import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FormErrorSummary } from '../FormErrorSummary';

describe('FormErrorSummary', () => {
    it('renders nothing when errors array is empty', () => {
        const { container } = render(<FormErrorSummary errors={[]} />);
        expect(container.firstChild).toBeNull();
    });

    it('renders nothing when errors record has no truthy values', () => {
        const { container } = render(
            <FormErrorSummary errors={{ name: '', email: '' }} />,
        );
        expect(container.firstChild).toBeNull();
    });

    it('renders error list from an array', () => {
        render(
            <FormErrorSummary errors={['Name is required', 'Email is required']} />,
        );

        const alert = screen.getByRole('alert');
        expect(alert).toBeInTheDocument();
        expect(screen.getByText('Name is required')).toBeInTheDocument();
        expect(screen.getByText('Email is required')).toBeInTheDocument();
    });

    it('renders error list from a record', () => {
        render(
            <FormErrorSummary
                errors={{ name: 'Required', amount: 'Must be positive' }}
            />,
        );

        const items = screen.getAllByRole('listitem');
        expect(items).toHaveLength(2);
        expect(items[0]).toHaveTextContent('Required');
        expect(items[1]).toHaveTextContent('Must be positive');
    });

    it('has role="alert" for screen reader announcement', () => {
        render(<FormErrorSummary errors={['Something went wrong']} />);
        expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('includes the "Please fix" heading', () => {
        render(<FormErrorSummary errors={['Field error']} />);
        expect(screen.getByText('Please fix the following:')).toBeInTheDocument();
    });
});
