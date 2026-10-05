ALTER TYPE "public"."movement_type" ADD VALUE 'transfer';--> statement-breakpoint
ALTER TYPE "public"."movement_type" ADD VALUE 'adjustment';--> statement-breakpoint
ALTER TABLE "movements" ADD COLUMN "destination_account_id" uuid;--> statement-breakpoint
ALTER TABLE "movements" ADD COLUMN "destination_amount" bigint;--> statement-breakpoint
ALTER TABLE "movements" ADD CONSTRAINT "movements_destination_account_id_accounts_id_fk" FOREIGN KEY ("destination_account_id") REFERENCES "public"."accounts"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "movements_destination_account_id_idx" ON "movements" USING btree ("destination_account_id");