DROP TABLE `agreement`;--> statement-breakpoint
DROP TABLE `specialty`;--> statement-breakpoint
DROP TABLE `task`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_professional` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text,
	`name` text NOT NULL,
	`email` text,
	`specialty` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_professional`("id", "user_id", "name", "email", "specialty", "created_at", "updated_at") SELECT "id", "user_id", "name", "email", "specialty", "created_at", "updated_at" FROM `professional`;--> statement-breakpoint
DROP TABLE `professional`;--> statement-breakpoint
ALTER TABLE `__new_professional` RENAME TO `professional`;--> statement-breakpoint
PRAGMA foreign_keys=ON;