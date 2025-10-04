import prisma from '../lib/prisma.js';

// Get user's wishlist
export const getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;

    const wishlist = await prisma.wishlist.findUnique({
      where: { userId: parseInt(userId) },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  where: { isPrimary: true },
                  take: 1
                },
                reviews: {
                  select: {
                    rating: true
                  }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!wishlist) {
      return res.json({
        success: true,
        data: {
          items: [],
          totalItems: 0
        }
      });
    }

    // Add rating info to products
    const itemsWithRating = wishlist.items.map(item => ({
      ...item,
      product: {
        ...item.product,
        averageRating: item.product.reviews.length > 0 
          ? item.product.reviews.reduce((sum, review) => sum + review.rating, 0) / item.product.reviews.length 
          : 0,
        reviewCount: item.product.reviews.length
      }
    }));

    res.json({
      success: true,
      data: {
        ...wishlist,
        items: itemsWithRating,
        totalItems: wishlist.items.length
      }
    });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wishlist'
    });
  }
};

// Add item to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId } = req.body;

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Get or create wishlist
    let wishlist = await prisma.wishlist.findUnique({
      where: { userId: parseInt(userId) }
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId: parseInt(userId) }
      });
    }

    // Check if item already exists in wishlist
    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId: parseInt(productId)
        }
      }
    });

    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: 'Product already in wishlist'
      });
    }

    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        wishlistId: wishlist.id,
        productId: parseInt(productId)
      },
      include: {
        product: {
          include: {
            images: {
              where: { isPrimary: true },
              take: 1
            }
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: wishlistItem,
      message: 'Item added to wishlist'
    });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add item to wishlist'
    });
  }
};

// Remove item from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    // Find wishlist item
    const wishlistItem = await prisma.wishlistItem.findFirst({
      where: {
        productId: parseInt(productId),
        wishlist: {
          userId: parseInt(userId)
        }
      }
    });

    if (!wishlistItem) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in wishlist'
      });
    }

    await prisma.wishlistItem.delete({
      where: { id: wishlistItem.id }
    });

    res.json({
      success: true,
      message: 'Item removed from wishlist'
    });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove item from wishlist'
    });
  }
};

// Clear entire wishlist
export const clearWishlist = async (req, res) => {
  try {
    const { userId } = req.params;

    const wishlist = await prisma.wishlist.findUnique({
      where: { userId: parseInt(userId) }
    });

    if (!wishlist) {
      return res.json({
        success: true,
        message: 'Wishlist is already empty'
      });
    }

    await prisma.wishlistItem.deleteMany({
      where: { wishlistId: wishlist.id }
    });

    res.json({
      success: true,
      message: 'Wishlist cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear wishlist'
    });
  }
};

// Check if product is in user's wishlist
export const checkWishlistItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const wishlistItem = await prisma.wishlistItem.findFirst({
      where: {
        productId: parseInt(productId),
        wishlist: {
          userId: parseInt(userId)
        }
      }
    });

    res.json({
      success: true,
      data: {
        inWishlist: !!wishlistItem
      }
    });
  } catch (error) {
    console.error('Error checking wishlist item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check wishlist item'
    });
  }
};
