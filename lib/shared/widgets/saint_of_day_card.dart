import 'package:flutter/material.dart';

import 'package:gw_parish_website/core/theme/design_tokens.dart';
import 'package:gw_parish_website/data/models/liturgy_models.dart';

/// Displays the Saint of the Day with a short biography.
///
/// Combines the editorial style of [ChristianArtCard] with the reverent
/// typography of [ScriptureBlock]. Falls back to a text-only card when
/// no image is available.
class SaintOfDayCard extends StatelessWidget {
  const SaintOfDayCard({required this.saint, super.key});

  final SaintOfDay saint;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Card(
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          border: Border(
            left: BorderSide(
              color: DesignTokens.accent.withValues(alpha: 0.6),
              width: 2,
            ),
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'SAINT OF THE DAY',
              style: theme.textTheme.labelMedium?.copyWith(
                letterSpacing: 2,
                color: DesignTokens.accent,
              ),
            ),
            const SizedBox(height: 12),
            Text(
              saint.name,
              style: theme.textTheme.titleLarge?.copyWith(
                fontStyle: FontStyle.italic,
              ),
            ),
            const SizedBox(height: 14),

            // Biography in a subtle scripture-like block.
            Container(
              padding: const EdgeInsets.all(16),
              color: isDark
                  ? DesignTokens.darkMutedBackground.withValues(alpha: 0.5)
                  : DesignTokens.mutedBackground.withValues(alpha: 0.3),
              child: Text(
                saint.biography,
                style: theme.textTheme.bodyMedium?.copyWith(
                  height: 1.6,
                ),
              ),
            ),
            const SizedBox(height: 10),
            Text(
              'Source: ${saint.source}',
              style: theme.textTheme.bodySmall,
            ),
          ],
        ),
      ),
    );
  }
}
