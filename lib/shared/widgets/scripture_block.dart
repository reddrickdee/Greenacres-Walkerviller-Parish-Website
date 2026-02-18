import 'package:flutter/material.dart';

import 'package:gw_parish_website/core/theme/design_tokens.dart';

class ScriptureBlock extends StatelessWidget {
  const ScriptureBlock({required this.text, super.key});

  final String text;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: const BoxDecoration(
        border: Border(left: BorderSide(color: DesignTokens.accent, width: 2)),
      ),
      child: Text(
        text,
        style: Theme.of(context).textTheme.titleLarge?.copyWith(
          fontStyle: FontStyle.italic,
          height: 1.5,
        ),
      ),
    );
  }
}
