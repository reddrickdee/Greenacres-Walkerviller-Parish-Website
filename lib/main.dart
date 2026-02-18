import 'package:flutter/material.dart';
import 'package:flutter_web_plugins/url_strategy.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:sentry_flutter/sentry_flutter.dart';
import 'package:timezone/data/latest.dart' as tz_data;

import 'app.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  usePathUrlStrategy();
  tz_data.initializeTimeZones();

  // Prevent Google Fonts from contacting Google servers at runtime.
  // Fonts are bundled in the asset directory (APP 8 compliance).
  GoogleFonts.config.allowRuntimeFetching = false;

  // Read Sentry DSN from build-time environment variable.
  // When empty, Sentry is not initialised and the app runs normally.
  const sentryDsn = String.fromEnvironment('SENTRY_DSN');

  if (sentryDsn.isNotEmpty) {
    await SentryFlutter.init(
      (options) {
        options.dsn = sentryDsn;
        options.environment = const String.fromEnvironment(
          'SENTRY_ENV',
          defaultValue: 'production',
        );
        options.release = 'gw-parish@1.0.0';
        options.tracesSampleRate = 0.2;
      },
      appRunner: () => runApp(const ParishApp()),
    );
  } else {
    runApp(const ParishApp());
  }
}
