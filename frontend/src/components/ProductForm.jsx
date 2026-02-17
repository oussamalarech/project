import { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';
import Input from './Input';
import Button from './Button';

export default function ProductForm({ product, onSuccess, onCancel }) {
  const isEdit = !!product;
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description,
        price: String(product.price),
        category: product.category,
        stock: String(product.stock),
      });
    }
  }, [product]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const data = new FormData();
    data.append('name', form.name.trim());
    data.append('description', form.description.trim());
    data.append('price', form.price);
    data.append('category', form.category.trim());
    data.append('stock', form.stock || '0');
    if (image) {
      data.append('image', image);
    }

    try {
      if (isEdit) {
        await productsAPI.update(product._id, data);
      } else {
        await productsAPI.create(data);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-stone-200 rounded-lg p-6 mb-8"
    >
      <h2 className="text-lg font-medium text-stone-800 mb-4">
        {isEdit ? 'Edit product' : 'New product'}
      </h2>

      <div className="space-y-4">
        <Input
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <Input
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={handleChange}
            required
          />
          <Input
            label="Stock"
            name="stock"
            type="number"
            min="0"
            value={form.stock}
            onChange={handleChange}
          />
        </div>
        <Input
          label="Category"
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        />
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Image {isEdit && '(leave empty to keep current)'}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0] || null)}
            className="w-full text-sm text-stone-600"
          />
        </div>
      </div>

      {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}

      <div className="mt-6 flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
