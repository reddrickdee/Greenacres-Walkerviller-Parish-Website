import 'dart:convert';

import 'package:flutter/services.dart';
import 'package:gw_parish_website/data/models/parish_models.dart';

/// Loads newsletter archive from bundled JSON assets.
class AssetNewsletterRepository {
  const AssetNewsletterRepository();

  Future<NewsletterArchive> loadArchive() async {
    final raw = await rootBundle.loadString('assets/data/newsletters.json');
    final jsonMap = jsonDecode(raw) as Map<String, dynamic>;
    return NewsletterArchive.fromJson(jsonMap);
  }
}
