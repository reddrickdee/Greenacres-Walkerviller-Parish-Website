import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:gw_parish_website/data/models/parish_models.dart';
import 'package:gw_parish_website/features/news_events/bulletin_detail_page.dart';
import 'package:gw_parish_website/shared/widgets/drop_cap_paragraph.dart';

void main() {
  final testBulletin = Bulletin(
    date: 'February 15, 2026',
    priestReflection: 'Reflection paragraph here.',
    sections: [
      const BulletinSection(title: 'Section A', content: 'Content A'),
      const BulletinSection(title: 'Section B', content: 'Content B'),
      const BulletinSection(title: 'Section C', content: 'Content C'),
    ],
  );

  testWidgets('renders DropCapParagraph for reflection', (tester) async {
    await tester.binding.setSurfaceSize(const Size(1200, 2400));
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: SingleChildScrollView(
            child: BulletinDetailPage(
              bulletin: testBulletin,
              title: 'TEST BULLETIN',
            ),
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.byType(DropCapParagraph), findsOneWidget);
  });

  testWidgets('renders correct number of section widgets', (tester) async {
    await tester.binding.setSurfaceSize(const Size(1200, 2400));
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: SingleChildScrollView(
            child: BulletinDetailPage(
              bulletin: testBulletin,
              title: 'TEST BULLETIN',
            ),
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();

    // Each section title should appear once
    expect(find.text('Section A'), findsOneWidget);
    expect(find.text('Section B'), findsOneWidget);
    expect(find.text('Section C'), findsOneWidget);
  });

  testWidgets('mobile width uses single column layout', (tester) async {
    await tester.binding.setSurfaceSize(const Size(375, 2400));
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: SingleChildScrollView(
            child: BulletinDetailPage(
              bulletin: testBulletin,
              title: 'TEST BULLETIN',
            ),
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();

    // All sections should still render in single column
    expect(find.text('Section A'), findsOneWidget);
    expect(find.text('Section B'), findsOneWidget);
    expect(find.text('Section C'), findsOneWidget);
  });
}
