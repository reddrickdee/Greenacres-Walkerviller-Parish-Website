import 'package:flutter/material.dart';

/// Four fixed vertical lines spanning the full viewport height at
/// column boundaries. Visible on desktop only.
///
/// Creates the editorial grid effect — like columns in a church nave.
/// Absorbs no pointer events.
class GridLinesOverlay extends StatelessWidget {
  const GridLinesOverlay({super.key});

  @override
  Widget build(BuildContext context) {
    return IgnorePointer(
      child: LayoutBuilder(
        builder: (context, constraints) {
          final width = constraints.maxWidth;
          // 4 lines dividing the viewport into 5 equal columns
          final spacing = width / 5;

          return Stack(
            children: List.generate(4, (i) {
              return Positioned(
                left: spacing * (i + 1),
                top: 0,
                bottom: 0,
                child: Container(
                  width: 1,
                  color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.06),
                ),
              );
            }),
          );
        },
      ),
    );
  }
}
