/*
  Warnings:

  - You are about to drop the column `categoryId` on the `QuestionBank` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Categories" DROP CONSTRAINT "Categories_pageId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_billingAddressId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_shippingAddressId_fkey";

-- DropForeignKey
ALTER TABLE "QuestionBank" DROP CONSTRAINT "QuestionBank_categoryId_fkey";

-- AlterTable
ALTER TABLE "QuestionBank" DROP COLUMN "categoryId";

-- CreateTable
CREATE TABLE "_CategoryToQuestionBank" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CategoryToQuestionBank_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CategoryToQuestionBank_B_index" ON "_CategoryToQuestionBank"("B");

-- AddForeignKey
ALTER TABLE "Categories" ADD CONSTRAINT "Categories_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_billingAddressId_fkey" FOREIGN KEY ("billingAddressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_shippingAddressId_fkey" FOREIGN KEY ("shippingAddressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToQuestionBank" ADD CONSTRAINT "_CategoryToQuestionBank_A_fkey" FOREIGN KEY ("A") REFERENCES "Categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToQuestionBank" ADD CONSTRAINT "_CategoryToQuestionBank_B_fkey" FOREIGN KEY ("B") REFERENCES "QuestionBank"("id") ON DELETE CASCADE ON UPDATE CASCADE;
