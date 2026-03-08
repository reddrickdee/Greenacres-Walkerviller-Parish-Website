interface FormErrorSummaryProps {
    /** Map of field id → error message, or an array of error strings. */
    errors: Record<string, string> | string[];
    /** Additional class on the wrapper. */
    className?: string;
}

/**
 * Accessible error summary displayed at the top of a form.
 *
 * Renders nothing when there are no errors.
 */
export function FormErrorSummary({ errors, className = '' }: FormErrorSummaryProps) {
    const messages = Array.isArray(errors)
        ? errors.filter(Boolean)
        : Object.values(errors).filter(Boolean);

    if (messages.length === 0) return null;

    return (
        <div
            role="alert"
            className={`rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500 ${className}`.trim()}
        >
            <p className="font-semibold">Please fix the following:</p>
            <ul className="mt-1 list-disc pl-4 space-y-0.5">
                {messages.map((msg, i) => (
                    <li key={i}>{msg}</li>
                ))}
            </ul>
        </div>
    );
}
