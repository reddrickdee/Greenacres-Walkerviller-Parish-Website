import 'package:gw_parish_website/core/theme/design_tokens.dart';

LiturgicalSeason parseSeason(String value) {
  final lower = value.toLowerCase();
  if (lower.contains('advent')) {
    return LiturgicalSeason.advent;
  }
  if (lower.contains('lent')) {
    return LiturgicalSeason.lent;
  }
  if (lower.contains('christmas')) {
    return LiturgicalSeason.christmas;
  }
  if (lower.contains('easter')) {
    return LiturgicalSeason.easter;
  }
  if (lower.contains('pentecost')) {
    return LiturgicalSeason.pentecost;
  }
  if (lower.contains('martyr')) {
    return LiturgicalSeason.martyrs;
  }
  if (lower.contains('all souls') || lower.contains('good friday')) {
    return LiturgicalSeason.allSouls;
  }
  if (lower.contains('ordinary')) {
    return LiturgicalSeason.ordinaryTime;
  }
  return LiturgicalSeason.unknown;
}
