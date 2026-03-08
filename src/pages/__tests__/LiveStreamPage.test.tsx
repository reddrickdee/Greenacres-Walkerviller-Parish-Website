import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LiveStreamPage } from '../LiveStreamPage';

function renderLiveStreamPage() {
    return render(
        <MemoryRouter initialEntries={['/live']}>
            <LiveStreamPage />
        </MemoryRouter>,
    );
}

describe('LiveStreamPage', () => {
    it('does not apply cursor-pointer to past recording cards with no videoId', () => {
        const { container } = renderLiveStreamPage();
        // Past recording cards with empty videoId should NOT have cursor-pointer
        const allElements = container.querySelectorAll('.cursor-pointer');
        // If any exist, verify they are not the past recording cards
        allElements.forEach((el) => {
            // Past recording cards should not be clickable
            const text = el.textContent ?? '';
            const isRecordingCard =
                text.includes('Sunday Mass') ||
                text.includes('Ash Wednesday') ||
                text.includes('Ordinary Time');
            if (isRecordingCard) {
                // This is a recording card with cursor-pointer — fail
                expect(el.classList.contains('cursor-pointer')).toBe(false);
            }
        });
    });

    it('shows stream schedule information', () => {
        renderLiveStreamPage();
        expect(screen.getByText(/Saturday Vigil Mass/i)).toBeInTheDocument();
        expect(screen.getAllByText(/Sunday Mass/i).length).toBeGreaterThanOrEqual(1);
    });
});
