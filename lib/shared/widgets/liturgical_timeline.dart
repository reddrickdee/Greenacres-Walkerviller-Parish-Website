import 'package:flutter/material.dart';

import 'package:gw_parish_website/core/theme/design_tokens.dart';
import 'package:gw_parish_website/data/models/liturgy_models.dart';
import 'package:gw_parish_website/data/models/liturgical_timeline_data.dart';

/// A horizontally scrollable timeline of the Catholic Liturgical Year.
///
/// Each season is rendered as a colour-coded block with feast day markers.
/// The current date is highlighted with a gold accent line.
class LiturgicalTimeline extends StatefulWidget {
  const LiturgicalTimeline({
    required this.day,
    this.reduceMotion = false,
    super.key,
  });

  final LiturgicalDay day;
  final bool reduceMotion;

  @override
  State<LiturgicalTimeline> createState() => _LiturgicalTimelineState();
}

class _LiturgicalTimelineState extends State<LiturgicalTimeline> {
  final ScrollController _scrollController = ScrollController();
  late List<TimelineEntry> _entries;

  // Fixed pixel width per day, determining total timeline width.
  static const double _dayWidth = 1.6;
  static const double _segmentHeight = 80.0;
  static const double _feastRowHeight = 28.0;

  @override
  void initState() {
    super.initState();
    _entries = LiturgicalTimelineBuilder.build(
      today: widget.day.date,
      upcomingFeasts: widget.day.upcomingFeasts,
    );
    WidgetsBinding.instance.addPostFrameCallback((_) => _scrollToToday());
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _scrollToToday() {
    final now = widget.day.date;
    double offset = 0;

    for (final entry in _entries) {
      final days = entry.end.difference(entry.start).inDays.clamp(1, 365);
      final segmentWidth = days * _dayWidth;

      if (!now.isBefore(entry.start) && !now.isAfter(entry.end)) {
        final daysIn = now.difference(entry.start).inDays;
        offset += daysIn * _dayWidth;
        break;
      }
      offset += segmentWidth;
    }

    // Center the viewport on today's position.
    final viewportWidth = _scrollController.position.viewportDimension;
    final centeredOffset = (offset - viewportWidth / 2)
        .clamp(0, _scrollController.position.maxScrollExtent)
        .toDouble();

    if (widget.reduceMotion) {
      _scrollController.jumpTo(centeredOffset);
    } else {
      _scrollController.animateTo(
        centeredOffset,
        duration: const Duration(milliseconds: 800),
        curve: DesignTokens.cinematicCurve,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final resolver = const SeasonColorResolver();
    final now = widget.day.date;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Season blocks
        SizedBox(
          height: _segmentHeight + _feastRowHeight + 12,
          child: SingleChildScrollView(
            controller: _scrollController,
            scrollDirection: Axis.horizontal,
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: _entries.map((entry) {
                final days =
                    entry.end.difference(entry.start).inDays.clamp(1, 365);
                final segmentWidth = days * _dayWidth;
                final colour = resolver.colorFor(entry.season);

                // Is today within this segment?
                final isActive =
                    !now.isBefore(entry.start) && !now.isAfter(entry.end);

                return SizedBox(
                  width: segmentWidth,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      // Feast day indicators
                      SizedBox(
                        height: _feastRowHeight,
                        child: Stack(
                          children: entry.feasts.map((feast) {
                            final feastDaysIn =
                                feast.date.difference(entry.start).inDays;
                            final feastLeft =
                                (feastDaysIn * _dayWidth).clamp(0, segmentWidth - 8);
                            return Positioned(
                              left: feastLeft.toDouble(),
                              child: Tooltip(
                                message: feast.name,
                                child: Container(
                                  width: 6,
                                  height: 6,
                                  decoration: BoxDecoration(
                                    color: DesignTokens.accent,
                                    shape: BoxShape.circle,
                                  ),
                                ),
                              ),
                            );
                          }).toList(),
                        ),
                      ),
                      const SizedBox(height: 4),

                      // Season block
                      Stack(
                        children: [
                          Container(
                            width: segmentWidth,
                            height: _segmentHeight,
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 6,
                            ),
                            decoration: BoxDecoration(
                              color: colour.withValues(
                                alpha: isActive ? 0.35 : 0.15,
                              ),
                              border: Border(
                                bottom: BorderSide(color: colour, width: 3),
                              ),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Flexible(
                                  child: Text(
                                    entry.name,
                                    style:
                                        theme.textTheme.labelSmall?.copyWith(
                                      color: colour,
                                      fontWeight: isActive
                                          ? FontWeight.bold
                                          : FontWeight.normal,
                                      letterSpacing: 1,
                                    ),
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          // Today marker
                          if (isActive) ...[
                            Positioned(
                              left: now
                                      .difference(entry.start)
                                      .inDays
                                      .toDouble() *
                                  _dayWidth,
                              top: 0,
                              bottom: 0,
                              child: Container(
                                width: 2,
                                color: DesignTokens.accent,
                              ),
                            ),
                          ],
                        ],
                      ),
                    ],
                  ),
                );
              }).toList(),
            ),
          ),
        ),
      ],
    );
  }
}
