import 'package:gw_parish_website/data/models/liturgy_models.dart';
import 'package:gw_parish_website/core/theme/design_tokens.dart';
import 'package:gw_parish_website/services/liturgy/acbc_liturgy_provider.dart';
import 'package:gw_parish_website/services/liturgy/asset_liturgy_provider.dart';
import 'package:gw_parish_website/services/liturgy/christian_art_provider.dart';
import 'package:gw_parish_website/services/liturgy/liturgy_repository.dart';
import 'package:gw_parish_website/services/liturgy/scripture_reference_speech_formatter.dart';
import 'package:gw_parish_website/services/liturgy/universalis_liturgy_provider.dart';

class CompositeLiturgyRepository implements LiturgyRepository {
  CompositeLiturgyRepository({
    AcbcLiturgyProvider? acbc,
    UniversalisLiturgyProvider? universalis,
    AssetLiturgyProvider? fallback,
    ChristianArtProvider? christianArt,
  }) : _acbc = acbc ?? AcbcLiturgyProvider(),
       _universalis = universalis ?? UniversalisLiturgyProvider(),
       _fallback = fallback ?? const AssetLiturgyProvider(),
       _christianArt = christianArt ?? ChristianArtProvider();

  final AcbcLiturgyProvider _acbc;
  final UniversalisLiturgyProvider _universalis;
  final AssetLiturgyProvider _fallback;
  final ChristianArtProvider _christianArt;

  @override
  Future<LiturgicalDay> getToday({DateTime? now}) async {
    final date = now ?? DateTime.now();
    LiturgicalDay day = await _safeFallback();

    try {
      final acbc = await _acbc.tryFetch(date);
      if (acbc != null) {
        day = acbc;
      } else {
        final universalis = await _universalis.tryFetch(date);
        if (universalis != null) {
          day = universalis;
        }
      }
    } catch (_) {
      // Keep fallback day; upstream providers must not break app rendering.
    }
    day = _formatReadingsForScreenReaders(day);

    final gospelReference = day.readings
        .cast<ReadingItem?>()
        .firstWhere(
          (reading) => reading?.label.toLowerCase().contains('gospel') ?? false,
          orElse: () => null,
        )
        ?.reference;

    ChristianArtItem? christianArt;
    try {
      christianArt = await _christianArt.tryFetch(
        date: day.date,
        gospelReference: gospelReference,
      );
    } catch (_) {
      christianArt = null;
    }

    if (christianArt == null) {
      if (gospelReference != null && gospelReference.trim().isNotEmpty) {
        return _enrichWithSaint(
          day.copyWith(
            christianArt: _christianArt.universalisMirror(
              date: day.date,
              gospelReference: gospelReference,
            ),
          ),
        );
      }
      return _enrichWithSaint(day);
    }

    return _enrichWithSaint(day.copyWith(christianArt: christianArt));
  }

  LiturgicalDay _formatReadingsForScreenReaders(LiturgicalDay day) {
    final formattedReadings = day.readings.map((reading) {
      if (reading.spokenReference != null &&
          reading.spokenReference!.trim().isNotEmpty) {
        return reading;
      }

      final spokenReference =
          ScriptureReferenceSpeechFormatter.toSemanticsLabel(
            reference: reading.reference,
            readingLabel: reading.label,
          );
      return reading.copyWith(spokenReference: spokenReference);
    }).toList();

    return day.copyWith(readings: formattedReadings);
  }

  /// Tries to fetch the Saint of the Day and merge it into [day].
  Future<LiturgicalDay> _enrichWithSaint(LiturgicalDay day) async {
    try {
      final saint = await _universalis.fetchSaintOfDay(day.date);
      if (saint != null) {
        return day.copyWith(saintOfDay: saint);
      }
    } catch (_) {
      // Non-critical enrichment — keep the day without saint data.
    }
    return day;
  }

  Future<LiturgicalDay> _safeFallback() async {
    try {
      return await _fallback.loadFallback();
    } catch (_) {
      return LiturgicalDay(
        date: DateTime.now(),
        seasonName: 'Ordinary Time',
        season: LiturgicalSeason.ordinaryTime,
        readings: const [
          ReadingItem(
            label: 'First Reading',
            reference: 'Reference unavailable',
            summary: 'Try again shortly.',
            url: 'https://universalis.com/',
          ),
          ReadingItem(
            label: 'Responsorial Psalm',
            reference: 'Reference unavailable',
            summary: 'Try again shortly.',
            url: 'https://universalis.com/',
          ),
          ReadingItem(
            label: 'Gospel',
            reference: 'Reference unavailable',
            summary: 'Try again shortly.',
            url: 'https://universalis.com/',
          ),
        ],
        upcomingFeasts: const [],
        lastUpdated: DateTime.now().toIso8601String(),
        source: 'Emergency fallback',
      );
    }
  }
}
