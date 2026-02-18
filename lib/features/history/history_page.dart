import 'package:flutter/material.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';

import 'package:gw_parish_website/core/theme/design_tokens.dart';
import 'package:gw_parish_website/data/models/parish_models.dart';
import 'package:gw_parish_website/shared/widgets/grayscale_hover_image.dart';
import 'package:gw_parish_website/shared/widgets/section_shell.dart';

class HistoryPage extends StatelessWidget {
  const HistoryPage({required this.content, super.key});

  final ParishContent content;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        SectionShell(
          overline: 'Parish History',
          title: 'A Timeline of Faith',
          child: Column(
            children: content.historyMilestones
                .map(
                  (item) => Container(
                    decoration: BoxDecoration(
                      border: Border(
                        left: BorderSide(
                          color:
                              int.tryParse(item.year.substring(0, 4))?.isEven ==
                                  true
                              ? DesignTokens.accent
                              : Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.2),
                          width: 3,
                        ),
                      ),
                    ),
                    margin: const EdgeInsets.only(bottom: 14),
                    padding: const EdgeInsets.fromLTRB(16, 8, 10, 8),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        SizedBox(
                          width: 88,
                          child: Text(
                            item.year,
                            style: Theme.of(context).textTheme.titleMedium,
                          ),
                        ),
                        Expanded(
                          child: Text(
                            item.description,
                            style: Theme.of(context).textTheme.bodyLarge,
                          ),
                        ),
                      ],
                    ),
                  ),
                )
                .toList(),
          ),
        ),
        SectionShell(
          overline: 'Historical Gallery',
          title: 'Refurbishment and Milestones',
          child: MasonryGridView.count(
            shrinkWrap: true,
            crossAxisCount: 2,
            mainAxisSpacing: 12,
            crossAxisSpacing: 12,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: content.refurbishmentImages.length,
            itemBuilder: (context, index) {
              final image = content.refurbishmentImages[index];
              return GestureDetector(
                onTap: () => showDialog<void>(
                  context: context,
                  builder: (context) => Dialog(
                    shape: const RoundedRectangleBorder(
                      borderRadius: BorderRadius.zero,
                    ),
                    child: InteractiveViewer(
                      child: Image.asset(image, fit: BoxFit.contain),
                    ),
                  ),
                ),
                child: GrayscaleHoverImage(
                  image: AssetImage(image),
                  fit: BoxFit.cover,
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}
