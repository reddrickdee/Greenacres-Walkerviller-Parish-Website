import 'package:flutter/material.dart';

import 'package:gw_parish_website/core/theme/design_tokens.dart';

class GrayscaleHoverImage extends StatefulWidget {
  const GrayscaleHoverImage({
    required this.image,
    this.height,
    this.fit = BoxFit.cover,
    super.key,
  });

  final ImageProvider image;
  final double? height;
  final BoxFit fit;

  @override
  State<GrayscaleHoverImage> createState() => _GrayscaleHoverImageState();
}

class _GrayscaleHoverImageState extends State<GrayscaleHoverImage> {
  bool hovering = false;

  static const _matrix = <double>[
    0.2126,
    0.7152,
    0.0722,
    0,
    0,
    0.2126,
    0.7152,
    0.0722,
    0,
    0,
    0.2126,
    0.7152,
    0.0722,
    0,
    0,
    0,
    0,
    0,
    1,
    0,
  ];

  @override
  Widget build(BuildContext context) {
    final disableAnimations =
        MediaQuery.maybeOf(context)?.disableAnimations ?? false;
    final duration = disableAnimations
        ? Duration.zero
        : DesignTokens.imageMotion;

    return MouseRegion(
      onEnter: (_) => setState(() => hovering = true),
      onExit: (_) => setState(() => hovering = false),
      child: AnimatedScale(
        duration: duration,
        curve: DesignTokens.cinematicCurve,
        scale: hovering ? 1.04 : 1,
        child: AnimatedContainer(
          duration: duration,
          curve: DesignTokens.cinematicCurve,
          height: widget.height,
          clipBehavior: Clip.hardEdge,
          decoration: BoxDecoration(
            boxShadow: [
              BoxShadow(
                offset: const Offset(0, 8),
                blurRadius: 32,
                color: Colors.black.withValues(alpha: hovering ? 0.16 : 0.09),
              ),
            ],
          ),
          child: ColorFiltered(
            colorFilter: hovering
                ? const ColorFilter.mode(Colors.transparent, BlendMode.dst)
                : const ColorFilter.matrix(_matrix),
            child: Image(
              image: widget.image,
              fit: widget.fit,
              width: double.infinity,
              filterQuality: FilterQuality.medium,
            ),
          ),
        ),
      ),
    );
  }
}
