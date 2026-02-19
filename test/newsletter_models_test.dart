import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';

import 'package:gw_parish_website/data/models/parish_models.dart';

void main() {
  group('BulletinSection.fromJson', () {
    test('parses section with imageAsset and focal point', () {
      final json = <String, dynamic>{
        'title': 'Update',
        'content': 'Details here.',
        'imageAsset': 'assets/images/refurbishment/after_1.webp',
        'imageFocalPoint': {'x': 0.2, 'y': -0.4},
      };
      final section = BulletinSection.fromJson(json);

      expect(section.title, 'Update');
      expect(section.content, 'Details here.');
      expect(section.imageAsset, 'assets/images/refurbishment/after_1.webp');
      expect(section.imageFocalPoint, const Alignment(0.2, -0.4));
    });

    test('parses section without imageAsset', () {
      final json = <String, dynamic>{'title': 'News', 'content': 'Body text.'};
      final section = BulletinSection.fromJson(json);

      expect(section.imageAsset, isNull);
      expect(section.imageFocalPoint, Alignment.center);
    });

    test('clamps invalid focal values into alignment range', () {
      final json = <String, dynamic>{
        'title': 'News',
        'content': 'Body text.',
        'imageFocalPoint': {'x': -1.9, 'y': 1.4},
      };
      final section = BulletinSection.fromJson(json);

      expect(section.imageFocalPoint, const Alignment(-1, 1));
    });
  });

  group('Bulletin.fromJson', () {
    test('parses bulletin with cover image and sections', () {
      final json = <String, dynamic>{
        'date': 'February 15, 2026',
        'coverImage': 'assets/images/source/our_parish.webp',
        'priestReflection': 'Reflection text.',
        'sections': [
          {'title': 'A', 'content': 'Body A'},
          {'title': 'B', 'content': 'Body B', 'imageAsset': 'img.png'},
        ],
      };
      final bulletin = Bulletin.fromJson(json);

      expect(bulletin.date, 'February 15, 2026');
      expect(bulletin.coverImage, 'assets/images/source/our_parish.webp');
      expect(bulletin.priestReflection, 'Reflection text.');
      expect(bulletin.sections, hasLength(2));
      expect(bulletin.sections[1].imageAsset, 'img.png');
    });

    test('parses bulletin without cover image', () {
      final json = <String, dynamic>{
        'date': 'March 1, 2026',
        'priestReflection': 'Text.',
        'sections': <Map<String, dynamic>>[],
      };
      final bulletin = Bulletin.fromJson(json);

      expect(bulletin.coverImage, isNull);
      expect(bulletin.sections, isEmpty);
    });
  });

  group('NewsletterItem.fromJson', () {
    test('parses item with nativeBulletin', () {
      final json = <String, dynamic>{
        'id': 'lent-1',
        'title': 'CONNECTIONS 1ST SUN LENT',
        'url': 'https://example.com/lent.pdf',
        'isCurrent': true,
        'nativeBulletin': {
          'date': 'Feb 15',
          'priestReflection': 'Reflect.',
          'sections': [
            {'title': 'S', 'content': 'C'},
          ],
        },
      };
      final item = NewsletterItem.fromJson(json);

      expect(item.id, 'lent-1');
      expect(item.isCurrent, isTrue);
      expect(item.nativeBulletin, isNotNull);
      expect(item.nativeBulletin!.sections, hasLength(1));
    });

    test('parses pdf-only item', () {
      final json = <String, dynamic>{
        'id': 'easter-2',
        'title': 'CONNECTIONS 2ND SUNDAY EASTER',
        'url': 'https://example.com/easter.pdf',
        'isCurrent': false,
        'nativeBulletin': null,
      };
      final item = NewsletterItem.fromJson(json);

      expect(item.nativeBulletin, isNull);
      expect(item.isCurrent, isFalse);
    });
  });

  group('NewsletterArchive', () {
    late NewsletterArchive archive;

    setUp(() {
      archive = NewsletterArchive.fromJson({
        'lastVerified': '2026-02-12',
        'source': 'https://example.com',
        'items': [
          {
            'id': 'native-item',
            'title': 'Native',
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
            'title': 'PDF Only',
            'url': 'https://example.com/pdf.pdf',
            'isCurrent': false,
            'nativeBulletin': null,
          },
        ],
      });
    });

    test('parses mixed archive', () {
      expect(archive.items, hasLength(2));
      expect(archive.items[0].nativeBulletin, isNotNull);
      expect(archive.items[1].nativeBulletin, isNull);
    });

    test('findById returns correct item', () {
      expect(archive.findById('native-item')?.title, 'Native');
      expect(archive.findById('pdf-item')?.title, 'PDF Only');
    });

    test('findById returns null for unknown id', () {
      expect(archive.findById('nonexistent'), isNull);
    });
  });
}
