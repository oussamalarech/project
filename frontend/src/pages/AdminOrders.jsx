import { useEffect, useState } from 'react';
import { ordersAPI, getImageUrl } from '../services/api';

const STATUS_OPTIONS = ['pending', 'shipped', 'delivered'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const fetchOrders = () => {
    ordersAPI
      .getAll()
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    setUpdating(orderId);
    try {
      await ordersAPI.updateStatus(orderId, status);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return <p className="text-stone-500">Loading orders...</p>;
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-stone-800 mb-6">Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white border border-stone-200 rounded-lg overflow-hidden"
          >
            <div className="px-4 py-3 bg-stone-50 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-sm text-stone-500">Order </span>
                <span className="font-mono text-sm text-stone-700">
                  {order._id.slice(-8)}
                </span>
                <span className="mx-2 text-stone-400">·</span>
                <span className="text-sm text-stone-600">
                  {order.user?.name} ({order.user?.email})
                </span>
                <span className="mx-2 text-stone-400">·</span>
                <span className="text-sm text-stone-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-stone-600">Status:</span>
                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(order._id, e.target.value)
                  }
                  disabled={updating === order._id}
                  className="text-sm border border-stone-300 rounded px-2 py-1"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="px-4 py-3 border-t border-stone-200">
              <div className="flex flex-wrap gap-4 mb-2">
                <span className="text-sm text-stone-600">Shipping:</span>
                <span className="text-sm text-stone-700">
                  {order.shippingAddress?.address}, {order.shippingAddress?.city},{' '}
                  {order.shippingAddress?.postalCode},{' '}
                  {order.shippingAddress?.country}
                </span>
              </div>
              <div className="flex flex-wrap gap-4 mb-3">
                <span className="text-sm text-stone-600">Items:</span>
              </div>
              <ul className="space-y-1">
                {order.orderItems?.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <div className="w-10 h-10 bg-stone-100 rounded overflow-hidden flex-shrink-0">
                      {item.product?.image ? (
                        <img
                          src={getImageUrl(item.product.image)}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">
                          —
                        </div>
                      )}
                    </div>
                    <span className="text-stone-800">{item.name}</span>
                    <span className="text-stone-500">× {item.quantity}</span>
                    <span className="text-stone-600">
                      ${item.price.toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-stone-800 font-medium">
                Total: ${order.totalPrice?.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {orders.length === 0 && (
        <p className="text-stone-500 py-8 text-center">No orders yet.</p>
      )}
    </div>
  );
}
