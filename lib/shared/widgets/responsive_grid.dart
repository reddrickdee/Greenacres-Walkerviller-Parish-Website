import 'package:flutter/material.dart';

import '../../core/layout/breakpoints.dart';

/// Responsive column layout helper that switches between
/// 1 / 2 / 3 columns based on breakpoints.
///
/// Wraps children in an even-width grid without pulling in
/// flutter_staggered_grid_view for simple column layouts.
class ResponsiveGrid extends StatelessWidget {
  final List<Widget> children;
  final int mobileColumns;
  final int tabletColumns;
  final int desktopColumns;
  final double spacing;
  final double runSpacing;

  const ResponsiveGrid({
    super.key,
    required this.children,
    this.mobileColumns = 1,
    this.tabletColumns = 2,
    this.desktopColumns = 3,
    this.spacing = 32,
    this.runSpacing = 32,
  });

  @override
  Widget build(BuildContext context) {
    final columns = Breakpoints.isMobile(context)
        ? mobileColumns
        : Breakpoints.isTablet(context)
        ? tabletColumns
        : desktopColumns;

    return Wrap(
      spacing: spacing,
      runSpacing: runSpacing,
      children: children.map((child) {
        return SizedBox(width: _childWidth(context, columns), child: child);
      }).toList(),
    );
  }

  double _childWidth(BuildContext context, int cols) {
    // Account for gaps between children
    final totalGaps = (cols - 1) * spacing;
    final available =
        MediaQuery.sizeOf(context).width -
        _horizontalPadding(context) * 2 -
        totalGaps;
    // Clamp to max content width
    final maxContentWidth = 1400 - totalGaps;
    final effectiveAvailable = available > maxContentWidth
        ? maxContentWidth
        : available;
    return effectiveAvailable / cols;
  }

  double _horizontalPadding(BuildContext context) {
    if (Breakpoints.isMobile(context)) return 24;
    if (Breakpoints.isTablet(context)) return 48;
    return 64;
  }
}
