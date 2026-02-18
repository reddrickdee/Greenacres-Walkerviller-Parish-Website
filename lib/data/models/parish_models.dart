import 'package:flutter/material.dart';

class ParishContent {
  const ParishContent({
    required this.lastVerified,
    required this.sources,
    required this.tagline,
    required this.parishName,
    required this.welcomeExcerpt,
    required this.parishPrayerText,
    required this.priestWelcome,
    required this.pastoralChairMessage,
    required this.visionStatement,
    required this.missionPoints,
    required this.councilMembers,
    required this.newsItems,
    required this.eventItems,
    required this.massSchedule,
    required this.sacraments,
    required this.communityServices,
    required this.faithFormation,
    required this.volunteerInfo,
    required this.newHereSteps,
    required this.historyMilestones,
    required this.contact,
    required this.schools,
    required this.refurbishmentImages,
    this.sacramentalJourneys = const [],
    this.homilyRecordings = const [],
  });

  final String lastVerified;
  final List<String> sources;
  final String tagline;
  final String parishName;
  final String welcomeExcerpt;
  final String parishPrayerText;
  final String priestWelcome;
  final String pastoralChairMessage;
  final String visionStatement;
  final List<MissionPoint> missionPoints;
  final List<CouncilMember> councilMembers;
  final List<NewsItem> newsItems;
  final List<EventItem> eventItems;
  final List<MassScheduleEntry> massSchedule;
  final List<SacramentInfo> sacraments;
  final List<String> communityServices;
  final List<String> faithFormation;
  final String volunteerInfo;
  final List<String> newHereSteps;
  final List<HistoryMilestone> historyMilestones;
  final ContactInfo contact;
  final List<SchoolInfo> schools;
  final List<String> refurbishmentImages;
  final List<SacramentalJourney> sacramentalJourneys;
  final List<HomilyRecording> homilyRecordings;

  factory ParishContent.fromJson(Map<String, dynamic> json) {
    return ParishContent(
      lastVerified: json['lastVerified'] as String,
      sources: List<String>.from(json['sources'] as List<dynamic>),
      tagline: json['tagline'] as String,
      parishName: json['parishName'] as String,
      welcomeExcerpt: json['welcomeExcerpt'] as String,
      parishPrayerText: json['parishPrayerText'] as String,
      priestWelcome: json['priestWelcome'] as String,
      pastoralChairMessage: json['pastoralChairMessage'] as String,
      visionStatement: json['visionStatement'] as String,
      missionPoints: (json['missionPoints'] as List<dynamic>)
          .map((item) => MissionPoint.fromJson(item as Map<String, dynamic>))
          .toList(),
      councilMembers: (json['councilMembers'] as List<dynamic>)
          .map((item) => CouncilMember.fromJson(item as Map<String, dynamic>))
          .toList(),
      newsItems: (json['newsItems'] as List<dynamic>)
          .map((item) => NewsItem.fromJson(item as Map<String, dynamic>))
          .toList(),
      eventItems: (json['eventItems'] as List<dynamic>)
          .map((item) => EventItem.fromJson(item as Map<String, dynamic>))
          .toList(),
      massSchedule: (json['massSchedule'] as List<dynamic>)
          .map(
            (item) => MassScheduleEntry.fromJson(item as Map<String, dynamic>),
          )
          .toList(),
      sacraments: (json['sacraments'] as List<dynamic>)
          .map((item) => SacramentInfo.fromJson(item as Map<String, dynamic>))
          .toList(),
      communityServices: List<String>.from(
        json['communityServices'] as List<dynamic>,
      ),
      faithFormation: List<String>.from(
        json['faithFormation'] as List<dynamic>,
      ),
      volunteerInfo: json['volunteerInfo'] as String,
      newHereSteps: List<String>.from(json['newHereSteps'] as List<dynamic>),
      historyMilestones: (json['historyMilestones'] as List<dynamic>)
          .map(
            (item) => HistoryMilestone.fromJson(item as Map<String, dynamic>),
          )
          .toList(),
      contact: ContactInfo.fromJson(json['contact'] as Map<String, dynamic>),
      schools: (json['schools'] as List<dynamic>)
          .map((item) => SchoolInfo.fromJson(item as Map<String, dynamic>))
          .toList(),
      refurbishmentImages: List<String>.from(
        json['refurbishmentImages'] as List<dynamic>,
      ),
      sacramentalJourneys: (json['sacramentalJourneys'] as List<dynamic>?)
              ?.map((item) => SacramentalJourney.fromJson(
                    item as Map<String, dynamic>,
                  ))
              .toList() ??
          const [],
      homilyRecordings: (json['homilyRecordings'] as List<dynamic>?)
              ?.map((item) =>
                  HomilyRecording.fromJson(item as Map<String, dynamic>))
              .toList() ??
          const [],
    );
  }
}

class MissionPoint {
  const MissionPoint({required this.title});

  final String title;

  factory MissionPoint.fromJson(Map<String, dynamic> json) {
    return MissionPoint(title: json['title'] as String);
  }
}

class CouncilMember {
  const CouncilMember({
    required this.name,
    required this.role,
    required this.bio,
    required this.photoAsset,
  });

  final String name;
  final String role;
  final String bio;
  final String photoAsset;

  factory CouncilMember.fromJson(Map<String, dynamic> json) {
    return CouncilMember(
      name: json['name'] as String,
      role: json['role'] as String,
      bio: json['bio'] as String,
      photoAsset: json['photoAsset'] as String,
    );
  }
}

class MassScheduleEntry {
  const MassScheduleEntry({
    required this.id,
    required this.church,
    required this.address,
    required this.dayOfWeek,
    required this.startTime,
    required this.type,
    this.notes,
    this.durationMinutes = 60,
  });

  final String id;
  final String church;
  final String address;
  final int dayOfWeek;
  final String startTime;
  final String type;
  final String? notes;
  final int durationMinutes;

  factory MassScheduleEntry.fromJson(Map<String, dynamic> json) {
    return MassScheduleEntry(
      id: json['id'] as String,
      church: json['church'] as String,
      address: json['address'] as String,
      dayOfWeek: json['dayOfWeek'] as int,
      startTime: json['startTime'] as String,
      type: json['type'] as String,
      notes: json['notes'] as String?,
      durationMinutes: json['durationMinutes'] as int? ?? 60,
    );
  }
}

class SacramentInfo {
  const SacramentInfo({required this.title, required this.details});

  final String title;
  final String details;

  factory SacramentInfo.fromJson(Map<String, dynamic> json) {
    return SacramentInfo(
      title: json['title'] as String,
      details: json['details'] as String,
    );
  }
}

class HistoryMilestone {
  const HistoryMilestone({required this.year, required this.description});

  final String year;
  final String description;

  factory HistoryMilestone.fromJson(Map<String, dynamic> json) {
    return HistoryMilestone(
      year: json['year'] as String,
      description: json['description'] as String,
    );
  }
}

class NewsItem {
  const NewsItem({
    required this.title,
    required this.summary,
    required this.url,
    this.imageAsset,
  });

  final String title;
  final String summary;
  final String url;
  final String? imageAsset;

  factory NewsItem.fromJson(Map<String, dynamic> json) {
    return NewsItem(
      title: json['title'] as String,
      summary: json['summary'] as String,
      url: json['url'] as String,
      imageAsset: json['imageAsset'] as String?,
    );
  }
}

class Bulletin {
  const Bulletin({
    required this.date,
    required this.priestReflection,
    required this.sections,
    this.coverImage,
  });

  final String date;
  final String priestReflection;
  final List<BulletinSection> sections;
  final String? coverImage;

  factory Bulletin.fromJson(Map<String, dynamic> json) {
    return Bulletin(
      date: json['date'] as String,
      priestReflection: json['priestReflection'] as String,
      coverImage: json['coverImage'] as String?,
      sections: (json['sections'] as List<dynamic>)
          .map((item) => BulletinSection.fromJson(item as Map<String, dynamic>))
          .toList(),
    );
  }
}

class BulletinSection {
  const BulletinSection({
    required this.title,
    required this.content,
    this.imageAsset,
    this.imageFocalPoint = Alignment.center,
  });

  final String title;
  final String content;
  final String? imageAsset;
  final Alignment imageFocalPoint;

  factory BulletinSection.fromJson(Map<String, dynamic> json) {
    return BulletinSection(
      title: json['title'] as String,
      content: json['content'] as String,
      imageAsset: json['imageAsset'] as String?,
      imageFocalPoint: _parseImageFocalPoint(json['imageFocalPoint']),
    );
  }

  static Alignment _parseImageFocalPoint(Object? raw) {
    if (raw is! Map<String, dynamic>) {
      return Alignment.center;
    }

    final x = (raw['x'] as num?)?.toDouble();
    final y = (raw['y'] as num?)?.toDouble();
    if (x == null || y == null) {
      return Alignment.center;
    }

    return Alignment(_clampToAlignmentRange(x), _clampToAlignmentRange(y));
  }

  static double _clampToAlignmentRange(double value) {
    return value.clamp(-1.0, 1.0).toDouble();
  }
}

class NewsletterArchive {
  const NewsletterArchive({
    required this.lastVerified,
    required this.source,
    required this.items,
  });

  final String lastVerified;
  final String source;
  final List<NewsletterItem> items;

  factory NewsletterArchive.fromJson(Map<String, dynamic> json) {
    return NewsletterArchive(
      lastVerified: json['lastVerified'] as String,
      source: json['source'] as String,
      items: (json['items'] as List<dynamic>)
          .map((item) => NewsletterItem.fromJson(item as Map<String, dynamic>))
          .toList(),
    );
  }

  /// Look up a newsletter item by its stable slug id.
  NewsletterItem? findById(String id) {
    for (final item in items) {
      if (item.id == id) return item;
    }
    return null;
  }
}

class NewsletterItem {
  const NewsletterItem({
    required this.id,
    required this.title,
    required this.url,
    required this.isCurrent,
    this.nativeBulletin,
  });

  final String id;
  final String title;
  final String url;
  final bool isCurrent;
  final Bulletin? nativeBulletin;

  factory NewsletterItem.fromJson(Map<String, dynamic> json) {
    final nativeJson = json['nativeBulletin'] as Map<String, dynamic>?;
    return NewsletterItem(
      id: json['id'] as String,
      title: json['title'] as String,
      url: json['url'] as String,
      isCurrent: json['isCurrent'] as bool,
      nativeBulletin: nativeJson != null ? Bulletin.fromJson(nativeJson) : null,
    );
  }
}

class EventItem {
  const EventItem({
    required this.title,
    required this.dateLabel,
    required this.description,
  });

  final String title;
  final String dateLabel;
  final String description;

  factory EventItem.fromJson(Map<String, dynamic> json) {
    return EventItem(
      title: json['title'] as String,
      dateLabel: json['dateLabel'] as String,
      description: json['description'] as String,
    );
  }
}

class ContactInfo {
  const ContactInfo({
    required this.address,
    required this.postalAddress,
    required this.phone,
    required this.email,
    required this.officeHours,
    required this.stMonicaQuery,
    required this.stMartinQuery,
  });

  final String address;
  final String postalAddress;
  final String phone;
  final String email;
  final String officeHours;
  final String stMonicaQuery;
  final String stMartinQuery;

  factory ContactInfo.fromJson(Map<String, dynamic> json) {
    return ContactInfo(
      address: json['address'] as String,
      postalAddress: json['postalAddress'] as String,
      phone: json['phone'] as String,
      email: json['email'] as String,
      officeHours: json['officeHours'] as String,
      stMonicaQuery: json['stMonicaQuery'] as String,
      stMartinQuery: json['stMartinQuery'] as String,
    );
  }
}

class SchoolInfo {
  const SchoolInfo({
    required this.name,
    required this.address,
    required this.principal,
    required this.phone,
    required this.website,
  });

  final String name;
  final String address;
  final String principal;
  final String phone;
  final String website;

  factory SchoolInfo.fromJson(Map<String, dynamic> json) {
    return SchoolInfo(
      name: json['name'] as String,
      address: json['address'] as String,
      principal: json['principal'] as String,
      phone: json['phone'] as String,
      website: json['website'] as String,
    );
  }
}

class PrayerIntention {
  PrayerIntention({
    required this.id,
    required this.text,
    required this.submitted,
    this.prayerCount = 0,
  });

  final String id;
  final String text;
  final DateTime submitted;
  int prayerCount;
}

// ── Sacramental Journey models ──────────────────────────────

class SacramentalJourney {
  const SacramentalJourney({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.intro,
    required this.steps,
    this.ctaLabel,
    this.ctaRoute,
  });

  final String id;
  final String title;
  final String subtitle;
  final String intro;
  final List<JourneyStep> steps;
  final String? ctaLabel;
  final String? ctaRoute;

  factory SacramentalJourney.fromJson(Map<String, dynamic> json) {
    return SacramentalJourney(
      id: json['id'] as String,
      title: json['title'] as String,
      subtitle: json['subtitle'] as String? ?? '',
      intro: json['intro'] as String? ?? '',
      steps: (json['steps'] as List<dynamic>)
          .map((s) => JourneyStep.fromJson(s as Map<String, dynamic>))
          .toList(),
      ctaLabel: json['ctaLabel'] as String?,
      ctaRoute: json['ctaRoute'] as String?,
    );
  }
}

class JourneyStep {
  const JourneyStep({
    required this.id,
    required this.phaseLabel,
    required this.title,
    required this.details,
    this.prerequisites = const [],
    this.meetingLabel,
  });

  final String id;
  final String phaseLabel;
  final String title;
  final String details;
  final List<String> prerequisites;
  final String? meetingLabel;

  factory JourneyStep.fromJson(Map<String, dynamic> json) {
    return JourneyStep(
      id: json['id'] as String,
      phaseLabel: json['phaseLabel'] as String,
      title: json['title'] as String,
      details: json['details'] as String,
      prerequisites: (json['prerequisites'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
      meetingLabel: json['meetingLabel'] as String?,
    );
  }
}

// ── Homily Recording model ──────────────────────────────────

class HomilyRecording {
  const HomilyRecording({
    required this.id,
    required this.title,
    required this.speaker,
    required this.dateIso,
    required this.audioUrl,
    required this.durationLabel,
    this.summary = '',
  });

  final String id;
  final String title;
  final String speaker;
  final String dateIso;
  final String audioUrl;
  final String durationLabel;
  final String summary;

  factory HomilyRecording.fromJson(Map<String, dynamic> json) {
    return HomilyRecording(
      id: json['id'] as String,
      title: json['title'] as String,
      speaker: json['speaker'] as String,
      dateIso: json['dateIso'] as String,
      audioUrl: json['audioUrl'] as String,
      durationLabel: json['durationLabel'] as String,
      summary: json['summary'] as String? ?? '',
    );
  }
}
