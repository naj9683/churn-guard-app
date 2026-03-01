-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PlaybookRun" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "playbookType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "triggeredAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "emailSent" BOOLEAN NOT NULL DEFAULT false,
    "emailOpened" BOOLEAN NOT NULL DEFAULT false,
    "emailClicked" BOOLEAN NOT NULL DEFAULT false,
    "userResponded" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "PlaybookRun_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PlaybookRun" ("completedAt", "emailClicked", "emailOpened", "emailSent", "id", "playbookType", "status", "triggeredAt", "userId", "userResponded") SELECT "completedAt", "emailClicked", "emailOpened", "emailSent", "id", "playbookType", "status", "triggeredAt", "userId", "userResponded" FROM "PlaybookRun";
DROP TABLE "PlaybookRun";
ALTER TABLE "new_PlaybookRun" RENAME TO "PlaybookRun";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
