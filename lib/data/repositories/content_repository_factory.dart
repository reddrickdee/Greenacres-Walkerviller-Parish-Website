import 'package:gw_parish_website/data/repositories/asset_content_repository.dart';
import 'package:gw_parish_website/data/repositories/cms_content_repository.dart';
import 'package:gw_parish_website/data/repositories/content_repository.dart';

/// Selects the [IContentRepository] backend based on configuration.
///
/// Defaults to asset-backed content.  To swap to a CMS backend, pass
/// `backend: 'cms'` with the required endpoint.
///
/// ## Usage in app.dart
/// ```dart
/// final contentRepo = ContentRepositoryFactory.create();
/// // or:
/// final contentRepo = ContentRepositoryFactory.create(
///   backend: 'cms',
///   cmsEndpoint: 'https://your-project.api.sanity.io/v1/data/query/production',
///   cmsToken: const String.fromEnvironment('CMS_TOKEN'),
/// );
/// ```
abstract final class ContentRepositoryFactory {
  /// Creates the appropriate [IContentRepository].
  ///
  /// [backend] — `'asset'` (default) or `'cms'`.
  /// [cmsEndpoint] — required when backend is `'cms'`.
  /// [cmsToken] — optional bearer token for CMS authentication.
  static IContentRepository create({
    String backend = 'asset',
    String? cmsEndpoint,
    String? cmsToken,
  }) {
    switch (backend) {
      case 'cms':
        if (cmsEndpoint == null || cmsEndpoint.isEmpty) {
          throw ArgumentError(
            'cmsEndpoint is required when backend is "cms".',
          );
        }
        return CmsContentRepository(
          endpoint: cmsEndpoint,
          apiToken: cmsToken,
        );
      case 'asset':
      default:
        return const AssetContentRepository();
    }
  }
}
