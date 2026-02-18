import 'package:gw_parish_website/core/theme/design_tokens.dart';

class ReadingItem {
  const ReadingItem({
    required this.label,
    required this.reference,
    required this.summary,
    required this.url,
    this.spokenReference,
    this.translations = const {},
  });

  final String label;
  final String reference;
  final String summary;
  final String url;
  final String? spokenReference;
  final Map<String, String> translations;

  factory ReadingItem.fromJson(Map<String, dynamic> json) {
    return ReadingItem(
      label: json['label'] as String,
      reference: json['reference'] as String,
      summary: json['summary'] as String,
      url: json['url'] as String,
      spokenReference: json['spokenReference'] as String?,
      translations: Map<String, String>.from(
        json['translations'] as Map<String, dynamic>? ?? const {},
      ),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'label': label,
      'reference': reference,
      'summary': summary,
      'url': url,
      if (spokenReference != null) 'spokenReference': spokenReference,
      if (translations.isNotEmpty) 'translations': translations,
    };
  }

  ReadingItem copyWith({
    String? label,
    String? reference,
    String? summary,
    String? url,
    String? spokenReference,
    bool clearSpokenReference = false,
    Map<String, String>? translations,
  }) {
    return ReadingItem(
      label: label ?? this.label,
      reference: reference ?? this.reference,
      summary: summary ?? this.summary,
      url: url ?? this.url,
      spokenReference: clearSpokenReference
          ? null
          : spokenReference ?? this.spokenReference,
      translations: translations ?? this.translations,
    );
  }
}

class LiturgicalDay {
  const LiturgicalDay({
    required this.date,
    required this.seasonName,
    required this.season,
    required this.readings,
    required this.upcomingFeasts,
    required this.lastUpdated,
    required this.source,
    this.christianArt,
    this.saintOfDay,
  });

  final DateTime date;
  final String seasonName;
  final LiturgicalSeason season;
  final List<ReadingItem> readings;
  final List<String> upcomingFeasts;
  final String lastUpdated;
  final String source;
  final ChristianArtItem? christianArt;
  final SaintOfDay? saintOfDay;

  factory LiturgicalDay.fromJson(Map<String, dynamic> json) {
    return LiturgicalDay(
      date: DateTime.parse(json['date'] as String),
      seasonName: json['seasonName'] as String,
      season: _parseSeason(json['season'] as String),
      readings: (json['readings'] as List<dynamic>)
          .map((item) => ReadingItem.fromJson(item as Map<String, dynamic>))
          .toList(),
      upcomingFeasts: List<String>.from(
        json['upcomingFeasts'] as List<dynamic>? ?? [],
      ),
      lastUpdated: json['lastUpdated'] as String,
      source: json['source'] as String,
      christianArt: json['christianArt'] == null
          ? null
          : ChristianArtItem.fromJson(
              json['christianArt'] as Map<String, dynamic>,
            ),
      saintOfDay: json['saintOfDay'] == null
          ? null
          : SaintOfDay.fromJson(
              json['saintOfDay'] as Map<String, dynamic>,
            ),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'date': date.toIso8601String(),
      'seasonName': seasonName,
      'season': season.name,
      'readings': readings.map((r) => r.toJson()).toList(),
      'upcomingFeasts': upcomingFeasts,
      'lastUpdated': lastUpdated,
      'source': source,
      if (christianArt != null) 'christianArt': christianArt!.toJson(),
      if (saintOfDay != null) 'saintOfDay': saintOfDay!.toJson(),
    };
  }

  LiturgicalDay copyWith({
    DateTime? date,
    String? seasonName,
    LiturgicalSeason? season,
    List<ReadingItem>? readings,
    List<String>? upcomingFeasts,
    String? lastUpdated,
    String? source,
    ChristianArtItem? christianArt,
    bool clearChristianArt = false,
    SaintOfDay? saintOfDay,
    bool clearSaintOfDay = false,
  }) {
    return LiturgicalDay(
      date: date ?? this.date,
      seasonName: seasonName ?? this.seasonName,
      season: season ?? this.season,
      readings: readings ?? this.readings,
      upcomingFeasts: upcomingFeasts ?? this.upcomingFeasts,
      lastUpdated: lastUpdated ?? this.lastUpdated,
      source: source ?? this.source,
      christianArt: clearChristianArt
          ? null
          : christianArt ?? this.christianArt,
      saintOfDay: clearSaintOfDay ? null : saintOfDay ?? this.saintOfDay,
    );
  }

  static LiturgicalSeason _parseSeason(String raw) {
    switch (raw) {
      case 'advent':
        return LiturgicalSeason.advent;
      case 'lent':
        return LiturgicalSeason.lent;
      case 'christmas':
        return LiturgicalSeason.christmas;
      case 'easter':
        return LiturgicalSeason.easter;
      case 'ordinaryTime':
        return LiturgicalSeason.ordinaryTime;
      case 'pentecost':
        return LiturgicalSeason.pentecost;
      case 'martyrs':
        return LiturgicalSeason.martyrs;
      case 'allSouls':
        return LiturgicalSeason.allSouls;
      default:
        return LiturgicalSeason.unknown;
    }
  }
}

class ChristianArtItem {
  const ChristianArtItem({
    required this.title,
    required this.pageUrl,
    required this.imageUrl,
    required this.context,
    required this.source,
    this.author,
  });

  final String title;
  final String pageUrl;
  final String imageUrl;
  final String context;
  final String source;
  final String? author;

  factory ChristianArtItem.fromJson(Map<String, dynamic> json) {
    return ChristianArtItem(
      title: json['title'] as String,
      pageUrl: json['pageUrl'] as String,
      imageUrl: json['imageUrl'] as String,
      context: json['context'] as String,
      source: json['source'] as String,
      author: json['author'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'title': title,
      'pageUrl': pageUrl,
      'imageUrl': imageUrl,
      'context': context,
      'source': source,
      'author': author,
    };
  }
}

class SaintOfDay {
  const SaintOfDay({
    required this.name,
    required this.biography,
    required this.source,
    this.imageUrl,
  });

  final String name;
  final String biography;
  final String source;
  final String? imageUrl;

  factory SaintOfDay.fromJson(Map<String, dynamic> json) {
    return SaintOfDay(
      name: json['name'] as String,
      biography: json['biography'] as String,
      source: json['source'] as String,
      imageUrl: json['imageUrl'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'biography': biography,
      'source': source,
      if (imageUrl != null) 'imageUrl': imageUrl,
    };
  }
}
