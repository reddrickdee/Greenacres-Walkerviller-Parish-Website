import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'bulletin',
  title: 'Weekly Bulletin',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g., CONNECTIONS 6TH SUNDAY EASTER',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Publication Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pdfFile',
      title: 'Bulletin PDF Upload',
      type: 'file',
      description: 'Upload the PDF version of the bulletin',
      options: {
        accept: '.pdf',
      },
    }),
    defineField({
      name: 'pdfUrl',
      title: 'External/Legacy PDF URL',
      type: 'string',
      description: 'Fallback URL if the PDF is hosted externally',
    }),
    defineField({
      name: 'isCurrent',
      title: 'Is Current Bulletin?',
      type: 'boolean',
      description: 'Set to true for the most recent weekly bulletin',
      initialValue: false,
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover/Featured Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'priestReflection',
      title: 'Priest\'s Weekly Reflection',
      type: 'text',
      description: 'The weekly spiritual reflection written by the Priest',
    }),
    defineField({
      name: 'sections',
      title: 'Bulletin Sections / Announcements',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'bulletinSection',
          title: 'Bulletin Section',
          fields: [
            defineField({
              name: 'title',
              title: 'Section Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'content',
              title: 'Section Content',
              type: 'text',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'image',
              title: 'Section Image',
              type: 'image',
              options: {
                hotspot: true,
              },
            }),
          ],
          preview: {
            select: {
              title: 'title',
              content: 'content',
              media: 'image',
            },
            prepare(selection) {
              const {title, content, media} = selection
              return {
                title: title,
                subtitle: content ? content.substring(0, 60) + '...' : '',
                media: media,
              }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      isCurrent: 'isCurrent',
      media: 'coverImage',
    },
    prepare(selection) {
      const {title, date, isCurrent, media} = selection
      return {
        title: title,
        subtitle: `${date || ''} ${isCurrent ? '★ Current' : ''}`,
        media: media,
      }
    },
  },
})
