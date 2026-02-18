import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import 'package:gw_parish_website/core/theme/design_tokens.dart';
import 'package:gw_parish_website/data/models/parish_models.dart';

/// A discreet, accessible "I Need Help Now" section placed above the global
/// footer.  Provides one-tap call / email pathways for urgent pastoral needs.
class PastoralFastTrack extends StatelessWidget {
  const PastoralFastTrack({required this.contact, super.key});

  final ContactInfo contact;

  static const _pathways = <_Pathway>[
    _Pathway(
      icon: Icons.local_hospital,
      label: 'Anointing of the Sick',
      emailSubject: 'Urgent: Anointing of the Sick Request',
      emailBody:
          'I am requesting the Sacrament of Anointing of the Sick. Please contact me as soon as possible.',
    ),
    _Pathway(
      icon: Icons.volunteer_activism,
      label: 'St Vincent de Paul Assistance',
      emailSubject: 'Urgent: SVDP Assistance Needed',
      emailBody:
          'I am in need of assistance from the St Vincent de Paul Society. Please contact me as soon as possible.',
    ),
    _Pathway(
      icon: Icons.favorite_border,
      label: 'Grief & Bereavement Support',
      emailSubject: 'Urgent: Grief Support Request',
      emailBody:
          'I am seeking pastoral support during a time of grief. Please contact me as soon as possible.',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final bgColor =
        isDark ? DesignTokens.darkMutedBackground : const Color(0xFF2A2320);
    final fgColor = isDark
        ? DesignTokens.darkForeground.withValues(alpha: 0.9)
        : DesignTokens.background.withValues(alpha: 0.9);
    final mutedFg = fgColor.withValues(alpha: 0.6);

    return Container(
      width: double.infinity,
      color: bgColor,
      padding: const EdgeInsets.symmetric(
        horizontal: DesignTokens.paddingMobile,
        vertical: DesignTokens.space32,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ── Title ─────────────────────────────────────────────
          Text(
            'I NEED HELP NOW',
            style: theme.textTheme.labelLarge?.copyWith(
              color: DesignTokens.accent,
              letterSpacing: 2.4,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: DesignTokens.space4),
          Text(
            'Immediate pastoral pathways — no forms, no waiting.',
            style: theme.textTheme.bodySmall?.copyWith(color: mutedFg),
          ),
          const SizedBox(height: DesignTokens.space24),

          // ── Emergency note ────────────────────────────────────
          Container(
            padding: const EdgeInsets.all(DesignTokens.space12),
            decoration: BoxDecoration(
              border: Border.all(
                color: const Color(0xFFB33A3A).withValues(alpha: 0.5),
              ),
            ),
            child: Row(
              children: [
                Icon(
                  Icons.warning_amber,
                  size: 18,
                  color: const Color(0xFFB33A3A),
                  semanticLabel: 'Emergency warning',
                ),
                const SizedBox(width: DesignTokens.space8),
                Expanded(
                  child: Text(
                    'In a medical emergency, call 000 first.',
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: fgColor,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: DesignTokens.space24),

          // ── Pathway rows ──────────────────────────────────────
          ...ListTile.divideTiles(
            color: mutedFg.withValues(alpha: 0.2),
            tiles: _pathways.map(
              (pathway) => _PathwayRow(
                pathway: pathway,
                contact: contact,
                fgColor: fgColor,
                mutedFg: mutedFg,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _Pathway {
  const _Pathway({
    required this.icon,
    required this.label,
    required this.emailSubject,
    required this.emailBody,
  });

  final IconData icon;
  final String label;
  final String emailSubject;
  final String emailBody;
}

class _PathwayRow extends StatelessWidget {
  const _PathwayRow({
    required this.pathway,
    required this.contact,
    required this.fgColor,
    required this.mutedFg,
  });

  final _Pathway pathway;
  final ContactInfo contact;
  final Color fgColor;
  final Color mutedFg;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: DesignTokens.space12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(pathway.icon, size: 20, color: DesignTokens.accent),
              const SizedBox(width: DesignTokens.space12),
              Expanded(
                child: Text(
                  pathway.label,
                  style: theme.textTheme.titleSmall?.copyWith(color: fgColor),
                ),
              ),
            ],
          ),
          const SizedBox(height: DesignTokens.space8),
          Padding(
            padding: const EdgeInsets.only(left: 32),
            child: Wrap(
              spacing: DesignTokens.space12,
              runSpacing: DesignTokens.space8,
              children: [
                _ActionChip(
                  icon: Icons.phone,
                  label: 'Call now',
                  color: fgColor,
                  semanticsLabel:
                      'Call parish office for ${pathway.label}',
                  onTap: () => launchUrl(
                    Uri(scheme: 'tel', path: contact.phone),
                  ),
                ),
                _ActionChip(
                  icon: Icons.email_outlined,
                  label: 'Email now',
                  color: fgColor,
                  semanticsLabel:
                      'Email parish office for ${pathway.label}',
                  onTap: () => launchUrl(
                    Uri(
                      scheme: 'mailto',
                      path: contact.email,
                      queryParameters: {
                        'subject': pathway.emailSubject,
                        'body': pathway.emailBody,
                      },
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _ActionChip extends StatelessWidget {
  const _ActionChip({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
    this.semanticsLabel,
  });

  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;
  final String? semanticsLabel;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: semanticsLabel,
      button: true,
      child: InkWell(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(
            horizontal: DesignTokens.space12,
            vertical: DesignTokens.space8,
          ),
          decoration: BoxDecoration(
            border: Border.all(color: color.withValues(alpha: 0.3)),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(icon, size: 16, color: color),
              const SizedBox(width: DesignTokens.space8),
              Text(
                label,
                style: Theme.of(context).textTheme.labelMedium?.copyWith(
                      color: color,
                    ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
