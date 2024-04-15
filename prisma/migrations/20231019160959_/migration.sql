-- AlterTable
ALTER TABLE "events" ADD COLUMN     "schedule_link" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "transmission_link" SET DEFAULT '';
