import 'package:gw_parish_website/core/theme/design_tokens.dart';

/// Represents a segment of the liturgical year on the timeline.
class TimelineEntry {
  const TimelineEntry({
    required this.name,
    required this.start,
    required this.end,
    required this.season,
    this.feasts = const [],
  });

  final String name;
  final DateTime start;
  final DateTime end;
  final LiturgicalSeason season;
  final List<FeastDay> feasts;
}

/// A feast day or observance marker on the timeline.
class FeastDay {
  const FeastDay({
    required this.date,
    required this.name,
    this.rank = 'Memorial',
  });

  final DateTime date;
  final String name;
  final String rank;
}

/// Builds an approximate liturgical year timeline for display purposes.
///
/// Uses a hardcoded structural template for the prototype, which is
/// enriched with feast data from the [upcomingFeasts] when available.
class LiturgicalTimelineBuilder {
  const LiturgicalTimelineBuilder._();

  /// Returns the liturgical year entries for the year containing [today].
  static List<TimelineEntry> build({
    required DateTime today,
    List<String> upcomingFeasts = const [],
  }) {
    final year = today.year;

    // Calculate Advent I of previous year (liturgical year start).
    final adventStart = _firstSundayOfAdvent(year - 1);
    final christmasStart = DateTime(year - 1, 12, 25);
    final epiphany = DateTime(year, 1, 8); // approx. end of Christmas season
    final ashWednesday = _easterSunday(year).subtract(const Duration(days: 46));
    final easter = _easterSunday(year);
    final pentecost = easter.add(const Duration(days: 49));
    final adventNext = _firstSundayOfAdvent(year);

    // Parse upcoming feasts into FeastDay entries (approximate placement).
    final parsedFeasts = upcomingFeasts
        .map((f) => FeastDay(
              date: today.add(Duration(days: upcomingFeasts.indexOf(f) * 7)),
              name: f,
            ))
        .toList();

    return [
      TimelineEntry(
        name: 'Advent',
        start: adventStart,
        end: christmasStart.subtract(const Duration(days: 1)),
        season: LiturgicalSeason.advent,
      ),
      TimelineEntry(
        name: 'Christmas',
        start: christmasStart,
        end: epiphany,
        season: LiturgicalSeason.christmas,
      ),
      TimelineEntry(
        name: 'Ordinary Time I',
        start: epiphany.add(const Duration(days: 1)),
        end: ashWednesday.subtract(const Duration(days: 1)),
        season: LiturgicalSeason.ordinaryTime,
      ),
      TimelineEntry(
        name: 'Lent',
        start: ashWednesday,
        end: easter.subtract(const Duration(days: 1)),
        season: LiturgicalSeason.lent,
        feasts: [
          FeastDay(
            date: ashWednesday,
            name: 'Ash Wednesday',
            rank: 'Fast',
          ),
          FeastDay(
            date: easter.subtract(const Duration(days: 3)),
            name: 'Holy Thursday',
            rank: 'Triduum',
          ),
          FeastDay(
            date: easter.subtract(const Duration(days: 2)),
            name: 'Good Friday',
            rank: 'Fast',
          ),
        ],
      ),
      TimelineEntry(
        name: 'Easter',
        start: easter,
        end: pentecost,
        season: LiturgicalSeason.easter,
        feasts: [
          FeastDay(date: easter, name: 'Easter Sunday', rank: 'Solemnity'),
          FeastDay(
            date: easter.add(const Duration(days: 39)),
            name: 'Ascension',
            rank: 'Solemnity',
          ),
          FeastDay(date: pentecost, name: 'Pentecost', rank: 'Solemnity'),
        ],
      ),
      TimelineEntry(
        name: 'Ordinary Time II',
        start: pentecost.add(const Duration(days: 1)),
        end: adventNext.subtract(const Duration(days: 1)),
        season: LiturgicalSeason.ordinaryTime,
        feasts: parsedFeasts,
      ),
      TimelineEntry(
        name: 'Advent',
        start: adventNext,
        end: DateTime(year, 12, 24),
        season: LiturgicalSeason.advent,
      ),
    ];
  }

  static DateTime _firstSundayOfAdvent(int year) {
    final christmas = DateTime(year, 12, 25);
    final fourthSundayBefore = christmas.subtract(
      Duration(days: christmas.weekday % 7 + 21),
    );
    return DateTime(
      fourthSundayBefore.year,
      fourthSundayBefore.month,
      fourthSundayBefore.day,
    );
  }

  /// Computes Easter Sunday using the Anonymous Gregorian algorithm.
  static DateTime _easterSunday(int year) {
    final a = year % 19;
    final b = year ~/ 100;
    final c = year % 100;
    final d = b ~/ 4;
    final e = b % 4;
    final f = (b + 8) ~/ 25;
    final g = (b - f + 1) ~/ 3;
    final h = (19 * a + b - d - g + 15) % 30;
    final i = c ~/ 4;
    final k = c % 4;
    final l = (32 + 2 * e + 2 * i - h - k) % 7;
    final m = (a + 11 * h + 22 * l) ~/ 451;
    final month = (h + l - 7 * m + 114) ~/ 31;
    final day = (h + l - 7 * m + 114) % 31 + 1;
    return DateTime(year, month, day);
  }
}
