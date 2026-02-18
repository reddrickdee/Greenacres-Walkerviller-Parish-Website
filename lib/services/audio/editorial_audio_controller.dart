import 'package:flutter/foundation.dart';
import 'package:just_audio/just_audio.dart';

import 'package:gw_parish_website/data/models/parish_models.dart';

/// App-level audio controller that wraps [AudioPlayer] and persists across
/// route transitions.  Created once at bootstrap and provided through the
/// widget tree.
class EditorialAudioController extends ChangeNotifier {
  EditorialAudioController() {
    _player.positionStream.listen((_) => notifyListeners());
    _player.durationStream.listen((_) => notifyListeners());
    _player.playerStateStream.listen((_) => notifyListeners());
  }

  final AudioPlayer _player = AudioPlayer();

  HomilyRecording? _current;
  String? _errorMessage;

  // ── Public getters ──────────────────────────────────────────

  HomilyRecording? get current => _current;
  bool get isPlaying => _player.playing;
  Duration get position => _player.position;
  Duration get duration => _player.duration ?? Duration.zero;
  bool get hasError => _errorMessage != null;
  String? get errorMessage => _errorMessage;
  bool get isActive => _current != null;

  // ── Controls ────────────────────────────────────────────────

  Future<void> loadEpisode(HomilyRecording recording) async {
    _errorMessage = null;
    _current = recording;
    notifyListeners();

    try {
      await _player.setUrl(recording.audioUrl);
      await _player.play();
    } catch (e) {
      _errorMessage = 'Unable to load audio. Please try again later.';
      notifyListeners();
    }
  }

  Future<void> play() async {
    if (_current == null) return;
    await _player.play();
  }

  Future<void> pause() async {
    await _player.pause();
  }

  Future<void> togglePlayPause() async {
    if (_player.playing) {
      await pause();
    } else {
      await play();
    }
  }

  Future<void> seek(Duration position) async {
    await _player.seek(position);
  }

  Future<void> stop() async {
    await _player.stop();
    _current = null;
    _errorMessage = null;
    notifyListeners();
  }

  @override
  void dispose() {
    _player.dispose();
    super.dispose();
  }
}
