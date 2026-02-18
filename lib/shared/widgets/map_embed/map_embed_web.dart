import 'dart:ui_web' as ui_web;

import 'package:flutter/widgets.dart';
import 'package:web/web.dart' as web;

final Set<String> _registeredMapViews = <String>{};

Widget createMapEmbed({required String title, required String query}) {
  final viewType = 'gw-map-${title.hashCode}-${query.hashCode}';
  if (!_registeredMapViews.contains(viewType)) {
    ui_web.platformViewRegistry.registerViewFactory(viewType, (int _) {
      final frame = web.HTMLIFrameElement()
        ..src =
            'https://www.google.com/maps?q=${Uri.encodeComponent(query)}&output=embed'
        ..style.border = '0'
        ..style.width = '100%'
        ..style.height = '100%'
        ..loading = 'lazy'
        ..referrerPolicy = 'no-referrer-when-downgrade'
        ..setAttribute('sandbox', 'allow-scripts allow-same-origin')
        ..title = title;
      return frame;
    });
    _registeredMapViews.add(viewType);
  }

  return SizedBox(height: 360, child: HtmlElementView(viewType: viewType));
}
