import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'package:gw_parish_website/core/accessibility/accessibility_controller.dart';
import 'package:gw_parish_website/core/layout/breakpoints.dart';
import 'package:gw_parish_website/core/theme/design_tokens.dart';
import 'package:gw_parish_website/data/models/parish_models.dart';
import 'package:gw_parish_website/shared/widgets/editorial_audio_dock.dart';
import 'package:gw_parish_website/shared/widgets/pastoral_fast_track.dart';
import 'package:gw_parish_website/services/audio/editorial_audio_controller.dart';

class NavItem {
  const NavItem(this.label, this.path);

  final String label;
  final String path;
}

class ParishFrame extends StatelessWidget {
  const ParishFrame({
    required this.child,
    required this.parishContent,
    required this.accessibility,
    required this.currentPath,
    required this.seasonColor,
    required this.seasonLabel,
    required this.audioController,
    super.key,
  });

  final Widget child;
  final ParishContent parishContent;
  final AccessibilityController accessibility;
  final String currentPath;
  final Color seasonColor;
  final String seasonLabel;
  final EditorialAudioController audioController;

  static const navItems = <NavItem>[
    NavItem('Home', '/'),
    NavItem('About', '/about'),
    NavItem('Mass Times', '/mass-sacraments'),
    NavItem('News', '/news-events'),
    NavItem('Services', '/services-community'),
    NavItem('History', '/history'),
    NavItem('Contact', '/contact'),
  ];

  @override
  Widget build(BuildContext context) {
    final mobile = Breakpoints.isMobile(context);

    return Scaffold(
      appBar: AppBar(
        toolbarHeight: 80,
        titleSpacing: mobile ? 8 : 20,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              parishContent.parishName,
              style: Theme.of(context).textTheme.titleMedium,
            ),
            Text(
              parishContent.tagline,
              style: Theme.of(
                context,
              ).textTheme.labelMedium?.copyWith(letterSpacing: 2.2),
            ),
          ],
        ),
        leading: mobile
            ? Builder(
                builder: (context) {
                  return IconButton(
                    icon: const Icon(Icons.menu),
                    onPressed: () => Scaffold.of(context).openDrawer(),
                  );
                },
              )
            : null,
        actions: [
          if (!mobile)
            for (final item in navItems)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 4),
                child: TextButton(
                  onPressed: () => context.go(item.path),
                  child: Text(
                    item.label,
                    style: Theme.of(context).textTheme.labelLarge?.copyWith(
                      color: currentPath == item.path
                          ? DesignTokens.accent
                          : Theme.of(context).colorScheme.onSurface,
                    ),
                  ),
                ),
              ),
          IconButton(
            tooltip: 'Search parish site',
            onPressed: () {
              context.push('/search');
            },
            icon: const Icon(Icons.search),
          ),
          const SizedBox(width: 12),
        ],
      ),
      drawer: mobile
          ? Drawer(
              backgroundColor: Theme.of(context).scaffoldBackgroundColor,
              shape: const RoundedRectangleBorder(
                borderRadius: BorderRadius.zero,
              ),
              child: SafeArea(
                child: ListView(
                  padding: EdgeInsets.zero,
                  children: [
                    for (final item in navItems)
                      ListTile(
                        minTileHeight: 56,
                        title: Text(item.label),
                        trailing: currentPath == item.path
                            ? const Icon(Icons.arrow_forward)
                            : null,
                        onTap: () {
                          Navigator.pop(context);
                          context.go(item.path);
                        },
                      ),
                  ],
                ),
              ),
            )
          : null,
      floatingActionButton: AccessibilityToolbar(controller: accessibility),
      body: Column(
        children: [
          Container(height: 3, color: seasonColor),
          Expanded(
            child: Stack(
              children: [
                const _VerticalGridLines(),
                SingleChildScrollView(
                  child: Column(
                    children: [
                      Padding(
                        padding: const EdgeInsets.symmetric(
                          horizontal: DesignTokens.paddingMobile,
                          vertical: 8,
                        ),
                        child: Align(
                          alignment: Alignment.centerLeft,
                          child: Text(
                            seasonLabel,
                            style: Theme.of(context).textTheme.labelMedium,
                          ),
                        ),
                      ),
                      KeyedSubtree(
                        key: const ValueKey('main-content'),
                        child: child,
                      ),
                      EditorialAudioDock(
                        controller: parishContent.sacramentalJourneys.isNotEmpty
                            ? audioController
                            : audioController,
                      ),
                      PastoralFastTrack(contact: parishContent.contact),
                      _Footer(content: parishContent),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _VerticalGridLines extends StatelessWidget {
  const _VerticalGridLines();

  @override
  Widget build(BuildContext context) {
    if (Breakpoints.isMobile(context)) {
      return const SizedBox.shrink();
    }
    return IgnorePointer(
      child: Row(
        children: List.generate(
          5,
          (index) => Expanded(
            child: Container(
              decoration: index == 4
                  ? null
                  : BoxDecoration(
                      border: Border(
                        right: BorderSide(
                          color: Theme.of(
                            context,
                          ).colorScheme.onSurface.withValues(alpha: 0.1),
                        ),
                      ),
                    ),
            ),
          ),
        ),
      ),
    );
  }
}

class AccessibilityToolbar extends StatelessWidget {
  const AccessibilityToolbar({required this.controller, super.key});

  final AccessibilityController controller;

  @override
  Widget build(BuildContext context) {
    return FloatingActionButton(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      foregroundColor: Theme.of(context).colorScheme.onSurface,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.zero),
      elevation: 4,
      tooltip: 'Accessibility settings',
      onPressed: () => _showPanel(context),
      child: const Icon(Icons.accessibility_new),
    );
  }

  void _showPanel(BuildContext context) {
    showModalBottomSheet<void>(
      context: context,
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (sheetContext) {
        return AnimatedBuilder(
          animation: controller,
          builder: (ctx, _) {
            return SafeArea(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(24, 20, 24, 24),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Center(
                      child: Container(
                        width: 40,
                        height: 4,
                        decoration: BoxDecoration(
                          color: Theme.of(
                            ctx,
                          ).colorScheme.onSurface.withValues(alpha: 0.3),
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'ACCESSIBILITY',
                      style: Theme.of(ctx).textTheme.labelLarge,
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        OutlinedButton(
                          onPressed: controller.decreaseFontSize,
                          child: const Text('A−'),
                        ),
                        const SizedBox(width: 8),
                        OutlinedButton(
                          onPressed: controller.increaseFontSize,
                          child: const Text('A+'),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    SwitchListTile(
                      value: controller.highContrast,
                      onChanged: (_) => controller.toggleHighContrast(),
                      title: const Text('High contrast'),
                      contentPadding: EdgeInsets.zero,
                    ),
                    SwitchListTile(
                      value: controller.reduceMotion,
                      onChanged: (_) => controller.toggleReducedMotion(),
                      title: const Text('Reduce motion'),
                      contentPadding: EdgeInsets.zero,
                    ),
                    SwitchListTile(
                      value: controller.highLegibility,
                      onChanged: (_) => controller.toggleHighLegibility(),
                      title: const Text('High legibility (dyslexia-friendly)'),
                      subtitle: const Text(
                        'Swap heading serif to Atkinson Hyperlegible',
                      ),
                      contentPadding: EdgeInsets.zero,
                    ),
                    SwitchListTile(
                      value: controller.darkMode,
                      onChanged: (_) {
                        controller.toggleDarkMode();
                        Navigator.of(sheetContext).pop();
                      },
                      title: const Text('Dark mode'),
                      contentPadding: EdgeInsets.zero,
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }
}

class _Footer extends StatelessWidget {
  const _Footer({required this.content});

  final ParishContent content;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      color: Theme.of(context).brightness == Brightness.dark
          ? DesignTokens.darkMutedBackground
          : DesignTokens.foreground,
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 28),
      child: DefaultTextStyle(
        style: Theme.of(context).textTheme.bodySmall!.copyWith(
          color: Theme.of(context).brightness == Brightness.dark
              ? DesignTokens.darkForeground.withValues(alpha: 0.9)
              : DesignTokens.background.withValues(alpha: 0.9),
        ),
        child: Wrap(
          spacing: 40,
          runSpacing: 16,
          children: [
            SizedBox(
              width: 320,
              child: Text(
                '${content.parishName}\n'
                '${content.contact.postalAddress}\n'
                '${content.contact.phone}',
              ),
            ),
            SizedBox(
              width: 320,
              child: Text(
                'Weekend Mass Summary\n'
                'St Monica\'s: Saturday 6:00pm\n'
                'St Martin\'s: Sunday 9:30am',
              ),
            ),
            SizedBox(
              width: 320,
              child: Text(
                'Schools\n${content.schools.first.name}\n${content.schools.last.name}',
              ),
            ),
          ],
        ),
      ),
    );
  }
}
