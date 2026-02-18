import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';

import '../../core/theme/design_tokens.dart';

/// Primary editorial button with the signature gold-slide hover effect.
///
/// On hover, a gold layer slides in from the left (500ms cinematic).
/// On dark backgrounds, set [dark] to true for inverted colours.
class EditorialButton extends StatefulWidget {
  final String label;
  final VoidCallback? onTap;
  final bool secondary;
  final bool dark;

  const EditorialButton({
    super.key,
    required this.label,
    this.onTap,
    this.secondary = false,
    this.dark = false,
  });

  @override
  State<EditorialButton> createState() => _EditorialButtonState();
}

class _EditorialButtonState extends State<EditorialButton> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    final bool isPrimary = !widget.secondary;
    final theme = Theme.of(context);
    final fg = theme.colorScheme.onSurface;
    final bg = theme.scaffoldBackgroundColor;

    return MouseRegion(
      onEnter: (_) => setState(() => _hovered = true),
      onExit: (_) => setState(() => _hovered = false),
      child: GestureDetector(
        onTap: widget.onTap,
        child: Semantics(
          button: true,
          label: widget.label,
          child: AnimatedContainer(
            duration: DesignTokens.buttonMotion,
            curve: Curves.easeOut,
            height: 48,
            padding: const EdgeInsets.symmetric(horizontal: 32),
            decoration: BoxDecoration(
              color: isPrimary
                  ? (_hovered ? DesignTokens.accent : fg)
                  : (_hovered ? fg : Colors.transparent),
              border: isPrimary
                  ? null
                  : Border.all(
                      color: widget.dark
                          ? bg.withValues(alpha: 0.5)
                          : fg.withValues(alpha: 0.5),
                    ),
              boxShadow: [
                BoxShadow(
                  offset: const Offset(0, 4),
                  blurRadius: _hovered ? 24 : 16,
                  color: Color.fromRGBO(0, 0, 0, _hovered ? 0.2 : 0.1),
                ),
              ],
            ),
            alignment: Alignment.center,
            child: Text(
              widget.label.toUpperCase(),
              style: GoogleFonts.inter(
                fontSize: 12,
                letterSpacing: 2.5,
                fontWeight: FontWeight.w500,
                color: isPrimary || _hovered ? bg : (widget.dark ? bg : fg),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class PrintPageSection {
  const PrintPageSection({required this.heading, required this.lines});

  final String heading;
  final List<String> lines;
}

class EditorialPrintButton extends StatefulWidget {
  const EditorialPrintButton({
    required this.documentTitle,
    required this.sections,
    super.key,
    this.subtitle,
    this.footer,
    this.buttonLabel = 'PRINT PAGE',
  });

  final String documentTitle;
  final String? subtitle;
  final List<PrintPageSection> sections;
  final String? footer;
  final String buttonLabel;

  @override
  State<EditorialPrintButton> createState() => _EditorialPrintButtonState();
}

class _EditorialPrintButtonState extends State<EditorialPrintButton> {
  bool _printing = false;

  @override
  Widget build(BuildContext context) {
    return OutlinedButton.icon(
      onPressed: _printing ? null : _printPage,
      icon: const Icon(Icons.print_outlined, size: 18),
      label: Text(_printing ? 'PREPARING...' : widget.buttonLabel),
    );
  }

  Future<void> _printPage() async {
    if (_printing) {
      return;
    }
    setState(() => _printing = true);

    try {
      final document = pw.Document();
      const bodyStyle = pw.TextStyle(
        fontSize: 11,
        lineSpacing: 3,
      );
      final headingStyle = pw.TextStyle(
        fontSize: 12,
        fontWeight: pw.FontWeight.bold,
      );
      final titleStyle = pw.TextStyle(
        fontSize: 18,
        fontWeight: pw.FontWeight.bold,
      );

      document.addPage(
        pw.MultiPage(
          pageFormat: PdfPageFormat.a4,
          margin: const pw.EdgeInsets.symmetric(horizontal: 28, vertical: 24),
          build: (context) {
            final widgets = <pw.Widget>[
              pw.Text(widget.documentTitle, style: titleStyle),
              if (widget.subtitle != null && widget.subtitle!.trim().isNotEmpty)
                pw.Padding(
                  padding: const pw.EdgeInsets.only(top: 4, bottom: 12),
                  child: pw.Text(widget.subtitle!, style: bodyStyle),
                )
              else
                pw.SizedBox(height: 12),
            ];

            for (final section in widget.sections) {
              final cleanLines = section.lines
                  .map((line) => line.trim())
                  .where((line) => line.isNotEmpty)
                  .toList();
              if (cleanLines.isEmpty) {
                continue;
              }

              widgets.add(
                pw.Container(
                  width: double.infinity,
                  margin: const pw.EdgeInsets.only(bottom: 8),
                  decoration: const pw.BoxDecoration(
                    border: pw.Border(
                      left: pw.BorderSide(color: PdfColors.black, width: 1.2),
                    ),
                  ),
                  padding: const pw.EdgeInsets.only(left: 8),
                  child: pw.Text(section.heading, style: headingStyle),
                ),
              );
              for (final line in cleanLines) {
                widgets.add(
                  pw.Padding(
                    padding: const pw.EdgeInsets.only(left: 4, bottom: 5),
                    child: pw.Bullet(
                      text: line,
                      style: bodyStyle,
                      bulletSize: 2,
                    ),
                  ),
                );
              }
              widgets.add(pw.SizedBox(height: 10));
            }

            if (widget.footer != null && widget.footer!.trim().isNotEmpty) {
              widgets.add(
                pw.Padding(
                  padding: const pw.EdgeInsets.only(top: 8),
                  child: pw.Text(widget.footer!, style: bodyStyle),
                ),
              );
            }

            return widgets;
          },
        ),
      );

      await Printing.layoutPdf(
        name: '${widget.documentTitle}.pdf',
        onLayout: (_) async => document.save(),
      );
    } catch (_) {
      if (!mounted) return;
      ScaffoldMessenger.maybeOf(context)?.showSnackBar(
        const SnackBar(
          content: Text('Unable to prepare printable page right now.'),
        ),
      );
    } finally {
      if (mounted) {
        setState(() => _printing = false);
      }
    }
  }
}
