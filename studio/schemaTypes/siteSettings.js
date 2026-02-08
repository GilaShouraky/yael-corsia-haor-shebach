// Schema for Site Settings in Sanity Studio
export default {
  name: 'siteSettings',
  title: 'הגדרות אתר',
  type: 'document',
  fields: [
    {
      name: 'siteName',
      title: 'שם האתר',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'tagline',
      title: 'סלוגן',
      type: 'string'
    },
    {
      name: 'about',
      title: 'טקסט אודות',
      type: 'array',
      of: [{type: 'block'}]
    },
    {
      name: 'aboutImage',
      title: 'תמונת אודות',
      type: 'image',
      options: {
        hotspot: true,
      }
    },
    {
      name: 'contactEmail',
      title: 'אימייל ליצירת קשר',
      type: 'string',
      validation: Rule => Rule.email()
    },
    {
      name: 'contactPhone',
      title: 'טלפון ליצירת קשר',
      type: 'string'
    },
    {
      name: 'whatsappNumber',
      title: 'מספר וואטסאפ',
      type: 'string'
    },
    {
      name: 'instagramHandle',
      title: 'אינסטגרם',
      type: 'string'
    },
    {
      name: 'whatsappGroupLink',
      title: 'קישור לקבוצת וואטסאפ',
      type: 'url'
    },
    {
      name: 'stats',
      title: 'סטטיסטיקות',
      type: 'object',
      fields: [
        {
          name: 'yearsExperience',
          title: 'שנות ניסיון',
          type: 'number'
        },
        {
          name: 'womenHelped',
          title: 'נשים שליוויתי',
          type: 'number'
        },
        {
          name: 'notebooksSold',
          title: 'מחברות שנמכרו',
          type: 'number'
        },
        {
          name: 'workshopsHeld',
          title: 'סדנאות שהעברתי',
          type: 'number'
        }
      ]
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'הגדרות אתר'
      }
    }
  }
}
