-- CreateTable
CREATE TABLE "Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productName" TEXT NOT NULL,
    "pstatus" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" REAL
);
