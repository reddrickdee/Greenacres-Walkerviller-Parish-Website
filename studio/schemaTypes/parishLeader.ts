import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'parishLeader',
  title: 'Parish Leaders & Staff',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role / Position',
      type: 'string',
      description: 'e.g., Priest Moderator, Pastoral Associate, Deacon, Secretary',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bio',
      title: 'Biography / Profile Text',
      type: 'text',
    }),
    defineField({
      name: 'photo',
      title: 'Profile Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers will appear first on the website (e.g., 1 for Parish Priest, 2 for Deacon)',
      initialValue: 10,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      role: 'role',
      media: 'photo',
      order: 'order',
    },
    prepare(selection) {
      const {title, role, media, order} = selection
      return {
        title: title,
        subtitle: `${role || ''} (Sort: ${order ?? 10})`,
        media: media,
      }
    },
  },
})
