import { defineField, defineType } from 'sanity';

export default defineType({
    name: 'galleryAlbum',
    title: 'Gallery Album',
    type: 'document',
    fields: [
        defineField({ name: 'title', title: 'Title', type: 'string', validation: r => r.required() }),
        defineField({ name: 'date', title: 'Date', type: 'date' }),
        defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
        defineField({ name: 'coverImage', title: 'Cover image', type: 'image', options: { hotspot: true } }),
        defineField({
            name: 'images',
            title: 'Images',
            type: 'array',
            of: [
                {
                    type: 'image',
                    options: { hotspot: true },
                    fields: [
                        { name: 'alt', title: 'Alt text', type: 'string', validation: r => r.required() },
                        { name: 'caption', title: 'Caption', type: 'string' },
                    ],
                },
            ],
        }),
    ],
    preview: { select: { title: 'title', subtitle: 'date', media: 'coverImage' } },
});
