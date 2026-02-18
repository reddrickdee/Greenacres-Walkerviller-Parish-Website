import 'package:flutter/material.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';
import 'package:intl/intl.dart';

import 'package:gw_parish_website/core/layout/breakpoints.dart';
import 'package:gw_parish_website/core/theme/design_tokens.dart';
import 'package:gw_parish_website/data/models/parish_models.dart';
import 'package:gw_parish_website/services/prayer/prayer_wall_service.dart';

/// A reverent, staggered-grid prayer wall resembling a physical ledger.
///
/// Displays anonymous prayer intentions with a "Pray for this" button.
/// When tapped, plays a slow warm pulse animation simulating a lit votive candle
/// (respects [reduceMotion]).
class PrayerWallSection extends StatefulWidget {
  const PrayerWallSection({
    required this.service,
    this.reduceMotion = false,
    super.key,
  });

  final PrayerWallService service;
  final bool reduceMotion;

  @override
  State<PrayerWallSection> createState() => _PrayerWallSectionState();
}

class _PrayerWallSectionState extends State<PrayerWallSection> {
  final TextEditingController _textController = TextEditingController();

  @override
  void initState() {
    super.initState();
    widget.service.addListener(_onUpdate);
  }

  @override
  void dispose() {
    widget.service.removeListener(_onUpdate);
    _textController.dispose();
    super.dispose();
  }

  void _onUpdate() {
    if (mounted) setState(() {});
  }

  void _submit() {
    final text = _textController.text;
    if (text.trim().isEmpty) return;
    widget.service.addIntention(text);
    _textController.clear();
    FocusScope.of(context).unfocus();
  }

  @override
  Widget build(BuildContext context) {
    final mobile = Breakpoints.isMobile(context);
    final intentions = widget.service.intentions;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // ── Submit form ──────────────────────────────────────────
        Row(
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Expanded(
              child: TextField(
                controller: _textController,
                maxLength: 200,
                maxLines: 2,
                decoration: const InputDecoration(
                  hintText: 'Share your prayer intention (anonymous)…',
                  border: OutlineInputBorder(),
                  counterText: '',
                ),
              ),
            ),
            const SizedBox(width: 12),
            FilledButton(
              onPressed: _submit,
              child: const Text('Submit'),
            ),
          ],
        ),
        const SizedBox(height: 24),

        // ── Staggered grid of intentions ─────────────────────────
        MasonryGridView.count(
          crossAxisCount: mobile ? 1 : 3,
          mainAxisSpacing: 16,
          crossAxisSpacing: 16,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: intentions.length,
          itemBuilder: (context, index) {
            return _IntentionCard(
              intention: intentions[index],
              onPray: () => widget.service.prayFor(intentions[index].id),
              reduceMotion: widget.reduceMotion,
            );
          },
        ),
      ],
    );
  }
}

class _IntentionCard extends StatefulWidget {
  const _IntentionCard({
    required this.intention,
    required this.onPray,
    this.reduceMotion = false,
  });

  final PrayerIntention intention;
  final VoidCallback onPray;
  final bool reduceMotion;

  @override
  State<_IntentionCard> createState() => _IntentionCardState();
}

class _IntentionCardState extends State<_IntentionCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _glowController;
  late Animation<double> _glowAnim;
  bool _justPrayed = false;

  @override
  void initState() {
    super.initState();
    _glowController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2000),
    );
    _glowAnim = TweenSequence<double>([
      TweenSequenceItem(
        tween: Tween(begin: 0.0, end: 1.0)
            .chain(CurveTween(curve: DesignTokens.cinematicCurve)),
        weight: 50,
      ),
      TweenSequenceItem(
        tween: Tween(begin: 1.0, end: 0.0)
            .chain(CurveTween(curve: DesignTokens.cinematicCurve)),
        weight: 50,
      ),
    ]).animate(_glowController);
  }

  @override
  void dispose() {
    _glowController.dispose();
    super.dispose();
  }

  void _handlePray() {
    widget.onPray();

    if (widget.reduceMotion) {
      // No animation — just update.
      setState(() => _justPrayed = true);
      Future.delayed(const Duration(seconds: 2), () {
        if (mounted) setState(() => _justPrayed = false);
      });
      return;
    }

    setState(() => _justPrayed = true);
    _glowController.forward(from: 0).then((_) {
      if (mounted) setState(() => _justPrayed = false);
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final parchment = isDark
        ? const Color(0xFF2A2520)
        : const Color(0xFFF5EFE6);

    return AnimatedBuilder(
      animation: _glowAnim,
      builder: (context, child) {
        return Container(
          decoration: BoxDecoration(
            color: parchment,
            borderRadius: BorderRadius.circular(4),
            boxShadow: _justPrayed
                ? [
                    BoxShadow(
                      color: DesignTokens.accent
                          .withValues(alpha: 0.3 * _glowAnim.value),
                      blurRadius: 24 * _glowAnim.value,
                      spreadRadius: 4 * _glowAnim.value,
                    ),
                  ]
                : null,
          ),
          child: child,
        );
      },
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              widget.intention.text,
              style: theme.textTheme.bodyMedium?.copyWith(
                fontStyle: FontStyle.italic,
                height: 1.6,
              ),
            ),
            const SizedBox(height: 12),
            Text(
              DateFormat('d MMMM y').format(widget.intention.submitted),
              style: theme.textTheme.bodySmall,
            ),
            const SizedBox(height: 10),
            TextButton.icon(
              onPressed: _handlePray,
              icon: const Text('🕯', style: TextStyle(fontSize: 16)),
              label: Text(
                'Pray for this · ${widget.intention.prayerCount}',
              ),
            ),
          ],
        ),
      ),
    );
  }
}
