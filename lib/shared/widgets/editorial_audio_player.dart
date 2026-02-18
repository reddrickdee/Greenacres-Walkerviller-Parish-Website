import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'package:gw_parish_website/core/theme/design_tokens.dart';
import 'package:gw_parish_website/data/models/parish_models.dart';
import 'package:gw_parish_website/services/audio/editorial_audio_controller.dart';

/// Full-size in-page homily audio player.  Sharp corners, thin progress line,
/// Playfair Display typography.  Shows a list of episodes and inline playback.
class EditorialAudioPlayer extends StatelessWidget {
  const EditorialAudioPlayer({
    required this.recordings,
    required this.controller,
    super.key,
  });

  final List<HomilyRecording> recordings;
  final EditorialAudioController controller;

  @override
  Widget build(BuildContext context) {
    if (recordings.isEmpty) {
      return Text(
        'Homily recordings will appear here when available.',
        style: Theme.of(context).textTheme.bodyLarge?.copyWith(
              fontStyle: FontStyle.italic,
              color: DesignTokens.mutedForeground,
            ),
      );
    }

    return AnimatedBuilder(
      animation: controller,
      builder: (context, _) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: recordings.map((recording) {
            final isActive = controller.current?.id == recording.id;

            return _EpisodeCard(
              recording: recording,
              controller: controller,
              isActive: isActive,
            );
          }).toList(),
        );
      },
    );
  }
}

class _EpisodeCard extends StatelessWidget {
  const _EpisodeCard({
    required this.recording,
    required this.controller,
    required this.isActive,
  });

  final HomilyRecording recording;
  final EditorialAudioController controller;
  final bool isActive;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final cardColor =
        isDark ? DesignTokens.darkSurface : DesignTokens.mutedBackground;

    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: DesignTokens.space16),
      padding: const EdgeInsets.all(DesignTokens.space24),
      decoration: BoxDecoration(
        color: cardColor,
        border: isActive
            ? Border(
                left: BorderSide(color: DesignTokens.accent, width: 3),
              )
            : null,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Date label
          Text(
            recording.dateIso,
            style: theme.textTheme.labelSmall?.copyWith(
              letterSpacing: 1.4,
              color: DesignTokens.accent,
            ),
          ),
          const SizedBox(height: DesignTokens.space4),

          // Title in Playfair
          Text(
            recording.title,
            style: GoogleFonts.playfairDisplay(
              textStyle: theme.textTheme.titleLarge,
            ),
          ),
          const SizedBox(height: DesignTokens.space4),

          // Speaker + duration
          Text(
            '${recording.speaker}  ·  ${recording.durationLabel}',
            style: theme.textTheme.bodySmall?.copyWith(
              color: isDark
                  ? DesignTokens.darkMutedForeground
                  : DesignTokens.mutedForeground,
            ),
          ),

          if (recording.summary.isNotEmpty) ...[
            const SizedBox(height: DesignTokens.space8),
            Text(
              recording.summary,
              style: theme.textTheme.bodyMedium,
            ),
          ],

          const SizedBox(height: DesignTokens.space16),

          if (controller.hasError && isActive)
            Padding(
              padding: const EdgeInsets.only(bottom: DesignTokens.space8),
              child: Text(
                controller.errorMessage!,
                style: theme.textTheme.bodySmall?.copyWith(
                  color: const Color(0xFFB33A3A),
                ),
              ),
            ),

          // ── Controls ──────────────────────────────────────────
          if (isActive) ...[
            // Thin progress line
            _ThinProgressBar(controller: controller),
            const SizedBox(height: DesignTokens.space8),

            // Time labels
            Row(
              children: [
                Text(
                  _formatDuration(controller.position),
                  style: theme.textTheme.labelSmall,
                ),
                const Spacer(),
                Text(
                  _formatDuration(controller.duration),
                  style: theme.textTheme.labelSmall,
                ),
              ],
            ),
            const SizedBox(height: DesignTokens.space8),

            // Play / pause
            IconButton(
              icon: Icon(
                controller.isPlaying ? Icons.pause : Icons.play_arrow,
              ),
              iconSize: 32,
              onPressed: controller.togglePlayPause,
              tooltip: controller.isPlaying ? 'Pause' : 'Play',
              style: IconButton.styleFrom(
                shape: const RoundedRectangleBorder(
                  borderRadius: BorderRadius.zero,
                ),
              ),
            ),
          ] else
            // Play button for inactive episodes
            FilledButton.icon(
              style: FilledButton.styleFrom(
                shape: const RoundedRectangleBorder(
                  borderRadius: BorderRadius.zero,
                ),
              ),
              onPressed: () => controller.loadEpisode(recording),
              icon: const Icon(Icons.play_arrow, size: 18),
              label: const Text('Listen'),
            ),
        ],
      ),
    );
  }

  String _formatDuration(Duration d) {
    final minutes = d.inMinutes.remainder(60).toString().padLeft(2, '0');
    final seconds = d.inSeconds.remainder(60).toString().padLeft(2, '0');
    return '$minutes:$seconds';
  }
}

class _ThinProgressBar extends StatelessWidget {
  const _ThinProgressBar({required this.controller});

  final EditorialAudioController controller;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final total = controller.duration.inMilliseconds;
    final progress = total > 0
        ? controller.position.inMilliseconds / total
        : 0.0;

    return GestureDetector(
      onTapDown: (details) {
        if (total <= 0) return;
        final box = context.findRenderObject() as RenderBox;
        final fraction = details.localPosition.dx / box.size.width;
        controller.seek(
          Duration(milliseconds: (fraction * total).round()),
        );
      },
      child: Container(
        height: 20,
        alignment: Alignment.centerLeft,
        child: Stack(
          children: [
            // Track
            Positioned.fill(
              child: Align(
                alignment: Alignment.centerLeft,
                child: Container(
                  height: 2,
                  width: double.infinity,
                  color: theme.colorScheme.onSurface.withValues(alpha: 0.15),
                ),
              ),
            ),
            // Progress
            Positioned.fill(
              child: Align(
                alignment: Alignment.centerLeft,
                child: FractionallySizedBox(
                  widthFactor: progress.clamp(0.0, 1.0),
                  child: Container(
                    height: 2,
                    color: DesignTokens.accent,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
