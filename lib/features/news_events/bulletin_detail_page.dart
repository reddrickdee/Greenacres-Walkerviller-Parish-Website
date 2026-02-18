import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../core/theme/design_tokens.dart';
import '../../data/models/parish_models.dart';
import '../../shared/widgets/drop_cap_paragraph.dart';
import '../../shared/widgets/editorial_image.dart';
import '../../shared/widgets/responsive_grid.dart';
import '../../shared/widgets/section_shell.dart';

class BulletinDetailPage extends StatelessWidget {
  const BulletinDetailPage({
    super.key,
    required this.bulletin,
    required this.title,
  });

  final Bulletin bulletin;
  final String title;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Header Section
        _BulletinHeader(bulletin: bulletin, title: title),

        // Priest's Reflection (Spread 1: Full width or lead)
        SectionShell(
          overline: 'The Pastor\'s Pen',
          title: 'Weekly Reflection',
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 900),
            child: DropCapParagraph(text: bulletin.priestReflection),
          ),
        ),

        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 64),
          child: Divider(height: 1, thickness: 1),
        ),

        // Spread 2: Multi-column news sections
        SectionShell(
          overline: 'Parish Life',
          title: 'Community & Projects',
          child: ResponsiveGrid(
            desktopColumns: 2,
            tabletColumns: 2,
            mobileColumns: 1,
            spacing: 48,
            runSpacing: 48,
            children: bulletin.sections.map((section) {
              return _BulletinSectionWidget(section: section);
            }).toList(),
          ),
        ),

        const SizedBox(height: 80),
      ],
    );
  }
}

class _BulletinHeader extends StatelessWidget {
  const _BulletinHeader({required this.bulletin, required this.title});

  final Bulletin bulletin;
  final String title;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 80, horizontal: 64),
      decoration: BoxDecoration(
        color: theme.scaffoldBackgroundColor,
        border: Border(
          bottom: BorderSide(
            color: theme.dividerColor.withValues(alpha: 0.1),
            width: 1,
          ),
        ),
      ),
      child: Column(
        children: [
          Text(
            bulletin.date.toUpperCase(),
            style: GoogleFonts.inter(
              letterSpacing: 4,
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: DesignTokens.accent,
            ),
          ),
          const SizedBox(height: 24),
          Text(
            title,
            textAlign: TextAlign.center,
            style: GoogleFonts.playfairDisplay(
              fontSize: 64,
              height: 1.1,
              fontWeight: FontWeight.w900,
              fontStyle: FontStyle.italic,
              color: theme.colorScheme.onSurface,
            ),
          ),
          const SizedBox(height: 48),
          if (bulletin.coverImage != null)
            ConstrainedBox(
              constraints: const BoxConstraints(maxHeight: 500),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(4),
                child: Image(
                  image: EditorialImage.resolveImage(bulletin.coverImage!),
                  width: 1200,
                  fit: BoxFit.cover,
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class _BulletinSectionWidget extends StatelessWidget {
  const _BulletinSectionWidget({required this.section});

  final BulletinSection section;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (section.imageAsset != null) ...[
          EditorialImage(
            image: EditorialImage.resolveImage(section.imageAsset!),
            height: 300,
            focalPoint: section.imageFocalPoint,
            borderRadius: BorderRadius.circular(2),
          ),
          const SizedBox(height: 24),
        ],
        Text(
          section.title,
          style: GoogleFonts.playfairDisplay(
            fontSize: 28,
            fontWeight: FontWeight.bold,
            color: theme.colorScheme.onSurface,
          ),
        ),
        const SizedBox(height: 16),
        Text(
          section.content,
          style: GoogleFonts.inter(
            fontSize: 18,
            height: 1.6,
            color: theme.colorScheme.onSurface.withValues(alpha: 0.8),
          ),
        ),
      ],
    );
  }
}
