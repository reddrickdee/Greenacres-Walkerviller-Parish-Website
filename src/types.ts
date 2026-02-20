// ── Parish Content Models ────────────────────────────────────────────────────
// Ported from lib/data/models/parish_models.dart

export interface ParishContent {
    lastVerified: string;
    sources: string[];
    tagline: string;
    parishName: string;
    welcomeExcerpt: string;
    parishPrayerText: string;
    priestWelcome: string;
    pastoralChairMessage: string;
    visionStatement: string;
    missionPoints: MissionPoint[];
    councilMembers: CouncilMember[];
    newsItems: NewsItem[];
    eventItems: EventItem[];
    massSchedule: MassScheduleEntry[];
    sacraments: SacramentInfo[];
    communityServices: string[];
    faithFormation: string[];
    volunteerInfo: string;
    newHereSteps: string[];
    historyMilestones: HistoryMilestone[];
    contact: ContactInfo;
    schools: SchoolInfo[];
    refurbishmentImages: string[];
    sacramentalJourneys: SacramentalJourney[];
    homilyRecordings: HomilyRecording[];
}

export interface MissionPoint {
    title: string;
}

export interface CouncilMember {
    name: string;
    role: string;
    bio: string;
    photoAsset: string;
}

export interface MassScheduleEntry {
    id: string;
    church: string;
    address: string;
    dayOfWeek: number;
    startTime: string;
    type: string;
    notes?: string;
    durationMinutes: number;
}

export interface SacramentInfo {
    title: string;
    details: string;
}

export interface HistoryMilestone {
    year: string;
    description: string;
}

export interface NewsItem {
    title: string;
    summary: string;
    url: string;
    imageAsset?: string;
}

export interface EventItem {
    title: string;
    dateLabel: string;
    description: string;
}

export interface ContactInfo {
    address: string;
    postalAddress: string;
    phone: string;
    email: string;
    officeHours: string;
    stMonicaQuery: string;
    stMartinQuery: string;
}

export interface SchoolInfo {
    name: string;
    address: string;
    principal: string;
    phone: string;
    website: string;
}

export interface PrayerIntention {
    id: string;
    text: string;
    submitted: Date;
    prayerCount: number;
}

// ── Sacramental Journey ──────────────────────────────────────────────────────

export interface SacramentalJourney {
    id: string;
    title: string;
    subtitle: string;
    intro: string;
    steps: JourneyStep[];
    ctaLabel?: string;
    ctaRoute?: string;
}

export interface JourneyStep {
    id: string;
    phaseLabel: string;
    title: string;
    details: string;
    prerequisites: string[];
    meetingLabel?: string;
}

// ── Homily Recording ─────────────────────────────────────────────────────────

export interface HomilyRecording {
    id: string;
    title: string;
    speaker: string;
    dateIso: string;
    audioUrl: string;
    durationLabel: string;
    summary: string;
}

// ── Newsletter Archive ───────────────────────────────────────────────────────

export interface NewsletterArchive {
    lastVerified: string;
    source: string;
    items: NewsletterItem[];
}

export interface NewsletterItem {
    id: string;
    title: string;
    url: string;
    isCurrent: boolean;
    nativeBulletin?: Bulletin;
}

export interface Bulletin {
    date: string;
    priestReflection: string;
    sections: BulletinSection[];
    coverImage?: string;
}

export interface BulletinSection {
    title: string;
    content: string;
    imageAsset?: string;
    imageFocalPoint?: { x: number; y: number };
}

export interface DailyReflection {
    id: string;
    date: string;
    liturgicalColor: string;
    title: string;
    // Readings
    firstReadingRef?: string;
    firstReadingText?: string;
    psalmRef?: string;
    psalmResponse?: string;
    psalmText?: string;
    secondReadingRef?: string;
    secondReadingText?: string;
    gospelAcclamation?: string;
    gospelRef?: string;
    gospelText?: string;
    sequence?: string;
    // Structured Reflection
    reflectionContext?: string;
    reflectionBody?: string;
    reflectionPrayer?: string;
    reflectionAuthor?: string;
}
