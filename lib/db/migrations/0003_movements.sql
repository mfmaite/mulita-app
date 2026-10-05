CREATE TYPE "public"."movement_type" AS ENUM('income', 'expense');--> statement-breakpoint
CREATE TABLE "movements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "movement_type" NOT NULL,
	"date" date NOT NULL,
	"account_id" uuid NOT NULL,
	"category_id" uuid,
	"amount" bigint NOT NULL,
	"detail" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP INDEX "accounts_user_id_name_idx";--> statement-breakpoint
DROP INDEX "categories_user_id_name_idx";--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "archived_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "archived_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "movements" ADD CONSTRAINT "movements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movements" ADD CONSTRAINT "movements_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movements" ADD CONSTRAINT "movements_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "movements_user_id_date_idx" ON "movements" USING btree ("user_id","date");--> statement-breakpoint
CREATE INDEX "movements_account_id_idx" ON "movements" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "movements_category_id_idx" ON "movements" USING btree ("category_id");--> statement-breakpoint
CREATE UNIQUE INDEX "accounts_user_id_name_idx" ON "accounts" USING btree ("user_id",lower("name")) WHERE "accounts"."archived_at" is null;--> statement-breakpoint
CREATE UNIQUE INDEX "categories_user_id_name_idx" ON "categories" USING btree ("user_id",lower("name")) WHERE "categories"."archived_at" is null;