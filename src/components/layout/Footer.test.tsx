// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { ReactElement } from 'react';

import { Footer } from './Footer';

/* ------------------------------------------------------------------ */
/*  Footer carries statutory parish content and the contentinfo        */
/*  landmark. It uses react-router <Link>, so it needs a Router.        */
/* ------------------------------------------------------------------ */

function renderInRouter(ui: ReactElement) {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
}

afterEach(() => {
    cleanup();
});

describe('Footer — contentinfo landmark', () => {
    // Validates: Requirements 2.7
    it('renders exactly one contentinfo landmark', () => {
        renderInRouter(<Footer />);
        expect(screen.getAllByRole('contentinfo').length).toBe(1);
    });
});

describe('Footer — statutory content preserved', () => {
    // Validates: Requirements 2.7 (preservation — Requirements 6.8)
    it('preserves the child safeguarding contacts', () => {
        renderInRouter(<Footer />);
        expect(screen.getByText(/child abuse report line/i)).toBeTruthy();
        expect(screen.getByText(/13 14 78/)).toBeTruthy();
        expect(screen.getByText(/archdiocese office/i)).toBeTruthy();
    });

    // Validates: Requirements 2.7 (preservation — Requirements 6.8)
    it('preserves the Kaurna acknowledgement', () => {
        renderInRouter(<Footer />);
        expect(screen.getByText(/kaurna people/i)).toBeTruthy();
    });
});

describe('Footer — social links expose accessible names', () => {
    // Validates: Requirements 2.7
    it('the email and phone social links have accessible names', () => {
        renderInRouter(<Footer />);
        expect(screen.getByRole('link', { name: /email/i })).toBeTruthy();
        expect(screen.getByRole('link', { name: /phone/i })).toBeTruthy();
    });
});
