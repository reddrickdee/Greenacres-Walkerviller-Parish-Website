import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../core/theme/design_tokens.dart';

/// First-letter drop cap with body text in manuscript style.
///
/// On Christmas Day, Easter Sunday, and Pentecost Sunday this widget
/// swaps the text drop cap for an illuminated SVG initial.
class DropCapParagraph extends StatelessWidget {
  const DropCapParagraph({
    super.key,
    required this.text,
    this.dark = false,
    this.referenceDate,
  });

  final String text;
  final bool dark;

  /// Optional override used for deterministic tests.
  final DateTime? referenceDate;

  static final RegExp _latinLetterPattern = RegExp(r'^[A-Za-z]$');

  @override
  Widget build(BuildContext context) {
    if (text.isEmpty) return const SizedBox.shrink();

    final initial = text[0];
    final rest = text.substring(1);
    final theme = Theme.of(context);
    final fgColor = dark
        ? theme.scaffoldBackgroundColor
        : theme.colorScheme.onSurface;

    final today = referenceDate ?? DateTime.now();
    final solemnity = _majorSolemnityForDate(today);
    final useIlluminatedCap =
        solemnity != null && _latinLetterPattern.hasMatch(initial);

    final InlineSpan leading = useIlluminatedCap
        ? WidgetSpan(
            alignment: PlaceholderAlignment.top,
            child: Padding(
              padding: const EdgeInsets.only(right: 8),
              child: _IlluminatedDropCap(
                letter: initial.toUpperCase(),
                accentColor: _accentForSolemnity(solemnity),
              ),
            ),
          )
        : TextSpan(
            text: initial,
            style: GoogleFonts.playfairDisplay(
              fontSize: 56,
              height: 0.85,
              color: DesignTokens.accent,
            ),
          );

    return Text.rich(
      TextSpan(
        children: [
          leading,
          TextSpan(
            text: rest,
            style: GoogleFonts.inter(
              fontSize: 18,
              height: 1.625,
              color: fgColor,
            ),
          ),
        ],
      ),
    );
  }

  static Color _accentForSolemnity(_MajorSolemnity? solemnity) {
    switch (solemnity) {
      case _MajorSolemnity.pentecost:
        return DesignTokens.pentecostMartyrs;
      case _MajorSolemnity.christmas:
      case _MajorSolemnity.easter:
      case null:
        return DesignTokens.christmasEaster;
    }
  }

  static _MajorSolemnity? _majorSolemnityForDate(DateTime date) {
    final localDate = DateTime.utc(date.year, date.month, date.day);

    if (localDate.month == 12 && localDate.day == 25) {
      return _MajorSolemnity.christmas;
    }

    final easterSunday = _easterSunday(localDate.year);
    if (_isSameDate(localDate, easterSunday)) {
      return _MajorSolemnity.easter;
    }

    final pentecostSunday = easterSunday.add(const Duration(days: 49));
    if (_isSameDate(localDate, pentecostSunday)) {
      return _MajorSolemnity.pentecost;
    }

    return null;
  }

  static DateTime _easterSunday(int year) {
    // Anonymous Gregorian algorithm.
    final a = year % 19;
    final b = year ~/ 100;
    final c = year % 100;
    final d = b ~/ 4;
    final e = b % 4;
    final f = (b + 8) ~/ 25;
    final g = (b - f + 1) ~/ 3;
    final h = (19 * a + b - d - g + 15) % 30;
    final i = c ~/ 4;
    final k = c % 4;
    final l = (32 + 2 * e + 2 * i - h - k) % 7;
    final m = (a + 11 * h + 22 * l) ~/ 451;
    final month = (h + l - 7 * m + 114) ~/ 31;
    final day = (h + l - 7 * m + 114) % 31 + 1;
    return DateTime.utc(year, month, day);
  }

  static bool _isSameDate(DateTime a, DateTime b) {
    return a.year == b.year && a.month == b.month && a.day == b.day;
  }
}

enum _MajorSolemnity { christmas, easter, pentecost }

class _IlluminatedDropCap extends StatelessWidget {
  const _IlluminatedDropCap({required this.letter, required this.accentColor});

  final String letter;
  final Color accentColor;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 66,
      height: 80,
      child: SvgPicture.string(
        _buildIlluminatedSvg(letter, accentColor),
        fit: BoxFit.contain,
        semanticsLabel: 'Illuminated drop cap',
      ),
    );
  }

  static String _buildIlluminatedSvg(String letter, Color accentColor) {
    final accentHex = _toHex(accentColor);
    final deepInk = '#241E17';
    final letterGlyph = letter.toUpperCase();

    return '''
<svg viewBox="0 0 320 390" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="parchment" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCF4E2"/>
      <stop offset="100%" stop-color="#F0E2C8"/>
    </linearGradient>
  </defs>
  <rect x="10" y="10" width="300" height="370" rx="18" fill="url(#parchment)" />
  <rect x="20" y="20" width="280" height="350" rx="12" fill="none" stroke="$accentHex" stroke-width="7"/>
  <circle cx="43" cy="43" r="10" fill="$accentHex"/>
  <circle cx="277" cy="43" r="10" fill="$accentHex"/>
  <circle cx="43" cy="347" r="10" fill="$accentHex"/>
  <circle cx="277" cy="347" r="10" fill="$accentHex"/>
  <path d="M58 65 C120 20, 200 20, 262 65" fill="none" stroke="$accentHex" stroke-width="5"/>
  <path d="M58 325 C120 368, 200 368, 262 325" fill="none" stroke="$accentHex" stroke-width="5"/>
  <text x="160" y="260" text-anchor="middle" font-size="215" font-family="Times New Roman, serif" font-weight="700" fill="$deepInk">$letterGlyph</text>
</svg>
''';
  }

  static String _toHex(Color color) {
    final hex = color.toARGB32().toRadixString(16).padLeft(8, '0');
    return '#${hex.substring(2)}';
  }
}
