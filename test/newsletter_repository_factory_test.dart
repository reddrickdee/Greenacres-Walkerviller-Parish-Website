import 'package:flutter_test/flutter_test.dart';

import 'package:gw_parish_website/data/repositories/asset_newsletter_repository.dart';
import 'package:gw_parish_website/data/repositories/cms_newsletter_repository.dart';
import 'package:gw_parish_website/data/repositories/newsletter_repository.dart';
import 'package:gw_parish_website/data/repositories/newsletter_repository_factory.dart';

void main() {
  group('INewsletterRepository conformance', () {
    test('AssetNewsletterRepository satisfies INewsletterRepository', () {
      const repo = AssetNewsletterRepository();
      expect(repo, isA<INewsletterRepository>());
    });

    test('CmsNewsletterRepository satisfies INewsletterRepository', () {
      final repo = CmsNewsletterRepository(endpoint: 'https://example.com');
      expect(repo, isA<INewsletterRepository>());
    });
  });

  group('NewsletterRepositoryFactory', () {
    test('returns AssetNewsletterRepository by default', () {
      final repo = NewsletterRepositoryFactory.create();
      expect(repo, isA<AssetNewsletterRepository>());
    });

    test('returns AssetNewsletterRepository for explicit "asset" backend', () {
      final repo = NewsletterRepositoryFactory.create(backend: 'asset');
      expect(repo, isA<AssetNewsletterRepository>());
    });

    test('returns CmsNewsletterRepository for "cms" backend', () {
      final repo = NewsletterRepositoryFactory.create(
        backend: 'cms',
        cmsEndpoint: 'https://example.com',
        cmsToken: 'test-token',
      );
      expect(repo, isA<CmsNewsletterRepository>());
    });

    test('throws ArgumentError if cms backend has no endpoint', () {
      expect(
        () => NewsletterRepositoryFactory.create(backend: 'cms'),
        throwsA(isA<ArgumentError>()),
      );
    });

    test('throws ArgumentError if cms backend has empty endpoint', () {
      expect(
        () => NewsletterRepositoryFactory.create(
          backend: 'cms',
          cmsEndpoint: '',
        ),
        throwsA(isA<ArgumentError>()),
      );
    });
  });
}
