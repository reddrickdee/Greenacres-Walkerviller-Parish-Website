import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ContributorGuardProps {
    children: ReactNode;
}

export function ContributorGuard({ children }: ContributorGuardProps) {
    const { canAuthorMiniArticles, isLoading, session } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-parish-surface flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-2 border-parish-accent/30 border-t-parish-accent rounded-full animate-spin" />
                    <p className="font-display text-sm uppercase tracking-widest text-parish-muted">Verifying access…</p>
                </div>
            </div>
        );
    }

    if (!session || !canAuthorMiniArticles) {
        return <Navigate to="/community" replace />;
    }

    return <>{children}</>;
}
