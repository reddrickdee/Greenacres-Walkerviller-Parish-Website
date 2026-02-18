import 'dart:convert';

import 'package:http/http.dart' as http;

import 'package:gw_parish_website/data/models/liturgy_models.dart';

class ChristianArtProvider {
  ChristianArtProvider({http.Client? client})
    : _client = client ?? http.Client();

  final http.Client _client;

  Future<ChristianArtItem?> tryFetch({
    required DateTime date,
    String? gospelReference,
  }) async {
    try {
      if (gospelReference == null || gospelReference.trim().isEmpty) {
        return null;
      }

      final slug = _slugFromGospelReference(gospelReference, date.year);
      Map<String, dynamic>? post;

      if (slug != null) {
        post = await _fetchBySlug(slug);
      }

      post ??= await _fetchBySearch(gospelReference, date.year);
      if (post == null) {
        return universalisMirror(date: date, gospelReference: gospelReference);
      }

      final title = _stripHtml(
        (post['title'] as Map<String, dynamic>?)?['rendered'] as String? ??
            '$gospelReference (${date.year})',
      );
      final pageUrl = post['link'] as String?;
      if (pageUrl == null || pageUrl.isEmpty) {
        return null;
      }

      final imageUrl = _toCorsFriendlyImageUrl(
        _extractImageUrl(post) ??
            'https://christian.art/wp-content/uploads/2024/09/christian-art-logo.png',
      );

      final oembed = await _fetchOembed(pageUrl);
      final author = oembed?['author_name'] as String?;

      final context =
          'Daily Gospel art and reflection from Christian Art for $title. '
          'Open to read the full meditation.';

      return ChristianArtItem(
        title: title,
        pageUrl: pageUrl,
        imageUrl: imageUrl,
        context: context,
        source: 'Christian Art WP API',
        author: author,
      );
    } catch (_) {
      return null;
    }
  }

  ChristianArtItem universalisMirror({
    required DateTime date,
    required String gospelReference,
  }) {
    return _fromUniversalisMirror(date: date, gospelReference: gospelReference);
  }

  Future<Map<String, dynamic>?> _fetchBySlug(String slug) async {
    try {
      final uri = Uri.parse(
        'https://christian.art/wp-json/wp/v2/daily-gospel-reading'
        '?slug=$slug&_embed=1',
      );
      final response = await _client.get(uri).timeout(const Duration(seconds: 5));
      if (response.statusCode != 200) {
        return null;
      }
      final decoded = jsonDecode(response.body) as List<dynamic>;
      if (decoded.isEmpty) {
        return null;
      }
      return decoded.first as Map<String, dynamic>;
    } catch (_) {
      return null;
    }
  }

  Future<Map<String, dynamic>?> _fetchBySearch(
    String gospelReference,
    int year,
  ) async {
    try {
      final normalized = _normalizeGospelReference(gospelReference);
      final uri = Uri.parse(
        'https://christian.art/wp-json/wp/v2/search'
        '?search=${Uri.encodeQueryComponent('$normalized ($year)')}'
        '&subtype=daily-gospel-reading'
        '&per_page=1',
      );

      final searchResponse = await _client.get(uri).timeout(const Duration(seconds: 5));
      if (searchResponse.statusCode != 200) {
        return null;
      }

      final searchResults = jsonDecode(searchResponse.body) as List<dynamic>;
      if (searchResults.isEmpty) {
        return null;
      }

      final id = (searchResults.first as Map<String, dynamic>)['id'];
      if (id is! int) {
        return null;
      }

      final detailsResponse = await _client.get(
        Uri.parse(
          'https://christian.art/wp-json/wp/v2/daily-gospel-reading/$id?_embed=1',
        ),
      ).timeout(const Duration(seconds: 5));
      if (detailsResponse.statusCode != 200) {
        return null;
      }

      return jsonDecode(detailsResponse.body) as Map<String, dynamic>;
    } catch (_) {
      return null;
    }
  }

  Future<Map<String, dynamic>?> _fetchOembed(String pageUrl) async {
    try {
      final uri = Uri.parse(
        'https://christian.art/wp-json/oembed/1.0/embed'
        '?url=${Uri.encodeQueryComponent(pageUrl)}',
      );

      final response = await _client.get(uri).timeout(const Duration(seconds: 5));
      if (response.statusCode != 200) {
        return null;
      }

      return jsonDecode(response.body) as Map<String, dynamic>;
    } catch (_) {
      return null;
    }
  }

  String? _extractImageUrl(Map<String, dynamic> post) {
    final embedded = post['_embedded'] as Map<String, dynamic>?;
    final featured = embedded?['wp:featuredmedia'] as List<dynamic>?;
    if (featured == null || featured.isEmpty) {
      return null;
    }

    final media = featured.first as Map<String, dynamic>;
    final mediaDetails = media['media_details'] as Map<String, dynamic>?;
    final sizes = mediaDetails?['sizes'] as Map<String, dynamic>?;

    final preferredLarge = sizes?['large'] as Map<String, dynamic>?;
    if (preferredLarge?['source_url'] is String) {
      return preferredLarge!['source_url'] as String;
    }

    final preferredMediumLarge =
        sizes?['medium_large'] as Map<String, dynamic>?;
    if (preferredMediumLarge?['source_url'] is String) {
      return preferredMediumLarge!['source_url'] as String;
    }

    return media['source_url'] as String?;
  }

  String _normalizeGospelReference(String reference) {
    return reference
        .replaceAll(':', ': ')
        .replaceAll(RegExp(r'\s+'), ' ')
        .trim();
  }

  String? _slugFromGospelReference(String reference, int year) {
    final normalized = reference.replaceAll(RegExp(r'\s+'), ' ').trim();
    final match = RegExp(
      r'^([1-3]?\s?[A-Za-z]+(?:\s+[A-Za-z]+)*)\s+(\d+):\s*(\d+)(?:\s*-\s*(\d+))?$',
    ).firstMatch(normalized);

    if (match == null) {
      return null;
    }

    final book = match.group(1)!.toLowerCase().replaceAll(RegExp(r'\s+'), '-');
    final chapter = match.group(2)!;
    final verseStart = match.group(3)!;
    final verseEnd = match.group(4);

    final versePart = verseEnd == null
        ? '$chapter-$verseStart'
        : '$chapter-$verseStart-$verseEnd';

    return '$book-$versePart-$year';
  }

  String _stripHtml(String raw) {
    return raw.replaceAll(RegExp(r'<[^>]*>'), '').trim();
  }

  ChristianArtItem _fromUniversalisMirror({
    required DateTime date,
    required String gospelReference,
  }) {
    final month = date.month;
    final day = date.day;
    final year = date.year;
    return ChristianArtItem(
      title: '$gospelReference ($year)',
      pageUrl:
          'https://universalis.com/christian.art/$month-$day-$year-reading',
      imageUrl: _toCorsFriendlyImageUrl(
        'https://universalis.com/christian.art/$month-$day-$year-image.jpg',
      ),
      context:
          'Daily Gospel art and reflection served via Universalis Christian Art mirror.',
      source: 'Universalis Christian Art mirror',
    );
  }

  String _toCorsFriendlyImageUrl(String rawUrl) {
    final uri = Uri.tryParse(rawUrl);
    if (uri == null || uri.host.isEmpty || uri.host == 'images.weserv.nl') {
      return rawUrl;
    }
    final normalizedPath = uri.query.isEmpty
        ? '${uri.host}${uri.path}'
        : '${uri.host}${uri.path}?${uri.query}';
    return Uri.https('images.weserv.nl', '/', {
      'url': normalizedPath,
    }).toString();
  }
}
