const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const addPgTrgm = async () => {
    const extensionCheck = await prisma.$queryRaw`SELECT extname FROM pg_extension WHERE extname = 'pg_trgm';`;
    if (extensionCheck.length > 0) {
        console.log("✅ pg_trgm already installed in the database.");
        return;
    }

    const migrationsDir = path.join(__dirname, "../prisma/migrations");
    const folders = fs.readdirSync(migrationsDir).filter(name =>
        fs.statSync(path.join(migrationsDir, name)).isDirectory()
    );

    const latest = folders
        .map(name => ({
            name,
            time: fs.statSync(path.join(migrationsDir, name)).ctimeMs,
        }))
        .sort((a, b) => b.time - a.time)[0];

    if (!latest) return console.error("No migration found.");

    const migrationPath = path.join(migrationsDir, latest.name, "migration.sql");

    let sql = fs.readFileSync(migrationPath, "utf-8");
    if (!sql.includes("CREATE EXTENSION IF NOT EXISTS pg_trgm")) {
        sql = `-- Ensure pg_trgm is available\nCREATE EXTENSION IF NOT EXISTS pg_trgm;\n\n${sql}`;
        fs.writeFileSync(migrationPath, sql, "utf-8");
        console.log(`✅ Added pg_trgm to: ${migrationPath}`);
    } else {
        console.log(`ℹ️ pg_trgm already present in: ${migrationPath}`);
    }
};

//addPgTrgm().then(() => prisma.$disconnect());
console.log("Script not active")