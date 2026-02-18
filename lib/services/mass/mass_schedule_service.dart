import 'package:gw_parish_website/data/models/parish_models.dart';
import 'package:timezone/timezone.dart' as tz;

/// The contextual state of the next scheduled Mass.
enum MassStatus {
  /// Mass is more than 1 hour away — show standard countdown.
  upcoming,

  /// Mass is less than 1 hour away — prompt "Get Directions".
  imminent,

  /// A Mass is currently being celebrated.
  inProgress,
}

class NextMassResult {
  const NextMassResult({required this.entry, required this.start});

  final MassScheduleEntry entry;
  final tz.TZDateTime start;

  Duration get countdown => start.difference(tz.TZDateTime.now(start.location));
}

class MassStatusResult {
  const MassStatusResult({
    required this.next,
    required this.status,
    this.inProgressEntry,
    this.inProgressChurch,
  });

  final NextMassResult next;
  final MassStatus status;

  /// The Mass entry currently in progress (only set when [status] is
  /// [MassStatus.inProgress]).
  final MassScheduleEntry? inProgressEntry;

  /// Display name of the church where Mass is being celebrated.
  final String? inProgressChurch;
}

class MassScheduleService {
  MassScheduleService() : _location = tz.getLocation('Australia/Adelaide');

  final tz.Location _location;

  NextMassResult nextMass(DateTime now, List<MassScheduleEntry> schedule) {
    final nowTz = tz.TZDateTime.from(now, _location);

    NextMassResult? candidate;
    for (final item in schedule) {
      final next = _nextOccurrence(nowTz, item);
      if (candidate == null || next.isBefore(candidate.start)) {
        candidate = NextMassResult(entry: item, start: next);
      }
    }
    if (candidate == null) {
      throw StateError('Mass schedule is empty.');
    }
    return candidate;
  }

  /// Returns context-aware status: upcoming, imminent (<1hr), or in-progress.
  MassStatusResult massStatus(
    DateTime now,
    List<MassScheduleEntry> schedule,
  ) {
    final nowTz = tz.TZDateTime.from(now, _location);
    final next = nextMass(now, schedule);

    // Check if any Mass is currently in progress.
    for (final item in schedule) {
      final start = _mostRecentOccurrence(nowTz, item);
      final end = start.add(Duration(minutes: item.durationMinutes));

      if (!nowTz.isBefore(start) && nowTz.isBefore(end)) {
        return MassStatusResult(
          next: next,
          status: MassStatus.inProgress,
          inProgressEntry: item,
          inProgressChurch: item.church,
        );
      }
    }

    // Check if next Mass is imminent (< 1 hour).
    final countdown = next.start.difference(nowTz);
    if (countdown.inMinutes < 60 && !countdown.isNegative) {
      return MassStatusResult(
        next: next,
        status: MassStatus.imminent,
      );
    }

    return MassStatusResult(
      next: next,
      status: MassStatus.upcoming,
    );
  }

  tz.TZDateTime _nextOccurrence(tz.TZDateTime now, MassScheduleEntry entry) {
    final timeParts = entry.startTime.split(':');
    final hour = int.parse(timeParts[0]);
    final minute = int.parse(timeParts[1]);

    final dayDiff = (entry.dayOfWeek - now.weekday + 7) % 7;
    var target = tz.TZDateTime(
      _location,
      now.year,
      now.month,
      now.day + dayDiff,
      hour,
      minute,
    );

    if (!target.isAfter(now)) {
      target = target.add(const Duration(days: 7));
    }
    return target;
  }

  /// Returns the most recent occurrence of this Mass that has already started
  /// or is starting right now.
  tz.TZDateTime _mostRecentOccurrence(
    tz.TZDateTime now,
    MassScheduleEntry entry,
  ) {
    final timeParts = entry.startTime.split(':');
    final hour = int.parse(timeParts[0]);
    final minute = int.parse(timeParts[1]);

    final dayDiff = (now.weekday - entry.dayOfWeek + 7) % 7;
    var target = tz.TZDateTime(
      _location,
      now.year,
      now.month,
      now.day - dayDiff,
      hour,
      minute,
    );

    if (target.isAfter(now)) {
      target = target.subtract(const Duration(days: 7));
    }
    return target;
  }
}
