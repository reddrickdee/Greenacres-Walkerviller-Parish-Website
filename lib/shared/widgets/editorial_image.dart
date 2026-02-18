import 'package:flutter/material.dart';

/// Semantic focal presets for editorial crop direction.
abstract final class EditorialFocalPoints {
  static const Alignment center = Alignment.center;
  static const Alignment eucharist = Alignment(0, 0.1);
  static const Alignment saintFace = Alignment(0, -0.45);
  static const Alignment altar = Alignment(0, 0.25);
  static const Alignment crucifix = Alignment(0, -0.2);
}

/// Editorial image component that preserves a sacred focal point
/// while layouts reflow across breakpoints.
class EditorialImage extends StatelessWidget {
  const EditorialImage({
    super.key,
    required this.image,
    this.focalPoint = Alignment.center,
    this.width = double.infinity,
    this.height,
    this.fit = BoxFit.cover,
    this.borderRadius = BorderRadius.zero,
    this.filterQuality = FilterQuality.medium,
    this.semanticLabel,
  });

  EditorialImage.asset({
    super.key,
    required String assetPath,
    this.focalPoint = Alignment.center,
    this.width = double.infinity,
    this.height,
    this.fit = BoxFit.cover,
    this.borderRadius = BorderRadius.zero,
    this.filterQuality = FilterQuality.medium,
    this.semanticLabel,
  }) : image = AssetImage(assetPath);

  EditorialImage.network({
    super.key,
    required String url,
    this.focalPoint = Alignment.center,
    this.width = double.infinity,
    this.height,
    this.fit = BoxFit.cover,
    this.borderRadius = BorderRadius.zero,
    this.filterQuality = FilterQuality.medium,
    this.semanticLabel,
  }) : image = NetworkImage(url);

  /// Resolves an image path to the appropriate [ImageProvider].
  ///
  /// Paths starting with `http://` or `https://` are treated as network
  /// images (CMS-uploaded); all other paths are treated as bundled assets.
  static ImageProvider resolveImage(String path) {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return NetworkImage(path);
    }
    return AssetImage(path);
  }

  final ImageProvider image;
  final Alignment focalPoint;
  final double? width;
  final double? height;
  final BoxFit fit;
  final BorderRadius borderRadius;
  final FilterQuality filterQuality;
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: borderRadius,
      child: Image(
        image: image,
        width: width,
        height: height,
        fit: fit,
        alignment: focalPoint,
        filterQuality: filterQuality,
        semanticLabel: semanticLabel,
        excludeFromSemantics: semanticLabel == null,
      ),
    );
  }
}

