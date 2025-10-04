import prisma from '../lib/prisma.js';

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const [
      // Product stats
      totalProducts,
      activeProducts,
      outOfStockProducts,
      
      // Order stats
      totalOrders,
      pendingOrders,
      shippedOrders,
      deliveredOrders,
      
      // User stats
      totalUsers,
      totalCustomers,
      
      // Revenue stats
      totalRevenue,
      monthlyRevenue,
      
      // Inquiry stats
      totalInquiries,
      pendingInquiries,
      
      // Recent orders
      recentOrders,
      
      // Top products
      topProducts
    ] = await Promise.all([
      // Product queries
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({ where: { stock: { lte: 0 } } }),
      
      // Order queries
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.count({ where: { status: 'SHIPPED' } }),
      prisma.order.count({ where: { status: 'DELIVERED' } }),
      
      // User queries
      prisma.user.count(),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      
      // Revenue queries
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: { in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] } }
      }),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: {
          status: { in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }),
      
      // Inquiry queries
      prisma.productInquiry.count(),
      prisma.productInquiry.count({ where: { status: 'PENDING' } }),
      
      // Recent orders
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      }),
      
      // Top products by order count
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        _count: { productId: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5
      })
    ]);

    // Get product details for top products
    const topProductIds = topProducts.map(p => p.productId);
    const productDetails = await prisma.product.findMany({
      where: { id: { in: topProductIds } },
      select: {
        id: true,
        name: true,
        price: true,
        images: {
          where: { isPrimary: true },
          take: 1
        }
      }
    });

    const topProductsWithDetails = topProducts.map(item => {
      const product = productDetails.find(p => p.id === item.productId);
      return {
        product,
        totalSold: item._sum.quantity,
        orderCount: item._count.productId
      };
    });

    res.json({
      success: true,
      data: {
        products: {
          total: totalProducts,
          active: activeProducts,
          outOfStock: outOfStockProducts
        },
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          shipped: shippedOrders,
          delivered: deliveredOrders
        },
        users: {
          total: totalUsers,
          customers: totalCustomers
        },
        revenue: {
          total: totalRevenue._sum.totalAmount || 0,
          monthly: monthlyRevenue._sum.totalAmount || 0
        },
        inquiries: {
          total: totalInquiries,
          pending: pendingInquiries
        },
        recentOrders,
        topProducts: topProductsWithDetails
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics'
    });
  }
};

// Get sales analytics
export const getSalesAnalytics = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    let dateFilter;
    const now = new Date();
    
    switch (period) {
      case 'week':
        dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        dateFilter = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        dateFilter = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        dateFilter = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const salesData = await prisma.order.groupBy({
      by: ['status'],
      _sum: { totalAmount: true },
      _count: { id: true },
      where: {
        createdAt: { gte: dateFilter }
      }
    });

    const categoryData = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true, price: true },
      where: {
        order: {
          createdAt: { gte: dateFilter },
          status: { in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] }
        }
      }
    });

    res.json({
      success: true,
      data: {
        salesByStatus: salesData,
        categoryPerformance: categoryData,
        period,
        dateRange: {
          from: dateFilter,
          to: now
        }
      }
    });
  } catch (error) {
    console.error('Error fetching sales analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sales analytics'
    });
  }
};
