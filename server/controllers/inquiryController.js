import prisma from '../lib/prisma.js';

// Get all inquiries (Admin) or user's inquiries
export const getInquiries = async (req, res) => {
  try {
    const { userId, status, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      ...(userId && { userId: parseInt(userId) }),
      ...(status && { status })
    };

    const [inquiries, totalCount] = await Promise.all([
      prisma.productInquiry.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          }
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.productInquiry.count({ where })
    ]);

    res.json({
      success: true,
      data: inquiries,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalItems: totalCount,
        hasNext: parseInt(page) < Math.ceil(totalCount / parseInt(limit)),
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inquiries'
    });
  }
};

// Get single inquiry
export const getInquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const inquiry = await prisma.productInquiry.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true
          }
        }
      }
    });

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    res.json({
      success: true,
      data: inquiry
    });
  } catch (error) {
    console.error('Error fetching inquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inquiry'
    });
  }
};

// Create new inquiry
export const createInquiry = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      productName,
      message,
      quantity = 1,
      userId
    } = req.body;

    const inquiry = await prisma.productInquiry.create({
      data: {
        name,
        email,
        phone,
        productName,
        message,
        quantity: parseInt(quantity),
        ...(userId && { userId: parseInt(userId) })
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: inquiry,
      message: 'Inquiry submitted successfully'
    });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit inquiry'
    });
  }
};

// Update inquiry status (Admin)
export const updateInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const inquiry = await prisma.productInquiry.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: inquiry,
      message: 'Inquiry status updated successfully'
    });
  } catch (error) {
    console.error('Error updating inquiry status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update inquiry status'
    });
  }
};

// Delete inquiry (Admin)
export const deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.productInquiry.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Inquiry deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete inquiry'
    });
  }
};

// Get inquiry statistics (Admin)
export const getInquiryStats = async (req, res) => {
  try {
    const [
      totalInquiries,
      pendingInquiries,
      contactedInquiries,
      fulfilledInquiries,
      closedInquiries
    ] = await Promise.all([
      prisma.productInquiry.count(),
      prisma.productInquiry.count({ where: { status: 'PENDING' } }),
      prisma.productInquiry.count({ where: { status: 'CONTACTED' } }),
      prisma.productInquiry.count({ where: { status: 'FULFILLED' } }),
      prisma.productInquiry.count({ where: { status: 'CLOSED' } })
    ]);

    res.json({
      success: true,
      data: {
        totalInquiries,
        pendingInquiries,
        contactedInquiries,
        fulfilledInquiries,
        closedInquiries
      }
    });
  } catch (error) {
    console.error('Error fetching inquiry stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inquiry statistics'
    });
  }
};
