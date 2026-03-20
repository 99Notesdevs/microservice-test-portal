-- CreateTable
CREATE TABLE "_CategoryToCurrentAffairArticle" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CategoryToCurrentAffairArticle_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CategoryToCurrentAffairArticle_B_index" ON "_CategoryToCurrentAffairArticle"("B");

-- AddForeignKey
ALTER TABLE "_CategoryToCurrentAffairArticle" ADD CONSTRAINT "_CategoryToCurrentAffairArticle_A_fkey" FOREIGN KEY ("A") REFERENCES "Categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToCurrentAffairArticle" ADD CONSTRAINT "_CategoryToCurrentAffairArticle_B_fkey" FOREIGN KEY ("B") REFERENCES "CurrentAffairArticle"("id") ON DELETE CASCADE ON UPDATE CASCADE;