import { defineField, defineType } from 'sanity';

export default defineType({
    name: 'announcement',
    title: 'Announcement',
    type: 'document',
    fields: [
        defineField({ name: 'title', title: 'Title', type: 'string', validation: r => r.required() }),
        defineField({ name: 'body', title: 'Body', type: 'text', rows: 3 }),
        defineField({
            name: 'priority',
            title: 'Priority',
            type: 'string',
            options: { list: ['low', 'normal', 'high'] },
            initialValue: 'normal',
        }),
        defineField({ name: 'startDate', title: 'Start date', type: 'datetime' }),
        defineField({ name: 'endDate', title: 'End date', type: 'datetime' }),
        defineField({ name: 'dismissible', title: 'Dismissible', type: 'boolean', initialValue: true }),
    ],
    preview: { select: { title: 'title', subtitle: 'priority' } },
});
