import { Injectable } from '@nestjs/common';
import { EntityNotFoundError } from 'shared/errors/entity-not-found.error';
import { CheckInRepository } from 'src/check-in/check-in.repository';
import { EditeSubscribeDto } from 'src/check-in/dto/edit-attendance.dto';

@Injectable()
export class EditAttendanceById {
    constructor(private readonly checkInRepo: CheckInRepository) {}

    async execute({ attendanceId, data }: { attendanceId: string; data: EditeSubscribeDto }) {
        try {
            const attendance = await this.checkInRepo.findById(attendanceId);
            if (!attendance) throw new EntityNotFoundError('Attendance not found');

            return this.checkInRepo.editAttendanceById({ attendanceList: data, id: attendanceId });
        } catch (error) {
            throw new EntityNotFoundError(error.message);
        }
    }
}
