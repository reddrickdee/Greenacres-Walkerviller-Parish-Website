import 'package:flutter/material.dart';

import 'package:gw_parish_website/data/models/parish_models.dart';
import 'package:gw_parish_website/shared/widgets/editorial_button.dart';
import 'package:gw_parish_website/shared/widgets/map_embed/map_embed.dart';
import 'package:gw_parish_website/shared/widgets/sacramental_journey_stepper.dart';
import 'package:gw_parish_website/shared/widgets/section_shell.dart';

class MassSacramentsPage extends StatelessWidget {
  const MassSacramentsPage({required this.content, super.key});

  final ParishContent content;

  @override
  Widget build(BuildContext context) {
    final monica = content.massSchedule
        .where((m) => m.church.contains('Monica'))
        .toList();
    final martin = content.massSchedule
        .where((m) => m.church.contains('Martin'))
        .toList();

    return Column(
      children: [
        SectionShell(
          overline: 'Mass and Sacraments',
          title: 'Worship Times',
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              EditorialPrintButton(
                documentTitle: 'Mass and Sacraments',
                subtitle: 'Greenacres Walkerville Catholic Parish',
                sections: [
                  PrintPageSection(
                    heading: 'Mass Times - St Monica\'s Church, Walkerville',
                    lines: monica.map(_printableMassLine).toList(),
                  ),
                  PrintPageSection(
                    heading: 'Mass Times - St Martin\'s Church, Greenacres',
                    lines: martin.map(_printableMassLine).toList(),
                  ),
                  PrintPageSection(
                    heading: 'Sacraments',
                    lines: content.sacraments
                        .map((item) => '${item.title}: ${item.details}')
                        .toList(),
                  ),
                ],
                footer:
                    'High-contrast print layout intentionally excludes decorative backgrounds and maps.',
              ),
              const SizedBox(height: 20),
              Wrap(
                spacing: 24,
                runSpacing: 24,
                children: [
                  _MassCard(
                    church: 'St Monica\'s Church, Walkerville',
                    entries: monica,
                  ),
                  _MassCard(
                    church: 'St Martin\'s Church, Greenacres',
                    entries: martin,
                  ),
                ],
              ),
            ],
          ),
        ),

        // ── Sacramental Journey Steppers (or legacy fallback) ──
        if (content.sacramentalJourneys.isNotEmpty)
          SectionShell(
            overline: 'Your Sacramental Journey',
            title: 'Preparation Pathways',
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: content.sacramentalJourneys
                  .map((journey) => SacramentalJourneyStepper(journey: journey))
                  .toList(),
            ),
          )
        else
          SectionShell(
            overline: 'Sacraments',
            title: 'Parish Life and Preparation',
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: content.sacraments
                  .map(
                    (item) => Padding(
                      padding: const EdgeInsets.only(bottom: 20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            item.title,
                            style: Theme.of(context).textTheme.titleMedium,
                          ),
                          const SizedBox(height: 6),
                          Text(
                            item.details,
                            style: Theme.of(context).textTheme.bodyLarge,
                          ),
                        ],
                      ),
                    ),
                  )
                  .toList(),
            ),
          ),

        SectionShell(
          overline: 'Church Locations',
          title: 'Find Our Churches',
          child: Column(
            children: [
              buildMapEmbed(
                title: 'St Monica Church Map',
                query: content.contact.stMonicaQuery,
              ),
              const SizedBox(height: 16),
              buildMapEmbed(
                title: 'St Martin Church Map',
                query: content.contact.stMartinQuery,
              ),
            ],
          ),
        ),
      ],
    );
  }

  static String _printableMassLine(MassScheduleEntry entry) {
    final notes = entry.notes == null ? '' : ' (${entry.notes})';
    return '${_weekdayName(entry.dayOfWeek)} ${entry.startTime} - '
        '${entry.type}$notes, ${entry.address}';
  }

  static String _weekdayName(int day) {
    const names = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];
    return names[day - 1];
  }
}

class _MassCard extends StatelessWidget {
  const _MassCard({required this.church, required this.entries});

  final String church;
  final List<MassScheduleEntry> entries;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 600,
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(church, style: Theme.of(context).textTheme.titleLarge),
              const SizedBox(height: 14),
              ...entries.map(
                (entry) => Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: Text(
                    '${_weekday(entry.dayOfWeek)} ${entry.startTime} · '
                    '${entry.type}${entry.notes == null ? '' : ' (${entry.notes})'}',
                    style: Theme.of(context).textTheme.bodyLarge,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _weekday(int day) {
    const names = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return names[day - 1];
  }
}
