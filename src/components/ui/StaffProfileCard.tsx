import { Mail } from 'lucide-react';

interface StaffProfileCardProps {
    name: string;
    role: string;
    imageUrl?: string;
    email?: string;
    bio?: string;
}

export function StaffProfileCard({ name, role, imageUrl, email, bio }: StaffProfileCardProps) {
    return (
        <div className="bg-parish-surface border border-parish-border/10 rounded-2xl p-6 text-center hover:border-parish-accent/30 hover:shadow-lg transition-all duration-300 group">
            {/* Profile image */}
            <div className="w-28 h-28 mx-auto mb-5 rounded-full overflow-hidden bg-parish-elevated border-2 border-parish-border/5 group-hover:border-parish-accent/20 transition-colors">
                {imageUrl ? (
                    <img src={imageUrl} alt={name} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-parish-muted font-display text-3xl uppercase">
                        {name.split(' ').map(n => n[0]).join('')}
                    </div>
                )}
            </div>

            {/* Info */}
            <h3 className="font-display text-xl text-parish-fg mb-1 group-hover:text-parish-accent transition-colors">{name}</h3>
            <p className="font-serif text-sm text-parish-accent italic mb-3">{role}</p>
            {bio && <p className="font-serif text-sm text-parish-muted leading-relaxed mb-4">{bio}</p>}

            {/* Contact */}
            {email && (
                <a
                    href={`mailto:${email}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-parish-accent/5 text-parish-accent font-display text-xs tracking-wider uppercase hover:bg-parish-accent/10 transition-colors no-underline"
                >
                    <Mail size={14} />
                    Contact
                </a>
            )}
        </div>
    );
}
