import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:gw_parish_website/data/models/parish_models.dart';
import 'package:gw_parish_website/features/about/about_page.dart';
import 'package:gw_parish_website/shared/widgets/editorial_heading.dart';

void main() {
  late ParishContent content;

  setUp(() {
    content = ParishContent.fromJson(_sampleContent);
  });

  Widget buildSubject({
    Size surfaceSize = const Size(1200, 2400),
    bool disableAnimations = false,
  }) {
    return MaterialApp(
      home: MediaQuery(
        data: MediaQueryData(
          size: surfaceSize,
          disableAnimations: disableAnimations,
        ),
        child: Scaffold(
          body: SingleChildScrollView(
            child: AboutPage(content: content),
          ),
        ),
      ),
    );
  }

  group('Sacred Spaces Tour', () {
    testWidgets('renders 3 scenes with expected headings', (tester) async {
      await tester.binding.setSurfaceSize(const Size(1200, 2400));
      await tester.pumpWidget(buildSubject());
      await tester.pumpAndSettle();

      // Section heading
      expect(find.text('SACRED SPACES'), findsOneWidget);

      // Scene headings – search for the gold/italic keyword portion
      expect(find.textContaining('Stained Glass'), findsWidgets);
      expect(find.textContaining('Tabernacle'), findsWidgets);
      expect(find.textContaining('Cornerstones'), findsWidgets);
    });

    testWidgets('uses EditorialHeading with church labels', (tester) async {
      await tester.binding.setSurfaceSize(const Size(1200, 2400));
      await tester.pumpWidget(buildSubject());
      await tester.pumpAndSettle();

      // 4 EditorialHeading widgets: 1 section heading + 3 scene headings
      expect(find.byType(EditorialHeading), findsNWidgets(4));

      // Church label text (uppercase)
      expect(find.text("ST MARTIN'S CHURCH"), findsOneWidget);
      expect(find.text("ST MONICA'S CHURCH"), findsOneWidget);
      expect(find.text('PARISH HERITAGE'), findsOneWidget);
    });

    testWidgets('scroll changes parallax transform on scene images',
        (tester) async {
      await tester.binding.setSurfaceSize(const Size(1200, 2400));
      await tester.pumpWidget(buildSubject());
      await tester.pumpAndSettle();

      // Find the first scene image Transform.translate via its keyed ancestor
      final imageFinder = find.byKey(const ValueKey('sacredSpaceImage_0'));
      expect(imageFinder, findsOneWidget);

      // The innermost Transform is the Transform.translate for parallax.
      // Use .last because AnimatedScale's Transform is an outer ancestor.
      final transformFinderBefore = find.descendant(
        of: imageFinder,
        matching: find.byType(Transform),
      );
      final transformBefore =
          tester.widget<Transform>(transformFinderBefore.last);
      final offsetBefore = transformBefore.transform.getTranslation();

      // Scroll down by a significant amount
      await tester.drag(
        find.byType(SingleChildScrollView),
        const Offset(0, -400),
      );
      await tester.pumpAndSettle();

      // Get Transform offset after scrolling
      final transformFinderAfter = find.descendant(
        of: imageFinder,
        matching: find.byType(Transform),
      );
      final transformAfter =
          tester.widget<Transform>(transformFinderAfter.last);
      final offsetAfter = transformAfter.transform.getTranslation();

      // The Y translation should differ after scroll
      expect(offsetAfter.y, isNot(equals(offsetBefore.y)));
    });

    testWidgets(
        'disableAnimations: true results in immediate visible content',
        (tester) async {
      await tester.binding.setSurfaceSize(const Size(1200, 2400));
      await tester.pumpWidget(buildSubject(disableAnimations: true));
      // Single pump, no settle – should be immediately visible
      await tester.pump();

      // All 3 image panels should be at full opacity
      for (var i = 0; i < 3; i++) {
        final opacityWidget = tester.widget<AnimatedOpacity>(
          find.byKey(ValueKey('sacredSpaceImage_$i')),
        );
        expect(opacityWidget.opacity, 1.0,
            reason: 'Scene $i image should be immediately visible');
      }

      // All 3 text panels should be at full opacity
      for (var i = 0; i < 3; i++) {
        final opacityWidget = tester.widget<AnimatedOpacity>(
          find.byKey(ValueKey('sacredSpaceText_$i')),
        );
        expect(opacityWidget.opacity, 1.0,
            reason: 'Scene $i text should be immediately visible');
      }
    });

    testWidgets('mobile viewport (390x844) renders without overflow',
        (tester) async {
      await tester.binding.setSurfaceSize(const Size(390, 844));
      await tester.pumpWidget(
        buildSubject(
          surfaceSize: const Size(390, 844),
          disableAnimations: true,
        ),
      );
      await tester.pumpAndSettle();

      // No overflow exceptions and Sacred Spaces renders
      expect(find.text('SACRED SPACES'), findsOneWidget);
    });

    testWidgets('desktop viewport (1440x1200) renders without overflow',
        (tester) async {
      await tester.binding.setSurfaceSize(const Size(1440, 1200));
      await tester.pumpWidget(
        buildSubject(
          surfaceSize: const Size(1440, 1200),
          disableAnimations: true,
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('SACRED SPACES'), findsOneWidget);
    });

    testWidgets('existing about sections still render after Sacred Spaces',
        (tester) async {
      await tester.binding.setSurfaceSize(const Size(1200, 4000));
      await tester.pumpWidget(buildSubject(disableAnimations: true));
      await tester.pumpAndSettle();

      // Sacred Spaces section is present
      expect(find.byKey(const ValueKey('sacredSpacesTour')), findsOneWidget);

      // Existing sections still render
      expect(find.text('ABOUT OUR PARISH'), findsOneWidget);
      expect(find.text('PASTORAL COUNCIL'), findsOneWidget);
    });
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
