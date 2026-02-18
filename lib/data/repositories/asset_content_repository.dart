import 'dart:convert';

import 'package:flutter/services.dart';
import 'package:gw_parish_website/data/models/parish_models.dart';
import 'package:gw_parish_website/data/repositories/content_repository.dart';

/// Loads parish content from bundled JSON assets.
///
/// This is the default [IContentRepository] implementation used during the
/// prototype phase.  Post-approval, the Parish Council can swap this for
/// [CmsContentRepository] via [ContentRepositoryFactory].
class AssetContentRepository implements IContentRepository {
  const AssetContentRepository();

  @override
  Future<ParishContent> loadContent() async {
    final raw = await rootBundle.loadString('assets/data/parish_content.json');
    final jsonMap = jsonDecode(raw) as Map<String, dynamic>;
    return ParishContent.fromJson(jsonMap);
  }
}
