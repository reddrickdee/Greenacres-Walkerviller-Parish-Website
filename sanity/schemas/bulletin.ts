import { defineField, defineType } from 'sanity';

export default defineType({
    name: 'bulletin',
    title: 'Bulletin',
    type: 'document',
    fields: [
        defineField({ name: 'title', title: 'Title', type: 'string', validation: r => r.required() }),
        defineField({ name: 'date', title: 'Date', type: 'date', validation: r => r.required() }),
        defineField({ name: 'coverImage', title: 'Cover image', type: 'image', options: { hotspot: true } }),
        defineField({ name: 'priestReflection', title: "Priest's reflection", type: 'array', of: [{ type: 'block' }] }),
        defineField({
            name: 'sections',
            title: 'Sections',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'heading', title: 'Heading', type: 'string' },
                        { name: 'body', title: 'Body', type: 'array', of: [{ type: 'block' }] },
                    ],
                    preview: { select: { title: 'heading' } },
                },
            ],
        }),
        defineField({ name: 'pdfUrl', title: 'PDF URL (optional)', type: 'url' }),
    ],
    orderings: [{ title: 'Newest', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] }],
    preview: { select: { title: 'title', subtitle: 'date', media: 'coverImage' } },
});
