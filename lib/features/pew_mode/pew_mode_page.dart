import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'package:gw_parish_website/core/theme/design_tokens.dart';
import 'package:gw_parish_website/core/utils/liturgical_cycle.dart';
import 'package:gw_parish_website/data/models/liturgy_models.dart';

/// A distraction-free, full-screen reading view for daily liturgical readings.
///
/// Designed as a digital missal, this bypasses the [ParishFrame] shell entirely
/// so parishioners can discreetly follow the Gospel on their phones during Mass
/// without UI distractions. Forces dark background, maximum font scale, and
/// disables all motion.
class PewModePage extends StatelessWidget {
  const PewModePage({required this.day, super.key});

  final LiturgicalDay day;

  static const _maxFontScale = 1.3;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final seasonColor = const SeasonColorResolver().colorFor(day.season);

    // Force dark, high-contrast palette for minimal screen glow in church.
    const bgColor = DesignTokens.darkBackground;
    const fgColor = DesignTokens.darkForeground;
    const mutedColor = DesignTokens.darkMutedForeground;

    return Scaffold(
      backgroundColor: bgColor,
      body: SafeArea(
        child: Column(
          children: [
            // ── Liturgical season colour bar ──────────────────────
            Container(height: 3, color: seasonColor),

            // ── Top bar with close button ────────────────────────
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Row(
                children: [
                  Expanded(
                    child: Semantics(
                      header: true,
                      child: Text(
                        'PEW MODE',
                        style: theme.textTheme.labelLarge?.copyWith(
                          color: mutedColor,
                          letterSpacing: 3,
                          fontSize: 12,
                        ),
                      ),
                    ),
                  ),
                  Semantics(
                    label: 'Exit Pew Mode',
                    button: true,
                    child: IconButton(
                      icon: const Icon(Icons.close, color: fgColor),
                      tooltip: 'Exit Pew Mode',
                      onPressed: () => context.go('/'),
                    ),
                  ),
                ],
              ),
            ),

            // ── Main content ─────────────────────────────────────
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(
                  horizontal: 24,
                  vertical: 16,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Season name
                    Text(
                      day.seasonName,
                      style: theme.textTheme.headlineMedium?.copyWith(
                        color: seasonColor,
                        fontStyle: FontStyle.italic,
                        fontSize: (24 * _maxFontScale).clamp(20, 36).toDouble(),
                      ),
                    ),
                    const SizedBox(height: 8),

                    // Liturgical cycle info
                    Text(
                      LiturgicalCycle.formatForUI(day.date),
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: mutedColor,
                        fontSize: (12 * _maxFontScale).clamp(10, 18).toDouble(),
                      ),
                    ),

                    const SizedBox(height: 32),

                    // Readings
                    for (final reading in day.readings) ...[
                      _ReadingBlock(reading: reading, seasonColor: seasonColor),
                      const SizedBox(height: 32),
                    ],

                    // Source attribution
                    Padding(
                      padding: const EdgeInsets.only(top: 16, bottom: 48),
                      child: Text(
                        'Source: ${day.source} · ${day.lastUpdated}',
                        style: theme.textTheme.bodySmall?.copyWith(
                          color: mutedColor.withValues(alpha: 0.6),
                          fontSize: (11 * _maxFontScale)
                              .clamp(10, 16)
                              .toDouble(),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ReadingBlock extends StatelessWidget {
  const _ReadingBlock({required this.reading, required this.seasonColor});

  final ReadingItem reading;
  final Color seasonColor;

  static const _maxFontScale = PewModePage._maxFontScale;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    const fgColor = DesignTokens.darkForeground;
    const mutedColor = DesignTokens.darkMutedForeground;

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: DesignTokens.darkSurface,
        border: Border(left: BorderSide(color: seasonColor, width: 3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Reading label (e.g., "First Reading", "Gospel")
          Text(
            reading.label.toUpperCase(),
            style: theme.textTheme.labelLarge?.copyWith(
              color: seasonColor,
              letterSpacing: 2,
              fontSize: (12 * _maxFontScale).clamp(10, 18).toDouble(),
            ),
          ),
          const SizedBox(height: 8),

          // Scripture reference
          Semantics(
            label:
                reading.spokenReference ??
                'A scripture reading, ${reading.reference}.',
            child: ExcludeSemantics(
              child: Text(
                reading.reference,
                style: theme.textTheme.titleLarge?.copyWith(
                  color: fgColor,
                  fontSize: (20 * _maxFontScale).clamp(16, 28).toDouble(),
                ),
              ),
            ),
          ),
          const SizedBox(height: 12),

          // Summary / excerpt
          Text(
            reading.summary,
            style: theme.textTheme.bodyLarge?.copyWith(
              color: fgColor.withValues(alpha: 0.9),
              height: 1.8,
              fontSize: (16 * _maxFontScale).clamp(14, 24).toDouble(),
            ),
          ),
          const SizedBox(height: 12),

          // Subtle full-text link
          Text(
            'Full text available at ${reading.url}',
            style: theme.textTheme.bodySmall?.copyWith(
              color: mutedColor.withValues(alpha: 0.5),
              fontSize: (11 * _maxFontScale).clamp(10, 16).toDouble(),
            ),
          ),
        ],
      ),
    );
  }
}
