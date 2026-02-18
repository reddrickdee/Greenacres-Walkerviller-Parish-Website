import 'dart:convert';

import 'package:flutter/services.dart';

import 'package:gw_parish_website/data/models/liturgy_models.dart';

class AssetLiturgyProvider {
  const AssetLiturgyProvider();

  Future<LiturgicalDay> loadFallback() async {
    final raw = await rootBundle.loadString(
      'assets/data/liturgy_fallback.json',
    );
    final jsonMap = jsonDecode(raw) as Map<String, dynamic>;
    return LiturgicalDay.fromJson(jsonMap);
  }
}
