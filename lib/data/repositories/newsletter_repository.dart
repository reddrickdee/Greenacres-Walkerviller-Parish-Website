import 'package:gw_parish_website/data/models/parish_models.dart';

/// The single contract for all newsletter archive content.
///
/// Concrete implementations:
///   • [AssetNewsletterRepository] — reads bundled JSON assets (current).
///   • [CmsNewsletterRepository]   — fetches from Supabase.
///
/// Mirrors the [IContentRepository] pattern used for parish content.
abstract interface class INewsletterRepository {
  /// The full newsletter archive (all bulletin items).
  Future<NewsletterArchive> loadArchive();
}

/// Backward-compatible alias so existing `NewsletterRepository` references
/// compile without modification.
typedef NewsletterRepository = INewsletterRepository;
