import { PrismaClient, Role, TransactionType } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("Admin@123", 10);
  const analystPassword = await bcrypt.hash("Analyst@123", 10);
  const viewerPassword = await bcrypt.hash("Viewer@123", 10);

  const users = [
    {
      name: "Admin User",
      email: "admin@finance.local",
      password: adminPassword,
      role: Role.ADMIN,
      isActive: true,
    },
    {
      name: "Analyst User",
      email: "analyst@finance.local",
      password: analystPassword,
      role: Role.ANALYST,
      isActive: true,
    },
    {
      name: "Viewer User",
      email: "viewer@finance.local",
      password: viewerPassword,
      role: Role.VIEWER,
      isActive: true,
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        password: user.password,
        role: user.role,
        isActive: user.isActive,
      },
      create: user,
    });
  }

  const analyst = await prisma.user.findUnique({ where: { email: "analyst@finance.local" } });
  const viewer = await prisma.user.findUnique({ where: { email: "viewer@finance.local" } });

  if (!analyst || !viewer) {
    throw new Error("Seed users not created");
  }

  await prisma.transaction.createMany({
    data: [
      {
        amount: 5000,
        type: TransactionType.INCOME,
        category: "Salary",
        date: new Date("2026-03-01T10:00:00.000Z"),
        notes: "Monthly salary",
        userId: analyst.id,
      },
      {
        amount: 1200,
        type: TransactionType.EXPENSE,
        category: "Rent",
        date: new Date("2026-03-02T10:00:00.000Z"),
        notes: "Apartment rent",
        userId: analyst.id,
      },
      {
        amount: 400,
        type: TransactionType.EXPENSE,
        category: "Groceries",
        date: new Date("2026-03-03T10:00:00.000Z"),
        notes: "Weekly groceries",
        userId: viewer.id,
      },
      {
        amount: 900,
        type: TransactionType.INCOME,
        category: "Freelance",
        date: new Date("2026-03-05T10:00:00.000Z"),
        notes: "Side project",
        userId: analyst.id,
      },
    ],
  });

  // eslint-disable-next-line no-console
  console.log("Database seeded successfully");
}

main()
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
