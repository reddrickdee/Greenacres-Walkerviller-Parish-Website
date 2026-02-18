import 'package:flutter/material.dart';

import '../../core/layout/breakpoints.dart';
import '../../core/theme/design_tokens.dart';

/// Responsive section wrapper with consistent vertical spacing,
/// optional dark background, optional top border, and max-width
/// constraint. This is the primary compositional unit for page
/// layout — every page section should use this.
class EditorialSection extends StatelessWidget {
  final Widget child;
  final bool dark;
  final bool topBorder;
  final EdgeInsetsGeometry? padding;

  const EditorialSection({
    super.key,
    required this.child,
    this.dark = false,
    this.topBorder = false,
    this.padding,
  });

  @override
  Widget build(BuildContext context) {
    final isMobile = Breakpoints.isMobile(context);
    final horizontalPadding = isMobile
        ? DesignTokens.paddingMobile
        : Breakpoints.isTablet(context)
        ? DesignTokens.paddingTablet
        : DesignTokens.paddingDesktop;
    final verticalGap = isMobile
        ? DesignTokens.sectionGapMobile
        : DesignTokens.sectionGapDesktop;

    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: dark ? Theme.of(context).colorScheme.onSurface : null,
        border: topBorder
            ? Border(
                top: BorderSide(
                  color: dark
                      ? Theme.of(context).scaffoldBackgroundColor.withValues(alpha: 0.1)
                      : Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.12),
                ),
              )
            : null,
      ),
      padding:
          padding ??
          EdgeInsets.symmetric(
            horizontal: horizontalPadding,
            vertical: verticalGap / 2,
          ),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 1400),
          child: child,
        ),
      ),
    );
  }
}
