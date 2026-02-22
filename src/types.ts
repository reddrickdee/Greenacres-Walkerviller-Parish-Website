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
    firstReadingHtml?: string;
    psalmHtml?: string;
    secondReadingHtml?: string;
    gospelAcclamationHtml?: string;
    gospelHtml?: string;
    sequence?: string;
    // Structured Reflection
    reflectionContext?: string;
    reflectionBody?: string;
    reflectionPrayer?: string;
    reflectionAuthor?: string;
}

// ── Community Hub Models ─────────────────────────────────────────────────────

export type CommunityPostType = 'prayer_request' | 'words_of_hope' | 'mini_article' | 'suggestion';
export type CommunityStatus = 'pending' | 'approved' | 'rejected' | 'escalated';
export type CommunityVisibility = 'public' | 'admin_private';
export type IntentionKind = 'ill' | 'deceased' | 'general';
export type WeeklyBatchStatus = 'draft' | 'finalized';

export interface CommunityProfile {
    id: string;
    firstName: string | null;
    lastName: string | null;
    role: 'user' | 'admin';
    createdAt: string;
    updatedAt: string;
}

export interface CommunityPost {
    id: string;
    authorId: string;
    postType: CommunityPostType;
    status: CommunityStatus;
    visibility: CommunityVisibility;
    title?: string;
    content: string;
    isAnonymous: boolean;
    intentionType: IntentionKind;
    intentionName?: string;
    createdAt: string;
    updatedAt: string;

    // Joined data
    author?: CommunityProfile;
    images?: CommunityPostImage[];
    prayers?: CommunityPrayer[];
    prayerCount?: number;
    comments?: CommunityComment[];
    hasPrayed?: boolean;
}

export interface CommunityPostImage {
    id: string;
    postId: string;
    storagePath: string;
    bucketId: string;
    displayOrder: number;
    createdAt: string;
    // For UI convenience
    publicUrl?: string;
}

export interface CommunityComment {
    id: string;
    postId: string;
    authorId: string;
    content: string;
    status: CommunityStatus;
    createdAt: string;
    updatedAt: string;

    // Joined data
    author?: CommunityProfile;
}

export interface CommunityPrayer {
    id: string;
    postId: string;
    userId: string;
    createdAt: string;
}

export interface WeeklyIntentionBatch {
    id: string;
    title: string;
    targetDate: string;
    status: WeeklyBatchStatus;
    createdBy?: string;
    createdAt: string;
    updatedAt: string;

    // Joined data
    items?: WeeklyIntentionItem[];
}

export interface WeeklyIntentionItem {
    id: string;
    batchId: string;
    postId?: string;
    intentionType: IntentionKind;
    name: string;
    sortOrder: number;
    createdAt: string;
}

export interface ModerationEvent {
    id: string;
    adminId?: string;
    targetType: 'post' | 'comment' | 'image';
    targetId: string;
    previousStatus?: string;
    newStatus: string;
    reason?: string;
    createdAt: string;
}
