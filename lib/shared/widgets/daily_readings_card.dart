import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';

import 'package:gw_parish_website/core/utils/liturgical_cycle.dart';
import 'package:gw_parish_website/data/models/liturgy_models.dart';
import 'package:gw_parish_website/shared/widgets/editorial_button.dart';
import 'package:gw_parish_website/shared/widgets/responsive_grid.dart';

class DailyReadingsCard extends StatefulWidget {
  const DailyReadingsCard({required this.day, super.key});

  final LiturgicalDay day;

  @override
  State<DailyReadingsCard> createState() => _DailyReadingsCardState();
}

class _DailyReadingsCardState extends State<DailyReadingsCard> {
  bool _showBilingualLayout = false;
  String _secondaryLanguageCode = _italianCode;

  static const _italianCode = 'it';
  static const _vietnameseCode = 'vi';
  static const Map<String, String> _languageNameByCode = {
    _italianCode: 'Italiano',
    _vietnameseCode: 'Tieng Viet',
  };
  static const Map<String, Map<String, String>> _translatedLabelByLanguage = {
    _italianCode: {
      'First Reading': 'Prima Lettura',
      'Responsorial Psalm': 'Salmo Responsoriale',
      'Gospel': 'Vangelo',
    },
    _vietnameseCode: {
      'First Reading': 'Bai doc I',
      'Responsorial Psalm': 'Thanh Vinh Dap Ca',
      'Gospel': 'Phuc Am',
    },
  };

  @override
  Widget build(BuildContext context) {
    final day = widget.day;
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Today\'s Readings',
              style: Theme.of(context).textTheme.labelMedium,
            ),
            const SizedBox(height: 10),
            Text(
              day.seasonName,
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 6),
            Text(
              LiturgicalCycle.formatForUI(day.date),
              style: Theme.of(context).textTheme.bodySmall,
            ),
            const SizedBox(height: 16),
            _buildLanguageControls(context),
            const SizedBox(height: 8),
            for (final reading in day.readings)
              Padding(
                padding: const EdgeInsets.only(bottom: 16),
                child: _showBilingualLayout
                    ? _buildBilingualReading(context, reading)
                    : _buildSingleLanguageReading(context, reading),
              ),
            Text(
              'Source: ${day.source} · Last updated ${day.lastUpdated}',
              style: Theme.of(context).textTheme.bodySmall,
            ),
            const SizedBox(height: 16),
            Wrap(
              spacing: 10,
              runSpacing: 10,
              children: [
                EditorialPrintButton(
                  documentTitle: 'Daily Readings',
                  subtitle:
                      '${day.seasonName} - ${LiturgicalCycle.formatForUI(day.date)}',
                  sections: [
                    for (final reading in day.readings)
                      PrintPageSection(
                        heading: '${reading.label} (${reading.reference})',
                        lines: [reading.summary, 'Full text: ${reading.url}'],
                      ),
                  ],
                  footer:
                      'Source: ${day.source} · Last updated ${day.lastUpdated}',
                ),
                OutlinedButton.icon(
                  onPressed: () => context.go('/pew-mode'),
                  icon: const Icon(Icons.menu_book_outlined, size: 18),
                  label: const Text('ENTER PEW MODE'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLanguageControls(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SwitchListTile(
          value: _showBilingualLayout,
          contentPadding: EdgeInsets.zero,
          title: const Text('Side-by-side scripture translation'),
          subtitle: const Text('Show English alongside a second language.'),
          onChanged: (value) {
            setState(() => _showBilingualLayout = value);
          },
        ),
        if (_showBilingualLayout)
          Row(
            children: [
              Text(
                'Secondary language',
                style: Theme.of(context).textTheme.labelLarge,
              ),
              const SizedBox(width: 12),
              DropdownButton<String>(
                value: _secondaryLanguageCode,
                items: _languageNameByCode.entries
                    .map(
                      (entry) => DropdownMenuItem<String>(
                        value: entry.key,
                        child: Text(entry.value),
                      ),
                    )
                    .toList(),
                onChanged: (value) {
                  if (value == null) return;
                  setState(() => _secondaryLanguageCode = value);
                },
              ),
            ],
          ),
      ],
    );
  }

  Widget _buildSingleLanguageReading(
    BuildContext context,
    ReadingItem reading,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(reading.label, style: Theme.of(context).textTheme.labelLarge),
        const SizedBox(height: 4),
        _buildReferenceText(context, reading),
        const SizedBox(height: 2),
        Text(reading.summary, style: Theme.of(context).textTheme.bodyMedium),
        const SizedBox(height: 6),
        InkWell(
          onTap: () => launchUrl(Uri.parse(reading.url)),
          child: const Text('Read full text'),
        ),
      ],
    );
  }

  Widget _buildBilingualReading(BuildContext context, ReadingItem reading) {
    final translatedSummary = _translatedSummary(
      reading,
      _secondaryLanguageCode,
    );
    final translatedLabel =
        _translatedLabelByLanguage[_secondaryLanguageCode]?[reading.label] ??
        reading.label;

    return ResponsiveGrid(
      mobileColumns: 1,
      tabletColumns: 2,
      desktopColumns: 2,
      spacing: 16,
      runSpacing: 10,
      children: [
        _readingPane(
          context,
          languageLabel: 'English',
          heading: reading.label,
          reading: reading,
          summary: reading.summary,
          isTranslatedPane: false,
        ),
        _readingPane(
          context,
          languageLabel: _languageNameByCode[_secondaryLanguageCode]!,
          heading: translatedLabel,
          reading: reading,
          summary: translatedSummary,
          isTranslatedPane: true,
        ),
      ],
    );
  }

  Widget _readingPane(
    BuildContext context, {
    required String languageLabel,
    required String heading,
    required ReadingItem reading,
    required String summary,
    required bool isTranslatedPane,
  }) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        border: Border.all(
          color: Theme.of(context).dividerColor.withValues(alpha: 0.75),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            languageLabel.toUpperCase(),
            style: Theme.of(context).textTheme.labelMedium,
          ),
          const SizedBox(height: 8),
          Text(heading, style: Theme.of(context).textTheme.labelLarge),
          const SizedBox(height: 4),
          _buildReferenceText(context, reading),
          const SizedBox(height: 6),
          Text(summary, style: Theme.of(context).textTheme.bodyMedium),
          if (isTranslatedPane &&
              !reading.translations.containsKey(_secondaryLanguageCode))
            Padding(
              padding: const EdgeInsets.only(top: 6),
              child: Text(
                'Translated summary not available yet. Showing English excerpt.',
                style: Theme.of(context).textTheme.bodySmall,
              ),
            ),
          const SizedBox(height: 8),
          InkWell(
            onTap: () => launchUrl(Uri.parse(reading.url)),
            child: const Text('Read full text'),
          ),
        ],
      ),
    );
  }

  Widget _buildReferenceText(BuildContext context, ReadingItem reading) {
    final semanticReference =
        reading.spokenReference ?? 'A scripture reading, ${reading.reference}.';
    return Semantics(
      label: semanticReference,
      child: ExcludeSemantics(
        child: Text(
          reading.reference,
          style: Theme.of(context).textTheme.titleMedium,
        ),
      ),
    );
  }

  String _translatedSummary(ReadingItem reading, String languageCode) {
    final translation = reading.translations[languageCode];
    if (translation != null && translation.trim().isNotEmpty) {
      return translation;
    }
    return reading.summary;
  }
}
