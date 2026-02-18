import 'package:flutter_test/flutter_test.dart';
import 'package:timezone/data/latest.dart' as tz_data;

import 'package:gw_parish_website/data/models/parish_models.dart';
import 'package:gw_parish_website/services/mass/mass_schedule_service.dart';

void main() {
  setUpAll(() {
    tz_data.initializeTimeZones();
  });

  test('returns chronologically next mass in Australia/Adelaide timezone', () {
    final service = MassScheduleService();
    const schedule = [
      MassScheduleEntry(
        id: 'sat_vigil',
        church: 'St Monica\'s Church',
        address: 'Walkerville',
        dayOfWeek: 6,
        startTime: '18:00',
        type: 'Weekend Vigil Mass',
      ),
      MassScheduleEntry(
        id: 'sun_morning',
        church: 'St Martin\'s Church',
        address: 'Greenacres',
        dayOfWeek: 7,
        startTime: '09:30',
        type: 'Sunday Mass',
      ),
    ];

    final now = DateTime(2026, 2, 14, 17, 0); // Saturday 5:00pm
    final next = service.nextMass(now, schedule);

    expect(next.entry.id, 'sat_vigil');
    expect(next.start.isAfter(now), isTrue);
  });
}
