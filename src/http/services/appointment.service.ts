import { DrizzleAppointmentRepository } from "@/http/repository/drizzle/appointment.repository";
import type { CreateAppointmentDTO, UpdateAppointmentDTO } from "@/http/dto/appointment.dto";
import type { AppointmentFilterParams } from "@/http/repository/appointment.repository";
import { HTTPException } from "hono/http-exception";

const appointmentRepository = new DrizzleAppointmentRepository();

export class AppointmentService {
	async getAll(params: AppointmentFilterParams) {
		return appointmentRepository.findAll(params);
	}

	async getById(id: number) {
		const appointment = await appointmentRepository.findById(id);
		if (!appointment) {
			throw new HTTPException(404, { message: "Appointment not found" });
		}
		return appointment;
	}

	async create(data: CreateAppointmentDTO, _userId?: string) {
		const start = new Date(data.start);
		const end = new Date(data.end);

		if (start >= end) {
			throw new HTTPException(400, { message: "Start time must be before end time" });
		}

		const overlaps = await appointmentRepository.findOverlaps(data.professionalId, start, end);
		if (overlaps.length > 0) {
			throw new HTTPException(409, { message: "Time slot conflict with existing appointment" });
		}

		return appointmentRepository.create(data);
	}

	async update(id: number, data: UpdateAppointmentDTO) {
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

			const overlaps = await appointmentRepository.findOverlaps(current.professionalId, newStart, newEnd, id);
			if (overlaps.length > 0) {
				throw new HTTPException(409, { message: "Time slot conflict with existing appointment" });
			}
		}

		return appointmentRepository.update(id, data);
	}

	async delete(id: number) {
		const exists = await appointmentRepository.findById(id);
		if (!exists) {
			throw new HTTPException(404, { message: "Appointment not found" });
		}
		return appointmentRepository.delete(id);
	}
}

export const appointmentService = new AppointmentService();