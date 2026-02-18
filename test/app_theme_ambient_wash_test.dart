import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';

import 'package:gw_parish_website/core/theme/app_theme.dart';
import 'package:gw_parish_website/core/theme/design_tokens.dart';

void main() {
  setUpAll(() {
    GoogleFonts.config.allowRuntimeFetching = false;
  });

  const seasonColor = DesignTokens.ordinaryTime;
  const lightBase = DesignTokens.background;
  const darkBase = DesignTokens.darkBackground;

  Color expectedWash(Color base, [Color color = seasonColor]) =>
      Color.alphaBlend(color.withValues(alpha: 0.025), base);

  testWidgets('light theme scaffoldBackgroundColor is washed', (tester) async {
    final theme = AppTheme.build(
      highContrast: false,
      fontScale: 1.0,
      reduceMotion: false,
      highLegibility: false,
      seasonColor: seasonColor,
    );

    expect(theme.scaffoldBackgroundColor, expectedWash(lightBase));
  });

  testWidgets('dark theme scaffoldBackgroundColor is washed', (tester) async {
    final theme = AppTheme.build(
      highContrast: false,
      fontScale: 1.0,
      reduceMotion: false,
      highLegibility: false,
      seasonColor: seasonColor,
      isDark: true,
    );

    expect(theme.scaffoldBackgroundColor, expectedWash(darkBase));
  });

  testWidgets('fallback accent produces a wash (not pure canonical base)', (
    tester,
  ) async {
    final theme = AppTheme.build(
      highContrast: false,
      fontScale: 1.0,
      reduceMotion: false,
      highLegibility: false,
      seasonColor: DesignTokens.accent,
    );

    expect(
      theme.scaffoldBackgroundColor,
      expectedWash(lightBase, DesignTokens.accent),
    );
    expect(theme.scaffoldBackgroundColor, isNot(equals(lightBase)));
  });

  testWidgets('dark colorScheme.surface remains DesignTokens.darkSurface', (
    tester,
  ) async {
    final theme = AppTheme.build(
      highContrast: false,
      fontScale: 1.0,
      reduceMotion: false,
      highLegibility: false,
      seasonColor: seasonColor,
      isDark: true,
    );

    expect(theme.colorScheme.surface, DesignTokens.darkSurface);
  });

  testWidgets('light colorScheme.surface uses ambient wash', (tester) async {
    final theme = AppTheme.build(
      highContrast: false,
      fontScale: 1.0,
      reduceMotion: false,
      highLegibility: false,
      seasonColor: seasonColor,
    );

    expect(theme.colorScheme.surface, expectedWash(lightBase));
  });

  testWidgets('appBarTheme.backgroundColor uses ambient wash', (tester) async {
    final theme = AppTheme.build(
      highContrast: false,
      fontScale: 1.0,
      reduceMotion: false,
      highLegibility: false,
      seasonColor: seasonColor,
    );

    expect(theme.appBarTheme.backgroundColor, expectedWash(lightBase));
  });

  testWidgets('high legibility swaps heading font family', (tester) async {
    final theme = AppTheme.build(
      highContrast: false,
      fontScale: 1.0,
      reduceMotion: false,
      highLegibility: true,
      seasonColor: seasonColor,
    );

    expect(
      theme.textTheme.headlineLarge?.fontFamily?.toLowerCase(),
      contains('atkinson'),
    );
  });
}
