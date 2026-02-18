import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'package:gw_parish_website/core/theme/design_tokens.dart';
import 'package:gw_parish_website/data/models/parish_models.dart';

/// A geometric, editorial-style vertical stepper visualising a sacramental
/// journey (RCIA, Baptism, Marriage).  All corners are sharp (no border-radius)
/// and the rhythm follows the [DesignTokens] spacing scale.
class SacramentalJourneyStepper extends StatelessWidget {
  const SacramentalJourneyStepper({required this.journey, super.key});

  final SacramentalJourney journey;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final lineColor = isDark
        ? DesignTokens.darkMutedForeground
        : DesignTokens.mutedForeground;
    final accentColor = DesignTokens.accent;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // ── Journey header ─────────────────────────────────────
        Text(
          journey.title,
          style: theme.textTheme.headlineSmall,
        ),
        if (journey.subtitle.isNotEmpty) ...[
          const SizedBox(height: DesignTokens.space4),
          Text(
            journey.subtitle,
            style: theme.textTheme.titleSmall?.copyWith(
              color: accentColor,
              letterSpacing: 1.4,
            ),
          ),
        ],
        if (journey.intro.isNotEmpty) ...[
          const SizedBox(height: DesignTokens.space12),
          Text(
            journey.intro,
            style: theme.textTheme.bodyLarge,
          ),
        ],
        const SizedBox(height: DesignTokens.space32),

        // ── Step list with geometric axis ──────────────────────
        ...List.generate(journey.steps.length, (index) {
          final step = journey.steps[index];
          final isLast = index == journey.steps.length - 1;

          return IntrinsicHeight(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Vertical axis + node
                SizedBox(
                  width: 40,
                  child: Column(
                    children: [
                      // Square milestone node
                      Container(
                        width: 18,
                        height: 18,
                        decoration: BoxDecoration(
                          color: accentColor,
                          border: Border.all(color: accentColor, width: 2),
                        ),
                      ),
                      // Connecting line
                      if (!isLast)
                        Expanded(
                          child: Container(
                            width: 1,
                            color: lineColor.withValues(alpha: 0.4),
                          ),
                        ),
                    ],
                  ),
                ),
                const SizedBox(width: DesignTokens.space12),
                // Step content
                Expanded(
                  child: Padding(
                    padding: EdgeInsets.only(
                      bottom: isLast
                          ? DesignTokens.space16
                          : DesignTokens.space32,
                    ),
                    child: _StepCard(step: step, lineColor: lineColor),
                  ),
                ),
              ],
            ),
          );
        }),

        // ── CTA ───────────────────────────────────────────────
        if (journey.ctaLabel != null && journey.ctaRoute != null)
          Padding(
            padding: const EdgeInsets.only(
              left: 52,
              top: DesignTokens.space8,
            ),
            child: FilledButton(
              style: FilledButton.styleFrom(
                shape: const RoundedRectangleBorder(
                  borderRadius: BorderRadius.zero,
                ),
              ),
              onPressed: () => context.go(journey.ctaRoute!),
              child: Text(journey.ctaLabel!),
            ),
          ),

        const SizedBox(height: DesignTokens.space48),
      ],
    );
  }
}

class _StepCard extends StatelessWidget {
  const _StepCard({required this.step, required this.lineColor});

  final JourneyStep step;
  final Color lineColor;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final cardColor = isDark
        ? DesignTokens.darkSurface
        : DesignTokens.mutedBackground.withValues(alpha: 0.5);

    return Container(
      padding: const EdgeInsets.all(DesignTokens.space16),
      decoration: BoxDecoration(
        color: cardColor,
        border: Border(
          left: BorderSide(
            color: lineColor.withValues(alpha: 0.3),
            width: 2,
          ),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Phase badge
          Container(
            padding: const EdgeInsets.symmetric(
              horizontal: DesignTokens.space8,
              vertical: DesignTokens.space4,
            ),
            color: DesignTokens.accent.withValues(alpha: 0.15),
            child: Text(
              step.phaseLabel.toUpperCase(),
              style: theme.textTheme.labelSmall?.copyWith(
                color: DesignTokens.accent,
                fontWeight: FontWeight.w700,
                letterSpacing: 1.6,
              ),
            ),
          ),
          const SizedBox(height: DesignTokens.space8),

          // Title
          Text(
            step.title,
            style: theme.textTheme.titleMedium,
          ),
          const SizedBox(height: DesignTokens.space8),

          // Details
          Text(
            step.details,
            style: theme.textTheme.bodyMedium,
          ),

          // Prerequisites
          if (step.prerequisites.isNotEmpty) ...[
            const SizedBox(height: DesignTokens.space12),
            Text(
              'PREREQUISITES',
              style: theme.textTheme.labelSmall?.copyWith(
                letterSpacing: 1.4,
                color: lineColor,
              ),
            ),
            const SizedBox(height: DesignTokens.space4),
            ...step.prerequisites.map(
              (prereq) => Padding(
                padding: const EdgeInsets.only(bottom: 4),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Padding(
                      padding: const EdgeInsets.only(top: 6, right: 8),
                      child: Container(
                        width: 6,
                        height: 6,
                        color: DesignTokens.accent,
                      ),
                    ),
                    Expanded(
                      child: Text(
                        prereq,
                        style: theme.textTheme.bodySmall,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],

          // Meeting label
          if (step.meetingLabel != null) ...[
            const SizedBox(height: DesignTokens.space12),
            Row(
              children: [
                Icon(
                  Icons.calendar_today,
                  size: 14,
                  color: lineColor,
                ),
                const SizedBox(width: DesignTokens.space8),
                Expanded(
                  child: Text(
                    step.meetingLabel!,
                    style: theme.textTheme.bodySmall?.copyWith(
                      fontStyle: FontStyle.italic,
                      color: lineColor,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }
}
