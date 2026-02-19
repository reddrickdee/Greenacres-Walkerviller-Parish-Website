import { Outlet, Link } from 'react-router-dom';

export function RootLayout() {
    return (
        <>
            {/* Navigation - Minimalist, overlapping layout */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6 mix-blend-difference text-white flex justify-between items-center pointer-events-none">
                <Link to="/" className="font-display font-semibold tracking-widest text-sm uppercase pointer-events-auto">
                    Greenacres Walkerville
                </Link>
                <div className="flex gap-6 lg:gap-8 text-[10px] lg:text-xs font-display tracking-widest uppercase pointer-events-auto items-center">
                    <Link to="/about" className="hover:text-parish-accent transition-colors hidden md:block">About</Link>
                    <Link to="/history" className="hover:text-parish-accent transition-colors hidden md:block">History</Link>
                    <Link to="/mass-times" className="hover:text-parish-accent transition-colors">Mass Times</Link>
                    <Link to="/sacraments" className="hover:text-parish-accent transition-colors hidden md:block">Sacraments</Link>
                    <Link to="/news-events" className="hover:text-parish-accent transition-colors hidden py-1 md:block">News & Events</Link>
                    <Link to="/contact" className="hover:text-parish-accent transition-colors">Contact</Link>
                    <Link to="/new-here" className="border border-white/30 px-4 py-2 hover:border-parish-accent hover:text-parish-accent transition-all rounded-full hidden sm:block">I'm New Here</Link>
                </div>
            </nav>

            {/* Main Content */}
            <Outlet />

            {/* Footer */}
            <footer className="bg-[#1C1917] text-parish-muted py-24 px-8 md:px-24">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 justify-between">
                    <div>
                        <h4 className="font-display text-white text-3xl mb-6">Greenacres Walkerville Parish</h4>
                        <p className="font-serif italic text-xl max-w-sm">
                            A welcoming Catholic community living the Gospel in Adelaide's inner north.
                        </p>
                    </div>

                    <div className="flex gap-16 font-display tracking-widest text-xs uppercase text-white/70">
                        <div className="flex flex-col gap-4">
                            <Link to="/" className="hover:text-parish-accent transition-colors">Home</Link>
                            <Link to="/about" className="hover:text-parish-accent transition-colors">About Us</Link>
                            <Link to="/history" className="hover:text-parish-accent transition-colors">History</Link>
                            <Link to="/new-here" className="hover:text-parish-accent transition-colors">I'm New Here</Link>
                        </div>
                        <div className="flex flex-col gap-4">
                            <Link to="/mass-times" className="hover:text-parish-accent transition-colors">Mass Times</Link>
                            <Link to="/sacraments" className="hover:text-parish-accent transition-colors">Sacraments</Link>
                            <Link to="/news-events" className="hover:text-parish-accent transition-colors">News & Events</Link>
                            <Link to="/contact" className="hover:text-parish-accent transition-colors">Contact</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
