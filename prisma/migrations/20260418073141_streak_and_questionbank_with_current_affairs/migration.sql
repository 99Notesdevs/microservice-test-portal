-- AlterTable
ALTER TABLE "QuestionBank" ADD COLUMN     "currentAffairArticleId" INTEGER,
ADD COLUMN     "isCurrentAffair" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "CurrentAffairVisit" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "currentAffairId" INTEGER,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_DATE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CurrentAffairVisit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurrentAffairStreak" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastVisited" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CurrentAffairStreak_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CurrentAffairVisit_userId_idx" ON "CurrentAffairVisit"("userId");

-- CreateIndex
CREATE INDEX "CurrentAffairVisit_currentAffairId_idx" ON "CurrentAffairVisit"("currentAffairId");

-- CreateIndex
CREATE UNIQUE INDEX "CurrentAffairVisit_userId_date_key" ON "CurrentAffairVisit"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "CurrentAffairStreak_userId_key" ON "CurrentAffairStreak"("userId");

-- AddForeignKey
ALTER TABLE "QuestionBank" ADD CONSTRAINT "QuestionBank_currentAffairArticleId_fkey" FOREIGN KEY ("currentAffairArticleId") REFERENCES "CurrentAffairArticle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrentAffairVisit" ADD CONSTRAINT "CurrentAffairVisit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrentAffairVisit" ADD CONSTRAINT "CurrentAffairVisit_currentAffairId_fkey" FOREIGN KEY ("currentAffairId") REFERENCES "CurrentAffair"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrentAffairStreak" ADD CONSTRAINT "CurrentAffairStreak_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
