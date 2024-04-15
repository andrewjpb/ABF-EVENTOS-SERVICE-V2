-- AddForeignKey
ALTER TABLE "attendance_list" ADD CONSTRAINT "attendance_list_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_list" ADD CONSTRAINT "attendance_list_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_list" ADD CONSTRAINT "attendance_list_company_cnpj_fkey" FOREIGN KEY ("company_cnpj") REFERENCES "company"("cnpj") ON DELETE RESTRICT ON UPDATE CASCADE;
