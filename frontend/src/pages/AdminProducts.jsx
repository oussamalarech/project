import { useEffect, useState } from 'react';
import { productsAPI, getImageUrl } from '../services/api';
import Button from '../components/Button';
import ProductForm from '../components/ProductForm';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchProducts = () => {
    productsAPI
      .getAll()
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await productsAPI.delete(id);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditing(null);
    fetchProducts();
  };

  if (loading) {
    return <p className="text-stone-500">Loading...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-stone-800">Products</h1>
        <Button
          onClick={() => {
            setEditing(null);
            setShowForm(!showForm);
          }}
        >
          {showForm ? 'Cancel' : 'Add product'}
        </Button>
      </div>

      {showForm && (
        <ProductForm
          product={editing}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}

      <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-stone-50">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-stone-700">
                Product
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-stone-700">
                Price
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-stone-700">
                Stock
              </th>
              <th className="text-right px-4 py-3 text-sm font-medium text-stone-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t border-stone-200">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-stone-100 rounded overflow-hidden flex-shrink-0">
                      {getImageUrl(p.image) ? (
                        <img
                          src={getImageUrl(p.image)}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">
                          —
                        </div>
                      )}
                    </div>
                    <span className="font-medium text-stone-800">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-stone-600">${p.price.toFixed(2)}</td>
                <td className="px-4 py-3 text-stone-600">{p.stock}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => {
                      setEditing(p);
                      setShowForm(true);
                    }}
                    className="text-stone-600 hover:text-stone-800 text-sm mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id, p.name)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {products.length === 0 && !showForm && (
        <p className="text-stone-500 py-8 text-center">No products yet.</p>
      )}
    </div>
  );
}
