import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_svg/flutter_svg.dart';

import 'package:gw_parish_website/shared/widgets/drop_cap_paragraph.dart';

void main() {
  Widget wrapWithScaffold(Widget child) {
    return MaterialApp(home: Scaffold(body: child));
  }

  testWidgets('uses illuminated SVG drop cap on Christmas', (tester) async {
    await tester.pumpWidget(
      wrapWithScaffold(
        DropCapParagraph(
          text: 'Glory to God in the highest.',
          referenceDate: DateTime(2026, 12, 25),
        ),
      ),
    );

    expect(find.byType(SvgPicture), findsOneWidget);
  });

  testWidgets('uses illuminated SVG drop cap on Pentecost', (tester) async {
    await tester.pumpWidget(
      wrapWithScaffold(
        DropCapParagraph(
          text: 'Peace be with you.',
          referenceDate: DateTime(2026, 5, 24),
        ),
      ),
    );

    expect(find.byType(SvgPicture), findsOneWidget);
  });

  testWidgets('keeps text drop cap on ordinary dates', (tester) async {
    await tester.pumpWidget(
      wrapWithScaffold(
        DropCapParagraph(
          text: 'Mercy and grace abound.',
          referenceDate: DateTime(2026, 2, 13),
        ),
      ),
    );

    expect(find.byType(SvgPicture), findsNothing);
  });
}
