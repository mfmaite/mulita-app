ALTER TABLE "movements" ADD COLUMN "fixed_commitment_id" uuid;--> statement-breakpoint
ALTER TABLE "movements" ADD COLUMN "fixed_month" date;--> statement-breakpoint
ALTER TABLE "movements" ADD CONSTRAINT "movements_fixed_commitment_id_fixed_commitments_id_fk" FOREIGN KEY ("fixed_commitment_id") REFERENCES "public"."fixed_commitments"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "movements_fixed_month_idx" ON "movements" USING btree ("fixed_commitment_id","fixed_month");