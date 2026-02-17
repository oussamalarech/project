import { useEffect, useState } from 'react';
import { productsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function Home() {
  /* -----------------------------
     Banner configuration
     You can freely add/remove images or videos here
  ----------------------------- */
  const banners = [
    { type: 'image', src: '/banners/banner1.jpg' },
    { type: 'image', src: '/banners/banner2.jpg' },
    { type: 'video', src: '/banners/banner3.webm' },
  ];

  const [currentBanner, setCurrentBanner] = useState(0);

  /* Rotate banner every 5 seconds */
  useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  /* -----------------------------
     Products logic
  ----------------------------- */
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    productsAPI
      .getAll()
      .then((res) => setProducts(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || 'Failed to load products')
      )
      .finally(() => setLoading(false));
  }, []);

  /* -----------------------------
     Loading & error states
  ----------------------------- */
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <p className="text-stone-500 text-center">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <p className="text-red-600 text-center">{error}</p>
      </div>
    );
  }

  /* -----------------------------
     Page render
  ----------------------------- */
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">

      {/* =============================
         Rotating Banner Slot
         (image OR video)
      ============================== */}
      {banners.length > 0 && (
        <div className="w-full mb-10 rounded-2xl overflow-hidden bg-black h-[180px] md:h-[260px]">
          {banners[currentBanner].type === 'image' ? (
            <img
              src={banners[currentBanner].src}
              alt="Store banner"
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              src={banners[currentBanner].src}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          )}
        </div>
      )}

      {/* =============================
         Products Section
      ============================== */}
      <h1 className="text-2xl font-semibold text-stone-800 mb-8">
        Products
      </h1>

      {products.length === 0 ? (
        <p className="text-stone-500 text-center py-12">
          No products available.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
