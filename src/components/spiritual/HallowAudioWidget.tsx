interface HallowAudioWidgetProps {
    language?: string;
    size?: 'small' | 'large';
}

export function HallowAudioWidget({ language = 'en', size = 'large' }: HallowAudioWidgetProps) {
    // Determine height based on logical sizing, you can adjust these based on Hallow's actual widget dimensions 
    const height = size === 'large' ? '180px' : '90px';

    return (
        <div className="w-full overflow-hidden rounded-xl border border-parish-warm-border bg-white shadow-sm">
            <div className="p-4 bg-parish-sand/30 border-b border-parish-warm-border flex justify-between items-center">
                <h3 className="font-heading font-semibold text-parish-accent flex items-center gap-2">
                    <span>Daily Gospel Reading</span>
                </h3>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Powered by Hallow</span>
            </div>
            <div className="relative w-full" style={{ height }}>
                <iframe
                    src={`https://hallow.com/embed/daily-gospel?lang=${language}`}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    lang={language}
                    title="Hallow Daily Gospel Audio Player"
                    className="absolute top-0 left-0"
                />
            </div>
        </div>
    );
}
