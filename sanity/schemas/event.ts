import { defineField, defineType } from 'sanity';

export default defineType({
    name: 'event',
    title: 'Event',
    type: 'document',
    fields: [
        defineField({ name: 'title', title: 'Title', type: 'string', validation: r => r.required() }),
        defineField({ name: 'dateTime', title: 'Date & Time', type: 'datetime', validation: r => r.required() }),
        defineField({ name: 'endDateTime', title: 'End Date & Time', type: 'datetime' }),
        defineField({ name: 'location', title: 'Location', type: 'string' }),
        defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'string',
            options: { list: ['Liturgical', 'Community', 'School', 'Sacramental'] },
            initialValue: 'Community',
        }),
        defineField({ name: 'registrationEnabled', title: 'Enable registration', type: 'boolean', initialValue: false }),
        defineField({
            name: 'maxCapacity',
            title: 'Max capacity',
            type: 'number',
            hidden: ({ parent }) => !(parent as { registrationEnabled?: boolean })?.registrationEnabled,
        }),
        defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
    ],
    orderings: [{ title: 'Date', name: 'dateAsc', by: [{ field: 'dateTime', direction: 'asc' }] }],
    preview: { select: { title: 'title', subtitle: 'dateTime', media: 'image' } },
});
