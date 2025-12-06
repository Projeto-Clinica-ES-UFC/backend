CREATE TABLE `appointment` (
	`id` text PRIMARY KEY NOT NULL,
	`professional_id` text NOT NULL,
	`patient_id` text NOT NULL,
	`start` integer NOT NULL,
	`end` integer NOT NULL,
	`title` text,
	`description` text,
	`status` text DEFAULT 'Scheduled' NOT NULL,
	`location` text,
	`created_by_id` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`professional_id`) REFERENCES `professional`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`patient_id`) REFERENCES `patient`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `anamnesis` (
	`id` text PRIMARY KEY NOT NULL,
	`patient_id` text NOT NULL,
	`data` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`patient_id`) REFERENCES `patient`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `medical_record` (
	`id` text PRIMARY KEY NOT NULL,
	`patient_id` text NOT NULL,
	`date` integer NOT NULL,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`attachment_url` text,
	`attachment_name` text,
	`created_by_id` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`patient_id`) REFERENCES `patient`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `agreement` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`cnpj` text,
	`ans_registration` text,
	`active` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE `configuration` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `specialty` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `task` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`status` text DEFAULT 'Pending' NOT NULL,
	`assigned_to_user_id` text,
	`due_date` integer,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`assigned_to_user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `patient` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`cpf` text,
	`date_of_birth` text,
	`gender` text,
	`phone` text,
	`agreement_id` text,
	`address` text,
	`city` text,
	`responsible_name` text,
	`responsible_phone` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`agreement_id`) REFERENCES `agreement`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `patient_cpf_unique` ON `patient` (`cpf`);--> statement-breakpoint
CREATE TABLE `professional` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`professional_registration` text,
	`phone` text,
	`schedule_config` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `professional_user_id_unique` ON `professional` (`user_id`);--> statement-breakpoint
CREATE TABLE `professional_specialty` (
	`professional_id` text NOT NULL,
	`specialty_id` text NOT NULL,
	PRIMARY KEY(`professional_id`, `specialty_id`),
	FOREIGN KEY (`professional_id`) REFERENCES `professional`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`specialty_id`) REFERENCES `specialty`(`id`) ON UPDATE no action ON DELETE no action
);
