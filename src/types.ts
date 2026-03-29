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
    visitorInfo?: VisitorInfo;
}

export interface VisitorInfo {
    arrivalGuidance: string;
    whatToExpect: string;
    accessibilitySupport: string;
    contactPrompt: string;
    churches: VisitorChurchInfo[];
}

export interface VisitorChurchInfo {
    id: string;
    name: string;
    address: string;
    mapQuery: string;
    parkingSummary: string;
    accessibilitySummary: string;
    arrivalTip: string;
    weekendSummary: string;
    weekdaySummary: string;
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


