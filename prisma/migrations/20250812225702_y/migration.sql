/*
  Warnings:

  - Added the required column `chat_id` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Users" ADD COLUMN     "chat_id" TEXT NOT NULL;
