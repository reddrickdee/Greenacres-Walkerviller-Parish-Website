import 'package:flutter/foundation.dart';

import 'package:gw_parish_website/data/models/parish_models.dart';

/// In-memory service for prayer intentions.
///
/// In production this would be backed by Firestore with a moderation queue.
/// For the prototype, it pre-seeds a small set of sample intentions.
class PrayerWallService extends ChangeNotifier {
  PrayerWallService() {
    _intentions.addAll(_sampleIntentions);
  }

  final List<PrayerIntention> _intentions = [];

  List<PrayerIntention> get intentions => List.unmodifiable(_intentions);

  void addIntention(String text) {
    if (text.trim().isEmpty) return;
    final trimmed = text.trim();
    final capped = trimmed.length > 200 ? trimmed.substring(0, 200) : trimmed;
    _intentions.insert(
      0,
      PrayerIntention(
        id: 'pi_${DateTime.now().millisecondsSinceEpoch}',
        text: capped,
        submitted: DateTime.now(),
      ),
    );
    notifyListeners();
  }

  void prayFor(String id) {
    final idx = _intentions.indexWhere((i) => i.id == id);
    if (idx != -1) {
      _intentions[idx].prayerCount++;
      notifyListeners();
    }
  }

  static List<PrayerIntention> get _sampleIntentions => [
        PrayerIntention(
          id: 'sample_1',
          text: 'For the repose of the soul of Margaret, beloved mother '
              'and grandmother. May she rest in eternal peace.',
          submitted: DateTime.now().subtract(const Duration(hours: 3)),
          prayerCount: 12,
        ),
        PrayerIntention(
          id: 'sample_2',
          text: 'Please pray for my son who is undergoing surgery this week. '
              'Lord, guide the hands of the surgeons.',
          submitted: DateTime.now().subtract(const Duration(hours: 8)),
          prayerCount: 24,
        ),
        PrayerIntention(
          id: 'sample_3',
          text: 'For all those affected by the recent floods in our communities. '
              'May they find shelter, strength and hope.',
          submitted: DateTime.now().subtract(const Duration(days: 1)),
          prayerCount: 31,
        ),
        PrayerIntention(
          id: 'sample_4',
          text: 'For peace in our world and an end to all conflict. '
              'Lord, hear our prayer.',
          submitted: DateTime.now().subtract(const Duration(days: 2)),
          prayerCount: 18,
        ),
        PrayerIntention(
          id: 'sample_5',
          text: 'A prayer of thanksgiving for the safe arrival of our new baby, '
              'a precious gift from God.',
          submitted: DateTime.now().subtract(const Duration(days: 3)),
          prayerCount: 42,
        ),
        PrayerIntention(
          id: 'sample_6',
          text: 'For all who struggle with loneliness and isolation. May they '
              'know they are never alone in God\u2019s love.',
          submitted: DateTime.now().subtract(const Duration(days: 4)),
          prayerCount: 15,
        ),
      ];
}
