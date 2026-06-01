import { defineField, defineType } from 'sanity';

export default defineType({
    name: 'parishInfo',
    title: 'Parish Info',
    type: 'document',
    fields: [
        defineField({ name: 'phone', title: 'Phone', type: 'string' }),
        defineField({ name: 'email', title: 'Email', type: 'string' }),
        defineField({ name: 'address', title: 'Address', type: 'string' }),
        defineField({ name: 'postalAddress', title: 'Postal address', type: 'string' }),
        defineField({ name: 'officeHours', title: 'Office hours', type: 'string' }),
        defineField({
            name: 'clergy',
            title: 'Clergy & staff',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'name', title: 'Name', type: 'string' },
                        { name: 'role', title: 'Role', type: 'string' },
                        { name: 'bio', title: 'Bio', type: 'text' },
                        { name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true } },
                    ],
                    preview: { select: { title: 'name', subtitle: 'role', media: 'photo' } },
                },
            ],
        }),
    ],
    preview: { prepare: () => ({ title: 'Parish Info' }) },
});
