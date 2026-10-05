ALTER TABLE "movements" ALTER COLUMN "account_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "movements" ADD COLUMN "card_id" uuid;--> statement-breakpoint
ALTER TABLE "movements" ADD COLUMN "currency" "currency";--> statement-breakpoint
ALTER TABLE "movements" ADD COLUMN "installments" integer;--> statement-breakpoint
ALTER TABLE "movements" ADD COLUMN "first_billing_month" date;--> statement-breakpoint
ALTER TABLE "movements" ADD CONSTRAINT "movements_card_id_credit_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."credit_cards"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "movements_card_id_idx" ON "movements" USING btree ("card_id");