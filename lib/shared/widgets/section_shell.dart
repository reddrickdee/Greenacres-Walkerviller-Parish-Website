import 'package:flutter/material.dart';

import 'package:gw_parish_website/core/layout/breakpoints.dart';
import 'package:gw_parish_website/core/theme/design_tokens.dart';

class SectionShell extends StatelessWidget {
  const SectionShell({
    required this.child,
    this.title,
    this.overline,
    this.background,
    super.key,
  });

  final Widget child;
  final String? title;
  final String? overline;
  final Color? background;

  @override
  Widget build(BuildContext context) {
    final horizontal = Breakpoints.isDesktop(context)
        ? DesignTokens.paddingDesktop
        : Breakpoints.isTablet(context)
        ? DesignTokens.paddingTablet
        : DesignTokens.paddingMobile;

    return Container(
      width: double.infinity,
      color: background,
      padding: EdgeInsets.symmetric(
        horizontal: horizontal,
        vertical: Breakpoints.isDesktop(context)
            ? DesignTokens.sectionGapDesktop / 2
            : DesignTokens.sectionGapMobile / 2,
      ),
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 1400),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (overline != null)
              Text(
                overline!.toUpperCase(),
                style: Theme.of(context).textTheme.labelMedium,
              ),
            if (title != null) ...[
              const SizedBox(height: 10),
              Text(title!, style: Theme.of(context).textTheme.headlineLarge),
              const SizedBox(height: 24),
            ],
            child,
          ],
        ),
      ),
    );
  }
}
