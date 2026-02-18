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
              SizedBox(
                width: 520,
                child: _ContactForm(parishEmail: content.contact.email),
              ),
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

class _ContactForm extends StatefulWidget {
  const _ContactForm({required this.parishEmail});

  final String parishEmail;

  @override
  State<_ContactForm> createState() => _ContactFormState();
}

class _ContactFormState extends State<_ContactForm> {
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _messageController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _messageController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    final name = _nameController.text.trim();
    final email = _emailController.text.trim();
    final message = _messageController.text.trim();
    if (name.isEmpty || message.isEmpty) return;

    final subject = Uri.encodeComponent('Website Contact from $name');
    final body = Uri.encodeComponent(
      'Name: $name\n'
      '${email.isNotEmpty ? 'Email: $email\n' : ''}'
      '\n$message',
    );

    final uri = Uri.parse(
      'mailto:${widget.parishEmail}?subject=$subject&body=$body',
    );
    await launchUrl(uri);
  }

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
            TextField(
              controller: _nameController,
              minLines: 1,
              maxLines: 1,
              decoration: const InputDecoration(
                labelText: 'Name',
                hintText: 'Your full name',
              ),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _emailController,
              minLines: 1,
              maxLines: 1,
              keyboardType: TextInputType.emailAddress,
              decoration: const InputDecoration(
                labelText: 'Email',
                hintText: 'your.email@example.com',
              ),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _messageController,
              minLines: 4,
              maxLines: 4,
              decoration: const InputDecoration(
                labelText: 'Message',
                hintText: 'How can we help?',
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Your name and email will be used only to respond to your '
              'enquiry. See our Privacy Policy.',
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: Theme.of(context)
                        .colorScheme
                        .onSurface
                        .withValues(alpha: 0.6),
                  ),
            ),
            const SizedBox(height: 12),
            ElevatedButton(
              onPressed: _submit,
              child: const Text('Send Message'),
            ),
          ],
        ),
      ),
    );
  }
}

