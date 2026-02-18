import 'package:gw_parish_website/data/models/parish_models.dart';

/// The single contract for all parish editorial content.
///
/// Concrete implementations:
///   • [AssetContentRepository] — reads bundled JSON assets (current).
///   • [CmsContentRepository]   — stub for future headless CMS swap.
///
/// Post-approval, adding a CMS backend requires only a new implementation
/// of this interface.  Zero UI changes.
abstract interface class IContentRepository {
  /// Core parish content (welcome text, councils, mass schedule, etc.).
  Future<ParishContent> loadContent();
}

/// Backward-compatible alias so existing `ContentRepository` references
/// continue to compile without modification.
typedef ContentRepository = IContentRepository;
