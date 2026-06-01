import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'parishInfo',
  title: 'Parish Info & Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'parishName',
      title: 'Parish Name',
      type: 'string',
      initialValue: 'Greenacres Walkerville Catholic Parish',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Parish Tagline',
      type: 'string',
      initialValue: 'In the Footsteps of Jesus',
    }),
    defineField({
      name: 'welcomeExcerpt',
      title: 'Welcome Excerpt',
      type: 'text',
      description: 'A brief welcoming text shown on the home page hero/intro section.',
    }),
    defineField({
      name: 'parishPrayer',
      title: 'Parish Prayer Text',
      type: 'text',
      description: 'The official prayer text of the parish.',
    }),
    defineField({
      name: 'priestWelcome',
      title: 'Priest\'s Welcome Message',
      type: 'text',
      description: 'A welcoming letter from the Parish Priest/Moderator.',
    }),
    defineField({
      name: 'visionStatement',
      title: 'Parish Vision Statement',
      type: 'text',
    }),
    defineField({
      name: 'missionPoints',
      title: 'Parish Mission Points',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'officeHours',
      title: 'Office Hours',
      type: 'string',
      description: 'e.g., Tuesday - Friday 9:00am - 3:00pm',
    }),
    defineField({
      name: 'officePhone',
      title: 'Office Phone',
      type: 'string',
      initialValue: '08 8261 6200',
    }),
    defineField({
      name: 'officeEmail',
      title: 'Office Email',
      type: 'string',
      initialValue: 'admin@gwparish.org.au',
    }),
    defineField({
      name: 'officeAddress',
      title: 'Office Street Address',
      type: 'string',
      initialValue: '20 Linke Crescent, Greenacres SA 5086',
    }),
    defineField({
      name: 'postalAddress',
      title: 'Postal Address',
      type: 'string',
      initialValue: 'PO Box 220, Greenacres SA 5086',
    }),
    defineField({
      name: 'facebookUrl',
      title: 'Parish Facebook Page URL',
      type: 'url',
      initialValue: 'https://www.facebook.com/profile.php?id=61584973342464',
    }),
    defineField({
      name: 'goodGivingUrl',
      title: 'Good Giving (Donations) URL',
      type: 'url',
      initialValue: 'https://adelaide.goodgiving.com.au/qr/parish/greenacres',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Parish Info & Settings',
        subtitle: 'Edit global contact, welcome, and mission details',
      }
    },
  },
})
