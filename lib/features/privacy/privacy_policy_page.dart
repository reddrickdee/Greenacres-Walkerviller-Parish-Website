import 'package:flutter/material.dart';

import 'package:gw_parish_website/shared/widgets/section_shell.dart';

/// APP 1 privacy disclosure page.
///
/// This is a template based on OAIC APP guidance.
/// **The parish should have the Archdiocese's privacy officer or legal
/// counsel review the final wording before production launch.**
class PrivacyPolicyPage extends StatelessWidget {
  const PrivacyPolicyPage({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final bodyStyle = theme.textTheme.bodyLarge;
    final headingStyle = theme.textTheme.titleMedium;

    return SectionShell(
      overline: 'Legal',
      title: 'Privacy Policy',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Greenacres Walkerville Catholic Parish is committed to '
            'protecting the personal information of parishioners and '
            'website visitors in accordance with the Privacy Act 1988 '
            '(Cth) and the Australian Privacy Principles (APPs).',
            style: bodyStyle,
          ),
          const SizedBox(height: 24),

          // ── 1. Information We Collect ───────────────────────────
          Text('1. Information We Collect', style: headingStyle),
          const SizedBox(height: 8),
          Text(
            'When you use the "Send a Message" form on our Contact page, '
            'we collect your name, email address (optional), and the '
            'content of your message. This information is transmitted '
            'directly to the parish office email via your device\'s '
            'mail application; it is not stored on this website.',
            style: bodyStyle,
          ),
          const SizedBox(height: 16),

          // ── 2. Purpose of Collection ───────────────────────────
          Text('2. Purpose of Collection', style: headingStyle),
          const SizedBox(height: 8),
          Text(
            'Personal information collected through the contact form '
            'is used solely to respond to your enquiry or request. '
            'We do not use this information for marketing, '
            'analytics, or any secondary purpose.',
            style: bodyStyle,
          ),
          const SizedBox(height: 16),

          // ── 3. No Data Stored on This Website ──────────────────
          Text('3. Data Storage', style: headingStyle),
          const SizedBox(height: 8),
          Text(
            'This website does not store personal information in '
            'databases, cookies, or local storage. Prayer intentions '
            'displayed on the Prayer Wall are pre-seeded sample '
            'entries; public submission of prayer intentions is '
            'currently disabled.',
            style: bodyStyle,
          ),
          const SizedBox(height: 16),

          // ── 4. Third-Party Services ────────────────────────────
          Text('4. Third-Party Services', style: headingStyle),
          const SizedBox(height: 8),
          Text(
            'This website embeds a Google Maps view of our church '
            'locations. When you view the map, your IP address and '
            'device information may be transmitted to Google LLC '
            '(headquartered in the United States). Google\'s privacy '
            'policy applies to that data: '
            'https://policies.google.com/privacy',
            style: bodyStyle,
          ),
          const SizedBox(height: 16),

          // ── 5. Cross-Border Disclosure ─────────────────────────
          Text('5. Cross-Border Disclosure (APP 8)', style: headingStyle),
          const SizedBox(height: 8),
          Text(
            'The Google Maps embed described in section 4 constitutes '
            'a cross-border disclosure of limited personal information '
            '(IP address) to the United States. No other personal '
            'information is disclosed to overseas recipients.',
            style: bodyStyle,
          ),
          const SizedBox(height: 16),

          // ── 6. Your Rights ─────────────────────────────────────
          Text('6. Access and Correction', style: headingStyle),
          const SizedBox(height: 8),
          Text(
            'You may request access to, or correction of, any '
            'personal information held about you by contacting the '
            'parish office.',
            style: bodyStyle,
          ),
          const SizedBox(height: 16),

          // ── 7. Contact ─────────────────────────────────────────
          Text('7. Contact', style: headingStyle),
          const SizedBox(height: 8),
          Text(
            'For privacy enquiries, please contact:\n\n'
            'Greenacres Walkerville Catholic Parish\n'
            'PO Box 42, Greenacres SA 5086\n'
            'Phone: (08) 8261 6200\n'
            'Email: office@gwparish.org.au',
            style: bodyStyle,
          ),
          const SizedBox(height: 24),
          Text(
            'Last updated: February 2026',
            style: theme.textTheme.bodySmall,
          ),
        ],
      ),
    );
  }
}
