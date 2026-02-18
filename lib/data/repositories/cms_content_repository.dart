import 'dart:convert';

import 'package:http/http.dart' as http;

import 'package:gw_parish_website/data/models/parish_models.dart';
import 'package:gw_parish_website/data/repositories/asset_content_repository.dart';
import 'package:gw_parish_website/data/repositories/content_repository.dart';

/// Supabase-backed [IContentRepository] that overlays CMS mass schedule
/// data onto asset-loaded parish content.
///
/// ## Resilience
///
/// If the Supabase request fails for any reason (network, auth, malformed
/// payload), the repository silently returns the asset fallback content.
///
/// ## Usage
///
/// ```dart
/// final repo = CmsContentRepository(
///   endpoint: 'https://xxxx.supabase.co',
///   apiToken: const String.fromEnvironment('CMS_TOKEN'),
/// );
/// ```
class CmsContentRepository implements IContentRepository {
  CmsContentRepository({
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
  Future<ParishContent> loadContent() async {
    final fallback = await const AssetContentRepository().loadContent();

    try {
      final uri = Uri.parse(
        '$endpoint/rest/v1/mass_schedule_entries'
        '?is_active=eq.true&order=sort_order.asc',
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

      final cmsEntries = rows
          .map((row) => _mapRow(row as Map<String, dynamic>))
          .toList();

      return fallback.copyWith(massSchedule: cmsEntries);
    } catch (_) {
      return fallback;
    }
  }

  static MassScheduleEntry _mapRow(Map<String, dynamic> row) {
    // Supabase returns `time` as "HH:mm:ss"; we need "HH:mm".
    final rawTime = row['start_time'] as String;
    final startTime =
        rawTime.length >= 5 ? rawTime.substring(0, 5) : rawTime;

    return MassScheduleEntry(
      id: row['id'] as String,
      church: row['church'] as String,
      address: row['address'] as String,
      dayOfWeek: row['day_of_week'] as int,
      startTime: startTime,
      type: row['type'] as String,
      notes: row['notes'] as String?,
      durationMinutes: row['duration_minutes'] as int? ?? 60,
    );
  }
}

/// Thrown when CMS content fetching fails.
class ContentFetchException implements Exception {
  const ContentFetchException(this.message);
  final String message;

  @override
  String toString() => 'ContentFetchException: $message';
}
