import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";
import path from "path";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const dbPath = process.env.DATABASE_URL?.startsWith("file:") 
  ? `file:${path.resolve(process.cwd(), process.env.DATABASE_URL.replace("file:", ""))}`
  : process.env.DATABASE_URL;

const libsql = createClient({
  url: dbPath as string,
});
const adapter = new PrismaLibSql(libsql as any);

export const prisma =
  globalThis.prisma ||
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
