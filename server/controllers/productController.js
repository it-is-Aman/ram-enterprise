import prisma from '../lib/prisma.js';

// Get all products with filters and pagination
export const getProducts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      category, 
      search, 
      minPrice, 
      maxPrice, 
      inStock, 
      featured,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build where condition
    const where = {
      isActive: true,
      ...(category && { category: { slug: category } }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { material: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(minPrice || maxPrice) && {
        price: {
          ...(minPrice && { gte: parseFloat(minPrice) }),
          ...(maxPrice && { lte: parseFloat(maxPrice) })
        }
      },
      ...(inStock === 'true' && { stock: { gt: 0 } }),
      ...(featured === 'true' && { isFeatured: true })
    };

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          images: true,
          variants: true,
          reviews: {
            select: {
              rating: true
            }
          }
        },
        skip,
        take: parseInt(limit),
        orderBy: {
          [sortBy]: sortOrder
        }
      }),
      prisma.product.count({ where })
    ]);

    // Calculate average rating for each product
    const productsWithRating = products.map(product => ({
      ...product,
      averageRating: product.reviews.length > 0 
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length 
        : 0,
      reviewCount: product.reviews.length
    }));

    res.json({
      success: true,
      data: productsWithRating,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalItems: totalCount,
        hasNext: parseInt(page) < Math.ceil(totalCount / parseInt(limit)),
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    });
  }
};

// Get single product by ID or slug
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const isNumeric = !isNaN(parseInt(id));

    const product = await prisma.product.findFirst({
      where: isNumeric ? { id: parseInt(id) } : { slug: id },
      include: {
        category: true,
        images: {
          orderBy: { isPrimary: 'desc' }
        },
        variants: true,
        reviews: {
          include: {
            user: {
              select: { name: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Calculate average rating
    const averageRating = product.reviews.length > 0 
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length 
      : 0;

    res.json({
      success: true,
      data: {
        ...product,
        averageRating,
        reviewCount: product.reviews.length
      }
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product'
    });
  }
};

// Get featured products
export const getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const products = await prisma.product.findMany({
      where: {
        isFeatured: true,
        isActive: true
      },
      include: {
        category: true,
        images: true,
        reviews: {
          select: {
            rating: true
          }
        }
      },
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' }
    });

    const productsWithRating = products.map(product => ({
      ...product,
      averageRating: product.reviews.length > 0 
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length 
        : 0,
      reviewCount: product.reviews.length
    }));

    res.json({
      success: true,
      data: productsWithRating
    });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured products'
    });
  }
};

// Create new product (Admin)
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      discount = 0,
      stock,
      sku,
      weight,
      dimensions,
      material,
      isFeatured = false,
      categoryId,
      images = [],
      variants = []
    } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parseFloat(price),
        discount: parseFloat(discount),
        stock: parseInt(stock),
        sku,
        weight: weight ? parseFloat(weight) : null,
        dimensions,
        material,
        isFeatured,
        categoryId: parseInt(categoryId),
        images: {
          create: images.map(image => ({
            url: image.url,
            alt: image.alt || name,
            isPrimary: image.isPrimary || false
          }))
        },
        variants: {
          create: variants.map(variant => ({
            name: variant.name,
            value: variant.value,
            price: variant.price ? parseFloat(variant.price) : 0,
            stock: variant.stock ? parseInt(variant.stock) : 0,
            sku: variant.sku
          }))
        }
      },
      include: {
        category: true,
        images: true,
        variants: true
      }
    });

    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product'
    });
  }
};

// Update product (Admin)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove nested relations from direct update
    const { images, variants, ...productData } = updateData;

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        ...productData,
        ...(productData.price && { price: parseFloat(productData.price) }),
        ...(productData.discount !== undefined && { discount: parseFloat(productData.discount) }),
        ...(productData.stock && { stock: parseInt(productData.stock) }),
        ...(productData.weight && { weight: parseFloat(productData.weight) }),
        ...(productData.categoryId && { categoryId: parseInt(productData.categoryId) })
      },
      include: {
        category: true,
        images: true,
        variants: true
      }
    });

    res.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product'
    });
  }
};

// Delete product (Admin)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product'
    });
  }
};

// Update product stock (Admin)
export const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: { stock: parseInt(stock) }
    });

    res.json({
      success: true,
      data: product,
      message: 'Stock updated successfully'
    });
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update stock'
    });
  }
};
