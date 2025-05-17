-- CreateTable
CREATE TABLE "AboutContent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL DEFAULT 'About Me',
    "content" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);
