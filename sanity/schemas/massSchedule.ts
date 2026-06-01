import { defineField, defineType } from 'sanity';

export default defineType({
    name: 'massSchedule',
    title: 'Mass Schedule',
    type: 'document',
    fields: [
        defineField({
            name: 'church',
            title: 'Church',
            type: 'string',
            options: { list: ["St Monica's Church", "St Martin's Church"] },
            validation: r => r.required(),
        }),
        defineField({
            name: 'dayOfWeek',
            title: 'Day of week (1 = Mon … 7 = Sun)',
            type: 'number',
            validation: r => r.required().min(1).max(7),
        }),
        defineField({ name: 'startTime', title: 'Start time (HH:MM)', type: 'string', validation: r => r.required() }),
        defineField({ name: 'type', title: 'Type', type: 'string' }),
        defineField({ name: 'notes', title: 'Notes', type: 'string' }),
        defineField({ name: 'isActive', title: 'Active', type: 'boolean', initialValue: true }),
    ],
    preview: { select: { title: 'church', subtitle: 'type' } },
});
