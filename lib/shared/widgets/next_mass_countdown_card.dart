import 'dart:async';

import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';

import 'package:gw_parish_website/core/theme/design_tokens.dart';
import 'package:gw_parish_website/data/models/parish_models.dart';
import 'package:gw_parish_website/services/mass/mass_schedule_service.dart';

class NextMassCountdownCard extends StatefulWidget {
  const NextMassCountdownCard({
    required this.schedule,
    required this.service,
    required this.contact,
    super.key,
  });

  final List<MassScheduleEntry> schedule;
  final MassScheduleService service;
  final ContactInfo contact;

  @override
  State<NextMassCountdownCard> createState() => _NextMassCountdownCardState();
}

class _NextMassCountdownCardState extends State<NextMassCountdownCard> {
  late Timer _timer;
  late MassStatusResult _status;

  @override
  void initState() {
    super.initState();
    _status = widget.service.massStatus(DateTime.now(), widget.schedule);
    _timer = Timer.periodic(const Duration(seconds: 1), (_) {
      setState(() {
        _status = widget.service.massStatus(DateTime.now(), widget.schedule);
      });
    });
  }

  @override
  void dispose() {
    _timer.cancel();
    super.dispose();
  }

  String _directionsUrl(String church) {
    final query = church.contains("Monica")
        ? widget.contact.stMonicaQuery
        : widget.contact.stMartinQuery;
    return 'https://www.google.com/maps/dir/?api=1'
        '&destination=${Uri.encodeQueryComponent(query)}';
  }

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: 'Next mass information',
      child: switch (_status.status) {
        MassStatus.inProgress => _InProgressCard(
            church: _status.inProgressChurch ?? 'our parish',
          ),
        MassStatus.imminent => _ImminentCard(
            result: _status.next,
            directionsUrl: _directionsUrl(_status.next.entry.church),
          ),
        MassStatus.upcoming => _UpcomingCard(result: _status.next),
      },
    );
  }
}

/// Default countdown state — Mass is > 1 hour away.
class _UpcomingCard extends StatelessWidget {
  const _UpcomingCard({required this.result});

  final NextMassResult result;

  @override
  Widget build(BuildContext context) {
    final countdown = result.countdown;
    final totalSeconds = countdown.inSeconds.clamp(0, 999999);
    final days = totalSeconds ~/ (24 * 3600);
    final hours = (totalSeconds % (24 * 3600)) ~/ 3600;
    final minutes = (totalSeconds % 3600) ~/ 60;
    final seconds = totalSeconds % 60;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Next Mass', style: Theme.of(context).textTheme.labelMedium),
            const SizedBox(height: 12),
            Text(
              result.entry.church,
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 6),
            Text(
              DateFormat('EEEE, d MMMM · h:mm a').format(result.start),
              style: Theme.of(context).textTheme.bodyLarge,
            ),
            const SizedBox(height: 12),
            Text(
              '${days}d ${hours}h ${minutes}m ${seconds}s',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
          ],
        ),
      ),
    );
  }
}

/// Imminent state — Mass is < 1 hour away.
class _ImminentCard extends StatelessWidget {
  const _ImminentCard({
    required this.result,
    required this.directionsUrl,
  });

  final NextMassResult result;
  final String directionsUrl;

  @override
  Widget build(BuildContext context) {
    final minutes = result.countdown.inMinutes;

    return Card(
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: const BoxDecoration(
          border: Border(
            left: BorderSide(color: DesignTokens.accent, width: 3),
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'MASS IN $minutes MINUTES',
              style: Theme.of(context).textTheme.labelMedium?.copyWith(
                    color: DesignTokens.accent,
                    letterSpacing: 2,
                  ),
            ),
            const SizedBox(height: 12),
            Text(
              result.entry.church,
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 6),
            Text(
              DateFormat('h:mm a').format(result.start),
              style: Theme.of(context).textTheme.bodyLarge,
            ),
            const SizedBox(height: 16),
            FilledButton.icon(
              onPressed: () => launchUrl(Uri.parse(directionsUrl)),
              icon: const Icon(Icons.directions, size: 20),
              label: Text(
                'Get Directions to ${result.entry.church}',
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// In-progress state — Mass is currently being celebrated.
class _InProgressCard extends StatelessWidget {
  const _InProgressCard({required this.church});

  final String church;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          border: Border(
            left: BorderSide(
              color: DesignTokens.accent.withValues(alpha: 0.6),
              width: 3,
            ),
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(
              Icons.church_outlined,
              color: DesignTokens.accent.withValues(alpha: 0.8),
              size: 32,
            ),
            const SizedBox(height: 12),
            Text(
              'Mass is currently being celebrated',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontStyle: FontStyle.italic,
                  ),
            ),
            const SizedBox(height: 8),
            Text(
              'at $church',
              style: Theme.of(context).textTheme.bodyLarge,
            ),
            const SizedBox(height: 12),
            Text(
              'Please keep the parish in your prayers.',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Theme.of(context)
                        .colorScheme
                        .onSurface
                        .withValues(alpha: 0.7),
                  ),
            ),
          ],
        ),
      ),
    );
  }
}
