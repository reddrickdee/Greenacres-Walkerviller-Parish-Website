import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'massTime',
  title: 'Mass Times & Services',
  type: 'document',
  fields: [
    defineField({
      name: 'church',
      title: 'Church Location',
      type: 'string',
      options: {
        list: [
          {title: "St Monica's Church (Walkerville)", value: "St Monica's Church"},
          {title: "St Martin's Church (Greenacres)", value: "St Martin's Church"},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'dayOfWeek',
      title: 'Day of the Week',
      type: 'string',
      options: {
        list: [
          {title: 'Monday', value: 'Monday'},
          {title: 'Tuesday', value: 'Tuesday'},
          {title: 'Wednesday', value: 'Wednesday'},
          {title: 'Thursday', value: 'Thursday'},
          {title: 'Friday', value: 'Friday'},
          {title: 'Saturday', value: 'Saturday'},
          {title: 'Sunday', value: 'Sunday'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'startTime',
      title: 'Start Time',
      type: 'string',
      description: 'e.g., 9:00am, 9:30am, or 6:00pm Vigil',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Service Type',
      type: 'string',
      options: {
        list: [
          {title: 'Sunday Mass', value: 'Sunday Mass'},
          {title: 'Weekend Vigil Mass', value: 'Weekend Vigil Mass'},
          {title: 'Weekday Mass', value: 'Weekday Mass'},
          {title: 'Reconciliation / Confession', value: 'Reconciliation'},
          {title: 'Devotion / Adoration', value: 'Devotion'},
          {title: 'Special / Seasonal Liturgy', value: 'Special Liturgy'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'durationMinutes',
      title: 'Typical Duration (Minutes)',
      type: 'number',
      initialValue: 60,
    }),
    defineField({
      name: 'notes',
      title: 'Special Notes',
      type: 'string',
      description: 'e.g., Ordinariate of Our Lady of the Southern Cross, or Novena follows Mass',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Used to sort the times on the schedule (e.g. 1 for Saturday Vigil, 2 for Sunday morning)',
      initialValue: 10,
    }),
  ],
  preview: {
    select: {
      church: 'church',
      day: 'dayOfWeek',
      time: 'startTime',
      type: 'type',
      notes: 'notes',
    },
    prepare(selection) {
      const {church, day, time, type, notes} = selection
      const churchShort = church?.includes("Monica") ? "St Monica" : "St Martin"
      return {
        title: `${churchShort} — ${day} ${time}`,
        subtitle: `${type || ''} ${notes ? `(${notes})` : ''}`,
      }
    },
  },
})
