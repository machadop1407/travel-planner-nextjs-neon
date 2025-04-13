/*
  Warnings:

  - Added the required column `itineraryOrder` to the `TravelLocation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TravelLocation" ADD COLUMN     "itineraryOrder" INTEGER NOT NULL;
