import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data (optional - be careful in production!)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.productInquiry.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Cleared existing data');

  // Create Users
//   const hashedPassword = await bcrypt.hash('password123', 10);
    const hashedPassword = "123456"
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@barproducts.com',
      password: hashedPassword,
      phone: '+91-9876543210',
      address: '123 Admin Street, Delhi, India',
      role: "ADMIN",
    },
  });

  const customer1 = await prisma.user.create({
    data: {
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      password: hashedPassword,
      phone: '+91-9876543211',
      address: '45 MG Road, Bangalore, Karnataka, India',
      role: "CUSTOMER",
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      name: 'Priya Patel',
      email: 'priya@example.com',
      password: hashedPassword,
      phone: '+91-9876543212',
      address: '78 Park Street, Mumbai, Maharashtra, India',
      role: "CUSTOMER",
    },
  });

  console.log('✅ Created users');

  // Create Categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Bar Tools & Accessories',
        slug: 'bar-tools-accessories',
        image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Copper Water Bottles',
        slug: 'copper-water-bottles',
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Cocktail Shakers',
        slug: 'cocktail-shakers',
        image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Wine Accessories',
        slug: 'wine-accessories',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Bar Glassware',
        slug: 'bar-glassware',
        image: 'https://images.unsplash.com/photo-1509669803555-fd5d97b16c7e',
      },
    }),
  ]);

  console.log('✅ Created categories');

  // Create Products
  const product1 = await prisma.product.create({
    data: {
      name: 'Premium Copper Water Bottle',
      slug: 'premium-copper-water-bottle',
      description: 'Handcrafted pure copper water bottle with leak-proof cap. Perfect for storing water overnight for Ayurvedic health benefits.',
      price: 899,
      discount: 10,
      stock: 50,
      sku: 'CWB-001',
      weight: 250,
      dimensions: '8cm x 8cm x 26cm',
      material: '100% Pure Copper',
      isActive: true,
      isFeatured: true,
      categoryId: categories[1].id,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8',
            alt: 'Copper water bottle front view',
            isPrimary: true,
          },
          {
            url: 'https://images.unsplash.com/photo-1523362628745-0c100150b504',
            alt: 'Copper water bottle side view',
            isPrimary: false,
          },
        ],
      },
      variants: {
        create: [
          { name: 'Capacity', value: '500ml', price: 0, stock: 25, sku: 'CWB-001-500' },
          { name: 'Capacity', value: '1000ml', price: 200, stock: 25, sku: 'CWB-001-1000' },
        ],
      },
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Professional Cocktail Shaker Set',
      slug: 'professional-cocktail-shaker-set',
      description: 'Complete bartender kit with 750ml shaker, strainer, jigger, and mixing spoon. Made from premium stainless steel.',
      price: 1499,
      discount: 15,
      stock: 30,
      sku: 'CKS-002',
      weight: 450,
      dimensions: '10cm x 10cm x 25cm',
      material: 'Stainless Steel 304',
      isActive: true,
      isFeatured: true,
      categoryId: categories[2].id,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1551024506-0bccd828d307',
            alt: 'Cocktail shaker set',
            isPrimary: true,
          },
        ],
      },
      variants: {
        create: [
          { name: 'Finish', value: 'Mirror Polish', price: 0, stock: 15, sku: 'CKS-002-MP' },
          { name: 'Finish', value: 'Rose Gold', price: 300, stock: 15, sku: 'CKS-002-RG' },
        ],
      },
    },
  });

  const product3 = await prisma.product.create({
    data: {
      name: 'Copper Moscow Mule Mug Set',
      slug: 'copper-moscow-mule-mug-set',
      description: 'Set of 4 authentic copper mugs perfect for Moscow Mule cocktails. Keeps drinks cold for hours.',
      price: 2499,
      discount: 20,
      stock: 20,
      sku: 'MMM-003',
      weight: 800,
      dimensions: '8cm x 8cm x 10cm (each)',
      material: 'Pure Copper with Brass Handle',
      isActive: true,
      isFeatured: false,
      categoryId: categories[0].id,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1560508179-7f98044c5e4f',
            alt: 'Moscow Mule copper mugs',
            isPrimary: true,
          },
        ],
      },
    },
  });

  const product4 = await prisma.product.create({
    data: {
      name: 'Wine Opener Corkscrew Premium',
      slug: 'wine-opener-corkscrew-premium',
      description: 'Professional sommelier wine opener with wooden handle and double-hinged design for easy cork removal.',
      price: 599,
      discount: 0,
      stock: 40,
      sku: 'WOP-004',
      weight: 150,
      dimensions: '12cm x 3cm x 2cm',
      material: 'Stainless Steel & Rosewood',
      isActive: true,
      isFeatured: false,
      categoryId: categories[3].id,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1585553616435-2dc0a54e271d',
            alt: 'Wine opener corkscrew',
            isPrimary: true,
          },
        ],
      },
    },
  });

  const product5 = await prisma.product.create({
    data: {
      name: 'Crystal Whiskey Glasses Set',
      slug: 'crystal-whiskey-glasses-set',
      description: 'Set of 6 premium crystal glasses perfect for whiskey, scotch, and bourbon. Elegant cut design.',
      price: 1899,
      discount: 5,
      stock: 25,
      sku: 'WGS-005',
      weight: 1200,
      dimensions: '8cm x 8cm x 9cm (each)',
      material: 'Lead-Free Crystal Glass',
      isActive: true,
      isFeatured: true,
      categoryId: categories[4].id,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b',
            alt: 'Crystal whiskey glasses',
            isPrimary: true,
          },
        ],
      },
    },
  });

  console.log('✅ Created products');

  // Create Reviews
  await prisma.review.createMany({
    data: [
      {
        productId: product1.id,
        userId: customer1.id,
        rating: 5,
        comment: 'Excellent quality copper bottle! Water tastes amazing. Highly recommended.',
        isVerified: true,
      },
      {
        productId: product1.id,
        userId: customer2.id,
        rating: 4,
        comment: 'Good product but took a while to deliver. Quality is great though.',
        isVerified: true,
      },
      {
        productId: product2.id,
        userId: customer1.id,
        rating: 5,
        comment: 'Professional quality shaker set. Perfect for home bartending!',
        isVerified: true,
      },
      {
        productId: product5.id,
        userId: customer2.id,
        rating: 5,
        comment: 'Beautiful glasses! Look premium and feel great in hand.',
        isVerified: true,
      },
    ],
  });

  console.log('✅ Created reviews');

  // Create Cart for customer1
  const cart1 = await prisma.cart.create({
    data: {
      userId: customer1.id,
      items: {
        create: [
          { productId: product3.id, quantity: 1 },
          { productId: product4.id, quantity: 2 },
        ],
      },
    },
  });

  console.log('✅ Created cart');

  // Create Wishlist for customer2
  await prisma.wishlist.create({
    data: {
      userId: customer2.id,
      items: {
        create: [
          { productId: product2.id },
          { productId: product3.id },
        ],
      },
    },
  });

  console.log('✅ Created wishlist');

  // Create Orders
  const order1 = await prisma.order.create({
    data: {
      userId: customer1.id,
      totalAmount: 809.10, // 899 - 10% discount
      status: "DELIVERED",
      paymentId: 'pay_123456789',
      paymentMethod: 'Razorpay',
      shippingAddress: '45 MG Road',
      shippingCity: 'Bangalore',
      shippingState: 'Karnataka',
      shippingPincode: '560001',
      shippingPhone: '+91-9876543211',
      trackingNumber: 'TRACK123456',
      items: {
        create: [
          {
            productId: product1.id,
            quantity: 1,
            price: 809.10,
          },
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      userId: customer2.id,
      totalAmount: 3273.15, // (1499 - 15%) + (1899 - 5%)
      status: "SHIPPED",
      paymentId: 'pay_987654321',
      paymentMethod: 'Razorpay',
      shippingAddress: '78 Park Street',
      shippingCity: 'Mumbai',
      shippingState: 'Maharashtra',
      shippingPincode: '400001',
      shippingPhone: '+91-9876543212',
      trackingNumber: 'TRACK789012',
      notes: 'Please deliver after 6 PM',
      items: {
        create: [
          {
            productId: product2.id,
            quantity: 1,
            price: 1274.15,
          },
          {
            productId: product5.id,
            quantity: 1,
            price: 1804.05,
          },
        ],
      },
    },
  });

  console.log('✅ Created orders');

  // Create Product Inquiries (Customer Requests to Admin)
  await prisma.productInquiry.createMany({
    data: [
      {
        name: 'Amit Kumar',
        email: 'amit@example.com',
        phone: '+91-9876543220',
        productName: 'Gold Plated Cocktail Set',
        message: 'Hi, I am looking for a premium gold-plated cocktail shaker set with 8 pieces. Do you have this in stock or can you arrange it?',
        quantity: 2,
        status: "PENDING",
        userId: customer1.id,
      },
      {
        name: 'Neha Gupta',
        email: 'neha@example.com',
        phone: '+91-9876543221',
        productName: 'Copper Beer Mugs',
        message: 'Need copper beer mugs similar to Moscow Mule mugs but larger capacity (500ml). Please let me know availability and pricing.',
        quantity: 6,
        status: "CONTACTED",
        userId: customer2.id,
      },
      {
        name: 'Rajesh Singh',
        email: 'rajesh@example.com',
        phone: '+91-9876543222',
        productName: 'Engraved Wine Decanter',
        message: 'Looking for a crystal wine decanter with custom engraving for corporate gifting. Need 50 pieces. Can you do bulk customization?',
        quantity: 50,
        status: "PENDING",
      },
      {
        name: customer1.name,
        email: customer1.email,
        phone: customer1.phone,
        productName: 'Vintage Bar Cart',
        message: 'Do you have any plans to stock vintage-style bar carts? I saw similar items on your Instagram.',
        quantity: 1,
        status: "FULFILLED",
        userId: customer1.id,
      },
      {
        name: 'Anonymous Customer',
        email: 'customer@example.com',
        phone: '+91-9876543223',
        productName: 'Ice Bucket with Tongs',
        message: 'Need a double-walled stainless steel ice bucket with matching tongs. What colors are available?',
        quantity: 1,
        status: "PENDING",
      },
    ],
  });

  console.log('✅ Created product inquiries');

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`- Users: ${await prisma.user.count()}`);
  console.log(`- Categories: ${await prisma.category.count()}`);
  console.log(`- Products: ${await prisma.product.count()}`);
  console.log(`- Reviews: ${await prisma.review.count()}`);
  console.log(`- Orders: ${await prisma.order.count()}`);
  console.log(`- Product Inquiries: ${await prisma.productInquiry.count()}`);
  console.log('\n🔑 Login Credentials:');
  console.log('Admin: admin@barproducts.com / password123');
  console.log('Customer 1: rahul@example.com / password123');
  console.log('Customer 2: priya@example.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });