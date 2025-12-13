import type { appointment } from "@/db/schema";
import type { CreateAppointmentDTO, UpdateAppointmentDTO } from "@/http/dto/appointment.dto";
import type { PaginatedResult, PaginationParams } from "@/http/types";

export type Appointment = typeof appointment.$inferSelect;

export type AppointmentFilterParams = PaginationParams & {
	professionalId?: number;
	patientId?: number;
	startDate?: string; // ISO
	endDate?: string; // ISO
	status?: string[];
};

export interface IAppointmentRepository {
	findAll(params: AppointmentFilterParams): Promise<PaginatedResult<Appointment>>;
	findById(id: number): Promise<Appointment | null>;
	create(data: CreateAppointmentDTO): Promise<Appointment>;
	update(id: number, data: UpdateAppointmentDTO): Promise<Appointment | null>;
	delete(id: number): Promise<void>;
	findOverlaps(professionalId: number, start: Date, end: Date, excludeId?: number): Promise<Appointment[]>;
}
