import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import 'package:gw_parish_website/data/models/liturgy_models.dart';

class ChristianArtCard extends StatelessWidget {
  const ChristianArtCard({required this.item, super.key});

  final ChristianArtItem item;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Christian Art',
              style: Theme.of(context).textTheme.labelMedium,
            ),
            const SizedBox(height: 10),
            Text(item.title, style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 14),
            Semantics(
              label: 'Christian art: ${item.title}',
              child: ClipRect(
                child: Image.network(
                  item.imageUrl,
                  fit: BoxFit.cover,
                  width: double.infinity,
                  height: 320,
                  webHtmlElementStrategy: WebHtmlElementStrategy.fallback,
                  loadingBuilder: (context, child, loadingProgress) {
                    if (loadingProgress == null) {
                      return child;
                    }
                    return const SizedBox(
                      height: 320,
                      child: Center(child: CircularProgressIndicator()),
                    );
                  },
                  errorBuilder: (context, error, stackTrace) {
                    return Container(
                      height: 260,
                      width: double.infinity,
                      alignment: Alignment.center,
                      color: const Color(0x14D4AF37),
                      child: const Text(
                        'Christian Art image unavailable right now.',
                      ),
                    );
                  },
                ),
              ),
            ),
            const SizedBox(height: 12),
            Text(item.context, style: Theme.of(context).textTheme.bodyLarge),
            if (item.author != null && item.author!.trim().isNotEmpty) ...[
              const SizedBox(height: 8),
              Text(
                'By ${item.author}',
                style: Theme.of(context).textTheme.bodySmall,
              ),
            ],
            const SizedBox(height: 8),
            TextButton(
              onPressed: () => launchUrl(Uri.parse(item.pageUrl)),
              child: const Text('Open Full Reflection'),
            ),
            Text(
              'Source: ${item.source}',
              style: Theme.of(context).textTheme.bodySmall,
            ),
          ],
        ),
      ),
    );
  }
}
