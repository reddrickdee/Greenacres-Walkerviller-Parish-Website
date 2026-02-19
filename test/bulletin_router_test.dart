import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';
import 'package:timezone/data/latest.dart' as tz_data;

import 'package:gw_parish_website/core/accessibility/accessibility_controller.dart';
import 'package:gw_parish_website/core/navigation/app_router.dart';
import 'package:gw_parish_website/data/models/liturgy_models.dart';
import 'package:gw_parish_website/data/models/parish_models.dart';
import 'package:gw_parish_website/features/news_events/bulletin_detail_page.dart';
import 'package:gw_parish_website/services/liturgy/liturgy_repository.dart';
import 'package:gw_parish_website/services/mass/mass_schedule_service.dart';
import 'package:gw_parish_website/services/prayer/prayer_wall_service.dart';
import 'package:gw_parish_website/services/audio/editorial_audio_controller.dart';

void main() {
  late GoRouter router;
  late NewsletterArchive archive;

  setUpAll(() {
    tz_data.initializeTimeZones();
  });

  setUp(() async {
    archive = NewsletterArchive.fromJson({
      'lastVerified': '2026-02-12',
      'source': 'https://example.com',
      'items': [
        {
          'id': 'native-id',
          'title': 'Native Bulletin',
          'url': 'https://example.com/native.pdf',
          'isCurrent': true,
          'nativeBulletin': {
            'date': 'Feb 15',
            'priestReflection': 'Reflection.',
            'sections': [
              {'title': 'S', 'content': 'C'},
            ],
          },
        },
        {
          'id': 'pdf-only-id',
          'title': 'PDF Only',
          'url': 'https://example.com/pdf.pdf',
          'isCurrent': false,
          'nativeBulletin': null,
        },
      ],
    });

    final content = ParishContent.fromJson(_sampleContent);
    final accessibility = await AccessibilityController.load();

    router = createRouter(
      content: content,
      accessibility: accessibility,
      liturgyRepository: _FakeLiturgyRepository(),
      massScheduleService: MassScheduleService(),
      liturgicalDay: null,
      archive: archive,
      prayerWallService: PrayerWallService(),
      audioController: EditorialAudioController(),
    );
  });

  testWidgets('valid native id renders BulletinDetailPage', (tester) async {
    await tester.binding.setSurfaceSize(const Size(1200, 2400));

    router.go('/news-events/bulletin/native-id');

    await tester.pumpWidget(MaterialApp.router(routerConfig: router));
    await tester.pumpAndSettle();

    expect(find.byType(BulletinDetailPage), findsOneWidget);
    expect(find.text('Reflection.'), findsOneWidget);
  });

  testWidgets('valid non-native id renders unavailable state', (tester) async {
    await tester.binding.setSurfaceSize(const Size(1200, 2400));

    router.go('/news-events/bulletin/pdf-only-id');

    await tester.pumpWidget(MaterialApp.router(routerConfig: router));
    await tester.pumpAndSettle();

    expect(find.text('Native edition unavailable'), findsOneWidget);
    expect(find.text('Open PDF'), findsOneWidget);
  });

  testWidgets('invalid id renders not-found state', (tester) async {
    await tester.binding.setSurfaceSize(const Size(1200, 2400));

    router.go('/news-events/bulletin/nonexistent');

    await tester.pumpWidget(MaterialApp.router(routerConfig: router));
    await tester.pumpAndSettle();

    expect(find.text('Bulletin not found'), findsOneWidget);
    expect(find.text('Back to News & Events'), findsOneWidget);
  });

  testWidgets('compat route /bulletin/:id redirects to canonical',
      (tester) async {
    await tester.binding.setSurfaceSize(const Size(1200, 2400));

    router.go('/bulletin/native-id');

    await tester.pumpWidget(MaterialApp.router(routerConfig: router));
    await tester.pumpAndSettle();

    // Should redirect and render the detail page
    expect(find.byType(BulletinDetailPage), findsOneWidget);
  });
}

class _FakeLiturgyRepository implements LiturgyRepository {
  @override
  Future<LiturgicalDay> getToday({DateTime? now}) async {
    return LiturgicalDay.fromJson({
      'date': '2026-02-12',
      'seasonName': 'Test',
      'season': 'ordinaryTime',
      'readings': <Map<String, dynamic>>[],
      'upcomingFeasts': <Map<String, dynamic>>[],
      'lastUpdated': '2026-02-12T00:00:00Z',
      'source': 'Test',
    });
  }
}

const Map<String, dynamic> _sampleContent = {
  'lastVerified': '2026-02-12',
  'sources': <String>[],
  'tagline': 'In the Footsteps of Jesus',
  'parishName': 'Greenacres Walkerville Catholic Parish',
  'welcomeExcerpt': 'Welcome.',
  'parishPrayerText': 'Prayer.',
  'priestWelcome': 'Welcome.',
  'pastoralChairMessage': 'Chair.',
  'visionStatement': 'Vision.',
  'missionPoints': [
    {'title': 'Mission'},
  ],
  'councilMembers': [
    {
      'name': 'N',
      'role': 'R',
      'bio': 'B',
      'photoAsset': 'assets/images/source/council_reg_nye.webp',
    },
  ],
  'newsItems': [
    {'title': 'News', 'summary': 'Summary', 'url': 'https://example.com'},
  ],
  'eventItems': [
    {'title': 'Event', 'dateLabel': 'Weekly', 'description': 'D'},
  ],
  'massSchedule': [
    {
      'id': 'sat_vigil',
      'church': "St Monica's Church",
      'address': 'Walkerville',
      'dayOfWeek': 6,
      'startTime': '18:00',
      'type': 'Weekend Vigil Mass',
    },
  ],
  'sacraments': [
    {'title': 'Baptism', 'details': 'Details'},
  ],
  'communityServices': ['Service'],
  'faithFormation': ['Formation'],
  'volunteerInfo': 'Vol',
  'newHereSteps': ['Step 1'],
  'historyMilestones': [
    {'year': '2024', 'description': 'M'},
  ],
  'contact': {
    'address': '56-80 Princes Road',
    'postalAddress': 'PO Box 42',
    'phone': '(08) 8261 6200',
    'email': 'office@gwparish.org.au',
    'officeHours': 'Mon Wed Thu 9-3',
    'stMonicaQuery': 'St Monica Church Walkerville',
    'stMartinQuery': 'St Martin Church Greenacres',
  },
  'schools': [
    {
      'name': 'St Martin School',
      'address': 'Greenacres',
      'principal': 'P',
      'phone': '1234',
      'website': 'www.example.com',
    },
  ],
  'refurbishmentImages': ['assets/images/refurbishment/after_1.webp'],
};
