import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../services/api';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const imageUrl = getImageUrl(product.image);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem(product);
  };

  return (
    <div className="bg-white rounded-lg border border-stone-200 overflow-hidden hover:shadow-md transition-shadow">
      <Link to={`/product/${product._id}`} className="block">
        <div className="aspect-square bg-stone-100">
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
        <div className="p-4">
          <h3 className="font-medium text-stone-900">{product.name}</h3>
          <p className="text-sm text-stone-500 mt-0.5">{product.category}</p>
          <p className="text-stone-800 font-semibold mt-2">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </Link>
      <div className="px-4 pb-4">
        <button
          onClick={handleAddToCart}
          className="w-full py-2 px-4 bg-stone-800 text-white text-sm font-medium rounded hover:bg-stone-700 transition-colors"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
