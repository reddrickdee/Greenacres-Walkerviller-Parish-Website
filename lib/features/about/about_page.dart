import 'package:flutter/material.dart';

import 'package:gw_parish_website/core/layout/breakpoints.dart';
import 'package:gw_parish_website/core/theme/design_tokens.dart';
import 'package:gw_parish_website/data/models/parish_models.dart';
import 'package:gw_parish_website/shared/widgets/editorial_heading.dart';
import 'package:gw_parish_website/shared/widgets/grayscale_hover_image.dart';
import 'package:gw_parish_website/shared/widgets/scripture_block.dart';
import 'package:gw_parish_website/shared/widgets/section_shell.dart';

class AboutPage extends StatelessWidget {
  const AboutPage({required this.content, super.key});

  final ParishContent content;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const _SacredSpacesTour(),
        SectionShell(
          overline: 'About Our Parish',
          title: 'Welcome and Mission',
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _DropCapParagraph(text: content.priestWelcome),
              const SizedBox(height: 24),
              Text(
                'From the Pastoral Council Chairperson',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: 10),
              Text(
                content.pastoralChairMessage,
                style: Theme.of(context).textTheme.bodyLarge,
              ),
              const SizedBox(height: 24),
              Text(
                content.visionStatement,
                style: Theme.of(context).textTheme.bodyLarge,
              ),
              const SizedBox(height: 16),
              ...content.missionPoints.map(
                (point) => Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: Text(
                    '• ${point.title}',
                    style: Theme.of(context).textTheme.bodyLarge,
                  ),
                ),
              ),
              const SizedBox(height: 24),
              ScriptureBlock(text: content.parishPrayerText),
            ],
          ),
        ),
        SectionShell(
          overline: 'Pastoral Council',
          title: 'Members',
          child: LayoutBuilder(
            builder: (context, constraints) {
              final columns = constraints.maxWidth > 1100
                  ? 3
                  : constraints.maxWidth > 740
                  ? 2
                  : 1;
              return GridView.builder(
                itemCount: content.councilMembers.length,
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: columns,
                  crossAxisSpacing: 20,
                  mainAxisSpacing: 20,
                  childAspectRatio: Breakpoints.isMobile(context) ? 0.7 : 0.95,
                ),
                itemBuilder: (context, index) {
                  final member = content.councilMembers[index];
                  return Card(
                    child: Padding(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          GrayscaleHoverImage(
                            image: AssetImage(member.photoAsset),
                            height: 180,
                            fit: BoxFit.contain,
                          ),
                          const SizedBox(height: 12),
                          Text(
                            member.role,
                            style: Theme.of(context).textTheme.labelMedium,
                          ),
                          const SizedBox(height: 4),
                          Text(
                            member.name,
                            style: Theme.of(context).textTheme.titleMedium,
                          ),
                          const SizedBox(height: 8),
                          Expanded(
                            child: Text(
                              member.bio,
                              style: Theme.of(context).textTheme.bodySmall,
                              overflow: TextOverflow.fade,
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              );
            },
          ),
        ),
      ],
    );
  }
}

class _DropCapParagraph extends StatelessWidget {
  const _DropCapParagraph({required this.text});

  final String text;

  @override
  Widget build(BuildContext context) {
    if (text.isEmpty) {
      return const SizedBox.shrink();
    }

    final firstChar = text.substring(0, 1);
    final rest = text.substring(1);

    return RichText(
      text: TextSpan(
        style: Theme.of(context).textTheme.bodyLarge,
        children: [
          TextSpan(
            text: firstChar,
            style: Theme.of(context).textTheme.displaySmall,
          ),
          TextSpan(text: rest),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Sacred Spaces Architectural Tour
// ─────────────────────────────────────────────────────────────────────────────

/// Configuration for a single scene in the Sacred Spaces photo essay.
class _SacredSpaceScene {
  const _SacredSpaceScene({
    required this.church,
    required this.label,
    required this.assetPath,
    required this.headlineParts,
    required this.body,
    required this.semanticLabel,
  });

  final String church;
  final String label;
  final String assetPath;
  final List<HeadlinePart> headlineParts;
  final String body;
  final String semanticLabel;
}

/// The three scenes of the Sacred Spaces tour.
/// Swap asset paths to final photography when available.
const _scenes = <_SacredSpaceScene>[
  _SacredSpaceScene(
    church: "St Martin's Church",
    label: 'Stained Glass',
    assetPath: 'assets/images/refurbishment/st_monica_5.webp',
    headlineParts: [
      HeadlinePart('Light Through '),
      HeadlinePart('Stained Glass', italic: true, gold: true),
    ],
    body:
        'The radiant stained-glass windows of St Martin\'s tell the story of '
        'faith handed down through generations. Each panel captures a moment '
        'of scripture, bathing the nave in colour that shifts with the '
        'passing hours — a perpetual reminder that sacred light is never still.',
    semanticLabel:
        'Stained glass windows inside St Martin\'s Church, Greenacres',
  ),
  _SacredSpaceScene(
    church: "St Monica's Church",
    label: 'Tabernacle',
    assetPath: 'assets/images/refurbishment/after_2.webp',
    headlineParts: [
      HeadlinePart('The '),
      HeadlinePart('Tabernacle', italic: true, gold: true),
    ],
    body:
        'At the heart of St Monica\'s stands the tabernacle — the dwelling '
        'place of the Blessed Sacrament. Its quiet presence anchors the '
        'sanctuary, drawing parishioners into contemplation and adoration '
        'amid the hush of Walkerville\'s beloved church.',
    semanticLabel:
        'The tabernacle and sanctuary of St Monica\'s Church, Walkerville',
  ),
  _SacredSpaceScene(
    church: 'Parish Heritage',
    label: 'Cornerstones',
    assetPath: 'assets/images/refurbishment/before_1.webp',
    headlineParts: [
      HeadlinePart('Historical '),
      HeadlinePart('Cornerstones', italic: true, gold: true),
    ],
    body:
        'From the foundation stones laid more than a century ago to the '
        'recent refurbishment, the buildings of Greenacres Walkerville '
        'Parish carry the prayers of every generation. These cornerstones '
        'are not merely architectural — they are sacramental milestones.',
    semanticLabel:
        'Historical cornerstone detail of the Greenacres Walkerville parish buildings',
  ),
];

/// Maximum vertical parallax shift in logical pixels.
const double _maxParallaxShift = 60.0;

/// Height of each scene image panel.
const double _imageHeight = 420.0;

/// Stagger delay per scene index for the cinematic reveal.
const Duration _staggerDelay = Duration(milliseconds: 200);

// ─────────────────────────────────────────────────────────────────────────────

/// A scroll-driven, parallax photo essay showcasing the sacred spaces
/// of St Martin's and St Monica's churches.
class _SacredSpacesTour extends StatefulWidget {
  const _SacredSpacesTour();

  @override
  State<_SacredSpacesTour> createState() => _SacredSpacesTourState();
}

class _SacredSpacesTourState extends State<_SacredSpacesTour> {
  ScrollPosition? _scrollPosition;
  final List<GlobalKey> _sceneKeys = List.generate(
    _scenes.length,
    (_) => GlobalKey(),
  );

  /// Per-scene visibility flag, flipped once the scene enters the viewport.
  final List<bool> _visible = List.filled(_scenes.length, false);

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Detach from previous position if any.
    _scrollPosition?.removeListener(_onScroll);
    _scrollPosition = Scrollable.maybeOf(context)?.position;
    _scrollPosition?.addListener(_onScroll);

    // Schedule an initial check after the frame is laid out.
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) _onScroll();
    });
  }

  @override
  void dispose() {
    _scrollPosition?.removeListener(_onScroll);
    super.dispose();
  }

  void _onScroll() {
    if (!mounted) return;
    for (var i = 0; i < _scenes.length; i++) {
      if (_visible[i]) continue;
      final ctx = _sceneKeys[i].currentContext;
      if (ctx == null) continue;
      final box = ctx.findRenderObject() as RenderBox?;
      if (box == null || !box.hasSize) continue;
      final offset = box.localToGlobal(Offset.zero);
      final viewportHeight = MediaQuery.sizeOf(context).height;
      // Trigger when the top of the scene enters the bottom 85% of viewport.
      if (offset.dy < viewportHeight * 0.85) {
        _visible[i] = true;
      }
    }
    // Always rebuild to update parallax Transform.translate offsets.
    setState(() {});
  }

  /// Compute parallax progress for a scene: 0 when its top is at the bottom
  /// of the viewport, 1 when its top is at the top. Clamped to [0,1].
  double _parallaxProgress(int index) {
    final ctx = _sceneKeys[index].currentContext;
    if (ctx == null) return 0.5;
    final box = ctx.findRenderObject() as RenderBox?;
    if (box == null || !box.hasSize) return 0.5;
    final offset = box.localToGlobal(Offset.zero);
    final viewportHeight = MediaQuery.sizeOf(context).height;
    if (viewportHeight <= 0) return 0.5;
    return (1.0 - offset.dy / viewportHeight).clamp(0.0, 1.0);
  }

  @override
  Widget build(BuildContext context) {
    final disableAnimations =
        MediaQuery.maybeOf(context)?.disableAnimations ?? false;
    final isMobile = Breakpoints.isMobile(context);
    final horizontal = Breakpoints.isDesktop(context)
        ? DesignTokens.paddingDesktop
        : Breakpoints.isTablet(context)
            ? DesignTokens.paddingTablet
            : DesignTokens.paddingMobile;

    return Container(
      key: const ValueKey('sacredSpacesTour'),
      width: double.infinity,
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
            const EditorialHeading(
              overline: 'Sacred Spaces',
              parts: [
                HeadlinePart('An Architectural '),
                HeadlinePart('Tour', italic: true, gold: true),
              ],
              subtitle: 'A cinematic journey through the churches '
                  'of Greenacres Walkerville Parish',
            ),
            SizedBox(
              height: Breakpoints.isDesktop(context)
                  ? DesignTokens.sectionGapDesktop / 2
                  : DesignTokens.sectionGapMobile / 2,
            ),
            for (var i = 0; i < _scenes.length; i++) ...[
              _buildScene(i, isMobile, disableAnimations),
              if (i < _scenes.length - 1) const SizedBox(height: 64),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildScene(int index, bool isMobile, bool disableAnimations) {
    final scene = _scenes[index];
    final isVisible = disableAnimations || _visible[index];
    final duration =
        disableAnimations ? Duration.zero : DesignTokens.imageMotion;
    final staggeredDuration = disableAnimations
        ? Duration.zero
        : DesignTokens.imageMotion + _staggerDelay * index;
    final curve = DesignTokens.cinematicCurve;

    final imageWidget = _buildImagePanel(
      index,
      scene,
      isVisible,
      duration,
      curve,
      disableAnimations,
    );
    final textWidget = _buildTextPanel(
      index,
      scene,
      isVisible,
      staggeredDuration,
      curve,
    );

    final sceneContent = isMobile
        ? Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [imageWidget, const SizedBox(height: 32), textWidget],
          )
        : index.isOdd
            ? Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(child: textWidget),
                  const SizedBox(width: 48),
                  Expanded(child: imageWidget),
                ],
              )
            : Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(child: imageWidget),
                  const SizedBox(width: 48),
                  Expanded(child: textWidget),
                ],
              );

    return Container(
      key: ValueKey('sacredSpaceScene_$index'),
      child: Builder(
        key: _sceneKeys[index],
        builder: (_) => sceneContent,
      ),
    );
  }

  Widget _buildImagePanel(
    int index,
    _SacredSpaceScene scene,
    bool isVisible,
    Duration duration,
    Curve curve,
    bool disableAnimations,
  ) {
    final progress = _parallaxProgress(index);
    final parallaxOffset =
        disableAnimations ? 0.0 : _lerp(-_maxParallaxShift, _maxParallaxShift, progress);

    return AnimatedOpacity(
      key: ValueKey('sacredSpaceImage_$index'),
      duration: duration,
      curve: curve,
      opacity: isVisible ? 1.0 : 0.0,
      child: AnimatedScale(
        duration: duration,
        curve: curve,
        scale: isVisible ? 1.0 : 0.96,
        child: Semantics(
          label: scene.semanticLabel,
          image: true,
          child: ClipRect(
            child: SizedBox(
              height: _imageHeight,
              width: double.infinity,
              child: Transform.translate(
                offset: Offset(0, parallaxOffset),
                child: Image.asset(
                  scene.assetPath,
                  fit: BoxFit.cover,
                  height: _imageHeight + _maxParallaxShift * 2,
                  width: double.infinity,
                  filterQuality: FilterQuality.medium,
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTextPanel(
    int index,
    _SacredSpaceScene scene,
    bool isVisible,
    Duration duration,
    Curve curve,
  ) {
    return AnimatedOpacity(
      key: ValueKey('sacredSpaceText_$index'),
      duration: duration,
      curve: curve,
      opacity: isVisible ? 1.0 : 0.0,
      child: AnimatedSlide(
        duration: duration,
        curve: curve,
        offset: isVisible ? Offset.zero : const Offset(0, 0.08),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              scene.church.toUpperCase(),
              style: Theme.of(context).textTheme.labelMedium?.copyWith(
                    letterSpacing: 2.5,
                    color: DesignTokens.mutedForeground,
                  ),
            ),
            const SizedBox(height: 16),
            EditorialHeading(
              parts: scene.headlineParts,
              fontSize: 36,
            ),
            const SizedBox(height: 20),
            Text(
              scene.body,
              style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    height: 1.75,
                  ),
            ),
          ],
        ),
      ),
    );
  }

  static double _lerp(double a, double b, double t) => a + (b - a) * t;
}
