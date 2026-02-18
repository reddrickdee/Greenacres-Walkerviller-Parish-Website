import 'package:http/http.dart' as http;
import 'package:intl/intl.dart';

import 'package:gw_parish_website/data/models/liturgy_models.dart';
import 'package:gw_parish_website/services/liturgy/liturgy_parsing.dart';

class UniversalisLiturgyProvider {
  UniversalisLiturgyProvider({http.Client? client})
    : _client = client ?? http.Client();

  final http.Client _client;

  Future<LiturgicalDay?> tryFetch(DateTime date) async {
    final pathDate = DateFormat('yyyyMMdd').format(date);
    final uri = Uri.parse(
      'https://universalis.com/Australia/$pathDate/mass.htm',
    );

    try {
      final response = await _client.get(uri);
      if (response.statusCode != 200) {
        return null;
      }
      final body = response.body;

      final seasonName = _extractSeasonName(body);
      final firstReading = _extractReading(body, 'First reading');
      final psalm = _extractReading(body, 'Responsorial Psalm');
      final gospel = _extractReading(body, 'Gospel');

      if (seasonName == null ||
          firstReading == null ||
          psalm == null ||
          gospel == null) {
        return null;
      }

      return LiturgicalDay(
        date: DateTime(date.year, date.month, date.day),
        seasonName: seasonName,
        season: parseSeason(seasonName),
        readings: [firstReading, psalm, gospel],
        upcomingFeasts: _extractUpcomingFeasts(body),
        lastUpdated: DateTime.now().toIso8601String(),
        source: 'Universalis',
      );
    } catch (_) {
      return null;
    }
  }

  String? _extractSeasonName(String body) {
    final match = RegExp(
      r'id="feastname"[^>]*>\s*<strong>(.*?)</strong>',
      caseSensitive: false,
      dotAll: true,
    ).firstMatch(body);
    if (match == null) {
      return null;
    }
    return _stripTags(match.group(1)!).trim();
  }

  ReadingItem? _extractReading(String body, String label) {
    final blockMatch = RegExp(
      '<th align="left">$label</th>(.*?)<hr class="shortrule"/>',
      caseSensitive: false,
      dotAll: true,
    ).firstMatch(body);

    if (blockMatch == null) {
      return null;
    }
    final block = blockMatch.group(1)!;

    final reference = RegExp(
      r'<th align="right">(.*?)</th>',
      caseSensitive: false,
      dotAll: true,
    ).firstMatch(block);
    final cleanedRef = reference == null
        ? ''
        : _stripTags(reference.group(1)!).trim();

    final summaryMatch = RegExp(
      label == 'Responsorial Psalm'
          ? r'<div class="v"><i>(.*?)</i></div>'
          : r'<h4[^>]*>(.*?)</h4>',
      caseSensitive: false,
      dotAll: true,
    ).firstMatch(block);

    final summary = summaryMatch == null
        ? 'Read full text in Universalis.'
        : _stripTags(summaryMatch.group(1)!).trim();

    final normalizedPath = Uri.encodeComponent(label.toLowerCase());

    return ReadingItem(
      label: label,
      reference: cleanedRef,
      summary: summary,
      url: 'https://universalis.com/mass.htm#$normalizedPath',
    );
  }

  List<String> _extractUpcomingFeasts(String body) {
    final matches = RegExp(
      r'<div id="d\d+"><h4>.*?</h4><a class="(.*?)"[^>]*>(.*?)</a></div>',
      caseSensitive: false,
      dotAll: true,
    ).allMatches(body);

    final values = <String>[];
    for (final match in matches) {
      final cssClass = match.group(1) ?? '';
      final text = _stripTags(
        match.group(2) ?? '',
      ).replaceAll('\n', ' ').trim();

      if (text.isEmpty) {
        continue;
      }
      if (cssClass.contains('feria')) {
        continue;
      }
      values.add(text);
      if (values.length == 4) {
        break;
      }
    }
    return values;
  }

  String _stripTags(String raw) {
    return raw
        .replaceAll(RegExp(r'<[^>]*>'), ' ')
        .replaceAll('&nbsp;', ' ')
        .trim();
  }

  /// Fetches the Saint of the Day from Universalis for the given [date].
  ///
  /// Parses the today.htm page to extract the saint name and biography.
  /// Returns `null` if no saint is featured or if parsing fails.
  Future<SaintOfDay?> fetchSaintOfDay(DateTime date) async {
    final pathDate = DateFormat('yyyyMMdd').format(date);
    final uri = Uri.parse(
      'https://universalis.com/Australia/$pathDate/today.htm',
    );

    try {
      final response = await _client.get(uri);
      if (response.statusCode != 200) {
        return null;
      }
      final body = response.body;

      // Extract saint name from the page — typically in a heading or
      // "id=saint" section.
      final nameMatch = RegExp(
        r'id="saint"[^>]*>\s*<h[1-4][^>]*>(.*?)</h[1-4]>',
        caseSensitive: false,
        dotAll: true,
      ).firstMatch(body);

      // Fallback: look for a strong tag within a "saint" section.
      String? saintName;
      if (nameMatch != null) {
        saintName = _stripTags(nameMatch.group(1)!).trim();
      } else {
        final altMatch = RegExp(
          r'<div[^>]*id="[^"]*saint[^"]*"[^>]*>.*?<strong>(.*?)</strong>',
          caseSensitive: false,
          dotAll: true,
        ).firstMatch(body);
        if (altMatch != null) {
          saintName = _stripTags(altMatch.group(1)!).trim();
        }
      }

      if (saintName == null || saintName.isEmpty) {
        return null;
      }

      // Extract biography text.
      final bioMatch = RegExp(
        r'id="saint"[^>]*>.*?</h[1-4]>\s*(.*?)(?=<hr|<div\s+id=|$)',
        caseSensitive: false,
        dotAll: true,
      ).firstMatch(body);

      String biography = 'Learn more about $saintName on Universalis.';
      if (bioMatch != null) {
        final rawBio = _stripTags(bioMatch.group(1)!).trim();
        if (rawBio.length > 30) {
          // Limit to ~500 chars for the card.
          biography = rawBio.length > 500
              ? '${rawBio.substring(0, 497)}...'
              : rawBio;
        }
      }

      return SaintOfDay(
        name: saintName,
        biography: biography,
        source: 'Universalis',
      );
    } catch (_) {
      return null;
    }
  }
}
