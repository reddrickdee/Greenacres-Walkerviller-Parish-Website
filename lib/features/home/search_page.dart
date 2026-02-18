import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'package:gw_parish_website/data/models/parish_models.dart';
import 'package:gw_parish_website/shared/widgets/section_shell.dart';

/// In-app search over parish content.
///
/// Replaces the former redirect to the legacy gwparish.org.au search endpoint.
/// Searches over section titles, mass schedule, sacraments, community services,
/// faith formation, parish history, news items, and school listings.
class SearchPage extends StatefulWidget {
  const SearchPage({required this.content, super.key});

  final ParishContent content;

  @override
  State<SearchPage> createState() => _SearchPageState();
}

class _SearchPageState extends State<SearchPage> {
  final _controller = TextEditingController();
  List<_SearchResult> _results = [];
  bool _hasSearched = false;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _search() {
    final query = _controller.text.trim().toLowerCase();
    if (query.isEmpty) {
      setState(() {
        _results = [];
        _hasSearched = false;
      });
      return;
    }

    final results = <_SearchResult>[];

    // Mass schedule
    for (final entry in widget.content.massSchedule) {
      final text = '${entry.church} · ${entry.type} · ${entry.startTime}';
      if (text.toLowerCase().contains(query)) {
        results.add(_SearchResult(
          title: entry.church,
          subtitle: '${entry.type} — ${entry.startTime}',
          route: '/mass-sacraments',
          icon: Icons.church_outlined,
        ));
      }
    }

    // Sacraments
    for (final s in widget.content.sacraments) {
      if (s.title.toLowerCase().contains(query) ||
          s.details.toLowerCase().contains(query)) {
        results.add(_SearchResult(
          title: s.title,
          subtitle: s.details.length > 100
              ? '${s.details.substring(0, 100)}…'
              : s.details,
          route: '/mass-sacraments',
          icon: Icons.auto_awesome_outlined,
        ));
      }
    }

    // Community services
    for (final line in widget.content.communityServices) {
      if (line.toLowerCase().contains(query)) {
        results.add(_SearchResult(
          title: 'Community Service',
          subtitle: line,
          route: '/services-community',
          icon: Icons.people_outlined,
        ));
      }
    }

    // Faith formation
    for (final line in widget.content.faithFormation) {
      if (line.toLowerCase().contains(query)) {
        results.add(_SearchResult(
          title: 'Faith Formation',
          subtitle: line,
          route: '/services-community',
          icon: Icons.menu_book_outlined,
        ));
      }
    }

    // News items
    for (final item in widget.content.newsItems) {
      if (item.title.toLowerCase().contains(query) ||
          item.summary.toLowerCase().contains(query)) {
        results.add(_SearchResult(
          title: item.title,
          subtitle: item.summary,
          route: '/news-events',
          icon: Icons.article_outlined,
        ));
      }
    }

    // History milestones
    for (final m in widget.content.historyMilestones) {
      if (m.description.toLowerCase().contains(query) ||
          m.year.contains(query)) {
        results.add(_SearchResult(
          title: '${m.year} — Parish History',
          subtitle: m.description,
          route: '/history',
          icon: Icons.history_edu_outlined,
        ));
      }
    }

    // Schools
    for (final school in widget.content.schools) {
      if (school.name.toLowerCase().contains(query) ||
          school.address.toLowerCase().contains(query)) {
        results.add(_SearchResult(
          title: school.name,
          subtitle: school.address,
          route: '/contact',
          icon: Icons.school_outlined,
        ));
      }
    }

    // Contact
    final contactText = '${widget.content.contact.postalAddress} '
        '${widget.content.contact.phone} '
        '${widget.content.contact.email} '
        '${widget.content.contact.officeHours}';
    if (contactText.toLowerCase().contains(query)) {
      results.add(_SearchResult(
        title: 'Parish Office',
        subtitle: widget.content.contact.postalAddress,
        route: '/contact',
        icon: Icons.location_on_outlined,
      ));
    }

    // Sacramental journeys
    for (final journey in widget.content.sacramentalJourneys) {
      if (journey.title.toLowerCase().contains(query) ||
          journey.intro.toLowerCase().contains(query)) {
        results.add(_SearchResult(
          title: journey.title,
          subtitle: journey.subtitle,
          route: '/mass-sacraments',
          icon: Icons.route_outlined,
        ));
      }
    }

    setState(() {
      _results = results;
      _hasSearched = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    return SectionShell(
      overline: 'Search',
      title: 'Find on Parish Website',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Search parish Mass times, sacraments, services, news and history.'),
          const SizedBox(height: 14),
          TextField(
            controller: _controller,
            decoration: const InputDecoration(
              labelText: 'Search',
              hintText: 'e.g. Baptism, Wednesday Mass, St Vincent de Paul…',
              prefixIcon: Icon(Icons.search),
            ),
            onSubmitted: (_) => _search(),
          ),
          const SizedBox(height: 10),
          ElevatedButton(
            onPressed: _search,
            child: const Text('Search'),
          ),
          if (_hasSearched) ...[
            const SizedBox(height: 24),
            if (_results.isEmpty)
              Text(
                'No results found for "${_controller.text.trim()}".',
                style: Theme.of(context).textTheme.bodyLarge,
              )
            else ...[
              Text(
                '${_results.length} result${_results.length == 1 ? '' : 's'} found',
                style: Theme.of(context).textTheme.labelMedium,
              ),
              const SizedBox(height: 12),
              for (final result in _results)
                Card(
                  child: ListTile(
                    leading: Icon(result.icon),
                    title: Text(result.title),
                    subtitle: Text(
                      result.subtitle,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    trailing: const Icon(Icons.chevron_right),
                    onTap: () => context.go(result.route),
                  ),
                ),
            ],
          ],
        ],
      ),
    );
  }
}

class _SearchResult {
  const _SearchResult({
    required this.title,
    required this.subtitle,
    required this.route,
    required this.icon,
  });

  final String title;
  final String subtitle;
  final String route;
  final IconData icon;
}
