// ignore_for_file: avoid_print
/// One-time seed script: reads existing JSON assets and inserts them into
/// Supabase via the REST API.
///
/// Usage:
///   dart run scripts/seed_supabase.dart \
///     --endpoint=https://xxxx.supabase.co \
///     --token=YOUR_SERVICE_ROLE_KEY
///
/// Uses the service_role key (not anon) because it needs INSERT access.

import 'dart:convert';
import 'dart:io';

import 'package:http/http.dart' as http;

Future<void> main(List<String> args) async {
  final endpoint = _flag(args, 'endpoint');
  final token = _flag(args, 'token');

  if (endpoint == null || token == null) {
    stderr.writeln(
      'Usage: dart run scripts/seed_supabase.dart '
      '--endpoint=URL --token=SERVICE_ROLE_KEY',
    );
    exit(1);
  }

  final client = http.Client();
  try {
    await _seedMassSchedule(client, endpoint, token);
    await _seedNewsletters(client, endpoint, token);
    print('\n✅ Seed complete.');
  } finally {
    client.close();
  }
}

// ── Mass Schedule ──────────────────────────────────────────────────────────

Future<void> _seedMassSchedule(
  http.Client client,
  String endpoint,
  String token,
) async {
  print('📅 Seeding mass_schedule_entries…');

  final file = File('assets/data/parish_content.json');
  final json = jsonDecode(await file.readAsString()) as Map<String, dynamic>;
  final entries = json['massSchedule'] as List<dynamic>;

  final rows = <Map<String, dynamic>>[];
  for (var i = 0; i < entries.length; i++) {
    final e = entries[i] as Map<String, dynamic>;
    rows.add({
      'id': e['id'],
      'church': e['church'],
      'address': e['address'],
      'day_of_week': e['dayOfWeek'],
      'start_time': '${e['startTime']}:00', // "HH:mm" → "HH:mm:ss"
      'type': e['type'],
      'notes': e['notes'],
      'duration_minutes': e['durationMinutes'] ?? 60,
      'is_active': true,
      'sort_order': i,
    });
  }

  await _post(client, '$endpoint/rest/v1/mass_schedule_entries', token, rows);
  print('   → Inserted ${rows.length} mass schedule entries.');
}

// ── Newsletters ────────────────────────────────────────────────────────────

Future<void> _seedNewsletters(
  http.Client client,
  String endpoint,
  String token,
) async {
  print('📰 Seeding newsletter_items + bulletin_sections…');

  final file = File('assets/data/newsletters.json');
  final json = jsonDecode(await file.readAsString()) as Map<String, dynamic>;
  final items = json['items'] as List<dynamic>;

  final newsletterRows = <Map<String, dynamic>>[];
  final sectionRows = <Map<String, dynamic>>[];

  for (final item in items) {
    final i = item as Map<String, dynamic>;
    final bulletin = i['nativeBulletin'] as Map<String, dynamic>?;

    newsletterRows.add({
      'id': i['id'],
      'title': i['title'],
      'url': i['url'],
      'is_current': i['isCurrent'] ?? false,
      'published_on': DateTime.now().toIso8601String().substring(0, 10),
      if (bulletin != null) ...{
        'native_date': bulletin['date'],
        'cover_image': bulletin['coverImage'],
        'priest_reflection': bulletin['priestReflection'],
      },
    });

    if (bulletin != null) {
      final sections = bulletin['sections'] as List<dynamic>? ?? [];
      for (var s = 0; s < sections.length; s++) {
        final sec = sections[s] as Map<String, dynamic>;
        final focal = sec['imageFocalPoint'] as Map<String, dynamic>?;
        sectionRows.add({
          'newsletter_id': i['id'],
          'sort_order': s,
          'title': sec['title'],
          'content': sec['content'],
          'image_path': sec['imageAsset'],
          if (focal != null) ...{
            'image_focal_x': focal['x'],
            'image_focal_y': focal['y'],
          },
        });
      }
    }
  }

  await _post(
      client, '$endpoint/rest/v1/newsletter_items', token, newsletterRows);
  print('   → Inserted ${newsletterRows.length} newsletter items.');

  if (sectionRows.isNotEmpty) {
    await _post(
        client, '$endpoint/rest/v1/bulletin_sections', token, sectionRows);
    print('   → Inserted ${sectionRows.length} bulletin sections.');
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────

Future<void> _post(
  http.Client client,
  String url,
  String token,
  List<Map<String, dynamic>> rows,
) async {
  final response = await client.post(
    Uri.parse(url),
    headers: {
      'Content-Type': 'application/json',
      'apikey': token,
      'Authorization': 'Bearer $token',
      'Prefer': 'return=minimal',
    },
    body: jsonEncode(rows),
  );

  if (response.statusCode != 201) {
    throw Exception(
      'POST $url failed (${response.statusCode}): ${response.body}',
    );
  }
}

String? _flag(List<String> args, String name) {
  for (final arg in args) {
    if (arg.startsWith('--$name=')) {
      return arg.substring('--$name='.length);
    }
  }
  return null;
}
