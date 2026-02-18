import 'package:flutter_test/flutter_test.dart';

import 'package:gw_parish_website/data/repositories/asset_content_repository.dart';
import 'package:gw_parish_website/data/repositories/cms_content_repository.dart';
import 'package:gw_parish_website/data/repositories/content_repository.dart';
import 'package:gw_parish_website/data/repositories/content_repository_factory.dart';

void main() {
  group('IContentRepository conformance', () {
    test('AssetContentRepository satisfies IContentRepository', () {
      const repo = AssetContentRepository();
      expect(repo, isA<IContentRepository>());
    });

    test('CmsContentRepository satisfies IContentRepository', () {
      const repo = CmsContentRepository(endpoint: 'https://example.com');
      expect(repo, isA<IContentRepository>());
    });

    test('ContentRepository typedef resolves to IContentRepository', () {
      // The typedef should allow assignment without cast.
      const ContentRepository repo = AssetContentRepository();
      expect(repo, isA<IContentRepository>());
    });
  });

  group('ContentRepositoryFactory', () {
    test('returns AssetContentRepository by default', () {
      final repo = ContentRepositoryFactory.create();
      expect(repo, isA<AssetContentRepository>());
    });

    test('returns AssetContentRepository for explicit "asset" backend', () {
      final repo = ContentRepositoryFactory.create(backend: 'asset');
      expect(repo, isA<AssetContentRepository>());
    });

    test('returns CmsContentRepository for "cms" backend', () {
      final repo = ContentRepositoryFactory.create(
        backend: 'cms',
        cmsEndpoint: 'https://example.com/api',
        cmsToken: 'test-token',
      );
      expect(repo, isA<CmsContentRepository>());
    });

    test('throws ArgumentError if cms backend has no endpoint', () {
      expect(
        () => ContentRepositoryFactory.create(backend: 'cms'),
        throwsA(isA<ArgumentError>()),
      );
    });

    test('throws ArgumentError if cms backend has empty endpoint', () {
      expect(
        () => ContentRepositoryFactory.create(
          backend: 'cms',
          cmsEndpoint: '',
        ),
        throwsA(isA<ArgumentError>()),
      );
    });
  });

  group('CmsContentRepository', () {
    test('loadContent throws UnimplementedError (stub)', () {
      const repo = CmsContentRepository(endpoint: 'https://example.com');
      expect(repo.loadContent(), throwsA(isA<UnimplementedError>()));
    });

    test('ContentFetchException has message', () {
      const error = ContentFetchException('test error');
      expect(error.message, 'test error');
      expect(error.toString(), contains('test error'));
    });
  });
}
