import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'package:gw_parish_website/data/models/parish_models.dart';
import 'package:gw_parish_website/services/prayer/prayer_wall_service.dart';
import 'package:gw_parish_website/shared/widgets/prayer_wall_section.dart';
import 'package:gw_parish_website/shared/widgets/section_shell.dart';

class ServicesCommunityPage extends StatelessWidget {
  const ServicesCommunityPage({
    required this.content,
    required this.prayerWallService,
    this.reduceMotion = false,
    super.key,
  });

  final ParishContent content;
  final PrayerWallService prayerWallService;
  final bool reduceMotion;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        SectionShell(
          overline: 'Book of Remembrance',
          title: 'Prayer Wall',
          child: PrayerWallSection(
            service: prayerWallService,
            reduceMotion: reduceMotion,
          ),
        ),
        SectionShell(
          overline: 'Services and Community',
          title: 'Community Services',
          child: Column(
            children: content.communityServices
                .map(
                  (line) => ListTile(
                    minTileHeight: 58,
                    contentPadding: EdgeInsets.zero,
                    title: Text(
                      line,
                      style: Theme.of(context).textTheme.bodyLarge,
                    ),
                  ),
                )
                .toList(),
          ),
        ),
        SectionShell(
          overline: 'Faith Formation',
          title: 'Spirituality Programs',
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: content.faithFormation
                .map(
                  (line) => Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: Text(
                      line,
                      style: Theme.of(context).textTheme.bodyLarge,
                    ),
                  ),
                )
                .toList(),
          ),
        ),
        SectionShell(
          overline: 'Volunteers',
          title: 'Serve the Parish',
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                content.volunteerInfo,
                style: Theme.of(context).textTheme.bodyLarge,
              ),
              const SizedBox(height: 12),
              ElevatedButton(
                onPressed: () => context.go('/contact'),
                child: const Text('Contact Parish Office'),
              ),
              const SizedBox(height: 12),
              OutlinedButton(
                onPressed: () => context.go('/new-here'),
                child: const Text('I\'m New Here Guide'),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
