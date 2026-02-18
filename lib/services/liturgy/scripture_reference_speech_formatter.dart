class ScriptureReferenceSpeechFormatter {
  const ScriptureReferenceSpeechFormatter._();

  static final RegExp _referencePattern = RegExp(
    r'^\s*([1-3]?\s*[A-Za-z][A-Za-z.\s]*)\s+(\d+)(?::([\d,\-\u2013]+))?\s*$',
  );

  static final Map<String, String> _bookNames = {
    'gen': 'the Book of Genesis',
    'ex': 'the Book of Exodus',
    'lev': 'the Book of Leviticus',
    'num': 'the Book of Numbers',
    'deut': 'the Book of Deuteronomy',
    'jos': 'the Book of Joshua',
    'judg': 'the Book of Judges',
    'ruth': 'the Book of Ruth',
    '1sam': 'the First Book of Samuel',
    '2sam': 'the Second Book of Samuel',
    '1kgs': 'the First Book of Kings',
    '2kgs': 'the Second Book of Kings',
    '1chron': 'the First Book of Chronicles',
    '2chron': 'the Second Book of Chronicles',
    'ezra': 'the Book of Ezra',
    'neh': 'the Book of Nehemiah',
    'tob': 'the Book of Tobit',
    'jdt': 'the Book of Judith',
    'esth': 'the Book of Esther',
    'job': 'the Book of Job',
    'ps': 'the Book of Psalms',
    'psalm': 'the Book of Psalms',
    'prov': 'the Book of Proverbs',
    'eccl': 'the Book of Ecclesiastes',
    'song': 'the Song of Songs',
    'wis': 'the Book of Wisdom',
    'sir': 'the Book of Sirach',
    'isa': 'the Book of Isaiah',
    'jer': 'the Book of Jeremiah',
    'lam': 'the Book of Lamentations',
    'bar': 'the Book of Baruch',
    'ezek': 'the Book of Ezekiel',
    'dan': 'the Book of Daniel',
    'hos': 'the Book of Hosea',
    'joel': 'the Book of Joel',
    'amos': 'the Book of Amos',
    'obad': 'the Book of Obadiah',
    'jon': 'the Book of Jonah',
    'mic': 'the Book of Micah',
    'nah': 'the Book of Nahum',
    'hab': 'the Book of Habakkuk',
    'zeph': 'the Book of Zephaniah',
    'hag': 'the Book of Haggai',
    'zech': 'the Book of Zechariah',
    'mal': 'the Book of Malachi',
    'mt': 'the Gospel according to Saint Matthew',
    'matt': 'the Gospel according to Saint Matthew',
    'mk': 'the Gospel according to Saint Mark',
    'mrk': 'the Gospel according to Saint Mark',
    'lk': 'the Gospel according to Saint Luke',
    'jn': 'the Gospel according to Saint John',
    'jhn': 'the Gospel according to Saint John',
    'acts': 'the Acts of the Apostles',
    'rom': 'the Letter of Saint Paul to the Romans',
    '1cor': 'the First Letter of Saint Paul to the Corinthians',
    '2cor': 'the Second Letter of Saint Paul to the Corinthians',
    'gal': 'the Letter of Saint Paul to the Galatians',
    'eph': 'the Letter of Saint Paul to the Ephesians',
    'phil': 'the Letter of Saint Paul to the Philippians',
    'col': 'the Letter of Saint Paul to the Colossians',
    '1thess': 'the First Letter of Saint Paul to the Thessalonians',
    '2thess': 'the Second Letter of Saint Paul to the Thessalonians',
    '1tim': 'the First Letter of Saint Paul to Timothy',
    '2tim': 'the Second Letter of Saint Paul to Timothy',
    'tit': 'the Letter of Saint Paul to Titus',
    'phlm': 'the Letter of Saint Paul to Philemon',
    'heb': 'the Letter to the Hebrews',
    'jas': 'the Letter of Saint James',
    '1pet': 'the First Letter of Saint Peter',
    '2pet': 'the Second Letter of Saint Peter',
    '1jn': 'the First Letter of Saint John',
    '2jn': 'the Second Letter of Saint John',
    '3jn': 'the Third Letter of Saint John',
    'jude': 'the Letter of Saint Jude',
    'rev': 'the Book of Revelation',
  };

  static String toSemanticsLabel({
    required String reference,
    required String readingLabel,
  }) {
    final normalizedReference = reference.trim();
    final match = _referencePattern.firstMatch(normalizedReference);
    if (match == null) {
      return 'A scripture reading, $normalizedReference.';
    }

    final rawBook = match.group(1)!.trim();
    final chapter = int.parse(match.group(2)!);
    final verses = match.group(3);

    final bookKey = _normalizeBookKey(rawBook);
    final spokenBook = _bookNames[bookKey] ?? 'the Book of $rawBook';
    final spokenIntro = _spokenIntro(
      readingLabel: readingLabel,
      spokenBook: spokenBook,
    );
    final chapterText = _numberToWords(chapter);

    if (verses == null || verses.trim().isEmpty) {
      return '$spokenIntro, chapter $chapterText.';
    }

    return '$spokenIntro, chapter $chapterText, ${_spokenVerses(verses)}.';
  }

  static String _spokenIntro({
    required String readingLabel,
    required String spokenBook,
  }) {
    if (readingLabel.toLowerCase().contains('gospel')) {
      final simplified = spokenBook
          .replaceFirst('the Gospel according to Saint ', '')
          .replaceFirst('the Gospel according to ', '');
      return 'A reading from the Holy Gospel according to Saint $simplified';
    }
    return 'A reading from $spokenBook';
  }

  static String _normalizeBookKey(String rawBook) {
    var normalized = rawBook.toLowerCase().replaceAll('.', ' ').trim();
    normalized = normalized.replaceFirst(RegExp(r'^iii\s+'), '3 ');
    normalized = normalized.replaceFirst(RegExp(r'^ii\s+'), '2 ');
    normalized = normalized.replaceFirst(RegExp(r'^i\s+'), '1 ');
    return normalized.replaceAll(RegExp(r'[^a-z0-9]'), '');
  }

  static String _spokenVerses(String raw) {
    final segments = raw
        .split(',')
        .map((value) => value.trim())
        .where((value) => value.isNotEmpty)
        .toList();

    if (segments.isEmpty) {
      return 'verses as listed';
    }

    final spokenSegments = <String>[];
    var singleVerse = segments.length == 1;
    for (final segment in segments) {
      final rangeMatch = RegExp(
        r'^(\d+)\s*[\-\u2013]\s*(\d+)$',
      ).firstMatch(segment);
      if (rangeMatch != null) {
        singleVerse = false;
        final start = int.parse(rangeMatch.group(1)!);
        final end = int.parse(rangeMatch.group(2)!);
        spokenSegments.add(
          '${_numberToWords(start)} through ${_numberToWords(end)}',
        );
        continue;
      }

      final value = int.tryParse(segment);
      if (value == null) {
        singleVerse = false;
        spokenSegments.add(segment);
      } else {
        spokenSegments.add(_numberToWords(value));
      }
    }

    final noun = singleVerse ? 'verse' : 'verses';
    return '$noun ${spokenSegments.join(', ')}';
  }

  static String _numberToWords(int value) {
    if (value < 0) {
      return value.toString();
    }
    if (value < 20) {
      return _underTwenty[value];
    }
    if (value < 100) {
      final tens = value ~/ 10;
      final units = value % 10;
      if (units == 0) {
        return _tens[tens];
      }
      return '${_tens[tens]}-${_underTwenty[units]}';
    }
    if (value < 1000) {
      final hundreds = value ~/ 100;
      final remainder = value % 100;
      if (remainder == 0) {
        return '${_underTwenty[hundreds]} hundred';
      }
      return '${_underTwenty[hundreds]} hundred and ${_numberToWords(remainder)}';
    }
    return value.toString();
  }

  static const List<String> _underTwenty = <String>[
    'zero',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'ten',
    'eleven',
    'twelve',
    'thirteen',
    'fourteen',
    'fifteen',
    'sixteen',
    'seventeen',
    'eighteen',
    'nineteen',
  ];

  static const List<String> _tens = <String>[
    '',
    '',
    'twenty',
    'thirty',
    'forty',
    'fifty',
    'sixty',
    'seventy',
    'eighty',
    'ninety',
  ];
}
