import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:gw_parish_website/shared/widgets/editorial_image.dart';

void main() {
  testWidgets('applies focal alignment to the underlying image', (
    tester,
  ) async {
    const focalPoint = Alignment(0, -0.45);

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: EditorialImage.asset(
            assetPath: 'assets/images/source/our_parish.jpg',
            height: 220,
            focalPoint: focalPoint,
          ),
        ),
      ),
    );

    final image = tester.widget<Image>(find.byType(Image));
    expect(image.alignment, focalPoint);
  });
}
