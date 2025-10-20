import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive database seeding...');

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

  // Create 25 Users (20 customers + 5 admins)
  const hashedPassword = "123456";
  const users = [];

  // Create Admin Users
  const adminUsers = [
    { name: 'Super Admin', email: 'admin@rudraexports.com', phone: '+91-9876543210', address: '123 Admin Street, New Delhi, India', role: "ADMIN" },
    { name: 'Akansha Rawal', email: 'akansha@rudraexports.com', phone: '+91-9876543211', address: '456 Business Park, Mumbai, Maharashtra, India', role: "ADMIN" },
    { name: 'Sales Manager', email: 'sales@rudraexports.com', phone: '+91-9876543212', address: '789 Corporate Hub, Bangalore, Karnataka, India', role: "ADMIN" },
    { name: 'Inventory Manager', email: 'inventory@rudraexports.com', phone: '+91-9876543213', address: '321 Warehouse Road, Chennai, Tamil Nadu, India', role: "ADMIN" },
    { name: 'Customer Support', email: 'support@rudraexports.com', phone: '+91-9876543214', address: '654 Service Center, Pune, Maharashtra, India', role: "ADMIN" },
  ];

  for (const userData of adminUsers) {
    const user = await prisma.user.create({
      data: { ...userData, password: hashedPassword }
    });
    users.push(user);
  }

  // Create Customer Users
  const customerUsers = [
    { name: 'Rahul Sharma', email: 'rahul.sharma@gmail.com', phone: '+91-9876543215', address: '45 MG Road, Koramangala, Bangalore, Karnataka - 560034', role: "CUSTOMER" },
    { name: 'Priya Patel', email: 'priya.patel@yahoo.com', phone: '+91-9876543216', address: '78 Park Street, Bandra West, Mumbai, Maharashtra - 400050', role: "CUSTOMER" },
    { name: 'Amit Kumar Singh', email: 'amit.singh@hotmail.com', phone: '+91-9876543217', address: '23 Connaught Place, Central Delhi, New Delhi - 110001', role: "CUSTOMER" },
    { name: 'Neha Gupta', email: 'neha.gupta@gmail.com', phone: '+91-9876543218', address: '89 Sector 62, Noida, Uttar Pradesh - 201309', role: "CUSTOMER" },
    { name: 'Rajesh Verma', email: 'rajesh.verma@outlook.com', phone: '+91-9876543219', address: '56 Salt Lake City, Kolkata, West Bengal - 700064', role: "CUSTOMER" },
    { name: 'Deepika Reddy', email: 'deepika.reddy@gmail.com', phone: '+91-9876543220', address: '34 Banjara Hills, Hyderabad, Telangana - 500034', role: "CUSTOMER" },
    { name: 'Vikash Jain', email: 'vikash.jain@gmail.com', phone: '+91-9876543221', address: '67 Civil Lines, Jaipur, Rajasthan - 302006', role: "CUSTOMER" },
    { name: 'Anita Desai', email: 'anita.desai@yahoo.com', phone: '+91-9876543222', address: '12 FC Road, Pune, Maharashtra - 411005', role: "CUSTOMER" },
    { name: 'Suresh Nair', email: 'suresh.nair@gmail.com', phone: '+91-9876543223', address: '45 Marine Drive, Ernakulam, Kerala - 682031', role: "CUSTOMER" },
    { name: 'Kavita Mehta', email: 'kavita.mehta@gmail.com', phone: '+91-9876543224', address: '78 CG Road, Ahmedabad, Gujarat - 380009', role: "CUSTOMER" },
    { name: 'Ravi Agarwal', email: 'ravi.agarwal@hotmail.com', phone: '+91-9876543225', address: '23 Hazratganj, Lucknow, Uttar Pradesh - 226001', role: "CUSTOMER" },
    { name: 'Meera Iyer', email: 'meera.iyer@gmail.com', phone: '+91-9876543226', address: '56 Anna Nagar, Chennai, Tamil Nadu - 600040', role: "CUSTOMER" },
    { name: 'Karan Malhotra', email: 'karan.malhotra@gmail.com', phone: '+91-9876543227', address: '89 Model Town, Chandigarh - 160022', role: "CUSTOMER" },
    { name: 'Sneha Kulkarni', email: 'sneha.kulkarni@yahoo.com', phone: '+91-9876543228', address: '34 Shivaji Nagar, Nagpur, Maharashtra - 440010', role: "CUSTOMER" },
    { name: 'Arjun Singh', email: 'arjun.singh@outlook.com', phone: '+91-9876543229', address: '67 Lalbagh, Srinagar, Jammu & Kashmir - 190011', role: "CUSTOMER" },
    { name: 'Divya Rastogi', email: 'divya.rastogi@gmail.com', phone: '+91-9876543230', address: '12 Boring Road, Patna, Bihar - 800001', role: "CUSTOMER" },
    { name: 'Manish Tiwari', email: 'manish.tiwari@gmail.com', phone: '+91-9876543231', address: '45 Palasia, Indore, Madhya Pradesh - 452001', role: "CUSTOMER" },
    { name: 'Pooja Saxena', email: 'pooja.saxena@hotmail.com', phone: '+91-9876543232', address: '78 Karol Bagh, New Delhi - 110005', role: "CUSTOMER" },
    { name: 'Rohit Pandey', email: 'rohit.pandey@gmail.com', phone: '+91-9876543233', address: '23 Gomti Nagar, Lucknow, Uttar Pradesh - 226010', role: "CUSTOMER" },
    { name: 'Swati Sharma', email: 'swati.sharma@yahoo.com', phone: '+91-9876543234', address: '56 Malviya Nagar, Jaipur, Rajasthan - 302017', role: "CUSTOMER" },
  ];

  for (const userData of customerUsers) {
    const user = await prisma.user.create({
      data: { ...userData, password: hashedPassword }
    });
    users.push(user);
  }

  console.log('✅ Created 25 users (5 admins + 20 customers)');

  // Create 20 Categories
  const categoryData = [
    { name: 'Bar Tools & Accessories', slug: 'bar-tools-accessories', image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b' },
    { name: 'Copper Water Bottles', slug: 'copper-water-bottles', image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8' },
    { name: 'Cocktail Shakers', slug: 'cocktail-shakers', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307' },
    { name: 'Wine Accessories', slug: 'wine-accessories', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3' },
    { name: 'Bar Glassware', slug: 'bar-glassware', image: 'https://images.unsplash.com/photo-1509669803555-fd5d97b16c7e' },
    { name: 'Copper Cookware', slug: 'copper-cookware', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136' },
    { name: 'Ice Buckets & Tongs', slug: 'ice-buckets-tongs', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96' },
    { name: 'Beer Accessories', slug: 'beer-accessories', image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9' },
    { name: 'Serving Trays', slug: 'serving-trays', image: 'https://images.unsplash.com/photo-1578662015088-7a1f0f10c30a' },
    { name: 'Copper Vessels', slug: 'copper-vessels', image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371' },
    { name: 'Decorative Items', slug: 'decorative-items', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7' },
    { name: 'Chafing Dishes', slug: 'chafing-dishes', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836' },
    { name: 'Hotel Accessories', slug: 'hotel-accessories', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945' },
    { name: 'Measuring Tools', slug: 'measuring-tools', image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90' },
    { name: 'Stainless Steel Items', slug: 'stainless-steel-items', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136' },
    { name: 'Brass Accessories', slug: 'brass-accessories', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96' },
    { name: 'Gift Sets', slug: 'gift-sets', image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0' },
    { name: 'Kitchen Utensils', slug: 'kitchen-utensils', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136' },
    { name: 'Corporate Gifts', slug: 'corporate-gifts', image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0' },
    { name: 'Wedding Collection', slug: 'wedding-collection', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3' }
  ];

  const categories = [];
  for (const categoryInfo of categoryData) {
    const category = await prisma.category.create({ data: categoryInfo });
    categories.push(category);
  }

  console.log('✅ Created 20 categories');

  // Create 50 Products with comprehensive data
  const productData = [
    {
      name: 'Premium Copper Water Bottle', slug: 'premium-copper-water-bottle', description: 'Handcrafted pure copper water bottle with leak-proof cap. Perfect for storing water overnight for Ayurvedic health benefits.',
      price: 899, discount: 10, stock: 50, sku: 'CWB-001', weight: 250, dimensions: '8cm x 8cm x 26cm', material: '100% Pure Copper', isActive: true, isFeatured: true, categoryId: categories[1].id,
      images: [
        { url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8', alt: 'Copper water bottle front view', isPrimary: true },
        { url: 'https://images.unsplash.com/photo-1523362628745-0c100150b504', alt: 'Copper water bottle side view', isPrimary: false }
      ],
      variants: [
        { name: 'Capacity', value: '500ml', price: 0, stock: 25, sku: 'CWB-001-500' },
        { name: 'Capacity', value: '1000ml', price: 200, stock: 25, sku: 'CWB-001-1000' }
      ]
    },
    {
      name: 'Professional Cocktail Shaker Set', slug: 'professional-cocktail-shaker-set', description: 'Complete bartender kit with 750ml shaker, strainer, jigger, and mixing spoon. Made from premium stainless steel.',
      price: 1499, discount: 15, stock: 30, sku: 'CKS-002', weight: 450, dimensions: '10cm x 10cm x 25cm', material: 'Stainless Steel 304', isActive: true, isFeatured: true, categoryId: categories[2].id,
      images: [
        { url: 'https://images.unsplash.com/photo-1551024506-0bccd828d307', alt: 'Cocktail shaker set', isPrimary: true },
        { url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96', alt: 'Shaker components', isPrimary: false }
      ],
      variants: [
        { name: 'Finish', value: 'Mirror Polish', price: 0, stock: 15, sku: 'CKS-002-MP' },
        { name: 'Finish', value: 'Rose Gold', price: 300, stock: 15, sku: 'CKS-002-RG' }
      ]
    },
    {
      name: 'Copper Moscow Mule Mug Set', slug: 'copper-moscow-mule-mug-set', description: 'Set of 4 authentic copper mugs perfect for Moscow Mule cocktails. Keeps drinks cold for hours.',
      price: 2499, discount: 20, stock: 20, sku: 'MMM-003', weight: 800, dimensions: '8cm x 8cm x 10cm (each)', material: 'Pure Copper with Brass Handle', isActive: true, isFeatured: false, categoryId: categories[0].id,
      images: [
        { url: 'https://images.unsplash.com/photo-1560508179-7f98044c5e4f', alt: 'Moscow Mule copper mugs', isPrimary: true }
      ],
      variants: []
    },
    {
      name: 'Wine Opener Corkscrew Premium', slug: 'wine-opener-corkscrew-premium', description: 'Professional sommelier wine opener with wooden handle and double-hinged design for easy cork removal.',
      price: 599, discount: 0, stock: 40, sku: 'WOP-004', weight: 150, dimensions: '12cm x 3cm x 2cm', material: 'Stainless Steel & Rosewood', isActive: true, isFeatured: false, categoryId: categories[3].id,
      images: [
        { url: 'https://images.unsplash.com/photo-1585553616435-2dc0a54e271d', alt: 'Wine opener corkscrew', isPrimary: true }
      ],
      variants: []
    },
    {
      name: 'Crystal Whiskey Glasses Set', slug: 'crystal-whiskey-glasses-set', description: 'Set of 6 premium crystal glasses perfect for whiskey, scotch, and bourbon. Elegant cut design.',
      price: 1899, discount: 5, stock: 25, sku: 'WGS-005', weight: 1200, dimensions: '8cm x 8cm x 9cm (each)', material: 'Lead-Free Crystal Glass', isActive: true, isFeatured: true, categoryId: categories[4].id,
      images: [
        { url: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b', alt: 'Crystal whiskey glasses', isPrimary: true }
      ],
      variants: []
    },
    {
      name: 'Copper Chef Pot Set', slug: 'copper-chef-pot-set', description: 'Traditional copper cooking pot set with brass handles. Perfect for authentic Indian cooking.',
      price: 3499, discount: 12, stock: 15, sku: 'CCP-006', weight: 2500, dimensions: '20cm x 15cm x 10cm', material: 'Pure Copper with Brass', isActive: true, isFeatured: true, categoryId: categories[5].id,
      images: [
        { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136', alt: 'Copper cookware set', isPrimary: true }
      ],
      variants: [
        { name: 'Size', value: 'Small (1L)', price: -500, stock: 5, sku: 'CCP-006-S' },
        { name: 'Size', value: 'Medium (2L)', price: 0, stock: 5, sku: 'CCP-006-M' },
        { name: 'Size', value: 'Large (3L)', price: 500, stock: 5, sku: 'CCP-006-L' }
      ]
    },
    {
      name: 'Stainless Steel Ice Bucket', slug: 'stainless-steel-ice-bucket', description: 'Double-walled insulated ice bucket with matching tongs. Keeps ice frozen for hours.',
      price: 1299, discount: 8, stock: 35, sku: 'IB-007', weight: 800, dimensions: '18cm x 18cm x 20cm', material: 'Stainless Steel 304', isActive: true, isFeatured: false, categoryId: categories[6].id,
      images: [
        { url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96', alt: 'Ice bucket with tongs', isPrimary: true }
      ],
      variants: []
    },
    {
      name: 'Beer Mug Set of 6', slug: 'beer-mug-set-of-6', description: 'Heavy-duty glass beer mugs with comfortable handles. Perfect for serving beer and cold beverages.',
      price: 899, discount: 15, stock: 40, sku: 'BM-008', weight: 1500, dimensions: '9cm x 9cm x 15cm (each)', material: 'Tempered Glass', isActive: true, isFeatured: false, categoryId: categories[7].id,
      images: [
        { url: 'https://images.unsplash.com/photo-1608270586620-248524c67de9', alt: 'Beer mugs set', isPrimary: true }
      ],
      variants: []
    },
    {
      name: 'Wooden Serving Tray Round', slug: 'wooden-serving-tray-round', description: 'Handcrafted wooden serving tray with brass handles. Perfect for entertaining guests.',
      price: 799, discount: 0, stock: 30, sku: 'WST-009', weight: 600, dimensions: '35cm diameter x 5cm height', material: 'Sheesham Wood with Brass', isActive: true, isFeatured: false, categoryId: categories[8].id,
      images: [
        { url: 'https://images.unsplash.com/photo-1578662015088-7a1f0f10c30a', alt: 'Wooden serving tray', isPrimary: true }
      ],
      variants: []
    },
    {
      name: 'Copper Water Vessel Traditional', slug: 'copper-water-vessel-traditional', description: 'Traditional copper kalash for water storage. Authentic design with health benefits.',
      price: 1599, discount: 5, stock: 25, sku: 'CWV-010', weight: 1200, dimensions: '20cm x 20cm x 25cm', material: '99.9% Pure Copper', isActive: true, isFeatured: true, categoryId: categories[9].id,
      images: [
        { url: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371', alt: 'Copper water vessel', isPrimary: true }
      ],
      variants: []
    },
    {
      name: 'Brass Decorative Bowl Set', slug: 'brass-decorative-bowl-set', description: 'Set of 3 decorative brass bowls with intricate engravings. Perfect for home decoration.',
      price: 1199, discount: 10, stock: 20, sku: 'BDB-011', weight: 900, dimensions: 'Various sizes', material: 'Pure Brass', isActive: true, isFeatured: false, categoryId: categories[10].id,
      images: [
        { url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7', alt: 'Brass decorative bowls', isPrimary: true }
      ],
      variants: []
    },
    {
      name: 'Chafing Dish Deluxe', slug: 'chafing-dish-deluxe', description: 'Professional chafing dish with fuel burner. Perfect for buffets and catering.',
      price: 2799, discount: 18, stock: 12, sku: 'CD-012', weight: 3500, dimensions: '45cm x 30cm x 25cm', material: 'Stainless Steel with Brass Accents', isActive: true, isFeatured: false, categoryId: categories[11].id,
      images: [
        { url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836', alt: 'Chafing dish', isPrimary: true }
      ],
      variants: []
    },
    {
      name: 'Hotel Amenity Set Premium', slug: 'hotel-amenity-set-premium', description: 'Complete hotel room amenity set including ice bucket, tray, and glasses.',
      price: 3999, discount: 25, stock: 8, sku: 'HAS-013', weight: 4000, dimensions: 'Set of 8 items', material: 'Stainless Steel & Brass', isActive: true, isFeatured: true, categoryId: categories[12].id,
      images: [
        { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945', alt: 'Hotel amenities', isPrimary: true }
      ],
      variants: []
    },
    {
      name: 'Jigger Measuring Set Professional', slug: 'jigger-measuring-set-professional', description: 'Professional bartender measuring jigger set with multiple measurements.',
      price: 599, discount: 0, stock: 50, sku: 'JMS-014', weight: 200, dimensions: '8cm x 4cm x 10cm', material: 'Stainless Steel', isActive: true, isFeatured: false, categoryId: categories[13].id,
      images: [
        { url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90', alt: 'Measuring jiggers', isPrimary: true }
      ],
      variants: []
    },
    {
      name: 'Stainless Steel Mixing Bowl Set', slug: 'stainless-steel-mixing-bowl-set', description: 'Set of 5 nested mixing bowls with non-slip base. Perfect for kitchen use.',
      price: 1299, discount: 12, stock: 30, sku: 'SMB-015', weight: 1800, dimensions: 'Various sizes', material: 'Food Grade Stainless Steel', isActive: true, isFeatured: false, categoryId: categories[14].id,
      images: [
        { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136', alt: 'Steel mixing bowls', isPrimary: true }
      ],
      variants: []
    }
  ];

  // Add more products to reach 50
  const additionalProducts = [
    // Brass Accessories
    { name: 'Brass Candle Stand Pair', slug: 'brass-candle-stand-pair', description: 'Elegant pair of brass candle stands with traditional design.', price: 899, discount: 5, stock: 25, sku: 'BCS-016', weight: 600, dimensions: '15cm x 15cm x 20cm', material: 'Pure Brass', isActive: true, isFeatured: false, categoryId: categories[15].id },
    { name: 'Brass Pooja Thali Set', slug: 'brass-pooja-thali-set', description: 'Complete brass pooja thali set with diya, incense holder, and water bowl.', price: 1599, discount: 8, stock: 20, sku: 'BPT-017', weight: 800, dimensions: '25cm diameter', material: 'Pure Brass', isActive: true, isFeatured: false, categoryId: categories[15].id },
    
    // Gift Sets
    { name: 'Executive Whiskey Gift Set', slug: 'executive-whiskey-gift-set', description: 'Premium gift set with 2 glasses, whiskey stones, and wooden box.', price: 2999, discount: 20, stock: 15, sku: 'EWG-018', weight: 1500, dimensions: '30cm x 20cm x 10cm', material: 'Crystal & Wood', isActive: true, isFeatured: true, categoryId: categories[16].id },
    { name: 'Copper Water Bottle Gift Set', slug: 'copper-water-bottle-gift-set', description: 'Beautiful gift set with copper bottle, cleaning brush, and care instructions.', price: 1299, discount: 15, stock: 35, sku: 'CWG-019', weight: 400, dimensions: '25cm x 15cm x 8cm', material: 'Copper & Accessories', isActive: true, isFeatured: true, categoryId: categories[16].id },
    
    // Kitchen Utensils
    { name: 'Copper Ladle Set', slug: 'copper-ladle-set', description: 'Set of 4 copper ladles in different sizes for traditional cooking.', price: 799, discount: 10, stock: 40, sku: 'CL-020', weight: 500, dimensions: 'Various sizes', material: 'Pure Copper', isActive: true, isFeatured: false, categoryId: categories[17].id },
    { name: 'Stainless Steel Kitchen Tools', slug: 'stainless-steel-kitchen-tools', description: 'Complete kitchen utensil set with spatulas, spoons, and tongs.', price: 1599, discount: 12, stock: 30, sku: 'SKT-021', weight: 800, dimensions: 'Set of 8 tools', material: 'Stainless Steel', isActive: true, isFeatured: false, categoryId: categories[17].id },
    
    // Corporate Gifts
    { name: 'Corporate Trophy Cup', slug: 'corporate-trophy-cup', description: 'Elegant trophy cup for corporate awards and recognition ceremonies.', price: 1899, discount: 0, stock: 20, sku: 'CTC-022', weight: 700, dimensions: '20cm x 15cm x 25cm', material: 'Brass & Steel', isActive: true, isFeatured: false, categoryId: categories[18].id },
    { name: 'Executive Desk Organizer', slug: 'executive-desk-organizer', description: 'Premium desk organizer set with pen holder, card stand, and paperweight.', price: 2299, discount: 15, stock: 25, sku: 'EDO-023', weight: 1200, dimensions: '30cm x 20cm x 15cm', material: 'Brass & Wood', isActive: true, isFeatured: false, categoryId: categories[18].id },
    
    // Wedding Collection
    { name: 'Wedding Kalash Set', slug: 'wedding-kalash-set', description: 'Traditional brass kalash set for wedding ceremonies and rituals.', price: 3999, discount: 10, stock: 12, sku: 'WKS-024', weight: 2000, dimensions: 'Set of 3 kalash', material: 'Pure Brass', isActive: true, isFeatured: true, categoryId: categories[19].id },
    { name: 'Wedding Pooja Items Set', slug: 'wedding-pooja-items-set', description: 'Complete pooja items set for wedding ceremonies including thali, diya, and accessories.', price: 4999, discount: 18, stock: 8, sku: 'WPI-025', weight: 2500, dimensions: 'Set of 15 items', material: 'Brass & Silver Plated', isActive: true, isFeatured: true, categoryId: categories[19].id },
    
    // More Bar Accessories
    { name: 'Copper Julep Cup Set', slug: 'copper-julep-cup-set', description: 'Set of 4 copper julep cups perfect for mint julep and cocktails.', price: 1899, discount: 12, stock: 22, sku: 'CJC-026', weight: 600, dimensions: '8cm x 8cm x 12cm', material: 'Pure Copper', isActive: true, isFeatured: false, categoryId: categories[0].id },
    { name: 'Bar Spoon Set Long Handle', slug: 'bar-spoon-set-long-handle', description: 'Professional bar spoon set with spiral handle for perfect stirring.', price: 699, discount: 8, stock: 45, sku: 'BSS-027', weight: 150, dimensions: '30cm length', material: 'Stainless Steel', isActive: true, isFeatured: false, categoryId: categories[0].id },
    
    // Wine Accessories
    { name: 'Wine Decanter Crystal', slug: 'wine-decanter-crystal', description: 'Premium crystal wine decanter with aerating design for perfect wine service.', price: 2799, discount: 15, stock: 18, sku: 'WDC-028', weight: 1000, dimensions: '15cm x 15cm x 25cm', material: 'Lead-Free Crystal', isActive: true, isFeatured: true, categoryId: categories[3].id },
    { name: 'Wine Stopper Set Elegant', slug: 'wine-stopper-set-elegant', description: 'Set of 3 elegant wine stoppers with different designs and vacuum seal.', price: 899, discount: 5, stock: 35, sku: 'WSE-029', weight: 200, dimensions: 'Various sizes', material: 'Stainless Steel & Rubber', isActive: true, isFeatured: false, categoryId: categories[3].id },
    
    // Glassware
    { name: 'Champagne Flute Set', slug: 'champagne-flute-set', description: 'Set of 6 elegant champagne flutes with crystal clear design.', price: 1599, discount: 10, stock: 28, sku: 'CFS-030', weight: 800, dimensions: '7cm x 7cm x 22cm', material: 'Crystal Glass', isActive: true, isFeatured: false, categoryId: categories[4].id },
    { name: 'Brandy Snifter Glasses', slug: 'brandy-snifter-glasses', description: 'Premium brandy snifter glasses set perfect for cognac and brandy tasting.', price: 1299, discount: 8, stock: 32, sku: 'BSG-031', weight: 600, dimensions: '10cm x 10cm x 12cm', material: 'Crystal Glass', isActive: true, isFeatured: false, categoryId: categories[4].id },
    
    // Copper Water Products
    { name: 'Copper Water Jug Traditional', slug: 'copper-water-jug-traditional', description: 'Large capacity copper water jug with traditional design and spout.', price: 1899, discount: 12, stock: 20, sku: 'CWJ-032', weight: 1500, dimensions: '25cm x 18cm x 30cm', material: '100% Pure Copper', isActive: true, isFeatured: true, categoryId: categories[1].id },
    { name: 'Copper Water Glass Set', slug: 'copper-water-glass-set', description: 'Set of 6 copper drinking glasses with smooth finish and health benefits.', price: 1199, discount: 15, stock: 40, sku: 'CWG-033', weight: 800, dimensions: '8cm x 8cm x 10cm', material: 'Pure Copper', isActive: true, isFeatured: false, categoryId: categories[1].id },
    
    // More Cocktail Items
    { name: 'Muddler Tool Professional', slug: 'muddler-tool-professional', description: 'Professional wooden muddler for crushing herbs and fruits in cocktails.', price: 399, discount: 0, stock: 60, sku: 'MTP-034', weight: 100, dimensions: '25cm x 3cm', material: 'Hardwood', isActive: true, isFeatured: false, categoryId: categories[2].id },
    { name: 'Cocktail Strainer Fine Mesh', slug: 'cocktail-strainer-fine-mesh', description: 'Fine mesh cocktail strainer for smooth, pulp-free cocktails.', price: 599, discount: 5, stock: 50, sku: 'CSF-035', weight: 150, dimensions: '12cm diameter', material: 'Stainless Steel', isActive: true, isFeatured: false, categoryId: categories[2].id },
    
    // Serving Items
    { name: 'Copper Serving Bowls Set', slug: 'copper-serving-bowls-set', description: 'Set of 3 copper serving bowls in different sizes for Indian cuisine.', price: 1599, discount: 10, stock: 25, sku: 'CSB-036', weight: 1200, dimensions: 'Small, Medium, Large', material: 'Pure Copper', isActive: true, isFeatured: false, categoryId: categories[8].id },
    { name: 'Bamboo Serving Tray Eco', slug: 'bamboo-serving-tray-eco', description: 'Eco-friendly bamboo serving tray with natural finish and rope handles.', price: 699, discount: 8, stock: 35, sku: 'BST-037', weight: 400, dimensions: '40cm x 25cm x 5cm', material: 'Natural Bamboo', isActive: true, isFeatured: false, categoryId: categories[8].id },
    
    // Ice & Bar Tools
    { name: 'Ice Tongs Elegant Design', slug: 'ice-tongs-elegant-design', description: 'Elegant ice tongs with serrated grip for secure ice handling.', price: 399, discount: 0, stock: 55, sku: 'ITE-038', weight: 100, dimensions: '18cm length', material: 'Stainless Steel', isActive: true, isFeatured: false, categoryId: categories[6].id },
    { name: 'Ice Crusher Manual', slug: 'ice-crusher-manual', description: 'Manual ice crusher for fresh crushed ice in cocktails and drinks.', price: 1299, discount: 15, stock: 20, sku: 'ICM-039', weight: 1800, dimensions: '20cm x 15cm x 25cm', material: 'Cast Iron & Steel', isActive: true, isFeatured: false, categoryId: categories[6].id },
    
    // Decorative & Gift Items
    { name: 'Copper Flower Vase Antique', slug: 'copper-flower-vase-antique', description: 'Antique design copper flower vase with intricate patterns.', price: 1199, discount: 12, stock: 18, sku: 'CFV-040', weight: 800, dimensions: '15cm x 15cm x 25cm', material: 'Pure Copper', isActive: true, isFeatured: false, categoryId: categories[10].id },
    { name: 'Brass Lamp Traditional', slug: 'brass-lamp-traditional', description: 'Traditional brass oil lamp (diya) for religious ceremonies and decoration.', price: 799, discount: 5, stock: 30, sku: 'BLT-041', weight: 400, dimensions: '12cm x 8cm x 15cm', material: 'Pure Brass', isActive: true, isFeatured: false, categoryId: categories[10].id },
    
    // Premium Items
    { name: 'Silver Plated Tea Set', slug: 'silver-plated-tea-set', description: 'Elegant silver plated tea set with teapot, cups, and serving tray.', price: 8999, discount: 20, stock: 5, sku: 'SPT-042', weight: 3000, dimensions: 'Complete set', material: 'Silver Plated Brass', isActive: true, isFeatured: true, categoryId: categories[16].id },
    { name: 'Gold Plated Pooja Thali', slug: 'gold-plated-pooja-thali', description: 'Premium gold plated pooja thali with complete accessories for special occasions.', price: 5999, discount: 15, stock: 8, sku: 'GPT-043', weight: 1200, dimensions: '30cm diameter', material: 'Gold Plated Brass', isActive: true, isFeatured: true, categoryId: categories[19].id },
    
    // Outdoor & Bar Cart Items
    { name: 'Portable Bar Cart Vintage', slug: 'portable-bar-cart-vintage', description: 'Vintage style portable bar cart with wheels and multiple shelves.', price: 12999, discount: 25, stock: 3, sku: 'PBC-044', weight: 8000, dimensions: '80cm x 50cm x 90cm', material: 'Wood & Brass', isActive: true, isFeatured: true, categoryId: categories[0].id },
    
    // Specialty Items
    { name: 'Hookah Base Copper', slug: 'hookah-base-copper', description: 'Traditional copper hookah base with elegant design and perfect balance.', price: 2299, discount: 18, stock: 12, sku: 'HBC-045', weight: 2000, dimensions: '25cm x 25cm x 35cm', material: 'Pure Copper', isActive: true, isFeatured: false, categoryId: categories[15].id },
    
    // Kitchen Storage
    { name: 'Copper Spice Box Traditional', slug: 'copper-spice-box-traditional', description: 'Traditional copper masala dabba with 7 compartments and spoons.', price: 1799, discount: 10, stock: 22, sku: 'CSB-046', weight: 1000, dimensions: '20cm diameter x 8cm height', material: 'Pure Copper', isActive: true, isFeatured: false, categoryId: categories[17].id },
    
    // Bar Accessories Advanced
    { name: 'Cocktail Smoking Kit', slug: 'cocktail-smoking-kit', description: 'Professional cocktail smoking kit with wood chips and torch for flavored drinks.', price: 3999, discount: 22, stock: 10, sku: 'CSK-047', weight: 1500, dimensions: 'Complete kit', material: 'Various Materials', isActive: true, isFeatured: true, categoryId: categories[2].id },
    
    // Limited Edition
    { name: 'Handcrafted Copper Pitcher Limited', slug: 'handcrafted-copper-pitcher-limited', description: 'Limited edition handcrafted copper pitcher with unique hammered design.', price: 4999, discount: 0, stock: 5, sku: 'HCP-048', weight: 1800, dimensions: '20cm x 15cm x 30cm', material: '99.9% Pure Copper', isActive: true, isFeatured: true, categoryId: categories[9].id },
    
    // Restaurant Grade
    { name: 'Commercial Grade Ice Bucket', slug: 'commercial-grade-ice-bucket', description: 'Heavy duty commercial grade ice bucket for restaurants and bars.', price: 2799, discount: 12, stock: 15, sku: 'CGB-049', weight: 2200, dimensions: '30cm x 30cm x 35cm', material: 'Stainless Steel 316', isActive: true, isFeatured: false, categoryId: categories[6].id },
    
    // Festival Special
    { name: 'Diwali Special Gift Hamper', slug: 'diwali-special-gift-hamper', description: 'Special Diwali gift hamper with brass items, sweets container, and diyas.', price: 3599, discount: 20, stock: 25, sku: 'DSG-050', weight: 2000, dimensions: 'Gift box 40x30x15cm', material: 'Mixed Materials', isActive: true, isFeatured: true, categoryId: categories[16].id }
  ];

  // Combine all products
  const allProducts = [...productData, ...additionalProducts];
  const products = [];

  for (const productInfo of allProducts) {
    const { images, variants, ...productData } = productInfo;
    
    const product = await prisma.product.create({
      data: {
        ...productData,
        images: {
          create: images || []
        },
        variants: {
          create: variants || []
        }
      }
    });
    
    products.push(product);
  }

  console.log('✅ Created 50 comprehensive products');

  // Create 100+ Reviews (multiple reviews per product from different users)
  const reviewsData = [];
  const reviewComments = [
    { rating: 5, comment: 'Excellent quality! Exceeded my expectations. Highly recommended for everyone.', isVerified: true },
    { rating: 5, comment: 'Outstanding product with beautiful craftsmanship. Worth every penny spent.', isVerified: true },
    { rating: 4, comment: 'Very good quality but delivery took longer than expected. Overall satisfied.', isVerified: true },
    { rating: 5, comment: 'Perfect for my needs! Great build quality and elegant design.', isVerified: true },
    { rating: 4, comment: 'Good product with minor packaging issues. Quality is solid though.', isVerified: true },
    { rating: 5, comment: 'Amazing craftsmanship! This will be perfect for my home bar setup.', isVerified: true },
    { rating: 3, comment: 'Average product. Expected better quality for the price point.', isVerified: false },
    { rating: 4, comment: 'Good value for money. Functional and looks decent too.', isVerified: true },
    { rating: 5, comment: 'Superb quality! Using it daily and very happy with the purchase.', isVerified: true },
    { rating: 2, comment: 'Not as described. Quality issues noticed after a week of use.', isVerified: false },
    { rating: 5, comment: 'Premium feel and finish. Exactly what I was looking for!', isVerified: true },
    { rating: 4, comment: 'Great product but could use better packaging for shipping safety.', isVerified: true },
    { rating: 5, comment: 'Love the traditional design! Authentic and high quality material.', isVerified: true },
    { rating: 1, comment: 'Poor quality. Damaged upon arrival and customer service was unhelpful.', isVerified: false },
    { rating: 4, comment: 'Decent quality for the price. Would recommend to others.', isVerified: true },
    { rating: 5, comment: 'Fantastic! Perfect gift item. Recipient was very happy with it.', isVerified: true },
    { rating: 3, comment: 'Okay product but nothing special. Average quality for average price.', isVerified: false },
    { rating: 5, comment: 'Brilliant craftsmanship! Will definitely buy more products from this seller.', isVerified: true },
    { rating: 4, comment: 'Good build quality. Slightly heavy but thats expected for copper items.', isVerified: true },
    { rating: 5, comment: 'Perfect for professional use! Restaurant quality at home prices.', isVerified: true }
  ];

  // Create reviews for each product (2-5 reviews per product)
  const reviewTracker = new Set(); // Track user-product combinations
  const customersForReviews = users.filter(user => user.role === 'CUSTOMER');
  
  for (let i = 0; i < products.length; i++) {
    const numReviews = Math.floor(Math.random() * 4) + 2; // 2-5 reviews per product
    const usedUsers = new Set();
    let reviewsForProduct = 0;
    
    while (reviewsForProduct < numReviews && usedUsers.size < customersForReviews.length) {
      let randomUserIndex;
      do {
        randomUserIndex = Math.floor(Math.random() * customersForReviews.length);
      } while (usedUsers.has(randomUserIndex));
      
      const userId = customersForReviews[randomUserIndex].id;
      const productId = products[i].id;
      const reviewKey = `${productId}-${userId}`;
      
      // Check if this user-product combination already exists
      if (!reviewTracker.has(reviewKey)) {
        usedUsers.add(randomUserIndex);
        reviewTracker.add(reviewKey);
        
        const randomReview = reviewComments[Math.floor(Math.random() * reviewComments.length)];
        
        reviewsData.push({
          productId: productId,
          userId: userId,
          rating: randomReview.rating,
          comment: randomReview.comment,
          isVerified: randomReview.isVerified,
        });
        
        reviewsForProduct++;
      }
    }
  }

  // Add some specific high-quality reviews for featured products (avoid duplicates)
  const featuredReviews = [];
  const featuredReviewsData = [
    { productIndex: 0, userIndex: 5, rating: 5, comment: 'This copper water bottle has changed my daily routine! The water tastes so much better and I feel healthier. The craftsmanship is exceptional with smooth finish and leak-proof design. Highly recommend for anyone looking to improve their health naturally.', isVerified: true },
    { productIndex: 1, userIndex: 6, rating: 5, comment: 'Professional bartender here - this cocktail shaker set is restaurant quality! The weight distribution is perfect, strainer works flawlessly, and the finish is beautiful. Worth every rupee for serious home bartenders.', isVerified: true },
    { productIndex: 4, userIndex: 7, rating: 5, comment: 'These whiskey glasses are absolutely stunning! The crystal is clear and brilliant, perfect weight in hand. They elevate any drinking experience. Received many compliments from guests. Premium quality at fair price.', isVerified: true },
    { productIndex: 5, userIndex: 8, rating: 4, comment: 'Beautiful copper cookware set! Food tastes different (in a good way) when cooked in copper. Takes some getting used to the maintenance but the results are worth it. Authentic traditional cooking experience.', isVerified: true },
    { productIndex: 12, userIndex: 9, rating: 5, comment: 'Purchased this hotel amenity set for our guest house. Guests are always impressed with the quality and elegance. Professional appearance and durable construction. Great investment for hospitality business.', isVerified: true }
  ];

  for (const featuredReview of featuredReviewsData) {
    if (featuredReview.productIndex < products.length && featuredReview.userIndex < customersForReviews.length) {
      const productId = products[featuredReview.productIndex].id;
      const userId = customersForReviews[featuredReview.userIndex].id;
      const reviewKey = `${productId}-${userId}`;
      
      if (!reviewTracker.has(reviewKey)) {
        reviewTracker.add(reviewKey);
        featuredReviews.push({
          productId: productId,
          userId: userId,
          rating: featuredReview.rating,
          comment: featuredReview.comment,
          isVerified: featuredReview.isVerified
        });
      }
    }
  }

  reviewsData.push(...featuredReviews);

  await prisma.review.createMany({ data: reviewsData });
  console.log(`✅ Created ${reviewsData.length} comprehensive reviews`);

  // Create Carts for 15 customers (random cart contents)
  const filteredCustomers = users.filter(user => user.role === 'CUSTOMER');
  const cartsCreated = [];
  
  for (let i = 0; i < 15; i++) {
    const user = filteredCustomers[i];
    const numItems = Math.floor(Math.random() * 5) + 1; // 1-5 items per cart
    const cartItems = [];
    const usedProducts = new Set();
    
    for (let j = 0; j < numItems; j++) {
      let randomProduct;
      do {
        randomProduct = products[Math.floor(Math.random() * products.length)];
      } while (usedProducts.has(randomProduct.id));
      
      usedProducts.add(randomProduct.id);
      cartItems.push({
        productId: randomProduct.id,
        quantity: Math.floor(Math.random() * 3) + 1 // 1-3 quantity
      });
    }
    
    const cart = await prisma.cart.create({
      data: {
        userId: user.id,
        items: {
          create: cartItems
        }
      }
    });
    cartsCreated.push(cart);
  }

  console.log('✅ Created 15 customer carts');

  // Create Wishlists for 18 customers
  const wishlistsCreated = [];
  
  for (let i = 0; i < 18; i++) {
    const user = filteredCustomers[i];
    const numItems = Math.floor(Math.random() * 8) + 1; // 1-8 items per wishlist
    const wishlistItems = [];
    const usedProducts = new Set();
    
    for (let j = 0; j < numItems; j++) {
      let randomProduct;
      do {
        randomProduct = products[Math.floor(Math.random() * products.length)];
      } while (usedProducts.has(randomProduct.id));
      
      usedProducts.add(randomProduct.id);
      wishlistItems.push({
        productId: randomProduct.id
      });
    }
    
    const wishlist = await prisma.wishlist.create({
      data: {
        userId: user.id,
        items: {
          create: wishlistItems
        }
      }
    });
    wishlistsCreated.push(wishlist);
  }

  console.log('✅ Created 18 customer wishlists');

  // Create 30 Orders with different statuses and comprehensive data
  const orderStatuses = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];
  const paymentMethods = ["Razorpay", "PayPal", "Bank Transfer", "Cash on Delivery", "UPI", "Credit Card", "Debit Card"];
  const shippingNotes = [
    "Please deliver after 6 PM",
    "Leave at the security gate",
    "Call before delivery",
    "Handle with care - fragile items",
    "Gift wrapping requested",
    "",
    "Express delivery required",
    "Contactless delivery preferred",
    "Deliver on weekends only",
    "Office delivery - 9 AM to 5 PM"
  ];

  const ordersCreated = [];
  
  for (let i = 0; i < 30; i++) {
    const customer = filteredCustomers[i % filteredCustomers.length];
    const numItems = Math.floor(Math.random() * 4) + 1; // 1-4 items per order
    const orderItems = [];
    const usedProducts = new Set();
    let totalAmount = 0;
    
    // Create order items
    for (let j = 0; j < numItems; j++) {
      let randomProduct;
      do {
        randomProduct = products[Math.floor(Math.random() * products.length)];
      } while (usedProducts.has(randomProduct.id));
      
      usedProducts.add(randomProduct.id);
      const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 quantity
      const discountedPrice = randomProduct.price * (1 - randomProduct.discount / 100);
      const itemTotal = discountedPrice * quantity;
      
      orderItems.push({
        productId: randomProduct.id,
        quantity: quantity,
        price: itemTotal,
      });
      
      totalAmount += itemTotal;
    }
    
    // Generate random order data
    const status = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
    const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
    const notes = shippingNotes[Math.floor(Math.random() * shippingNotes.length)];
    
    // Generate tracking number for shipped/delivered orders
    const trackingNumber = (status === "SHIPPED" || status === "DELIVERED") 
      ? `TRACK${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}` 
      : null;
    
    // Generate payment ID for paid/processing/shipped/delivered orders
    const paymentId = !["PENDING", "CANCELLED"].includes(status) 
      ? `pay_${String(Math.floor(Math.random() * 1000000000)).padStart(9, '0')}` 
      : null;

    const order = await prisma.order.create({
      data: {
        userId: customer.id,
        totalAmount: Math.round(totalAmount * 100) / 100, // Round to 2 decimal places
        status: status,
        paymentId: paymentId,
        paymentMethod: paymentMethod,
        shippingAddress: customer.address.split(',')[0], // Extract address line
        shippingCity: customer.address.split(',')[1]?.trim() || 'Unknown City',
        shippingState: customer.address.split(',')[2]?.trim() || 'Unknown State',
        shippingPincode: customer.address.split('-')[1]?.trim() || '000000',
        shippingPhone: customer.phone,
        trackingNumber: trackingNumber,
        notes: notes || null,
        items: {
          create: orderItems
        }
      }
    });
    
    ordersCreated.push(order);
  }

  console.log('✅ Created 30 comprehensive orders with all statuses');

  // Create 50+ Product Inquiries with comprehensive scenarios
  const inquiryStatuses = ["PENDING", "CONTACTED", "FULFILLED", "CLOSED"];
  const inquiryMessages = [
    "Hi, I am looking for a premium gold-plated cocktail shaker set with 8 pieces. Do you have this in stock or can you arrange it?",
    "Need copper beer mugs similar to Moscow Mule mugs but larger capacity (500ml). Please let me know availability and pricing.",
    "Looking for a crystal wine decanter with custom engraving for corporate gifting. Need bulk quantities. Can you do customization?",
    "Do you have any plans to stock vintage-style bar carts? I saw similar items on social media.",
    "Need a double-walled stainless steel ice bucket with matching tongs. What colors are available?",
    "Interested in bulk purchase for hotel project. Need 200+ pieces of various bar accessories. Can you provide wholesale pricing?",
    "Looking for traditional copper water vessels for Ayurvedic treatment center. Need authentic designs with proper certification.",
    "Want to order custom engraved wine glasses for wedding favors. Need 150 pieces with names and date. What's the lead time?",
    "Searching for restaurant-grade chafing dishes with fuel burners. Need immediate delivery for catering business.",
    "Interested in brass pooja items set for temple donation. Need large quantity with religious authenticity certificate.",
    "Looking for copper cookware set for professional kitchen. Need heat conductivity specifications and warranty details.",
    "Want to purchase bar tools set for bartending school. Need educational discount and bulk pricing for 50 students.",
    "Interested in antique brass decorative items for interior design project. Need unique pieces with historical significance.",
    "Looking for premium gift sets for corporate Diwali gifting. Need customized packaging and bulk delivery options.",
    "Need stainless steel measuring tools for commercial kitchen setup. Required food-grade certification and calibration.",
    "Searching for wedding kalash set in pure silver for royal wedding. Budget no constraint, need premium quality only.",
    "Interested in copper Moscow Mule mugs for restaurant chain. Need 500+ pieces with consistent quality standards.",
    "Looking for ice crusher machine for bar setup. Need commercial grade with high capacity and durability.",
    "Want to buy traditional brass lamps for cultural center. Need authentic designs and proper documentation.",
    "Searching for crystal whiskey glasses for luxury hotel bar. Need premium quality with elegant presentation.",
    "Interested in serving trays for high-end restaurant. Need various sizes in copper and brass materials.",
    "Looking for copper spice boxes for spice retail business. Need authentic traditional designs with compartments.",
    "Need wine accessories complete set for wine tasting events. Looking for professional sommelier tools.",
    "Interested in decorative bowls for art gallery exhibition. Need unique artistic pieces with cultural significance.",
    "Looking for hotel amenity sets for new property launch. Need premium quality with brand customization options.",
    "Searching for brass candle stands for meditation center. Need various heights and authentic spiritual designs.",
    "Want to purchase cocktail smoking kit for molecular gastronomy. Need complete setup with training support.",
    "Interested in copper pitcher for Ayurvedic doctor's clinic. Need certified pure copper with health benefits proof.",
    "Looking for commercial ice buckets for event management company. Need durable and easy to transport options.",
    "Need festival gift hampers for employee appreciation. Looking for traditional items with modern presentation."
  ];

  const productNames = [
    "Gold Plated Cocktail Set", "Copper Beer Mugs Large", "Engraved Wine Decanter", "Vintage Bar Cart", "Ice Bucket with Tongs",
    "Hotel Bar Accessories Bulk", "Traditional Copper Vessels", "Custom Wine Glasses", "Restaurant Chafing Dishes", "Brass Pooja Items Set",
    "Professional Copper Cookware", "Bartending Tools Educational Set", "Antique Brass Decorative Items", "Corporate Gift Sets Diwali",
    "Commercial Measuring Tools", "Silver Wedding Kalash Set", "Moscow Mule Mugs Bulk", "Commercial Ice Crusher", "Traditional Brass Lamps",
    "Crystal Whiskey Glasses Premium", "Serving Trays Restaurant", "Copper Spice Boxes Traditional", "Wine Accessories Complete",
    "Artistic Decorative Bowls", "Hotel Amenity Sets Custom", "Brass Candle Stands Meditation", "Cocktail Smoking Kit Complete",
    "Copper Pitcher Ayurvedic", "Commercial Ice Buckets Events", "Festival Gift Hampers Traditional"
  ];

  const inquiriesData = [];
  
  // Create inquiries with user associations
  for (let i = 0; i < 30; i++) {
    const customer = filteredCustomers[i % filteredCustomers.length];
    const messageIndex = i % inquiryMessages.length;
    const productNameIndex = i % productNames.length;
    const status = inquiryStatuses[Math.floor(Math.random() * inquiryStatuses.length)];
    const quantity = Math.floor(Math.random() * 100) + 1; // 1-100 quantity
    
    inquiriesData.push({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      productName: productNames[productNameIndex],
      message: inquiryMessages[messageIndex],
      quantity: quantity,
      status: status,
      userId: customer.id,
    });
  }
  
  // Create inquiries without user associations (anonymous customers)
  const anonymousNames = [
    "Rohit Kumar", "Anjali Sharma", "Vikram Singh", "Madhuri Patel", "Sachin Gupta", 
    "Rekha Verma", "Arun Joshi", "Sunita Rao", "Manoj Tiwari", "Kavitha Reddy",
    "Sanjay Agarwal", "Preeti Saxena", "Rakesh Pandey", "Nisha Malhotra", "Deepak Bhatt",
    "Seema Kulkarni", "Ashish Sinha", "Pooja Rastogi", "Naveen Chandra", "Shweta Jain"
  ];
  
  for (let i = 0; i < 20; i++) {
    const messageIndex = (i + 30) % inquiryMessages.length;
    const productNameIndex = (i + 30) % productNames.length;
    const status = inquiryStatuses[Math.floor(Math.random() * inquiryStatuses.length)];
    const quantity = Math.floor(Math.random() * 50) + 1; // 1-50 quantity
    
    inquiriesData.push({
      name: anonymousNames[i],
      email: `${anonymousNames[i].toLowerCase().replace(' ', '.')}@gmail.com`,
      phone: `+91-98765432${String(50 + i).padStart(2, '0')}`,
      productName: productNames[productNameIndex],
      message: inquiryMessages[messageIndex],
      quantity: quantity,
      status: status,
      userId: null, // Anonymous inquiry
    });
  }

  await prisma.productInquiry.createMany({ data: inquiriesData });
  console.log(`✅ Created ${inquiriesData.length} comprehensive product inquiries (30 from users + 20 anonymous)`);

  console.log('🎉 Comprehensive database seeding completed successfully!');
  console.log('\n📊 Complete Summary:');
  console.log(`👥 Users: ${await prisma.user.count()} (5 Admins + 20 Customers)`);
  console.log(`📂 Categories: ${await prisma.category.count()} (Comprehensive product categories)`);
  console.log(`🛍️ Products: ${await prisma.product.count()} (With images, variants, and full details)`);
  console.log(`🖼️ Product Images: ${await prisma.productImage.count()}`);
  console.log(`🔄 Product Variants: ${await prisma.productVariant.count()}`);
  console.log(`⭐ Reviews: ${await prisma.review.count()} (Multiple reviews per product)`);
  console.log(`🛒 Carts: ${await prisma.cart.count()} (Active customer carts)`);
  console.log(`❤️ Wishlists: ${await prisma.wishlist.count()} (Customer wishlists)`);
  console.log(`📦 Orders: ${await prisma.order.count()} (All order statuses covered)`);
  console.log(`📝 Order Items: ${await prisma.orderItem.count()}`);
  console.log(`💬 Product Inquiries: ${await prisma.productInquiry.count()} (User + Anonymous inquiries)`);
  
  console.log('\n🔑 Login Credentials (Password: 123456 for all):');
  console.log('📧 Super Admin: admin@rudraexports.com');
  console.log('📧 Business Owner: akansha@rudraexports.com');
  console.log('📧 Sales Manager: sales@rudraexports.com');
  console.log('📧 Sample Customer 1: rahul.sharma@gmail.com');
  console.log('📧 Sample Customer 2: priya.patel@yahoo.com');
  
  console.log('\n🚀 Database Features:');
  console.log('✅ Complete E-commerce Schema');
  console.log('✅ Realistic Product Data with Images');
  console.log('✅ Customer Reviews & Ratings');
  console.log('✅ Shopping Carts & Wishlists');
  console.log('✅ Order Management (All Statuses)');
  console.log('✅ Product Inquiries System');
  console.log('✅ User Roles (Admin/Customer)');
  console.log('✅ Product Variants & Categories');
  console.log('✅ Comprehensive Test Data');
  
  console.log('\n🌟 Ready for Production Testing!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });