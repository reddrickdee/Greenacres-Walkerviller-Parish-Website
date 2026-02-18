import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'package:gw_parish_website/core/accessibility/accessibility_controller.dart';
import 'package:gw_parish_website/core/navigation/app_router.dart';
import 'package:gw_parish_website/core/theme/app_theme.dart';
import 'package:gw_parish_website/core/theme/design_tokens.dart';
import 'package:gw_parish_website/data/models/liturgy_models.dart';
import 'package:gw_parish_website/data/models/parish_models.dart';
import 'package:gw_parish_website/data/repositories/asset_newsletter_repository.dart';
import 'package:gw_parish_website/data/repositories/content_repository_factory.dart';
import 'package:gw_parish_website/services/liturgy/asset_liturgy_provider.dart';
import 'package:gw_parish_website/services/liturgy/composite_liturgy_repository.dart';
import 'package:gw_parish_website/services/liturgy/liturgy_repository.dart';
import 'package:gw_parish_website/services/mass/mass_schedule_service.dart';
import 'package:gw_parish_website/services/prayer/prayer_wall_service.dart';
import 'package:gw_parish_website/services/audio/editorial_audio_controller.dart';

class ParishApp extends StatefulWidget {
  const ParishApp({super.key});

  @override
  State<ParishApp> createState() => _ParishAppState();
}

class _ParishAppState extends State<ParishApp> {
  late final Future<_BootstrapData> _bootstrap;

  @override
  void initState() {
    super.initState();
    _bootstrap = _load();
  }

  Future<_BootstrapData> _load() async {
    final contentRepo = ContentRepositoryFactory.create();
    final newsletterRepo = const AssetNewsletterRepository();
    final content = await contentRepo.loadContent();
    final archive = await newsletterRepo.loadArchive();
    final accessibility = await AccessibilityController.load();
    final liturgyRepository = CompositeLiturgyRepository();
    final massScheduleService = MassScheduleService();
    final prayerWallService = PrayerWallService();
    final audioController = EditorialAudioController();
    LiturgicalDay? liturgicalDay;

    try {
      liturgicalDay = await liturgyRepository.getToday();
    } catch (_) {
      try {
        liturgicalDay = await const AssetLiturgyProvider().loadFallback();
      } catch (_) {
        liturgicalDay = null;
      }
    }

    final router = createRouter(
      content: content,
      accessibility: accessibility,
      liturgyRepository: liturgyRepository,
      massScheduleService: massScheduleService,
      liturgicalDay: liturgicalDay,
      archive: archive,
      prayerWallService: prayerWallService,
      audioController: audioController,
    );

    return _BootstrapData(
      content: content,
      archive: archive,
      accessibility: accessibility,
      liturgyRepository: liturgyRepository,
      massScheduleService: massScheduleService,
      liturgicalDay: liturgicalDay,
      prayerWallService: prayerWallService,
      audioController: audioController,
      router: router,
    );
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<_BootstrapData>(
      future: _bootstrap,
      builder: (context, snapshot) {
        if (!snapshot.hasData) {
          return MaterialApp(
            debugShowCheckedModeBanner: false,
            home: Scaffold(
              backgroundColor: const Color(0xFFF9F8F6),
              body: Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: const [
                    SizedBox(width: 160, child: LinearProgressIndicator()),
                    SizedBox(height: 16),
                    Text('Loading Parish Prototype...'),
                  ],
                ),
              ),
            ),
          );
        }

        final data = snapshot.data!;

        return AnimatedBuilder(
          animation: data.accessibility,
          builder: (context, _) {
            final seasonColor = data.liturgicalDay == null
                ? DesignTokens.accent
                : const SeasonColorResolver().colorFor(
                    data.liturgicalDay!.season,
                  );

            return MaterialApp.router(
              debugShowCheckedModeBanner: false,
              title: 'Greenacres Walkerville Catholic Parish',
              routerConfig: data.router,
              theme: AppTheme.build(
                highContrast: data.accessibility.highContrast,
                fontScale: data.accessibility.fontScale,
                reduceMotion: data.accessibility.reduceMotion,
                highLegibility: data.accessibility.highLegibility,
                seasonColor: seasonColor,
              ),
              darkTheme: AppTheme.build(
                highContrast: data.accessibility.highContrast,
                fontScale: data.accessibility.fontScale,
                reduceMotion: data.accessibility.reduceMotion,
                highLegibility: data.accessibility.highLegibility,
                seasonColor: seasonColor,
                isDark: true,
              ),
              themeMode: data.accessibility.darkMode
                  ? ThemeMode.dark
                  : ThemeMode.light,
            );
          },
        );
      },
    );
  }
}

class _BootstrapData {
  const _BootstrapData({
    required this.content,
    required this.archive,
    required this.accessibility,
    required this.liturgyRepository,
    required this.massScheduleService,
    required this.liturgicalDay,
    required this.prayerWallService,
    required this.audioController,
    required this.router,
  });

  final ParishContent content;
  final NewsletterArchive archive;
  final AccessibilityController accessibility;
  final LiturgyRepository liturgyRepository;
  final MassScheduleService massScheduleService;
  final LiturgicalDay? liturgicalDay;
  final PrayerWallService prayerWallService;
  final EditorialAudioController audioController;
  final GoRouter router;
}
