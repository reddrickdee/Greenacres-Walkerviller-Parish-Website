import 'package:http/http.dart' as http;

import 'package:gw_parish_website/data/models/liturgy_models.dart';
import 'package:gw_parish_website/services/liturgy/liturgy_parsing.dart';

/// Best-effort ACBC scraper.
/// The Catholic Australia site is SPA-driven and may fail from web CORS.
class AcbcLiturgyProvider {
  AcbcLiturgyProvider({http.Client? client})
    : _client = client ?? http.Client();

  final http.Client _client;

  Future<LiturgicalDay?> tryFetch(DateTime date) async {
    final uri = Uri.parse('https://www.catholic.au/s/article/Daily-Readings');
    try {
      final response = await _client.get(uri).timeout(const Duration(seconds: 5));
      if (response.statusCode != 200) {
        return null;
      }
      final body = response.body;
      final firstReference = _extractReference(body, 'First Reading');
      final psalmReference = _extractReference(body, 'Responsorial Psalm');
      final gospelReference = _extractReference(body, 'Gospel');
      final seasonName = _extractSeason(body);

      if (firstReference == null || gospelReference == null) {
        return null;
      }

      return LiturgicalDay(
        date: DateTime(date.year, date.month, date.day),
        seasonName: seasonName ?? 'Liturgical Season',
        season: parseSeason(seasonName ?? ''),
        readings: [
          ReadingItem(
            label: 'First Reading',
            reference: firstReference,
            summary:
                _extractSummary(body, 'First Reading') ??
                'Read full text online.',
            url: uri.toString(),
          ),
          ReadingItem(
            label: 'Responsorial Psalm',
            reference: psalmReference ?? 'Psalm',
            summary:
                _extractSummary(body, 'Responsorial Psalm') ??
                'Read full text online.',
            url: uri.toString(),
          ),
          ReadingItem(
            label: 'Gospel',
            reference: gospelReference,
            summary:
                _extractSummary(body, 'Gospel') ?? 'Read full text online.',
            url: uri.toString(),
          ),
        ],
        upcomingFeasts: const [],
        lastUpdated: DateTime.now().toIso8601String(),
        source: 'ACBC',
      );
    } catch (_) {
      return null;
    }
  }

  String? _extractReference(String body, String label) {
    final exp = RegExp(
      '$label[^<]{0,120}<[^>]+>[^<]*<[^>]+>([^<]{3,80})',
      caseSensitive: false,
      dotAll: true,
    );
    return exp.firstMatch(body)?.group(1)?.trim();
  }

  String? _extractSummary(String body, String label) {
    final exp = RegExp(
      '$label[^<]{0,120}</[^>]+>\\s*<[^>]+>([^<]{12,180})',
      caseSensitive: false,
      dotAll: true,
    );
    return exp.firstMatch(body)?.group(1)?.trim();
  }

  String? _extractSeason(String body) {
    final exp = RegExp(
      '(?:Liturgical Season|Season)\\s*[:\\-]\\s*([^<]{5,80})',
      caseSensitive: false,
    );
    return exp.firstMatch(body)?.group(1)?.trim();
  }
}
