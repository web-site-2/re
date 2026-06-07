import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("Admin123!", 12);

  const superAdmin = await prisma.user.upsert({
    where: { email: "admin@proty.com" },
    update: {},
    create: {
      email: "admin@proty.com",
      name: "Super Admin",
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
      emailVerified: new Date(),
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: "manager@proty.com" },
    update: {},
    create: {
      email: "manager@proty.com",
      name: "Restaurant Manager",
      password: hashedPassword,
      role: Role.MANAGER,
      emailVerified: new Date(),
    },
  });

  const staff = await prisma.user.upsert({
    where: { email: "staff@proty.com" },
    update: {},
    create: {
      email: "staff@proty.com",
      name: "Kitchen Staff",
      password: hashedPassword,
      role: Role.STAFF,
      emailVerified: new Date(),
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@proty.com" },
    update: {},
    create: {
      email: "customer@proty.com",
      name: "John Customer",
      password: hashedPassword,
      role: Role.CUSTOMER,
      emailVerified: new Date(),
    },
  });

  await prisma.settings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      restaurantName: "PROTY",
      tagline: "Fresh. Premium. Unforgettable.",
      email: "hello@proty.com",
      phone: "+1 (555) 123-4567",
      address: "123 Gourmet Avenue",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      taxRate: 0.0875,
      deliveryFee: 4.99,
      freeDeliveryMinimum: 50,
      loyaltyPointsPerDollar: 1,
      openingHours: {
        monday: { open: "11:00", close: "22:00" },
        tuesday: { open: "11:00", close: "22:00" },
        wednesday: { open: "11:00", close: "22:00" },
        thursday: { open: "11:00", close: "22:00" },
        friday: { open: "11:00", close: "23:00" },
        saturday: { open: "10:00", close: "23:00" },
        sunday: { open: "10:00", close: "21:00" },
      },
      socialLinks: {
        instagram: "https://instagram.com/proty",
        facebook: "https://facebook.com/proty",
        twitter: "https://twitter.com/proty",
      },
    },
  });

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "appetizers" },
      update: {},
      create: {
        name: "Appetizers",
        slug: "appetizers",
        description: "Start your meal with our exquisite appetizers",
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: "mains" },
      update: {},
      create: {
        name: "Main Courses",
        slug: "mains",
        description: "Signature dishes crafted by our executive chef",
        sortOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: "desserts" },
      update: {},
      create: {
        name: "Desserts",
        slug: "desserts",
        description: "Sweet endings to remember",
        sortOrder: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: "beverages" },
      update: {},
      create: {
        name: "Beverages",
        slug: "beverages",
        description: "Premium drinks and cocktails",
        sortOrder: 4,
      },
    }),
  ]);

  const products = [
    {
      name: "Truffle Arancini",
      slug: "truffle-arancini",
      description:
        "Crispy risotto balls infused with black truffle, served with saffron aioli.",
      price: 18.0,
      categoryId: categories[0].id,
      isFeatured: true,
      isVegetarian: true,
      calories: 320,
      prepTime: 15,
      tags: ["truffle", "premium"],
    },
    {
      name: "Wagyu Beef Tartare",
      slug: "wagyu-beef-tartare",
      description:
        "Hand-cut A5 wagyu with capers, shallots, quail egg, and toasted brioche.",
      price: 42.0,
      categoryId: categories[0].id,
      isFeatured: true,
      calories: 450,
      prepTime: 20,
      tags: ["wagyu", "signature"],
    },
    {
      name: "Pan-Seared Halibut",
      slug: "pan-seared-halibut",
      description:
        "Atlantic halibut with lemon beurre blanc, asparagus, and caviar pearls.",
      price: 58.0,
      categoryId: categories[1].id,
      isFeatured: true,
      isGlutenFree: true,
      calories: 520,
      prepTime: 25,
      tags: ["seafood", "signature"],
    },
    {
      name: "Herb-Crusted Lamb Rack",
      slug: "herb-crusted-lamb-rack",
      description:
        "New Zealand lamb with rosemary crust, red wine reduction, and root vegetables.",
      price: 64.0,
      categoryId: categories[1].id,
      isFeatured: true,
      calories: 680,
      prepTime: 30,
      tags: ["lamb", "premium"],
    },
    {
      name: "Dark Chocolate Soufflé",
      slug: "dark-chocolate-souffle",
      description:
        "Valrhona dark chocolate soufflé with vanilla bean ice cream.",
      price: 16.0,
      categoryId: categories[2].id,
      isVegetarian: true,
      calories: 380,
      prepTime: 20,
      tags: ["chocolate", "classic"],
    },
    {
      name: "Champagne Cocktail",
      slug: "champagne-cocktail",
      description:
        "Vintage champagne with elderflower liqueur and gold leaf garnish.",
      price: 24.0,
      categoryId: categories[3].id,
      isFeatured: true,
      calories: 150,
      prepTime: 5,
      tags: ["cocktail", "premium"],
    },
  ];

  for (const product of products) {
    const created = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });

    await prisma.productImage.upsert({
      where: { id: `${created.id}-img` },
      update: {},
      create: {
        id: `${created.id}-img`,
        productId: created.id,
        url: `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80`,
        alt: product.name,
        sortOrder: 0,
      },
    });

    await prisma.inventory.upsert({
      where: { productId: created.id },
      update: {},
      create: {
        productId: created.id,
        quantity: 100,
        minQuantity: 10,
      },
    });
  }

  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      type: "PERCENTAGE",
      value: 10,
      minOrderValue: 30,
      maxUses: 1000,
      isActive: true,
    },
  });

  await prisma.blogPost.upsert({
    where: { slug: "welcome-to-proty" },
    update: {},
    create: {
      title: "Welcome to PROTY",
      slug: "welcome-to-proty",
      excerpt: "Discover the story behind our premium dining experience.",
      content:
        "At PROTY, we believe every meal should be an unforgettable experience. Our executive chef brings decades of culinary excellence to every dish, sourcing only the finest ingredients from local farms and international purveyors.\n\nFrom our signature truffle arancini to our hand-selected wagyu beef, each plate tells a story of passion, precision, and premium quality.",
      author: "Executive Chef",
      status: "PUBLISHED",
      publishedAt: new Date(),
      tags: ["announcement", "about"],
    },
  });

  await prisma.employee.upsert({
    where: { userId: manager.id },
    update: {},
    create: {
      userId: manager.id,
      employeeId: "EMP-001",
      position: "General Manager",
      department: "Management",
      hireDate: new Date("2023-01-15"),
    },
  });

  await prisma.employee.upsert({
    where: { userId: staff.id },
    update: {},
    create: {
      userId: staff.id,
      employeeId: "EMP-002",
      position: "Head Chef",
      department: "Kitchen",
      hireDate: new Date("2023-03-01"),
    },
  });

  await prisma.cart.upsert({
    where: { userId: customer.id },
    update: {},
    create: { userId: customer.id },
  });

  console.log("Seed completed:", {
    superAdmin: superAdmin.email,
    manager: manager.email,
    staff: staff.email,
    customer: customer.email,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
