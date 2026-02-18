import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'package:gw_parish_website/core/theme/design_tokens.dart';
import 'package:gw_parish_website/services/audio/editorial_audio_controller.dart';

/// A persistent mini audio dock that sits at the bottom of the [ParishFrame]
/// body when an episode is actively loaded.  Continues playing across route
/// changes.
class EditorialAudioDock extends StatelessWidget {
  const EditorialAudioDock({required this.controller, super.key});

  final EditorialAudioController controller;

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: controller,
      builder: (context, _) {
        if (!controller.isActive) return const SizedBox.shrink();

        final theme = Theme.of(context);
        final isDark = theme.brightness == Brightness.dark;
        final bgColor =
            isDark ? DesignTokens.darkSurface : const Color(0xFF1A1A1A);
        final fgColor = isDark
            ? DesignTokens.darkForeground
            : DesignTokens.background;
        final total = controller.duration.inMilliseconds;
        final progress =
            total > 0 ? controller.position.inMilliseconds / total : 0.0;

        return Container(
          width: double.infinity,
          color: bgColor,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Thin progress line at top
              Container(
                height: 2,
                alignment: Alignment.centerLeft,
                child: FractionallySizedBox(
                  widthFactor: progress.clamp(0.0, 1.0),
                  child: Container(
                    height: 2,
                    color: DesignTokens.accent,
                  ),
                ),
              ),
              // Dock content
              Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: DesignTokens.space16,
                  vertical: DesignTokens.space8,
                ),
                child: Row(
                  children: [
                    // Play / pause
                    IconButton(
                      icon: Icon(
                        controller.isPlaying
                            ? Icons.pause
                            : Icons.play_arrow,
                        color: fgColor,
                      ),
                      iconSize: 24,
                      onPressed: controller.togglePlayPause,
                      tooltip:
                          controller.isPlaying ? 'Pause' : 'Play',
                    ),
                    const SizedBox(width: DesignTokens.space8),

                    // Title + elapsed
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            controller.current!.title,
                            style: GoogleFonts.playfairDisplay(
                              textStyle:
                                  theme.textTheme.labelLarge?.copyWith(
                                color: fgColor,
                              ),
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          Text(
                            '${_fmt(controller.position)} / ${_fmt(controller.duration)}',
                            style: theme.textTheme.labelSmall?.copyWith(
                              color: fgColor.withValues(alpha: 0.6),
                            ),
                          ),
                        ],
                      ),
                    ),

                    // Close
                    IconButton(
                      icon: Icon(Icons.close, color: fgColor, size: 20),
                      onPressed: controller.stop,
                      tooltip: 'Close player',
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  String _fmt(Duration d) {
    final m = d.inMinutes.remainder(60).toString().padLeft(2, '0');
    final s = d.inSeconds.remainder(60).toString().padLeft(2, '0');
    return '$m:$s';
  }
}
