import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:wakelock_plus/wakelock_plus.dart';

import 'package:gw_parish_website/core/theme/design_tokens.dart';
import 'package:gw_parish_website/core/utils/liturgical_cycle.dart';
import 'package:gw_parish_website/data/models/liturgy_models.dart';

/// A distraction-free, full-screen reading view for daily liturgical readings.
///
/// Designed as a digital missal, this bypasses the [ParishFrame] shell entirely
/// so parishioners can discreetly follow the Gospel on their phones during Mass
/// without UI distractions. Forces OLED true-black background, maximum font
/// scale, disables all motion, and keeps the screen awake.
class PewModePage extends StatefulWidget {
  const PewModePage({required this.day, super.key});

  final LiturgicalDay day;

  static const _maxFontScale = 1.3;

  @override
  State<PewModePage> createState() => _PewModePageState();
}

class _PewModePageState extends State<PewModePage> {
  @override
  void initState() {
    super.initState();
    WakelockPlus.enable();
  }

  @override
  void dispose() {
    WakelockPlus.disable();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final seasonColor =
        const SeasonColorResolver().colorFor(widget.day.season);

    // OLED true-black for minimal light emission in church.
    const bgColor = Color(0xFF000000);
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
                      widget.day.seasonName,
                      style: theme.textTheme.headlineMedium?.copyWith(
                        color: seasonColor,
                        fontStyle: FontStyle.italic,
                        fontSize: (24 * PewModePage._maxFontScale)
                            .clamp(20, 36)
                            .toDouble(),
                      ),
                    ),
                    const SizedBox(height: 8),

                    // Liturgical cycle info
                    Text(
                      LiturgicalCycle.formatForUI(widget.day.date),
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: mutedColor,
                        fontSize: (12 * PewModePage._maxFontScale)
                            .clamp(10, 18)
                            .toDouble(),
                      ),
                    ),

                    const SizedBox(height: 32),

                    // Readings
                    for (final reading in widget.day.readings) ...[
                      _ReadingBlock(
                          reading: reading, seasonColor: seasonColor),
                      const SizedBox(height: 32),
                    ],

                    // Source attribution
                    Padding(
                      padding: const EdgeInsets.only(top: 16, bottom: 48),
                      child: Text(
                        'Source: ${widget.day.source} · ${widget.day.lastUpdated}',
                        style: theme.textTheme.bodySmall?.copyWith(
                          color: mutedColor.withValues(alpha: 0.6),
                          fontSize: (11 * PewModePage._maxFontScale)
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

    // Near-black surface for reading cards — minimal glow in church.
    const cardSurface = Color(0xFF0A0A0A);

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: cardSurface,
        border: Border(left: BorderSide(color: seasonColor, width: 3)),
      ),
      child: SelectionArea(
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
              label: reading.spokenReference ??
                  'A scripture reading, ${reading.reference}.',
              child: ExcludeSemantics(
                child: Text(
                  reading.reference,
                  style: theme.textTheme.titleLarge?.copyWith(
                    color: fgColor,
                    fontSize:
                        (20 * _maxFontScale).clamp(16, 28).toDouble(),
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
      ),
    );
  }
}
