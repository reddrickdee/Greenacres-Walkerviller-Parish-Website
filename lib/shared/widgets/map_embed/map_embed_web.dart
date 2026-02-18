// ignore_for_file: avoid_web_libraries_in_flutter, deprecated_member_use

import 'dart:html' as html;
import 'dart:ui_web' as ui_web;

import 'package:flutter/widgets.dart';

final Set<String> _registeredMapViews = <String>{};

Widget createMapEmbed({required String title, required String query}) {
  final viewType = 'gw-map-${title.hashCode}-${query.hashCode}';
  if (!_registeredMapViews.contains(viewType)) {
    ui_web.platformViewRegistry.registerViewFactory(viewType, (int _) {
      final frame = html.IFrameElement()
        ..src =
            'https://www.google.com/maps?q=${Uri.encodeComponent(query)}&output=embed'
        ..style.border = '0'
        ..style.width = '100%'
        ..style.height = '100%'
        ..setAttribute('loading', 'lazy')
        ..setAttribute('referrerpolicy', 'no-referrer-when-downgrade')
        ..setAttribute('sandbox', 'allow-scripts allow-same-origin')
        ..title = title;
      return frame;
    });
    _registeredMapViews.add(viewType);
  }

  return SizedBox(height: 360, child: HtmlElementView(viewType: viewType));
}
