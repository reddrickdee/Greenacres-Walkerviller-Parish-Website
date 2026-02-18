import 'package:flutter_test/flutter_test.dart';

import 'package:gw_parish_website/core/theme/design_tokens.dart';
import 'package:gw_parish_website/services/liturgy/liturgy_parsing.dart';

void main() {
  group('parseSeason', () {
    test('maps ordinary time', () {
      expect(
        parseSeason('Thursday of week 5 in Ordinary Time'),
        LiturgicalSeason.ordinaryTime,
      );
    });

    test('maps Lent and Advent', () {
      expect(parseSeason('Friday of Lent'), LiturgicalSeason.lent);
      expect(parseSeason('Second Sunday of Advent'), LiturgicalSeason.advent);
    });

    test('returns unknown for non liturgical text', () {
      expect(parseSeason('Community Update'), LiturgicalSeason.unknown);
    });
  });
}
