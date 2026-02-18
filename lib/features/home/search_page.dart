import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import 'package:gw_parish_website/shared/widgets/section_shell.dart';

class SearchPage extends StatefulWidget {
  const SearchPage({super.key});

  @override
  State<SearchPage> createState() => _SearchPageState();
}

class _SearchPageState extends State<SearchPage> {
  final controller = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return SectionShell(
      overline: 'Search',
      title: 'Find on Parish Website',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Search opens the parish website search endpoint.'),
          const SizedBox(height: 14),
          TextField(
            controller: controller,
            decoration: const InputDecoration(hintText: 'Keywords'),
          ),
          const SizedBox(height: 10),
          ElevatedButton(
            onPressed: () {
              final query = controller.text.trim();
              if (query.isEmpty) {
                return;
              }
              launchUrl(
                Uri.parse(
                  'https://www.gwparish.org.au/search.html?searWords=$query',
                ),
                mode: LaunchMode.externalApplication,
              );
            },
            child: const Text('Search Website'),
          ),
        ],
      ),
    );
  }
}
