import 'package:flutter_test/flutter_test.dart';

import 'package:gw_parish_website/services/liturgy/scripture_reference_speech_formatter.dart';

void main() {
  group('ScriptureReferenceSpeechFormatter', () {
    test('formats abbreviated Pauline references for TTS', () {
      final label = ScriptureReferenceSpeechFormatter.toSemanticsLabel(
        reference: '1 Cor 13:1-8',
        readingLabel: 'First Reading',
      );

      expect(
        label,
        'A reading from the First Letter of Saint Paul to the Corinthians, '
        'chapter thirteen, verses one through eight.',
      );
    });

    test('uses gospel intro phrasing for Gospel labels', () {
      final label = ScriptureReferenceSpeechFormatter.toSemanticsLabel(
        reference: 'Mk 7:24-30',
        readingLabel: 'Gospel',
      );

      expect(
        label,
        'A reading from the Holy Gospel according to Saint Mark, '
        'chapter seven, verses twenty-four through thirty.',
      );
    });

    test('falls back gracefully when parsing fails', () {
      final label = ScriptureReferenceSpeechFormatter.toSemanticsLabel(
        reference: 'Reference unavailable',
        readingLabel: 'First Reading',
      );

      expect(label, 'A scripture reading, Reference unavailable.');
    });
  });
}
