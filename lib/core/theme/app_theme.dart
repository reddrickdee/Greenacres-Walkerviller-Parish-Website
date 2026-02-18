import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'design_tokens.dart';

class AppTheme {
  const AppTheme._();

  /// Blend [seasonColor] at 2.5 % opacity into [base] for a microscopic
  /// ambient liturgical wash.
  static Color _ambientWash(Color base, Color seasonColor) =>
      Color.alphaBlend(seasonColor.withValues(alpha: 0.025), base);

  static ThemeData build({
    required bool highContrast,
    required double fontScale,
    required bool reduceMotion,
    required bool highLegibility,
    required Color seasonColor,
    bool isDark = false,
  }) {
    final baseBodySize = (18 * fontScale).clamp(16, 24).toDouble();
    final borderOpacity = highContrast ? 0.3 : 0.15;

    // ── Resolve palette based on mode ──────────────────────────
    final baseBg = isDark
        ? DesignTokens.darkBackground
        : DesignTokens.background;
    final bg = _ambientWash(baseBg, seasonColor);
    final fg = isDark ? DesignTokens.darkForeground : DesignTokens.foreground;
    final surface = isDark ? DesignTokens.darkSurface : bg;
    final mutedFg = isDark
        ? DesignTokens.darkMutedForeground
        : DesignTokens.mutedForeground;

    TextStyle headingStyle({
      required double fontSize,
      required double height,
      double? letterSpacing,
      FontStyle? fontStyle,
      FontWeight? fontWeight,
    }) {
      if (highLegibility) {
        return GoogleFonts.atkinsonHyperlegible(
          fontSize: fontSize,
          height: height,
          letterSpacing: letterSpacing,
          fontStyle: fontStyle,
          fontWeight: fontWeight ?? FontWeight.w700,
          color: fg,
        );
      }
      return GoogleFonts.playfairDisplay(
        fontSize: fontSize,
        height: height,
        letterSpacing: letterSpacing,
        fontStyle: fontStyle,
        fontWeight: fontWeight,
        color: fg,
      );
    }

    final textTheme = TextTheme(
      displayLarge: headingStyle(
        fontSize: 84 * fontScale,
        height: 0.95,
        letterSpacing: -0.5,
      ),
      displayMedium: headingStyle(
        fontSize: 56 * fontScale,
        height: 1,
        letterSpacing: -0.3,
      ),
      headlineLarge: headingStyle(fontSize: 44 * fontScale, height: 1.05),
      headlineMedium: headingStyle(fontSize: 32 * fontScale, height: 1.1),
      titleLarge: headingStyle(fontSize: 28 * fontScale, height: 1.2),
      titleMedium: GoogleFonts.inter(
        fontSize: (20 * fontScale).clamp(18, 24).toDouble(),
        fontWeight: FontWeight.w500,
        color: fg,
      ),
      bodyLarge: GoogleFonts.inter(
        fontSize: baseBodySize,
        height: 1.625,
        color: fg,
      ),
      bodyMedium: GoogleFonts.inter(
        fontSize: (baseBodySize - 1).clamp(17, 22).toDouble(),
        height: 1.625,
        color: fg,
      ),
      labelLarge: GoogleFonts.inter(
        fontSize: (12 * fontScale).clamp(11, 14).toDouble(),
        letterSpacing: 2.5,
        fontWeight: FontWeight.w500,
        color: fg,
      ),
      labelMedium: GoogleFonts.inter(
        fontSize: (11 * fontScale).clamp(10, 13).toDouble(),
        letterSpacing: 3,
        fontWeight: FontWeight.w500,
        color: mutedFg,
      ),
      bodySmall: GoogleFonts.inter(
        fontSize: (16 * fontScale).clamp(14, 20).toDouble(),
        height: 1.5,
        color: mutedFg,
      ),
    );

    final colorScheme = isDark
        ? ColorScheme.dark(
            primary: fg,
            secondary: DesignTokens.accent,
            surface: surface,
            onSurface: fg,
            onPrimary: baseBg,
          )
        : ColorScheme.light(
            primary: fg,
            secondary: DesignTokens.accent,
            surface: bg,
            onSurface: fg,
          );

    return ThemeData(
      useMaterial3: true,
      brightness: isDark ? Brightness.dark : Brightness.light,
      scaffoldBackgroundColor: bg,
      colorScheme: colorScheme,
      textTheme: textTheme,
      dividerColor: fg.withValues(alpha: borderOpacity),
      cardTheme: CardThemeData(
        color: Colors.transparent,
        elevation: 0,
        margin: EdgeInsets.zero,
        shape: Border(
          top: BorderSide(color: fg.withValues(alpha: borderOpacity)),
        ),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: bg,
        surfaceTintColor: Colors.transparent,
        elevation: 0,
        scrolledUnderElevation: 0,
        foregroundColor: fg,
        titleTextStyle: textTheme.titleLarge,
      ),
      dividerTheme: DividerThemeData(
        color: fg.withValues(alpha: borderOpacity),
        thickness: highContrast ? 1.5 : 1,
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: false,
        hintStyle: headingStyle(
          fontSize: (18 * fontScale).clamp(16, 22).toDouble(),
          height: 1.2,
          fontStyle: FontStyle.italic,
        ).copyWith(color: mutedFg),
        enabledBorder: UnderlineInputBorder(
          borderSide: BorderSide(color: fg.withValues(alpha: borderOpacity)),
        ),
        focusedBorder: const UnderlineInputBorder(
          borderSide: BorderSide(color: DesignTokens.accent),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          minimumSize: const Size(140, 48),
          shape: const RoundedRectangleBorder(borderRadius: BorderRadius.zero),
          textStyle: textTheme.labelLarge,
          elevation: 0,
          foregroundColor: bg,
          backgroundColor: fg,
          padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 12),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          minimumSize: const Size(140, 48),
          shape: const RoundedRectangleBorder(borderRadius: BorderRadius.zero),
          side: BorderSide(color: fg.withValues(alpha: 0.6)),
          textStyle: textTheme.labelLarge,
          foregroundColor: fg,
          padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 12),
        ),
      ),
      pageTransitionsTheme: PageTransitionsTheme(
        builders: {
          for (final platform in TargetPlatform.values)
            platform: reduceMotion
                ? const _NoMotionTransitionsBuilder()
                : const FadeForwardsPageTransitionsBuilder(),
        },
      ),
      splashFactory: InkSparkle.splashFactory,
      visualDensity: VisualDensity.standard,
    );
  }
}

class _NoMotionTransitionsBuilder extends PageTransitionsBuilder {
  const _NoMotionTransitionsBuilder();

  @override
  Widget buildTransitions<T>(
    PageRoute<T> route,
    BuildContext context,
    Animation<double> animation,
    Animation<double> secondaryAnimation,
    Widget child,
  ) {
    return child;
  }
}
