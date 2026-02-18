import 'package:intl/intl.dart';

class LiturgicalCycle {
  const LiturgicalCycle._();

  static String sundayCycle(DateTime date) {
    final year = _liturgicalYear(date);
    const cycles = ['A', 'B', 'C'];
    final index = (year - 2023) % 3;
    return cycles[index < 0 ? index + 3 : index];
  }

  static String weekdayCycle(DateTime date) => date.year.isOdd ? 'I' : 'II';

  static int _liturgicalYear(DateTime date) {
    final adventStart = _firstSundayOfAdvent(date.year);
    return date.isBefore(adventStart) ? date.year : date.year + 1;
  }

  static DateTime _firstSundayOfAdvent(int year) {
    final christmas = DateTime(year, 12, 25);
    final fourthSundayBeforeChristmas = christmas.subtract(
      Duration(days: christmas.weekday % 7 + 21),
    );
    return DateTime(
      fourthSundayBeforeChristmas.year,
      fourthSundayBeforeChristmas.month,
      fourthSundayBeforeChristmas.day,
    );
  }

  static String formatForUI(DateTime date) {
    final formattedDate = DateFormat('EEEE d MMMM y').format(date);
    return '$formattedDate · Sunday Cycle ${sundayCycle(date)} · '
        'Weekday Cycle ${weekdayCycle(date)}';
  }
}
