CREATE TABLE "monthly_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"effective_from" date NOT NULL,
	"expected_income" bigint DEFAULT 0 NOT NULL,
	"savings_target" bigint DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_settings" ADD COLUMN "onboarded_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "monthly_plans" ADD CONSTRAINT "monthly_plans_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "monthly_plans_user_id_effective_from_idx" ON "monthly_plans" USING btree ("user_id","effective_from");--> statement-breakpoint
INSERT INTO "monthly_plans" ("user_id", "effective_from", "savings_target")
SELECT "user_settings"."user_id",
	coalesce((SELECT min("budgets"."effective_from") FROM "budgets" WHERE "budgets"."user_id" = "user_settings"."user_id"), date_trunc('month', now())::date),
	"user_settings"."monthly_savings_plan"
FROM "user_settings"
WHERE "user_settings"."monthly_savings_plan" > 0;--> statement-breakpoint
INSERT INTO "user_settings" ("user_id", "onboarded_at")
SELECT "id", now() FROM "users"
ON CONFLICT ("user_id") DO UPDATE SET "onboarded_at" = now();
