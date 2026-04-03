"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    const adminPassword = await bcrypt_1.default.hash("Admin@123", 10);
    const analystPassword = await bcrypt_1.default.hash("Analyst@123", 10);
    const viewerPassword = await bcrypt_1.default.hash("Viewer@123", 10);
    const users = [
        {
            name: "Admin User",
            email: "admin@finance.local",
            password: adminPassword,
            role: client_1.Role.ADMIN,
            isActive: true,
        },
        {
            name: "Analyst User",
            email: "analyst@finance.local",
            password: analystPassword,
            role: client_1.Role.ANALYST,
            isActive: true,
        },
        {
            name: "Viewer User",
            email: "viewer@finance.local",
            password: viewerPassword,
            role: client_1.Role.VIEWER,
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
                type: client_1.TransactionType.INCOME,
                category: "Salary",
                date: new Date("2026-03-01T10:00:00.000Z"),
                notes: "Monthly salary",
                userId: analyst.id,
            },
            {
                amount: 1200,
                type: client_1.TransactionType.EXPENSE,
                category: "Rent",
                date: new Date("2026-03-02T10:00:00.000Z"),
                notes: "Apartment rent",
                userId: analyst.id,
            },
            {
                amount: 400,
                type: client_1.TransactionType.EXPENSE,
                category: "Groceries",
                date: new Date("2026-03-03T10:00:00.000Z"),
                notes: "Weekly groceries",
                userId: viewer.id,
            },
            {
                amount: 900,
                type: client_1.TransactionType.INCOME,
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
//# sourceMappingURL=seed.js.map