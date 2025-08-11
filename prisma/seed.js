const { PrismaClient } = require("@prisma/client");

async function main() {
  const prisma = new PrismaClient();

  try {
    
    const existingOps = await prisma.progressConstraints.findFirst();
    if (!existingOps) {
      await prisma.progressConstraints.create({ data: { weakLimit: 10, strongLimit: 20, xp_status: "weak" } });
      console.log("AdminOps seeded successfully!");
    } else {
      await prisma.progressConstraints.update({
        where: { id: existingOps.id },
        data: { globalCss },
      });
      console.log("AdminOps already exists. Skipping creation.");
    }

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
