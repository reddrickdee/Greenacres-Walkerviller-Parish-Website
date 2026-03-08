import type { ReactNode } from 'react';

interface FormFieldProps {
    /** Unique identifier used for id/htmlFor/aria wiring. */
    id: string;
    /** Visible label text. */
    label: ReactNode;
    /** Optional field-level error message. */
    error?: string;
    /** Whether this field is required. */
    required?: boolean;
    /** The form control(s) to render. */
    children: ReactNode;
    /** Additional class on the wrapper. */
    className?: string;
}

/**
 * Accessible form field wrapper.
 *
 * Renders a `<label>` linked via `htmlFor`, the child control, and an
 * optional error message wired with `aria-describedby`.
 *
 * Children should use `id={id}` and `aria-describedby={id + '-error'}` when
 * this component passes an error.
 */
export function FormField({
    id,
    label,
    error,
    required,
    children,
    className = '',
}: FormFieldProps) {
    return (
        <div className={className}>
            <label
                htmlFor={id}
                className="ornamental-kicker mb-2 block text-[0.68rem]"
            >
                {label}
                {required && <span className="ml-1 text-parish-fg text-xs" aria-hidden="true">*</span>}
            </label>
            {children}
            {error && (
                <p
                    id={`${id}-error`}
                    role="alert"
                    className="mt-1.5 text-sm text-red-500"
                >
                    {error}
                </p>
            )}
        </div>
    );
}
