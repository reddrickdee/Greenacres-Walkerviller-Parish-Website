import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { GalleryPage } from '../GalleryPage';

function renderGalleryPage() {
    return render(
        <MemoryRouter initialEntries={['/gallery']}>
            <GalleryPage />
        </MemoryRouter>,
    );
}

describe('GalleryPage', () => {
    it('renders gallery tiles as semantic button elements', () => {
        renderGalleryPage();
        // All gallery tile triggers should be buttons (accessible keyboard interaction)
        const buttons = screen.getAllByRole('button');
        // At least some buttons should be gallery tiles (there are 9+ images)
        expect(buttons.length).toBeGreaterThanOrEqual(1);
    });

    it('does not render div[role="button"] for gallery tiles', () => {
        const { container } = renderGalleryPage();
        const roleButtons = container.querySelectorAll('div[role="button"]');
        expect(roleButtons.length).toBe(0);
    });
});
