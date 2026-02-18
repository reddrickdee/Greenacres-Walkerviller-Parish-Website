import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AccessibilityController extends ChangeNotifier {
  AccessibilityController._({
    required bool highContrast,
    required double fontScale,
    required bool reduceMotion,
    required bool darkMode,
    required bool highLegibility,
    required SharedPreferences? prefs,
  }) : _highContrast = highContrast,
       _fontScale = fontScale,
       _reduceMotion = reduceMotion,
       _darkMode = darkMode,
       _highLegibility = highLegibility,
       _prefs = prefs;

  static const _highContrastKey = 'accessibility_high_contrast';
  static const _fontScaleKey = 'accessibility_font_scale';
  static const _reduceMotionKey = 'accessibility_reduce_motion';
  static const _darkModeKey = 'accessibility_dark_mode';
  static const _highLegibilityKey = 'accessibility_high_legibility';

  final SharedPreferences? _prefs;

  bool _highContrast;
  double _fontScale;
  bool _reduceMotion;
  bool _darkMode;
  bool _highLegibility;

  bool get highContrast => _highContrast;
  double get fontScale => _fontScale;
  bool get reduceMotion => _reduceMotion;
  bool get darkMode => _darkMode;
  bool get highLegibility => _highLegibility;

  static Future<AccessibilityController> load() async {
    SharedPreferences? prefs;
    var highContrast = false;
    var fontScale = 1.0;
    var reduceMotion = false;
    var darkMode = false;
    var highLegibility = false;

    try {
      prefs = await SharedPreferences.getInstance();
      highContrast = prefs.getBool(_highContrastKey) ?? false;
      fontScale = prefs.getDouble(_fontScaleKey) ?? 1;
      reduceMotion = prefs.getBool(_reduceMotionKey) ?? false;
      darkMode = prefs.getBool(_darkModeKey) ?? false;
      highLegibility = prefs.getBool(_highLegibilityKey) ?? false;
    } catch (_) {
      // Fall back to in-memory defaults if local storage is unavailable.
    }

    return AccessibilityController._(
      highContrast: highContrast,
      fontScale: fontScale,
      reduceMotion: reduceMotion,
      darkMode: darkMode,
      highLegibility: highLegibility,
      prefs: prefs,
    );
  }

  Future<void> toggleHighContrast() async {
    _highContrast = !_highContrast;
    try {
      await _prefs?.setBool(_highContrastKey, _highContrast);
    } catch (_) {
      // Keep in-memory state even when storage is unavailable.
    }
    notifyListeners();
  }

  Future<void> increaseFontSize() async {
    _fontScale = (_fontScale + 0.1).clamp(0.9, 1.3);
    try {
      await _prefs?.setDouble(_fontScaleKey, _fontScale);
    } catch (_) {
      // Keep in-memory state even when storage is unavailable.
    }
    notifyListeners();
  }

  Future<void> decreaseFontSize() async {
    _fontScale = (_fontScale - 0.1).clamp(0.9, 1.3);
    try {
      await _prefs?.setDouble(_fontScaleKey, _fontScale);
    } catch (_) {
      // Keep in-memory state even when storage is unavailable.
    }
    notifyListeners();
  }

  Future<void> toggleReducedMotion() async {
    _reduceMotion = !_reduceMotion;
    try {
      await _prefs?.setBool(_reduceMotionKey, _reduceMotion);
    } catch (_) {
      // Keep in-memory state even when storage is unavailable.
    }
    notifyListeners();
  }

  Future<void> toggleDarkMode() async {
    _darkMode = !_darkMode;
    try {
      await _prefs?.setBool(_darkModeKey, _darkMode);
    } catch (_) {
      // Keep in-memory state even when storage is unavailable.
    }
    notifyListeners();
  }

  Future<void> toggleHighLegibility() async {
    _highLegibility = !_highLegibility;
    try {
      await _prefs?.setBool(_highLegibilityKey, _highLegibility);
    } catch (_) {
      // Keep in-memory state even when storage is unavailable.
    }
    notifyListeners();
  }
}
