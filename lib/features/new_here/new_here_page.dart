import 'package:flutter/material.dart';

import 'package:gw_parish_website/data/models/parish_models.dart';
import 'package:gw_parish_website/shared/widgets/new_here_concierge.dart';
import 'package:gw_parish_website/shared/widgets/section_shell.dart';

class NewHerePage extends StatelessWidget {
  const NewHerePage({required this.content, super.key});

  final ParishContent content;

  @override
  Widget build(BuildContext context) {
    return SectionShell(
      overline: 'Welcome',
      title: "I'm New Here",
      child: NewHereConcierge(content: content),
    );
  }
}
