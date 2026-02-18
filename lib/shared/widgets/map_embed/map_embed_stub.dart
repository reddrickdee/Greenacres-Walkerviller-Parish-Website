import 'package:flutter/material.dart';

Widget createMapEmbed({required String title, required String query}) {
  return Container(
    alignment: Alignment.center,
    constraints: const BoxConstraints(minHeight: 320),
    decoration: BoxDecoration(
      border: Border.all(color: const Color(0x331A1A1A)),
    ),
    child: Text('Map preview available on web only: $title'),
  );
}
