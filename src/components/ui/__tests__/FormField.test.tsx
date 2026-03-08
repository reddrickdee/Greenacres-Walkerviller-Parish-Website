import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FormField } from '../FormField';

describe('FormField', () => {
    it('associates label with input via htmlFor', () => {
        render(
            <FormField id="email" label="Email address">
                <input id="email" />
            </FormField>,
        );

        const label = screen.getByText('Email address');
        expect(label).toHaveAttribute('for', 'email');
    });

    it('renders required indicator when required is true', () => {
        render(
            <FormField id="name" label="Full name" required>
                <input id="name" />
            </FormField>,
        );

        const asterisk = screen.getByText('*');
        expect(asterisk).toHaveAttribute('aria-hidden', 'true');
    });

    it('does not render error paragraph when no error', () => {
        render(
            <FormField id="phone" label="Phone">
                <input id="phone" />
            </FormField>,
        );

        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('renders error message with correct id and role', () => {
        render(
            <FormField id="email" label="Email" error="Email is required">
                <input id="email" aria-describedby="email-error" />
            </FormField>,
        );

        const error = screen.getByRole('alert');
        expect(error).toHaveTextContent('Email is required');
        expect(error).toHaveAttribute('id', 'email-error');
    });

    it('wires aria-describedby between input and error', () => {
        render(
            <FormField id="amount" label="Amount" error="Required">
                <input id="amount" aria-describedby="amount-error" />
            </FormField>,
        );

        const input = screen.getByRole('textbox');
        const error = screen.getByRole('alert');

        expect(input).toHaveAttribute('aria-describedby', 'amount-error');
        expect(error.id).toBe('amount-error');
    });
});
