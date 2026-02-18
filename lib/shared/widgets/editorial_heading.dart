import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../core/theme/design_tokens.dart';

/// Composable editorial heading with optional overline label,
/// mixed-style headline, and subtitle.
///
/// Supports the signature "mixed italic" effect where specific words
/// in a headline are rendered in italic Playfair with optional gold
/// color. Pass [parts] for mixed-style or [text] for uniform style.
///
/// Example: `EditorialHeading(parts: [
///   HeadlinePart('Welcome to Our '),
///   HeadlinePart('Parish', italic: true, gold: true),
/// ])`
class EditorialHeading extends StatelessWidget {
  final String? overline;
  final String? text;
  final List<HeadlinePart>? parts;
  final String? subtitle;
  final double? fontSize;
  final bool dark;
  final CrossAxisAlignment alignment;

  const EditorialHeading({
    super.key,
    this.overline,
    this.text,
    this.parts,
    this.subtitle,
    this.fontSize,
    this.dark = false,
    this.alignment = CrossAxisAlignment.start,
  }) : assert(text != null || parts != null);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final fgColor = dark
        ? theme.scaffoldBackgroundColor
        : theme.colorScheme.onSurface;
    final mutedColor = dark
        ? theme.scaffoldBackgroundColor.withValues(alpha: 0.6)
        : (theme.brightness == Brightness.dark
            ? DesignTokens.darkMutedForeground
            : DesignTokens.mutedForeground);

    return Column(
      crossAxisAlignment: alignment,
      children: [
        // ── Overline label (e.g., "OUR PARISH") ─────────────────
        if (overline != null) ...[
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(width: 32, height: 1, color: DesignTokens.accent),
              const SizedBox(width: 12),
              Text(
                overline!.toUpperCase(),
                style: GoogleFonts.inter(
                  fontSize: 11,
                  letterSpacing: 3.5,
                  fontWeight: FontWeight.w500,
                  color: mutedColor,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
        ],

        // ── Headline ────────────────────────────────────────────
        if (parts != null)
          Text.rich(
            TextSpan(
              children: parts!.map((part) {
                return TextSpan(
                  text: part.text,
                  style: GoogleFonts.playfairDisplay(
                    fontSize: fontSize ?? 48,
                    height: 0.95,
                    letterSpacing: -0.5,
                    fontStyle: part.italic
                        ? FontStyle.italic
                        : FontStyle.normal,
                    color: part.gold ? DesignTokens.accent : fgColor,
                  ),
                );
              }).toList(),
            ),
          )
        else
          Text(
            text!,
            style: GoogleFonts.playfairDisplay(
              fontSize: fontSize ?? 48,
              height: 0.95,
              letterSpacing: -0.5,
              color: fgColor,
            ),
          ),

        // ── Subtitle ────────────────────────────────────────────
        if (subtitle != null) ...[
          const SizedBox(height: 16),
          Text(
            subtitle!,
            style: GoogleFonts.inter(
              fontSize: 18,
              height: 1.625,
              color: mutedColor,
            ),
          ),
        ],
      ],
    );
  }
}

/// A segment of a mixed-style headline.
class HeadlinePart {
  final String text;
  final bool italic;
  final bool gold;

  const HeadlinePart(this.text, {this.italic = false, this.gold = false});
}
