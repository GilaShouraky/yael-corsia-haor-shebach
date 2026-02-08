// Schema for Products in Sanity Studio
export default {
  name: 'product',
  title: 'מוצרים',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'שם המוצר',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'shortDescription',
      title: 'תיאור קצר',
      type: 'text',
      rows: 3
    },
    {
      name: 'fullDescription',
      title: 'תיאור מלא',
      type: 'text',
      rows: 5
    },
    {
      name: 'aboutBook',
      title: 'אודות הספר (אופציונלי)',
      type: 'text',
      rows: 3
    },
    {
      name: 'mainImage',
      title: 'תמונה ראשית',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'gallery',
      title: 'גלריית תמונות',
      type: 'array',
      of: [{
        type: 'image',
        options: { hotspot: true },
        fields: [
          {
            name: 'caption',
            title: 'כיתוב',
            type: 'string'
          }
        ]
      }]
    },
    {
      name: 'price',
      title: 'מחיר',
      type: 'number',
      validation: Rule => Rule.positive()
    },
    {
      name: 'salePrice',
      title: 'מחיר מבצע (אופציונלי)',
      type: 'number',
      validation: Rule => Rule.positive()
    },
    {
      name: 'bulkPrice',
      title: 'מחיר כמות (אופציונלי)',
      type: 'number'
    },
    {
      name: 'bulkMinimum',
      title: 'כמות מינימלית למחיר כמות',
      type: 'number'
    },
    {
      name: 'comingSoon',
      title: 'בקרוב',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'whatsInside',
      title: 'מה בערכה?',
      type: 'array',
      of: [{type: 'string'}]
    },
    {
      name: 'forWho',
      title: 'למי מתאים?',
      type: 'array',
      of: [{type: 'string'}]
    },
    {
      name: 'howToUse',
      title: 'איך זה עובד?',
      type: 'text',
      rows: 3
    },
    {
      name: 'reviews',
      title: 'המלצות',
      type: 'array',
      of: [{
        type: 'object',
        name: 'customerReview',
        title: 'המלצת לקוח',
        fields: [
          {
            name: 'customerName',
            title: 'שם הלקוח',
            type: 'string'
          },
          {
            name: 'reviewText',
            title: 'טקסט ההמלצה',
            type: 'text',
            rows: 2
          }
        ]
      }]
    },
    {
      name: 'link',
      title: 'קישור למוצר (אופציונלי)',
      type: 'url'
    },
    {
      name: 'order',
      title: 'מיקום בתצוגה',
      type: 'number',
      validation: Rule => Rule.integer().positive()
    },
    {
      name: 'active',
      title: 'פעיל',
      type: 'boolean',
      initialValue: true
    }
  ],
  orderings: [
    {
      title: 'לפי מיקום',
      name: 'orderAsc',
      by: [
        {field: 'order', direction: 'asc'}
      ]
    }
  ],
  preview: {
    select: {
      title: 'name',
      media: 'mainImage',
      price: 'price',
      active: 'active'
    },
    prepare(selection) {
      const {title, media, price, active} = selection
      return {
        title: title,
        subtitle: `₪${price} ${!active ? '(לא פעיל)' : ''}`,
        media: media
      }
    }
  }
}