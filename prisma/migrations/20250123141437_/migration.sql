-- DropForeignKey
ALTER TABLE "attendance_list" DROP CONSTRAINT "attendance_list_eventId_fkey";

-- AddForeignKey
ALTER TABLE "attendance_list" ADD CONSTRAINT "attendance_list_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
