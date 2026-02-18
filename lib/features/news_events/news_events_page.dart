import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';

import 'package:gw_parish_website/data/models/parish_models.dart';
import 'package:gw_parish_website/services/audio/editorial_audio_controller.dart';
import 'package:gw_parish_website/shared/widgets/editorial_audio_player.dart';
import 'package:gw_parish_website/shared/widgets/section_shell.dart';

class NewsEventsPage extends StatelessWidget {
  const NewsEventsPage({
    required this.content,
    required this.archive,
    required this.audioController,
    super.key,
  });

  final ParishContent content;
  final NewsletterArchive archive;
  final EditorialAudioController audioController;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        SectionShell(
          overline: 'News and Events',
          title: 'Parish Bulletin',
          child: Wrap(
            spacing: 20,
            runSpacing: 20,
            children: content.newsItems
                .map(
                  (item) => SizedBox(
                    width: 420,
                    child: Card(
                      child: Padding(
                        padding: const EdgeInsets.all(24),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            if (item.imageAsset != null)
                              Image.asset(
                                item.imageAsset!,
                                height: 220,
                                width: double.infinity,
                                fit: BoxFit.cover,
                              ),
                            if (item.imageAsset != null)
                              const SizedBox(height: 14),
                            Text(
                              item.title,
                              style: Theme.of(context).textTheme.titleMedium,
                            ),
                            const SizedBox(height: 8),
                            Text(
                              item.summary,
                              style: Theme.of(context).textTheme.bodyLarge,
                            ),
                            const SizedBox(height: 8),
                            TextButton(
                              onPressed: () => launchUrl(Uri.parse(item.url)),
                              child: const Text('Open resource'),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                )
                .toList(),
          ),
        ),
        SectionShell(
          overline: 'Upcoming',
          title: 'Editorial Calendar',
          child: Column(
            children: content.eventItems
                .map(
                  (item) => Card(
                    child: ListTile(
                      minTileHeight: 64,
                      title: Text(item.title),
                      subtitle: Text(item.description),
                      trailing: Text(item.dateLabel),
                    ),
                  ),
                )
                .toList(),
          ),
        ),
        SectionShell(
          overline: 'Homily & Reflections',
          title: "Listen to Father's Homily",
          child: EditorialAudioPlayer(
            recordings: content.homilyRecordings,
            controller: audioController,
          ),
        ),
        SectionShell(
          overline: 'Newsletter Archive',
          title: 'Connections Newsletter',
          child: _NewsletterArchiveList(archive: archive),
        ),
      ],
    );
  }
}

class _NewsletterArchiveList extends StatelessWidget {
  const _NewsletterArchiveList({required this.archive});

  final NewsletterArchive archive;

  @override
  Widget build(BuildContext context) {
    final items = archive.items;

    return SizedBox(
      height: 380,
      child: ListView.separated(
        itemCount: items.length,
        separatorBuilder: (_, _) => const Divider(height: 1),
        itemBuilder: (context, index) {
          final item = items[index];
          final hasNative = item.nativeBulletin != null;

          return ListTile(
            minTileHeight: 52,
            title: Text(item.title),
            subtitle: hasNative
                ? Text(
                    'Native Digital Edition Available',
                    style: TextStyle(
                      color: Theme.of(context).colorScheme.primary,
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  )
                : null,
            trailing: Icon(
              hasNative ? Icons.chrome_reader_mode : Icons.open_in_new,
              size: 18,
            ),
            onTap: () {
              if (hasNative) {
                context.push('/news-events/bulletin/${item.id}');
              } else {
                launchUrl(Uri.parse(item.url));
              }
            },
          );
        },
      ),
    );
  }
}
