import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'event',
  title: 'Parish Event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
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
      title: 'Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'time',
      title: 'Time',
      type: 'string',
      description: 'e.g., 9:30am or 7:00pm',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Mass', value: 'Mass'},
          {title: 'Sacrament', value: 'Sacrament'},
          {title: 'Devotion', value: 'Devotion'},
          {title: 'Meeting', value: 'Meeting'},
          {title: 'Youth', value: 'Youth'},
          {title: 'Community', value: 'Community'},
          {title: 'Other', value: 'Other'},
        ],
      },
    }),
    defineField({
      name: 'image',
      title: 'Event Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      category: 'category',
      media: 'image',
    },
    prepare(selection) {
      const {title, date, category, media} = selection
      return {
        title: title,
        subtitle: `${date || ''} [${category || 'No Category'}]`,
        media: media,
      }
    },
  },
})
