import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { productsAPI, getImageUrl } from '../services/api';
import { useCart } from '../context/CartContext';
import Button from '../components/Button';

export default function ProductDetails() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    productsAPI
      .getById(id)
      .then((res) => setProduct(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || 'Product not found')
      )
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <p className="text-stone-500 text-center">Loading...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <p className="text-red-600 text-center">{error || 'Product not found'}</p>
      </div>
    );
  }

  const imageUrl = getImageUrl(product.image);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="aspect-square bg-stone-100 rounded-lg overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-400">
              No image
            </div>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-semibold text-stone-900">{product.name}</h1>
          <p className="text-stone-500 mt-2">{product.category}</p>
          <p className="text-xl font-semibold text-stone-800 mt-4">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-stone-600 mt-6">{product.description}</p>
          <p className="text-sm text-stone-500 mt-4">
            {product.stock > 0 ? `In stock: ${product.stock}` : 'Out of stock'}
          </p>

          {product.stock > 0 && (
            <div className="mt-8 flex items-center gap-4">
              <label className="text-sm text-stone-700">Quantity:</label>
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-20 px-2 py-1 border border-stone-300 rounded"
              />
              <Button onClick={handleAddToCart}>Add to cart</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
