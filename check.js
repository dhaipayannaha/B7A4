const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const gears = await prisma.gearItem.findMany({ include: { reviews: true } });
    console.log(gears.map(g => g.id + ' has ' + g.reviews.length + ' reviews'));
}
main().finally(() => prisma.$disconnect());
