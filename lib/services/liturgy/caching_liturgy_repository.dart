import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

import 'package:gw_parish_website/data/models/liturgy_models.dart';
import 'package:gw_parish_website/services/liturgy/liturgy_repository.dart';

/// Caching decorator for [LiturgyRepository].
///
/// Wraps an upstream repository and persists the last successful
/// [LiturgicalDay] to [SharedPreferences]. On subsequent calls:
///
/// 1. Tries to fetch from the upstream.
/// 2. If successful, caches the result and returns it.
/// 3. If the upstream fails (network error), returns the cached version.
/// 4. If no cache exists either, rethrows the upstream error.
///
/// This ensures offline users still see yesterday's readings rather than
/// a blank page.
class CachingLiturgyRepository implements LiturgyRepository {
  CachingLiturgyRepository({required LiturgyRepository upstream})
      : _upstream = upstream;

  final LiturgyRepository _upstream;

  static const _cacheKey = 'cached_liturgical_day';

  @override
  Future<LiturgicalDay> getToday({DateTime? now}) async {
    try {
      final day = await _upstream.getToday(now: now);
      // Fire-and-forget cache write — don't block the UI.
      _write(day);
      return day;
    } catch (upstreamError) {
      final cached = await _read();
      if (cached != null) return cached;
      rethrow;
    }
  }

  Future<void> _write(LiturgicalDay day) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final json = jsonEncode(day.toJson());
      await prefs.setString(_cacheKey, json);
    } catch (_) {
      // Cache write failure is non-critical.
    }
  }

  Future<LiturgicalDay?> _read() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final raw = prefs.getString(_cacheKey);
      if (raw == null) return null;
      final json = jsonDecode(raw) as Map<String, dynamic>;
      return LiturgicalDay.fromJson(json);
    } catch (_) {
      return null;
    }
  }
}
