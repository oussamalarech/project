const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');

/**
 * @route   GET /api/products
 */
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

/**
 * @route   GET /api/products/:id
 */
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    if (error.kind === 'ObjectId') return res.status(404).json({ message: 'Product not found' });
    res.status(500).json({ message: 'Failed to fetch product' });
  }
};

/**
 * @route   POST /api/products
 * @desc    Create product (admin only)
 */
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    let imageUrl = '';
    if (req.file) {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'phone-store-products',
      });
      imageUrl = result.secure_url; // full URL
    }

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      category,
      stock: Number(stock) || 0,
      image: imageUrl, // save full Cloudinary URL
    });

    res.status(201).json(product);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Failed to create product' });
  }
};

/**
 * @route   PUT /api/products/:id
 * @desc    Update product (admin only)
 */
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const { name, description, price, category, stock } = req.body;
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (category !== undefined) product.category = category;
    if (stock !== undefined) product.stock = Number(stock);

    // Upload new image if provided
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'phone-store-products',
      });
      product.image = result.secure_url; // save full URL
    }

    await product.save();
    res.json(product);
  } catch (error) {
    if (error.kind === 'ObjectId') return res.status(404).json({ message: 'Product not found' });
    res.status(500).json({ message: 'Failed to update product' });
  }
};

/**
 * @route   DELETE /api/products/:id
 */
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Optional: delete from Cloudinary if needed
    // if (product.image) await cloudinary.uploader.destroy(publicId);

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product removed' });
  } catch (error) {
    if (error.kind === 'ObjectId') return res.status(404).json({ message: 'Product not found' });
    res.status(500).json({ message: 'Failed to delete product' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};