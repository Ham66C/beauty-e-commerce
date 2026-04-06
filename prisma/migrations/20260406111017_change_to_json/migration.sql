/*
  Warnings:

  - You are about to alter the column `images` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `problemTags` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `skinTypeTags` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "images" JSONB NOT NULL,
    "category" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "skinTypeTags" JSONB NOT NULL,
    "problemTags" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Product" ("category", "createdAt", "description", "id", "images", "name", "price", "problemTags", "skinTypeTags", "slug", "stock", "updatedAt") SELECT "category", "createdAt", "description", "id", "images", "name", "price", "problemTags", "skinTypeTags", "slug", "stock", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
