import 'package:flutter/material.dart';

enum LiturgicalSeason {
  advent,
  lent,
  christmas,
  easter,
  ordinaryTime,
  pentecost,
  martyrs,
  allSouls,
  unknown,
}

abstract final class DesignTokens {
  // ── Light palette ─────────────────────────────────────────
  static const Color background = Color(0xFFF9F8F6);
  static const Color foreground = Color(0xFF1A1A1A);
  static const Color mutedBackground = Color(0xFFEBE5DE);
  static const Color mutedForeground = Color(0xFF6C6863);
  static const Color accent = Color(0xFFD4AF37);
  static const Color accentForeground = Color(0xFFFFFFFF);

  // ── Dark palette ──────────────────────────────────────────
  static const Color darkBackground = Color(0xFF141414);
  static const Color darkSurface = Color(0xFF1E1E1E);
  static const Color darkForeground = Color(0xFFE8E4DF);
  static const Color darkMutedBackground = Color(0xFF2A2724);
  static const Color darkMutedForeground = Color(0xFF9A9590);

  static const Color adventLent = Color(0xFF6B3FA0);
  static const Color christmasEaster = Color(0xFFD4AF37);
  static const Color ordinaryTime = Color(0xFF2D5F2D);
  static const Color pentecostMartyrs = Color(0xFF8B2332);
  static const Color goodFridayAllSouls = Color(0xFF1A1A1A);

  // ── Spacing scale ──────────────────────────────────────────
  static const double space4 = 4;
  static const double space8 = 8;
  static const double space12 = 12;
  static const double space16 = 16;
  static const double space24 = 24;
  static const double space32 = 32;
  static const double space48 = 48;

  static const Radius radiusNone = Radius.zero;

  static const double sectionGapMobile = 80;
  static const double sectionGapDesktop = 128;

  static const double paddingMobile = 24;
  static const double paddingTablet = 48;
  static const double paddingDesktop = 64;

  static const Duration buttonMotion = Duration(milliseconds: 500);
  static const Duration standardMotion = Duration(milliseconds: 700);
  static const Duration pageMotion = Duration(milliseconds: 800);
  static const Duration imageMotion = Duration(milliseconds: 1700);

  static const Cubic cinematicCurve = Cubic(0.25, 0.46, 0.45, 0.94);
}

class SeasonColorResolver {
  const SeasonColorResolver();

  Color colorFor(LiturgicalSeason season) {
    switch (season) {
      case LiturgicalSeason.advent:
      case LiturgicalSeason.lent:
        return DesignTokens.adventLent;
      case LiturgicalSeason.christmas:
      case LiturgicalSeason.easter:
        return DesignTokens.christmasEaster;
      case LiturgicalSeason.ordinaryTime:
        return DesignTokens.ordinaryTime;
      case LiturgicalSeason.pentecost:
      case LiturgicalSeason.martyrs:
        return DesignTokens.pentecostMartyrs;
      case LiturgicalSeason.allSouls:
        return DesignTokens.goodFridayAllSouls;
      case LiturgicalSeason.unknown:
        return DesignTokens.accent;
    }
  }
}
