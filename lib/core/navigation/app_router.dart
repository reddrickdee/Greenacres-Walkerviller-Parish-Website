import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';

import 'package:gw_parish_website/core/accessibility/accessibility_controller.dart';
import 'package:gw_parish_website/core/theme/design_tokens.dart';
import 'package:gw_parish_website/data/models/liturgy_models.dart';
import 'package:gw_parish_website/data/models/parish_models.dart';
import 'package:gw_parish_website/features/about/about_page.dart';
import 'package:gw_parish_website/features/contact/contact_page.dart';
import 'package:gw_parish_website/features/history/history_page.dart';
import 'package:gw_parish_website/features/home/home_page.dart';
import 'package:gw_parish_website/features/home/search_page.dart';
import 'package:gw_parish_website/features/mass_sacraments/mass_sacraments_page.dart';
import 'package:gw_parish_website/features/new_here/new_here_page.dart';
import 'package:gw_parish_website/features/news_events/bulletin_detail_page.dart';
import 'package:gw_parish_website/features/news_events/news_events_page.dart';
import 'package:gw_parish_website/features/services_community/services_community_page.dart';
import 'package:gw_parish_website/features/privacy/privacy_policy_page.dart';
import 'package:gw_parish_website/features/pew_mode/pew_mode_page.dart';
import 'package:gw_parish_website/services/liturgy/liturgy_repository.dart';
import 'package:gw_parish_website/services/mass/mass_schedule_service.dart';
import 'package:gw_parish_website/services/prayer/prayer_wall_service.dart';
import 'package:gw_parish_website/services/audio/editorial_audio_controller.dart';
import 'package:gw_parish_website/shared/widgets/parish_frame.dart';

GoRouter createRouter({
  required ParishContent content,
  required AccessibilityController accessibility,
  required LiturgyRepository liturgyRepository,
  required MassScheduleService massScheduleService,
  required LiturgicalDay? liturgicalDay,
  required NewsletterArchive archive,
  required PrayerWallService prayerWallService,
  required EditorialAudioController audioController,
}) {
  final resolver = const SeasonColorResolver();
  final seasonColor = liturgicalDay == null
      ? DesignTokens.accent
      : resolver.colorFor(liturgicalDay.season);
  final seasonLabel =
      liturgicalDay?.seasonName ?? 'Liturgical season unavailable';

  Widget shell({required Widget child, required GoRouterState state}) {
    return ParishFrame(
      currentPath: state.uri.path,
      parishContent: content,
      accessibility: accessibility,
      seasonColor: seasonColor,
      seasonLabel: seasonLabel,
      audioController: audioController,
      child: child,
    );
  }

  return GoRouter(
    errorBuilder: (context, state) => shell(
      state: state,
      child: Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 64, horizontal: 24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.explore_off, size: 64),
              const SizedBox(height: 16),
              Text(
                'Page not found',
                style: Theme.of(context).textTheme.headlineMedium,
              ),
              const SizedBox(height: 8),
              Text(
                'The page "${state.uri.path}" does not exist.',
                style: Theme.of(context).textTheme.bodyLarge,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              FilledButton.icon(
                onPressed: () => context.go('/'),
                icon: const Icon(Icons.home),
                label: const Text('Go to Homepage'),
              ),
            ],
          ),
        ),
      ),
    ),
    routes: [
      GoRoute(
        path: '/',
        builder: (context, state) => shell(
          state: state,
          child: HomePage(
            content: content,
            liturgyRepository: liturgyRepository,
            massScheduleService: massScheduleService,
          ),
        ),
      ),
      GoRoute(
        path: '/about',
        builder: (context, state) => shell(
          state: state,
          child: AboutPage(content: content),
        ),
      ),
      GoRoute(
        path: '/mass-sacraments',
        builder: (context, state) => shell(
          state: state,
          child: MassSacramentsPage(content: content),
        ),
      ),
      GoRoute(
        path: '/news-events',
        builder: (context, state) => shell(
          state: state,
          child: NewsEventsPage(
            content: content,
            archive: archive,
            audioController: audioController,
          ),
        ),
      ),

      // ── Canonical bulletin reader route ────────────────────────
      GoRoute(
        path: '/news-events/bulletin/:id',
        builder: (context, state) {
          final id = state.pathParameters['id']!;
          final item = archive.findById(id);

          if (item == null) {
            return shell(
              state: state,
              child: const _BulletinNotFound(),
            );
          }

          if (item.nativeBulletin == null) {
            return shell(
              state: state,
              child: _BulletinUnavailable(item: item),
            );
          }

          return shell(
            state: state,
            child: BulletinDetailPage(
              bulletin: item.nativeBulletin!,
              title: item.title,
            ),
          );
        },
      ),

      // ── Compat redirect: /bulletin/:id → /news-events/bulletin/:id ──
      GoRoute(
        path: '/bulletin/:id',
        redirect: (context, state) =>
            '/news-events/bulletin/${state.pathParameters['id']}',
      ),

      GoRoute(
        path: '/services-community',
        builder: (context, state) => shell(
          state: state,
          child: ServicesCommunityPage(
            content: content,
            prayerWallService: prayerWallService,
            reduceMotion: accessibility.reduceMotion,
          ),
        ),
      ),
      GoRoute(
        path: '/history',
        builder: (context, state) => shell(
          state: state,
          child: HistoryPage(content: content),
        ),
      ),
      GoRoute(
        path: '/contact',
        builder: (context, state) => shell(
          state: state,
          child: ContactPage(content: content),
        ),
      ),
      GoRoute(
        path: '/new-here',
        builder: (context, state) => shell(
          state: state,
          child: NewHerePage(content: content),
        ),
      ),
      GoRoute(
        path: '/search',
        builder: (context, state) =>
            shell(state: state, child: SearchPage(content: content)),
      ),
      GoRoute(
        path: '/privacy',
        builder: (context, state) => shell(
          state: state,
          child: const PrivacyPolicyPage(),
        ),
      ),

      // ── Pew Mode: distraction-free reading view (no shell) ─────
      GoRoute(
        path: '/pew-mode',
        builder: (context, state) {
          if (liturgicalDay == null) {
            return shell(
              state: state,
              child: const Center(
                child: Text('Readings are not available right now.'),
              ),
            );
          }
          return PewModePage(day: liturgicalDay);
        },
      ),
    ],
  );
}

// ── Fallback states ──────────────────────────────────────────

class _BulletinNotFound extends StatelessWidget {
  const _BulletinNotFound();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.article_outlined, size: 48),
          const SizedBox(height: 16),
          Text(
            'Bulletin not found',
            style: Theme.of(context).textTheme.headlineSmall,
          ),
          const SizedBox(height: 8),
          Text(
            'The bulletin you requested does not exist.',
            style: Theme.of(context).textTheme.bodyLarge,
          ),
          const SizedBox(height: 24),
          FilledButton(
            onPressed: () => context.go('/news-events'),
            child: const Text('Back to News & Events'),
          ),
        ],
      ),
    );
  }
}

class _BulletinUnavailable extends StatelessWidget {
  const _BulletinUnavailable({required this.item});

  final NewsletterItem item;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.picture_as_pdf, size: 48),
          const SizedBox(height: 16),
          Text(
            'Native edition unavailable',
            style: Theme.of(context).textTheme.headlineSmall,
          ),
          const SizedBox(height: 8),
          Text(
            item.title,
            style: Theme.of(context).textTheme.bodyLarge,
          ),
          const SizedBox(height: 8),
          Text(
            'This bulletin is available as a PDF download.',
            style: Theme.of(context).textTheme.bodyMedium,
          ),
          const SizedBox(height: 24),
          FilledButton.icon(
            onPressed: () => launchUrl(Uri.parse(item.url)),
            icon: const Icon(Icons.open_in_new),
            label: const Text('Open PDF'),
          ),
          const SizedBox(height: 12),
          TextButton(
            onPressed: () => context.go('/news-events'),
            child: const Text('Back to News & Events'),
          ),
        ],
      ),
    );
  }
}
