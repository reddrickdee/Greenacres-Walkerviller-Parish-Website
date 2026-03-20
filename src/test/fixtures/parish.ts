import type {
    ParishContent,
    MassScheduleEntry,
    ContactInfo,
    NewsItem,
    EventItem,
    SacramentInfo,
    HistoryMilestone,
    MissionPoint,
    CouncilMember,
    SchoolInfo,
    SacramentalJourney,
    HomilyRecording,
    NewsletterArchive,
} from '../../types';

// ── Atomic builders ──────────────────────────────────────────────────────────

export function buildMassEntry(overrides: Partial<MassScheduleEntry> = {}): MassScheduleEntry {
    return {
        id: 'mass-1',
        church: "St Monica's Walkerville",
        address: '90 North East Road, Walkerville',
        dayOfWeek: 7, // Saturday
        startTime: '18:00',
        type: 'Vigil Mass',
        durationMinutes: 60,
        ...overrides,
    };
}

export function buildContact(overrides: Partial<ContactInfo> = {}): ContactInfo {
    return {
        address: '90 North East Road, Walkerville SA 5081',
        postalAddress: 'PO Box 1, Walkerville SA 5081',
        phone: '08 8344 3562',
        email: 'gw@parish.test',
        officeHours: 'Mon–Fri 9am–3pm',
        stMonicaQuery: "St+Monica's+Walkerville",
        stMartinQuery: "St+Martin's+Greenacres",
        ...overrides,
    };
}

export function buildNewsItem(overrides: Partial<NewsItem> = {}): NewsItem {
    return {
        title: 'Parish Update',
        summary: 'A summary of recent parish news.',
        url: '/news/update',
        ...overrides,
    };
}

export function buildEventItem(overrides: Partial<EventItem> = {}): EventItem {
    return {
        title: 'Community Lunch',
        dateLabel: 'Sunday 2 March 2026',
        description: 'A shared meal after 9:30am Mass.',
        ...overrides,
    };
}

// ── Composite builder ────────────────────────────────────────────────────────

/**
 * Builds a full `ParishContent` object with sensible test defaults.
 * Pass partial overrides to customise specific fields.
 */
export function buildParishContent(overrides: Partial<ParishContent> = {}): ParishContent {
    return {
        lastVerified: '2026-03-01',
        sources: ['test'],
        tagline: 'In the footsteps of Jesus',
        parishName: 'Greenacres Walkerville Catholic Parish',
        welcomeExcerpt: 'Welcome to our parish.',
        parishPrayerText: 'Lord, guide us.',
        priestWelcome: 'Dear friends, welcome.',
        pastoralChairMessage: 'Together we grow.',
        visionStatement: 'A welcoming Catholic community.',
        missionPoints: [{ title: 'Worship' }, { title: 'Service' }] as MissionPoint[],
        councilMembers: [] as CouncilMember[],
        newsItems: [buildNewsItem()],
        eventItems: [buildEventItem()],
        massSchedule: [
            buildMassEntry(),
            buildMassEntry({
                id: 'mass-2',
                church: "St Martin's Greenacres",
                address: 'Cnr Muller & Hampstead Rds, Greenacres',
                dayOfWeek: 1, // Sunday
                startTime: '09:30',
                type: 'Sunday Mass',
            }),
        ],
        sacraments: [{ title: 'Baptism', details: 'Contact the office.' }] as SacramentInfo[],
        communityServices: ['St Vinnies', 'Music Ministry'],
        faithFormation: ['RCIA', 'Bible Study'],
        volunteerInfo: 'Email the office to get involved.',
        newHereSteps: ['Come to Mass', 'Say hello', 'Join a group'],
        historyMilestones: [{ year: '1959', description: 'Parish founded.' }] as HistoryMilestone[],
        contact: buildContact(),
        schools: [] as SchoolInfo[],
        refurbishmentImages: [],
        sacramentalJourneys: [] as SacramentalJourney[],
        homilyRecordings: [] as HomilyRecording[],
        ...overrides,
    };
}

// ── Newsletter fixture ───────────────────────────────────────────────────────

export function buildNewsletterArchive(overrides: Partial<NewsletterArchive> = {}): NewsletterArchive {
    return {
        lastVerified: '2026-03-01',
        source: 'test',
        items: [],
        ...overrides,
    };
}
