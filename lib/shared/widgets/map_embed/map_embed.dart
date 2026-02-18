import 'package:flutter/widgets.dart';

import 'map_embed_stub.dart' if (dart.library.html) 'map_embed_web.dart';

Widget buildMapEmbed({required String title, required String query}) {
  return createMapEmbed(title: title, query: query);
}
