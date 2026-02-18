import 'package:flutter_test/flutter_test.dart';
import 'package:timezone/data/latest.dart' as tz_data;
import 'package:timezone/timezone.dart' as tz;

import 'package:gw_parish_website/data/models/parish_models.dart';
import 'package:gw_parish_website/services/mass/mass_schedule_service.dart';

void main() {
  late MassScheduleService service;
  late List<MassScheduleEntry> schedule;

  setUpAll(() {
    tz_data.initializeTimeZones();
  });

  setUp(() {
    service = MassScheduleService();
    schedule = [
      MassScheduleEntry(
        id: 'sat_vigil',
        church: "St Monica's Church",
        address: '90 North East Road, Walkerville',
        dayOfWeek: 6,
        startTime: '18:00',
        type: 'Weekend Vigil Mass',
        durationMinutes: 60,
      ),
      MassScheduleEntry(
        id: 'sun_morning',
        church: "St Martin's Church",
        address: 'Corner Muller and Hampstead Roads, Greenacres',
        dayOfWeek: 7,
        startTime: '09:30',
        type: 'Sunday Mass',
        durationMinutes: 60,
      ),
      MassScheduleEntry(
        id: 'wed_weekday',
        church: "St Monica's Church",
        address: '90 North East Road, Walkerville',
        dayOfWeek: 3,
        startTime: '09:00',
        type: 'Weekday Mass',
        durationMinutes: 30,
      ),
    ];
  });

  group('massStatus', () {
    test('returns upcoming when next mass is > 1 hour away', () {
      // Wednesday 15:00 — next mass is Saturday 18:00 (>1hr away).
      final adelaide = tz.getLocation('Australia/Adelaide');
      final now = tz.TZDateTime(adelaide, 2026, 2, 11, 15, 0); // Wednesday

      final result = service.massStatus(now, schedule);

      expect(result.status, MassStatus.upcoming);
      expect(result.next.entry.id, 'sat_vigil');
    });

    test('returns imminent when next mass is < 1 hour away', () {
      // Saturday 17:30 — next mass is 18:00 (30 min away).
      final adelaide = tz.getLocation('Australia/Adelaide');
      final now = tz.TZDateTime(adelaide, 2026, 2, 14, 17, 30); // Saturday

      final result = service.massStatus(now, schedule);

      expect(result.status, MassStatus.imminent);
      expect(result.next.entry.id, 'sat_vigil');
    });

    test('returns inProgress when a mass is currently happening', () {
      // Saturday 18:30 — sat vigil started at 18:00, duration 60 min.
      final adelaide = tz.getLocation('Australia/Adelaide');
      final now = tz.TZDateTime(adelaide, 2026, 2, 14, 18, 30); // Saturday

      final result = service.massStatus(now, schedule);

      expect(result.status, MassStatus.inProgress);
      expect(result.inProgressEntry?.id, 'sat_vigil');
      expect(result.inProgressChurch, "St Monica's Church");
    });

    test('returns upcoming after mass has ended', () {
      // Saturday 19:01 — sat vigil started at 18:00, ended at 19:00.
      final adelaide = tz.getLocation('Australia/Adelaide');
      final now = tz.TZDateTime(adelaide, 2026, 2, 14, 19, 1); // Saturday

      final result = service.massStatus(now, schedule);

      expect(result.status, MassStatus.upcoming);
      // Next mass should be Sunday 09:30.
      expect(result.next.entry.id, 'sun_morning');
    });

    test('weekday mass 30-minute duration is respected', () {
      // Wednesday 09:15 — wed mass started at 09:00, duration 30 min.
      final adelaide = tz.getLocation('Australia/Adelaide');
      final now = tz.TZDateTime(adelaide, 2026, 2, 11, 9, 15); // Wednesday

      final result = service.massStatus(now, schedule);

      expect(result.status, MassStatus.inProgress);
      expect(result.inProgressEntry?.id, 'wed_weekday');
    });

    test('weekday mass is not in-progress after 30 min', () {
      // Wednesday 09:31 — wed mass ended at 09:30.
      final adelaide = tz.getLocation('Australia/Adelaide');
      final now = tz.TZDateTime(adelaide, 2026, 2, 11, 9, 31); // Wednesday

      final result = service.massStatus(now, schedule);

      expect(result.status, isNot(MassStatus.inProgress));
    });
  });

  group('nextMass', () {
    test('select chronologically nearest mass', () {
      final adelaide = tz.getLocation('Australia/Adelaide');
      final now = tz.TZDateTime(adelaide, 2026, 2, 14, 10, 0); // Saturday

      final result = service.nextMass(now, schedule);

      expect(result.entry.id, 'sat_vigil');
    });
  });
}
