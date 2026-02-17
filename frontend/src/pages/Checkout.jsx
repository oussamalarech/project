import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ordersAPI } from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';
import { useRequireAuth } from '../hooks/useRequireAuth';

export default function Checkout() {
  const { user, loading: authLoading } = useRequireAuth();
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
    paymentMethod: 'card',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (items.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    const { address, city, postalCode, country, paymentMethod } = form;
    if (!address?.trim() || !city?.trim() || !postalCode?.trim() || !country?.trim()) {
      setError('Please fill in all shipping fields.');
      return;
    }

    setSubmitting(true);

    try {
      const orderItems = items.map(({ _id, qty }) => ({ product: _id, quantity: qty }));
      await ordersAPI.create({
        orderItems,
        shippingAddress: { address, city, postalCode, country },
        paymentMethod,
      });
      clearCart();
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order.');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || !user) {
    return null;
  }

  if (items.length === 0 && !submitting) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold text-stone-800 mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-stone-200 rounded-lg p-6 space-y-4">
          <h2 className="font-medium text-stone-800">Shipping address</h2>
          <Input
            label="Address"
            name="address"
            value={form.address}
            onChange={handleChange}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              name="city"
              value={form.city}
              onChange={handleChange}
              required
            />
            <Input
              label="Postal code"
              name="postalCode"
              value={form.postalCode}
              onChange={handleChange}
              required
            />
          </div>
          <Input
            label="Country"
            name="country"
            value={form.country}
            onChange={handleChange}
            required
          />
        </div>

        <div className="bg-white border border-stone-200 rounded-lg p-6">
          <h2 className="font-medium text-stone-800 mb-4">Payment</h2>
          <select
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-stone-300 rounded"
          >
            <option value="card">Card</option>
            <option value="cod">Cash on delivery</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-stone-800">
            Total: ${totalPrice.toFixed(2)}
          </p>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Placing order...' : 'Place order'}
          </Button>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>
    </div>
  );
}
