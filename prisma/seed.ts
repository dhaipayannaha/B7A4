import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });


const categories = [
  {
    name: "Cycling",
    description: "Bikes, helmets, cycling gear, and accessories for road, mountain, and trail riding.",
  },
  {
    name: "Camping",
    description: "Tents, sleeping bags, backpacks, and outdoor survival equipment for camping adventures.",
  },
  {
    name: "Fitness",
    description: "Gym equipment, weights, resistance bands, and workout gear for indoor and outdoor training.",
  },
  {
    name: "Water Sports",
    description: "Kayaks, paddleboards, snorkeling gear, wetsuits, and equipment for water-based activities.",
  },
  {
    name: "Hiking",
    description: "Trekking poles, boots, trail gear, and navigation tools for hiking and backpacking.",
  },
  {
    name: "Winter Sports",
    description: "Skis, snowboards, sleds, and cold-weather gear for snow and ice activities.",
  },
  {
    name: "Team Sports",
    description: "Football, basketball, cricket, and other team sport equipment and accessories.",
  },
  {
    name: "Photography & Film",
    description: "Cameras, tripods, drones, lighting rigs, and filmmaking equipment.",
  },
];

async function main() {
  console.log("🌱 Seeding categories...");

  for (const category of categories) {
    const result = await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
    console.log(`  ✅ ${result.name} — ${result.id}`);
  }

  console.log("\n🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
