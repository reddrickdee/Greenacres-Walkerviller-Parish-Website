import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../core/theme/design_tokens.dart';

/// Sacred text block for Scripture passages and the Parish Prayer.
///
/// Features a 2px gold left border, Playfair Display italic text,
/// and generous padding — setting sacred content apart from regular body text.
class SacredTextBlock extends StatelessWidget {
  final String text;
  final String? attribution;
  final bool isImage;
  final String? imageAsset;
  final String? altText;

  const SacredTextBlock({
    super.key,
    this.text = '',
    this.attribution,
    this.isImage = false,
    this.imageAsset,
    this.altText,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        border: Border(left: BorderSide(color: DesignTokens.accent, width: 2)),
      ),
      padding: const EdgeInsets.fromLTRB(24, 16, 16, 16),
      child: isImage && imageAsset != null
          ? Semantics(
              label: altText ?? 'Sacred text',
              child: Image.asset(imageAsset!, fit: BoxFit.contain),
            )
          : Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  text,
                  style: GoogleFonts.playfairDisplay(
                    fontSize: 20,
                    fontStyle: FontStyle.italic,
                    height: 1.6,
                    color: Theme.of(context).colorScheme.onSurface,
                  ),
                ),
                if (attribution != null) ...[
                  const SizedBox(height: 12),
                  Text(
                    '— $attribution',
                    style: GoogleFonts.inter(
                      fontSize: 13,
                      letterSpacing: 1,
                      color: Theme.of(context).textTheme.bodySmall?.color,
                    ),
                  ),
                ],
              ],
            ),
    );
  }
}
