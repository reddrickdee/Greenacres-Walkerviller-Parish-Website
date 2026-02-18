import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'package:gw_parish_website/core/layout/breakpoints.dart';
import 'package:gw_parish_website/core/theme/design_tokens.dart';
import 'package:gw_parish_website/data/models/liturgy_models.dart';
import 'package:gw_parish_website/data/models/parish_models.dart';
import 'package:gw_parish_website/services/liturgy/liturgy_repository.dart';
import 'package:gw_parish_website/services/mass/mass_schedule_service.dart';
import 'package:gw_parish_website/shared/widgets/christian_art_card.dart';
import 'package:gw_parish_website/shared/widgets/daily_readings_card.dart';
import 'package:gw_parish_website/shared/widgets/grayscale_hover_image.dart';
import 'package:gw_parish_website/shared/widgets/liturgical_timeline.dart';
import 'package:gw_parish_website/shared/widgets/next_mass_countdown_card.dart';
import 'package:gw_parish_website/shared/widgets/saint_of_day_card.dart';
import 'package:gw_parish_website/shared/widgets/scripture_block.dart';
import 'package:gw_parish_website/shared/widgets/section_shell.dart';

class HomePage extends StatelessWidget {
  const HomePage({
    required this.content,
    required this.liturgyRepository,
    required this.massScheduleService,
    super.key,
  });

  final ParishContent content;
  final LiturgyRepository liturgyRepository;
  final MassScheduleService massScheduleService;

  @override
  Widget build(BuildContext context) {
    final mobile = Breakpoints.isMobile(context);

    return Semantics(
      container: true,
      child: Column(
        children: [
          SectionShell(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'In the Footsteps of Jesus',
                  style: Theme.of(context).textTheme.labelMedium,
                ),
                const SizedBox(height: 16),
                Text.rich(
                  TextSpan(
                    text: 'Welcome to Our ',
                    style: Theme.of(context).textTheme.displayMedium,
                    children: [
                      TextSpan(
                        text: 'Parish',
                        style: Theme.of(context).textTheme.displayMedium
                            ?.copyWith(
                              fontStyle: FontStyle.italic,
                              color: DesignTokens.accent,
                            ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                GrayscaleHoverImage(
                  image: const AssetImage('assets/images/source/hero_3.jpg'),
                  height: mobile ? 320 : 520,
                ),
                const SizedBox(height: 24),
                Wrap(
                  spacing: 12,
                  runSpacing: 12,
                  children: [
                    _QuickLink(label: 'Mass Times', path: '/mass-sacraments'),
                    _QuickLink(label: 'Contact', path: '/contact'),
                    _QuickLink(label: 'I\'m New Here', path: '/new-here'),
                    _QuickLink(label: 'Latest News', path: '/news-events'),
                  ],
                ),
              ],
            ),
          ),

          // ── Liturgical Year Timeline ──────────────────────────
          _TimelineLoader(repository: liturgyRepository),

          SectionShell(
            overline: 'Liturgical Today',
            title: 'Worship at a Glance',
            background: Theme.of(context).brightness == Brightness.dark
                ? DesignTokens.darkMutedBackground.withValues(alpha: 0.5)
                : DesignTokens.mutedBackground.withValues(alpha: 0.35),
            child: LayoutBuilder(
              builder: (context, constraints) {
                final twoColumns = constraints.maxWidth > 900;
                if (!twoColumns) {
                  return Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      NextMassCountdownCard(
                        schedule: content.massSchedule,
                        service: massScheduleService,
                        contact: content.contact,
                      ),
                      const SizedBox(height: 20),
                      _ReadingsLoader(repository: liturgyRepository),
                    ],
                  );
                }
                return Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: NextMassCountdownCard(
                        schedule: content.massSchedule,
                        service: massScheduleService,
                        contact: content.contact,
                      ),
                    ),
                    const SizedBox(width: 20),
                    Expanded(
                      child: _ReadingsLoader(repository: liturgyRepository),
                    ),
                  ],
                );
              },
            ),
          ),
          SectionShell(
            overline: 'Parish Welcome',
            title: 'A Living Catholic Community',
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  content.welcomeExcerpt,
                  style: Theme.of(context).textTheme.bodyLarge,
                ),
                const SizedBox(height: 12),
                TextButton(
                  onPressed: () => context.go('/about'),
                  child: const Text('Read More'),
                ),
                const SizedBox(height: 24),
                ScriptureBlock(text: content.parishPrayerText),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ── Timeline loader ──────────────────────────────────────────────
class _TimelineLoader extends StatefulWidget {
  const _TimelineLoader({required this.repository});

  final LiturgyRepository repository;

  @override
  State<_TimelineLoader> createState() => _TimelineLoaderState();
}

class _TimelineLoaderState extends State<_TimelineLoader> {
  late Future<LiturgicalDay> _future;

  @override
  void initState() {
    super.initState();
    _future = widget.repository.getToday();
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<LiturgicalDay>(
      future: _future,
      builder: (context, snapshot) {
        if (!snapshot.hasData) {
          return const SizedBox.shrink();
        }
        return SectionShell(
          overline: 'Liturgical Calendar',
          title: 'The Year of Grace',
          child: LiturgicalTimeline(day: snapshot.data!),
        );
      },
    );
  }
}

// ── Readings loader ──────────────────────────────────────────────
class _ReadingsLoader extends StatefulWidget {
  const _ReadingsLoader({required this.repository});

  final LiturgyRepository repository;

  @override
  State<_ReadingsLoader> createState() => _ReadingsLoaderState();
}

class _ReadingsLoaderState extends State<_ReadingsLoader> {
  late Future<LiturgicalDay> _future;

  @override
  void initState() {
    super.initState();
    _future = widget.repository.getToday();
  }

  @override
  void didUpdateWidget(covariant _ReadingsLoader oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.repository != widget.repository) {
      _future = widget.repository.getToday();
    }
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<LiturgicalDay>(
      future: _future,
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return const Card(
            child: Padding(
              padding: EdgeInsets.all(24),
              child: LinearProgressIndicator(),
            ),
          );
        }
        if (snapshot.hasError || !snapshot.hasData) {
          return const Card(
            child: Padding(
              padding: EdgeInsets.all(24),
              child: Text('Unable to load readings right now.'),
            ),
          );
        }
        final day = snapshot.data!;
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            DailyReadingsCard(day: day),
            if (day.christianArt != null) ...[
              const SizedBox(height: 20),
              ChristianArtCard(item: day.christianArt!),
            ],
            if (day.saintOfDay != null) ...[
              const SizedBox(height: 20),
              SaintOfDayCard(saint: day.saintOfDay!),
            ],
          ],
        );
      },
    );
  }
}

class _QuickLink extends StatelessWidget {
  const _QuickLink({required this.label, required this.path});

  final String label;
  final String path;

  @override
  Widget build(BuildContext context) {
    return OutlinedButton(
      onPressed: () => context.go(path),
      child: Text(label.toUpperCase()),
    );
  }
}
