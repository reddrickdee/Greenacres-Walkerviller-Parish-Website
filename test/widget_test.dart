import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:timezone/data/latest.dart' as tz_data;

import 'package:gw_parish_website/data/models/liturgy_models.dart';
import 'package:gw_parish_website/data/models/parish_models.dart';
import 'package:gw_parish_website/features/home/home_page.dart';
import 'package:gw_parish_website/services/liturgy/liturgy_repository.dart';
import 'package:gw_parish_website/services/mass/mass_schedule_service.dart';

void main() {
  setUpAll(() {
    tz_data.initializeTimeZones();
  });

  testWidgets('home page renders key quick links', (tester) async {
    final content = ParishContent.fromJson(_sampleContent);
    await tester.binding.setSurfaceSize(const Size(1200, 2200));

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: SingleChildScrollView(
            child: HomePage(
              content: content,
              liturgyRepository: _FakeLiturgyRepository(),
              massScheduleService: MassScheduleService(),
            ),
          ),
        ),
      ),
    );

    await tester.pumpAndSettle();

    expect(find.textContaining('MASS TIMES'), findsWidgets);
    expect(find.textContaining("I'M NEW HERE"), findsWidgets);
    expect(find.textContaining("Today's Readings"), findsOneWidget);
  });
}

class _FakeLiturgyRepository implements LiturgyRepository {
  @override
  Future<LiturgicalDay> getToday({DateTime? now}) async {
    return LiturgicalDay.fromJson({
      'date': '2026-02-12',
      'seasonName': 'Thursday of week 5 in Ordinary Time',
      'season': 'ordinaryTime',
      'readings': [
        {
          'label': 'First Reading',
          'reference': '1 Kings 11:4-13',
          'summary': 'Summary',
          'url': 'https://example.com/1',
        },
        {
          'label': 'Responsorial Psalm',
          'reference': 'Psalm 105',
          'summary': 'Summary',
          'url': 'https://example.com/2',
        },
        {
          'label': 'Gospel',
          'reference': 'Mark 7:24-30',
          'summary': 'Summary',
          'url': 'https://example.com/3',
        },
      ],
      'upcomingFeasts': [],
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
  'welcomeExcerpt': 'Welcome to the parish.',
  'parishPrayerText': 'Parish prayer text.',
  'priestWelcome': 'Priest welcome text.',
  'pastoralChairMessage': 'Chair message.',
  'visionStatement': 'Vision statement.',
  'missionPoints': [
    {'title': 'Mission one'},
  ],
  'councilMembers': [
    {
      'name': 'Name',
      'role': 'Role',
      'bio': 'Bio',
      'photoAsset': 'assets/images/source/council_reg_nye.webp',
    },
  ],
  'newsItems': [
    {'title': 'News', 'summary': 'Summary', 'url': 'https://example.com'},
  ],
  'eventItems': [
    {'title': 'Event', 'dateLabel': 'Weekly', 'description': 'Description'},
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
  'volunteerInfo': 'Volunteer info',
  'newHereSteps': ['Step 1'],
  'historyMilestones': [
    {'year': '2024', 'description': 'Milestone'},
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
      'principal': 'Principal',
      'phone': '1234',
      'website': 'www.example.com',
    },
  ],
  'refurbishmentImages': ['assets/images/refurbishment/after_1.webp'],
};
