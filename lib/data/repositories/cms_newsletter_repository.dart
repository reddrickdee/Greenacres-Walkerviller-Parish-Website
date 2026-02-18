import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import 'package:gw_parish_website/data/models/parish_models.dart';
import 'package:gw_parish_website/data/repositories/asset_newsletter_repository.dart';
import 'package:gw_parish_website/data/repositories/newsletter_repository.dart';

/// Supabase-backed [INewsletterRepository] that fetches newsletter items
/// and optional native bulletin sections from CMS.
///
/// ## Resilience
///
/// If the Supabase request fails for any reason, the repository silently
/// falls back to [AssetNewsletterRepository].
class CmsNewsletterRepository implements INewsletterRepository {
  CmsNewsletterRepository({
    required this.endpoint,
    this.apiToken,
    http.Client? httpClient,
  }) : _httpClient = httpClient ?? http.Client();

  /// Supabase project URL (e.g. `https://xxxx.supabase.co`).
  final String endpoint;

  /// Supabase anon key for authenticated reads.
  final String? apiToken;

  final http.Client _httpClient;

  @override
  Future<NewsletterArchive> loadArchive() async {
    final fallback = await const AssetNewsletterRepository().loadArchive();

    try {
      final uri = Uri.parse(
        '$endpoint/rest/v1/newsletter_items'
        '?select=*,bulletin_sections(*)&order=published_on.desc',
      );

      final headers = <String, String>{
        'Accept': 'application/json',
        if (apiToken != null) ...{
          'apikey': apiToken!,
          'Authorization': 'Bearer $apiToken',
        },
      };

      final response = await _httpClient.get(uri, headers: headers);

      if (response.statusCode != 200) {
        return fallback;
      }

      final rows = jsonDecode(response.body) as List<dynamic>;
      if (rows.isEmpty) {
        return fallback;
      }

      final items = rows
          .map((row) => _mapNewsletterItem(row as Map<String, dynamic>))
          .toList();

      return NewsletterArchive(
        lastVerified: DateTime.now().toIso8601String().substring(0, 10),
        source: endpoint,
        items: items,
      );
    } catch (_) {
      return fallback;
    }
  }

  static NewsletterItem _mapNewsletterItem(Map<String, dynamic> row) {
    final sections = row['bulletin_sections'] as List<dynamic>? ?? [];

    // Sort sections by sort_order.
    final sortedSections = List<Map<String, dynamic>>.from(
      sections.cast<Map<String, dynamic>>(),
    )..sort((a, b) =>
        (a['sort_order'] as int? ?? 0).compareTo(b['sort_order'] as int? ?? 0));

    // Determine if this item has a native bulletin.
    final nativeDate = row['native_date'] as String?;
    final priestReflection = row['priest_reflection'] as String?;
    final coverImage = row['cover_image'] as String?;
    final hasNativeContent = nativeDate != null ||
        priestReflection != null ||
        coverImage != null ||
        sortedSections.isNotEmpty;

    Bulletin? nativeBulletin;
    if (hasNativeContent) {
      nativeBulletin = Bulletin(
        date: nativeDate ?? '',
        priestReflection: priestReflection ?? '',
        coverImage: coverImage,
        sections: sortedSections
            .map((s) => _mapBulletinSection(s))
            .toList(),
      );
    }

    return NewsletterItem(
      id: row['id'] as String,
      title: row['title'] as String,
      url: row['url'] as String,
      isCurrent: row['is_current'] as bool? ?? false,
      nativeBulletin: nativeBulletin,
    );
  }

  static BulletinSection _mapBulletinSection(Map<String, dynamic> row) {
    final focalX = (row['image_focal_x'] as num?)?.toDouble();
    final focalY = (row['image_focal_y'] as num?)?.toDouble();

    Alignment focalPoint = Alignment.center;
    if (focalX != null && focalY != null) {
      focalPoint = Alignment(
        focalX.clamp(-1.0, 1.0),
        focalY.clamp(-1.0, 1.0),
      );
    }

    return BulletinSection(
      title: row['title'] as String,
      content: row['content'] as String,
      imageAsset: row['image_path'] as String?,
      imageFocalPoint: focalPoint,
    );
  }
}
