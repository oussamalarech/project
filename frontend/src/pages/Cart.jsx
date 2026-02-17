import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../services/api';
import Button from '../components/Button';

export default function Cart() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

  if (totalItems === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-semibold text-stone-800 mb-8">Cart</h1>
        <p className="text-stone-500 mb-6">Your cart is empty.</p>
        <Link to="/">
          <Button>Continue shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold text-stone-800 mb-8">Cart</h1>

      <div className="space-y-6">
        {items.map((item) => {
          const imageUrl = getImageUrl(item.image);
          return (
            <div
              key={item._id}
              className="flex flex-col sm:flex-row gap-4 bg-white border border-stone-200 rounded-lg p-4"
            >
              <div className="w-full sm:w-24 h-24 bg-stone-100 rounded overflow-hidden flex-shrink-0">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-400 text-sm">
                    No image
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <Link
                  to={`/product/${item._id}`}
                  className="font-medium text-stone-900 hover:underline"
                >
                  {item.name}
                </Link>
                <p className="text-stone-600 mt-0.5">${item.price.toFixed(2)}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateQuantity(item._id, item.qty - 1)}
                    className="w-8 h-8 flex items-center justify-center border border-stone-300 rounded hover:bg-stone-100"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-stone-700">{item.qty}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.qty + 1)}
                    className="w-8 h-8 flex items-center justify-center border border-stone-300 rounded hover:bg-stone-100"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item._id)}
                  className="text-red-600 text-sm hover:underline"
                >
                  Remove
                </button>
              </div>

              <div className="font-medium text-stone-800 sm:text-right">
                ${(item.price * item.qty).toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-lg font-semibold text-stone-800">
          Total: ${totalPrice.toFixed(2)}
        </p>
        <div className="flex gap-3">
          <Link to="/">
            <Button variant="secondary">Continue shopping</Button>
          </Link>
          <Link to="/checkout">
            <Button>Proceed to checkout</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
