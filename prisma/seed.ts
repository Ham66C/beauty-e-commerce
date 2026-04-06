import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  const products = [
    {
      name: "Hydrating Facial Mist",
      slug: "hydrating-facial-mist",
      description: "A refreshing mist that instantly hydrates and revitalizes tired skin with rose water and aloe vera.",
      price: 24.0,
      images: JSON.stringify(["https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=1000"]),
      category: "Face Care",
      stock: 50,
      skinTypeTags: JSON.stringify(["Dry", "Normal", "Sensitive"]),
      problemTags: JSON.stringify(["Dullness", "Dehydration"]),
    },
    {
      name: "Rose Quartz Serum",
      slug: "rose-quartz-serum",
      description: "Infused with real rose quartz, this serum brightens skin tone and reduces the appearance of fine lines.",
      price: 45.0,
      images: JSON.stringify(["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000"]),
      category: "Anti-Aging",
      stock: 30,
      skinTypeTags: JSON.stringify(["Normal", "Combination", "Aging"]),
      problemTags: JSON.stringify(["Aging", "Fine Lines"]),
    },
    {
      name: "Glow Cleansing Balm",
      slug: "glow-cleansing-balm",
      description: "Melts away makeup and impurities while nourishing the skin with botanical oils for a radiant finish.",
      price: 28.0,
      images: JSON.stringify(["https://images.unsplash.com/photo-1556229162-d27b9c9c3620?q=80&w=1000"]),
      category: "Cleanser",
      stock: 40,
      skinTypeTags: JSON.stringify(["Dry", "Normal", "Combination"]),
      problemTags: JSON.stringify(["Dullness"]),
    },
    {
      name: "Bamboo Charcoal Mask",
      slug: "bamboo-charcoal-mask",
      description: "Deeply detoxifies pores and absorbs excess oil without stripping moisture from the skin.",
      price: 35.0,
      images: JSON.stringify(["https://images.unsplash.com/photo-1570172619666-1111624ca347?q=80&w=1000"]),
      category: "Masks",
      stock: 25,
      skinTypeTags: JSON.stringify(["Oily", "Combination"]),
      problemTags: JSON.stringify(["Acne", "Large Pores"]),
    },
    {
      name: "SPF 50 Silk Shield",
      slug: "spf-50-silk-shield",
      description: "A weightless, invisible sunscreen that provides broad-spectrum protection and a silky smooth base for makeup.",
      price: 38.0,
      images: JSON.stringify(["https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?q=80&w=1000"]),
      category: "Protection",
      stock: 60,
      skinTypeTags: JSON.stringify(["All Types"]),
      problemTags: JSON.stringify(["Sun Damage"]),
    },
    {
      name: "Lip Hydration Nectar",
      slug: "lip-hydration-nectar",
      description: "A luxurious lip treatment that provides long-lasting moisture and a subtle, natural shine.",
      price: 18.0,
      images: JSON.stringify(["https://images.unsplash.com/photo-1586495764447-6f97ca18d0d2?q=80&w=1000"]),
      category: "Lips",
      stock: 100,
      skinTypeTags: JSON.stringify(["All Types"]),
      problemTags: JSON.stringify(["Dryness"]),
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
