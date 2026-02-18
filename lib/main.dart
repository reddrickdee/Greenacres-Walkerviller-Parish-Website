import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:timezone/data/latest.dart' as tz_data;

import 'app.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  tz_data.initializeTimeZones();

  // Prevent Google Fonts from contacting Google servers at runtime.
  // Fonts are bundled in the asset directory (APP 8 compliance).
  GoogleFonts.config.allowRuntimeFetching = false;

  runApp(const ParishApp());
}
