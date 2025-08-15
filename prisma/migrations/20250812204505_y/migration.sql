-- CreateTable
CREATE TABLE "public"."Users" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "age" TEXT,
    "tel_1" TEXT NOT NULL,
    "tel_2" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "addres_doyimiy" TEXT NOT NULL,
    "addres_hozir" TEXT NOT NULL,
    "universitet" TEXT NOT NULL,
    "yonalish" TEXT NOT NULL,
    "daraja" TEXT NOT NULL,
    "portfoly_link" TEXT NOT NULL,
    "rezumey_link" TEXT NOT NULL,
    "ish_holati" TEXT NOT NULL,
    "till" TEXT[],

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);
