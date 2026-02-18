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

  group('resolveImage', () {
    test('returns NetworkImage for https URL', () {
      final result = EditorialImage.resolveImage(
        'https://cdn.example.com/image.jpg',
      );
      expect(result, isA<NetworkImage>());
    });

    test('returns NetworkImage for http URL', () {
      final result = EditorialImage.resolveImage(
        'http://cdn.example.com/image.jpg',
      );
      expect(result, isA<NetworkImage>());
    });

    test('returns AssetImage for asset path', () {
      final result = EditorialImage.resolveImage(
        'assets/images/source/our_parish.jpg',
      );
      expect(result, isA<AssetImage>());
    });

    test('returns AssetImage for relative path', () {
      final result = EditorialImage.resolveImage('images/photo.png');
      expect(result, isA<AssetImage>());
    });
  });
}
