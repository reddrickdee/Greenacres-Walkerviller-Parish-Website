import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';

import 'package:gw_parish_website/data/models/parish_models.dart';
import 'package:gw_parish_website/features/news_events/news_events_page.dart';
import 'package:gw_parish_website/services/audio/editorial_audio_controller.dart';

void main() {
  late NewsletterArchive archive;
  late ParishContent content;

  setUp(() {
    archive = NewsletterArchive.fromJson({
      'lastVerified': '2026-02-12',
      'source': 'https://example.com',
      'items': [
        {
          'id': 'native-item',
          'title': 'Native Bulletin',
          'url': 'https://example.com/native.pdf',
          'isCurrent': true,
          'nativeBulletin': {
            'date': 'Feb',
            'priestReflection': 'R',
            'sections': <Map<String, dynamic>>[],
          },
        },
        {
          'id': 'pdf-item',
          'title': 'PDF Only Bulletin',
          'url': 'https://example.com/pdf.pdf',
          'isCurrent': false,
          'nativeBulletin': null,
        },
      ],
    });

    content = ParishContent.fromJson(_sampleContent);
  });

  testWidgets('native item shows reader icon', (tester) async {
    await tester.binding.setSurfaceSize(const Size(1200, 2200));

    final router = GoRouter(
      routes: [
        GoRoute(
          path: '/',
          builder: (context, state) => Scaffold(
            body: SingleChildScrollView(
              child: NewsEventsPage(content: content, archive: archive, audioController: EditorialAudioController()),
            ),
          ),
        ),
        GoRoute(
          path: '/news-events/bulletin/:id',
          builder: (context, state) => const Scaffold(
            body: Center(child: Text('BULLETIN PAGE')),
          ),
        ),
      ],
    );

    await tester.pumpWidget(MaterialApp.router(routerConfig: router));
    await tester.pumpAndSettle();

    // The native item should show chrome_reader_mode icon
    expect(find.byIcon(Icons.chrome_reader_mode), findsOneWidget);
    // The non-native item should show open_in_new icon
    expect(find.byIcon(Icons.open_in_new), findsOneWidget);
  });

  testWidgets('tapping native item navigates to bulletin page', (tester) async {
    await tester.binding.setSurfaceSize(const Size(1200, 2200));

    final router = GoRouter(
      routes: [
        GoRoute(
          path: '/',
          builder: (context, state) => Scaffold(
            body: SingleChildScrollView(
              child: NewsEventsPage(content: content, archive: archive, audioController: EditorialAudioController()),
            ),
          ),
        ),
        GoRoute(
          path: '/news-events/bulletin/:id',
          builder: (context, state) => const Scaffold(
            body: Center(child: Text('BULLETIN PAGE')),
          ),
        ),
      ],
    );

    await tester.pumpWidget(MaterialApp.router(routerConfig: router));
    await tester.pumpAndSettle();

    // Scroll down to the archive section and tap the native item
    await tester.scrollUntilVisible(
      find.text('Native Bulletin'),
      200,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.tap(find.text('Native Bulletin'));
    await tester.pumpAndSettle();

    expect(find.text('BULLETIN PAGE'), findsOneWidget);
  });
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
      'photoAsset': 'assets/images/source/council_reg_nye.png',
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
  'refurbishmentImages': ['assets/images/refurbishment/after_1.png'],
};
