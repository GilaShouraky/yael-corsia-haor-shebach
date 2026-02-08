import {createClient} from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// Sanity client configuration
export const client = createClient({
  projectId: 'c1d4vky5', // תוחלף בהתקנה
  dataset: 'production',
  useCdn: true, // set to `false` to bypass the edge cache
  apiVersion: '2024-01-01', // use current date (YYYY-MM-DD) to target the latest API version
})

// Image URL builder
const builder = imageUrlBuilder(client)

export function urlFor(source) {
  return builder.image(source)
}

// Fetch all products
export async function getProducts() {
  const products = await client.fetch(`
    *[_type == "product" && active == true] | order(order asc) {
      _id,
      name,
      slug,
      shortDescription,
      fullDescription,
      aboutBook,
      "mainImage": mainImage.asset->url,
      "gallery": gallery[]{
        "url": image.asset->url,
        caption
      },
      price,
      salePrice,
      bulkPrice,
      bulkMinimum,
      comingSoon,
      whatsInside,
      forWho,
      howToUse,
      reviews,
      link,
      order
    }
  `)
  return products
}

// Fetch site settings
export async function getSiteSettings() {
  const settings = await client.fetch(`
    *[_type == "siteSettings"][0] {
      siteName,
      tagline,
      about,
      "aboutImage": aboutImage.asset->url,
      contactEmail,
      contactPhone,
      whatsappNumber,
      instagramHandle,
      whatsappGroupLink,
      stats
    }
  `)
  return settings
}

// Fetch single product by slug
export async function getProductBySlug(slug) {
  const product = await client.fetch(`
    *[_type == "product" && slug.current == $slug][0] {
      _id,
      name,
      slug,
      shortDescription,
      fullDescription,
      aboutBook,
      "mainImage": mainImage.asset->url,
      "gallery": gallery[]{
        "url": image.asset->url,
        caption
      },
      price,
      salePrice,
      bulkPrice,
      bulkMinimum,
      comingSoon,
      whatsInside,
      forWho,
      howToUse,
      reviews,
      link
    }
  `, { slug })
  return product
}
