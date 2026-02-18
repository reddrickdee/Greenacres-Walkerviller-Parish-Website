import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';

import 'package:gw_parish_website/core/theme/design_tokens.dart';
import 'package:gw_parish_website/data/models/parish_models.dart';

/// A conversational concierge UI that replaces the static "New Here" numbered
/// list.  Shows intent chips and progressively reveals relevant content.
class NewHereConcierge extends StatefulWidget {
  const NewHereConcierge({required this.content, super.key});

  final ParishContent content;

  @override
  State<NewHereConcierge> createState() => _NewHereConciergeState();
}

enum _Intent { massTimes, enrollChild, exploreFaith }

class _NewHereConciergeState extends State<NewHereConcierge> {
  _Intent? _selected;
  bool _showAll = false;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final cardColor =
        isDark ? DesignTokens.darkSurface : DesignTokens.mutedBackground;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // ── Conversational prompt ────────────────────────────────
        Text(
          'Welcome.',
          style: theme.textTheme.headlineLarge,
        ),
        const SizedBox(height: DesignTokens.space8),
        Text(
          'Are you looking to…',
          style: theme.textTheme.titleMedium?.copyWith(
            color: isDark
                ? DesignTokens.darkMutedForeground
                : DesignTokens.mutedForeground,
          ),
        ),
        const SizedBox(height: DesignTokens.space24),

        // ── Intent chips ────────────────────────────────────────
        Wrap(
          spacing: DesignTokens.space12,
          runSpacing: DesignTokens.space12,
          children: [
            _IntentChip(
              label: 'Find Mass times',
              icon: Icons.schedule,
              isSelected: _selected == _Intent.massTimes,
              onTap: () => setState(() => _selected = _Intent.massTimes),
            ),
            _IntentChip(
              label: 'Enrol a child',
              icon: Icons.school,
              isSelected: _selected == _Intent.enrollChild,
              onTap: () => setState(() => _selected = _Intent.enrollChild),
            ),
            _IntentChip(
              label: 'Explore the Catholic faith',
              icon: Icons.auto_awesome,
              isSelected: _selected == _Intent.exploreFaith,
              onTap: () => setState(() => _selected = _Intent.exploreFaith),
            ),
          ],
        ),
        const SizedBox(height: DesignTokens.space32),

        // ── Progressive reveal ──────────────────────────────────
        AnimatedSize(
          duration: DesignTokens.standardMotion,
          curve: DesignTokens.cinematicCurve,
          alignment: Alignment.topLeft,
          child: _selected == null && !_showAll
              ? const SizedBox.shrink()
              : Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (_selected == _Intent.massTimes || _showAll)
                      _RevealCard(
                        color: cardColor,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Weekend Mass',
                              style: theme.textTheme.titleMedium,
                            ),
                            const SizedBox(height: DesignTokens.space8),
                            Text(
                              "Saturday 6:00 pm — St Monica's, Walkerville\n"
                              "Sunday 9:30 am — St Martin's, Greenacres",
                              style: theme.textTheme.bodyLarge,
                            ),
                            const SizedBox(height: DesignTokens.space16),
                            _ConciergeAction(
                              label: 'See full schedule',
                              onTap: () =>
                                  context.go('/mass-sacraments'),
                            ),
                          ],
                        ),
                      ),

                    if (_selected == _Intent.enrollChild || _showAll)
                      _RevealCard(
                        color: cardColor,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Parish Schools',
                              style: theme.textTheme.titleMedium,
                            ),
                            const SizedBox(height: DesignTokens.space12),
                            ...widget.content.schools.map(
                              (school) => Padding(
                                padding: const EdgeInsets.only(
                                  bottom: DesignTokens.space12,
                                ),
                                child: Column(
                                  crossAxisAlignment:
                                      CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      school.name,
                                      style: theme.textTheme.titleSmall,
                                    ),
                                    Text(
                                      '${school.address}\nPrincipal: ${school.principal}',
                                      style: theme.textTheme.bodyMedium,
                                    ),
                                    const SizedBox(
                                        height: DesignTokens.space8),
                                    _ConciergeAction(
                                      label: 'Visit school website',
                                      onTap: () => launchUrl(
                                        Uri.parse(
                                          school.website.startsWith('http')
                                              ? school.website
                                              : 'https://${school.website}',
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

                    if (_selected == _Intent.exploreFaith || _showAll)
                      _RevealCard(
                        color: cardColor,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Explore the Catholic Faith',
                              style: theme.textTheme.titleMedium,
                            ),
                            const SizedBox(height: DesignTokens.space8),
                            Text(
                              'The RCIA (Rite of Christian Initiation of Adults) '
                              'is a welcoming journey for anyone curious about '
                              'Catholicism — no prior knowledge needed. '
                              'Sessions are relaxed and you are free to explore '
                              'at your own pace.',
                              style: theme.textTheme.bodyLarge,
                            ),
                            const SizedBox(height: DesignTokens.space16),
                            _ConciergeAction(
                              label: 'View the RCIA journey',
                              onTap: () =>
                                  context.go('/mass-sacraments'),
                            ),
                          ],
                        ),
                      ),
                  ],
                ),
        ),

        // ── Show all toggle ─────────────────────────────────────
        if (!_showAll)
          Padding(
            padding: const EdgeInsets.only(top: DesignTokens.space16),
            child: TextButton.icon(
              style: TextButton.styleFrom(
                shape: const RoundedRectangleBorder(
                  borderRadius: BorderRadius.zero,
                ),
              ),
              onPressed: () => setState(() {
                _showAll = true;
                _selected = null;
              }),
              icon: const Icon(Icons.grid_view, size: 18),
              label: const Text('Show all pathways'),
            ),
          ),
      ],
    );
  }
}

class _IntentChip extends StatelessWidget {
  const _IntentChip({
    required this.label,
    required this.icon,
    required this.isSelected,
    required this.onTap,
  });

  final String label;
  final IconData icon;
  final bool isSelected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Material(
      color: isSelected ? DesignTokens.accent : Colors.transparent,
      child: InkWell(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(
            horizontal: DesignTokens.space16,
            vertical: DesignTokens.space12,
          ),
          decoration: BoxDecoration(
            border: Border.all(
              color: isSelected
                  ? DesignTokens.accent
                  : theme.colorScheme.onSurface.withValues(alpha: 0.3),
            ),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                icon,
                size: 20,
                color: isSelected
                    ? DesignTokens.accentForeground
                    : theme.colorScheme.onSurface,
              ),
              const SizedBox(width: DesignTokens.space8),
              Text(
                label,
                style: theme.textTheme.labelLarge?.copyWith(
                  color: isSelected
                      ? DesignTokens.accentForeground
                      : theme.colorScheme.onSurface,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _RevealCard extends StatelessWidget {
  const _RevealCard({required this.child, required this.color});

  final Widget child;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: DesignTokens.space16),
      padding: const EdgeInsets.all(DesignTokens.space24),
      decoration: BoxDecoration(
        color: color,
        border: Border(
          left: BorderSide(
            color: DesignTokens.accent,
            width: 3,
          ),
        ),
      ),
      child: child,
    );
  }
}

class _ConciergeAction extends StatelessWidget {
  const _ConciergeAction({required this.label, required this.onTap});

  final String label;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return TextButton(
      style: TextButton.styleFrom(
        padding: EdgeInsets.zero,
        shape: const RoundedRectangleBorder(borderRadius: BorderRadius.zero),
      ),
      onPressed: onTap,
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(label),
          const SizedBox(width: 4),
          const Icon(Icons.arrow_forward, size: 16),
        ],
      ),
    );
  }
}
