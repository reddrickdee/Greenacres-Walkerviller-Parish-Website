@TestOn('vm')
library;

import 'dart:io';

import 'package:flutter_test/flutter_test.dart';

/// Verifies the source `web/flutter_bootstrap.js` template contains
/// the required Flutter placeholders and offline-precache logic.
void main() {
  late String bootstrapSource;

  setUpAll(() {
    final file = File('web/flutter_bootstrap.js');
    expect(file.existsSync(), isTrue,
        reason: 'web/flutter_bootstrap.js must exist as a source template');
    bootstrapSource = file.readAsStringSync();
  });

  test('contains {{flutter_js}} placeholder', () {
    expect(bootstrapSource, contains('{{flutter_js}}'));
  });

  test('contains {{flutter_build_config}} placeholder', () {
    expect(bootstrapSource, contains('{{flutter_build_config}}'));
  });

  test('contains service worker version placeholder', () {
    expect(
      bootstrapSource,
      contains("'{{flutter_service_worker_version}}'"),
    );
  });

  test('sets timeoutMillis for slow parish Wi-Fi', () {
    expect(bootstrapSource, contains('timeoutMillis'));
  });

  test('dispatches downloadOffline message for aggressive precache', () {
    expect(bootstrapSource, contains("postMessage('downloadOffline')"));
  });

  test('waits for navigator.serviceWorker.ready', () {
    expect(bootstrapSource, contains('navigator.serviceWorker.ready'));
  });
}
