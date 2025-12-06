import { DrizzleAppointmentRepository } from "@/http/repository/drizzle/appointment.repository";
import type { CreateAppointmentDTO, UpdateAppointmentDTO } from "@/http/dto/appointment.dto";
import type { AppointmentFilterParams } from "@/http/repository/appointment.repository";
import { HTTPException } from "hono/http-exception";

const appointmentRepository = new DrizzleAppointmentRepository();

export class AppointmentService {
	async getAll(params: AppointmentFilterParams) {
		return appointmentRepository.findAll(params);
	}

	async getById(id: string) {
		const appointment = await appointmentRepository.findById(id);
		if (!appointment) {
			throw new HTTPException(404, { message: "Appointment not found" });
		}
		return appointment;
	}

	async create(data: CreateAppointmentDTO, userId?: string) {
		const start = new Date(data.start);
		const end = new Date(data.end);

		if (start >= end) {
			throw new HTTPException(400, { message: "Start time must be before end time" });
		}

		const overlaps = await appointmentRepository.findOverlaps(data.professionalId, start, end);
		if (overlaps.length > 0) {
			throw new HTTPException(409, { message: "Time slot conflict with existing appointment" });
		}

		return appointmentRepository.create({ ...data, createdById: userId });
	}

	async update(id: string, data: UpdateAppointmentDTO) {
		const current = await appointmentRepository.findById(id);
		if (!current) {
			throw new HTTPException(404, { message: "Appointment not found" });
		}

		// If time changes, check overlap
		if (data.start || data.end) {
			const newStart = data.start ? new Date(data.start) : current.start;
			const newEnd = data.end ? new Date(data.end) : current.end;

			if (newStart >= newEnd) {
				throw new HTTPException(400, { message: "Start time must be before end time" });
			}

			// Professional ID logic: Should not change usually, but if so, need to check new prof's schedule.
			// Currently DTO doesn't allow changing professionalId.
			const overlaps = await appointmentRepository.findOverlaps(current.professionalId, newStart, newEnd, id);
			if (overlaps.length > 0) {
				throw new HTTPException(409, { message: "Time slot conflict with existing appointment" });
			}
		}

		return appointmentRepository.update(id, data);
	}

	async delete(id: string) {
		const exists = await appointmentRepository.findById(id);
		if (!exists) {
			throw new HTTPException(404, { message: "Appointment not found" });
		}
		// Maybe just cancel? The req says "cancel/delete".
		// I'll delete permanently as per HTTP DELETE semantics, or if status is used, I should have an endpoint for status.
		// Req says: "DELETE /api/appointments/:id — cancel/delete".
		// And "PATCH /api/appointments/:id/status".
		// I'll implement delete as delete.
		return appointmentRepository.delete(id);
	}
}

export const appointmentService = new AppointmentService();
