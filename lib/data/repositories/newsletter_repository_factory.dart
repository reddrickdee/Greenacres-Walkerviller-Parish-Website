import 'package:gw_parish_website/data/repositories/asset_newsletter_repository.dart';
import 'package:gw_parish_website/data/repositories/cms_newsletter_repository.dart';
import 'package:gw_parish_website/data/repositories/newsletter_repository.dart';

/// Selects the [INewsletterRepository] backend based on configuration.
///
/// Defaults to asset-backed content.  To swap to a CMS backend, pass
/// `backend: 'cms'` with the required endpoint.
///
/// ## Usage in app.dart
/// ```dart
/// final newsletterRepo = NewsletterRepositoryFactory.create();
/// // or:
/// final newsletterRepo = NewsletterRepositoryFactory.create(
///   backend: 'cms',
///   cmsEndpoint: 'https://xxxx.supabase.co',
///   cmsToken: const String.fromEnvironment('CMS_TOKEN'),
/// );
/// ```
abstract final class NewsletterRepositoryFactory {
  /// Creates the appropriate [INewsletterRepository].
  ///
  /// [backend] — `'asset'` (default) or `'cms'`.
  /// [cmsEndpoint] — required when backend is `'cms'`.
  /// [cmsToken] — optional bearer token for CMS authentication.
  static INewsletterRepository create({
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
        return CmsNewsletterRepository(
          endpoint: cmsEndpoint,
          apiToken: cmsToken,
        );
      case 'asset':
      default:
        return const AssetNewsletterRepository();
    }
  }
}
