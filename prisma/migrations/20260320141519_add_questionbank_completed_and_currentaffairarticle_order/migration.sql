-- AlterTable
ALTER TABLE "CurrentAffairArticle" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "QuestionBank" ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT true;
