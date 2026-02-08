import { useState, useEffect } from 'react';
import { getProducts, getSiteSettings } from './sanityClient';

// Custom hook to fetch products from Sanity
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const data = await getProducts();
        
        // Transform Sanity data to match your existing product structure
        const transformedProducts = data.map((product, index) => ({
          id: index + 1, // or use a unique field from Sanity
          name: product.name,
          shortDescription: product.shortDescription,
          fullDescription: product.fullDescription,
          aboutBook: product.aboutBook,
          price: product.price,
          salePrice: product.salePrice,
          bulkPrice: product.bulkPrice,
          bulkMinimum: product.bulkMinimum,
          comingSoon: product.comingSoon,
          image: product.mainImage,
          gallery: product.gallery || [],
          reviews: product.reviews || [],
          whatsInside: product.whatsInside,
          forWho: product.forWho,
          howToUse: product.howToUse,
          link: product.link,
          // Keep the icon based on product type (you can add this to Sanity too)
          icon: getIconForProduct(product.name)
        }));
        
        setProducts(transformedProducts);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return { products, loading, error };
}

// Custom hook to fetch site settings
export function useSiteSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true);
        const data = await getSiteSettings();
        setSettings(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching settings:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  return { settings, loading, error };
}

// Helper function to map product names to icons
function getIconForProduct(productName) {
  // You can customize this based on your needs
  if (productName.includes('קלפ')) return 'Sparkles';
  if (productName.includes('מחברת')) return 'Heart';
  if (productName.includes('בובי')) return 'BookOpen';
  return 'Sparkles';
}
