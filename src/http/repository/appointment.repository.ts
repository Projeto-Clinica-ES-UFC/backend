import type { appointment } from "@/db/schema";
import type { CreateAppointmentDTO, UpdateAppointmentDTO } from "@/http/dto/appointment.dto";
import type { PaginatedResult, PaginationParams } from "@/http/types";

export type Appointment = typeof appointment.$inferSelect;

export type AppointmentFilterParams = PaginationParams & {
	professionalId?: string;
	patientId?: string;
	startDate?: string; // ISO
	endDate?: string; // ISO
	status?: string[];
};

export interface IAppointmentRepository {
	findAll(params: AppointmentFilterParams): Promise<PaginatedResult<Appointment>>;
	findById(id: string): Promise<Appointment | null>;
	create(data: CreateAppointmentDTO & { createdById?: string }): Promise<Appointment>;
	update(id: string, data: UpdateAppointmentDTO): Promise<Appointment | null>;
	delete(id: string): Promise<void>;
	findOverlaps(professionalId: string, start: Date, end: Date, excludeId?: string): Promise<Appointment[]>;
}
