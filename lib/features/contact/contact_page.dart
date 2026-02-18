import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import 'package:gw_parish_website/data/models/parish_models.dart';
import 'package:gw_parish_website/shared/widgets/map_embed/map_embed.dart';
import 'package:gw_parish_website/shared/widgets/section_shell.dart';

class ContactPage extends StatelessWidget {
  const ContactPage({required this.content, super.key});

  final ParishContent content;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        SectionShell(
          overline: 'Contact Us',
          title: 'Parish Office',
          child: Wrap(
            spacing: 24,
            runSpacing: 24,
            children: [
              SizedBox(
                width: 520,
                child: Card(
                  child: Padding(
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(content.contact.postalAddress),
                        const SizedBox(height: 8),
                        Text('Phone: ${content.contact.phone}'),
                        const SizedBox(height: 8),
                        Text('Email: ${content.contact.email}'),
                        const SizedBox(height: 8),
                        Text('Office Hours: ${content.contact.officeHours}'),
                        const SizedBox(height: 14),
                        TextButton(
                          onPressed: () => launchUrl(
                            Uri.parse(
                              'tel:${content.contact.phone.replaceAll(' ', '')}',
                            ),
                          ),
                          child: const Text('Call Parish Office'),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              const SizedBox(width: 520, child: _ContactForm()),
            ],
          ),
        ),
        SectionShell(
          overline: 'Locations',
          title: 'Both Churches',
          child: Column(
            children: [
              buildMapEmbed(
                title: 'St Monica Church map',
                query: content.contact.stMonicaQuery,
              ),
              const SizedBox(height: 16),
              buildMapEmbed(
                title: 'St Martin Church map',
                query: content.contact.stMartinQuery,
              ),
            ],
          ),
        ),
        SectionShell(
          overline: 'Associated Schools',
          title: 'Parish Education Community',
          child: Wrap(
            spacing: 14,
            runSpacing: 14,
            children: content.schools
                .map(
                  (school) => SizedBox(
                    width: 500,
                    child: Card(
                      child: ListTile(
                        title: Text(school.name),
                        subtitle: Text(
                          '${school.address}\nPrincipal: ${school.principal}\nPhone: ${school.phone}',
                        ),
                        trailing: IconButton(
                          icon: const Icon(Icons.open_in_new),
                          onPressed: () =>
                              launchUrl(Uri.parse('https://${school.website}')),
                        ),
                      ),
                    ),
                  ),
                )
                .toList(),
          ),
        ),
      ],
    );
  }
}

class _ContactForm extends StatelessWidget {
  const _ContactForm();

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Send a Message',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 12),
            const TextField(
              minLines: 1,
              maxLines: 1,
              decoration: InputDecoration(hintText: 'Name'),
            ),
            const SizedBox(height: 8),
            const TextField(
              minLines: 1,
              maxLines: 1,
              decoration: InputDecoration(hintText: 'Email'),
            ),
            const SizedBox(height: 8),
            const TextField(
              minLines: 4,
              maxLines: 4,
              decoration: InputDecoration(hintText: 'Message'),
            ),
            const SizedBox(height: 12),
            ElevatedButton(onPressed: () {}, child: const Text('Submit')),
          ],
        ),
      ),
    );
  }
}
