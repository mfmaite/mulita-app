CREATE TYPE "public"."fixed_kind" AS ENUM('expense', 'card_payment', 'savings');--> statement-breakpoint
CREATE TYPE "public"."frequency" AS ENUM('monthly', 'bimonthly', 'quarterly', 'yearly');--> statement-breakpoint
CREATE TABLE "fixed_commitments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"kind" "fixed_kind" NOT NULL,
	"name" text NOT NULL,
	"amount" bigint NOT NULL,
	"variable_amount" boolean DEFAULT false NOT NULL,
	"due_day" integer NOT NULL,
	"frequency" "frequency" NOT NULL,
	"start_month" date NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"category_id" uuid,
	"account_id" uuid,
	"card_id" uuid,
	"currency" "currency",
	"destination_account_id" uuid,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "fixed_commitments" ADD CONSTRAINT "fixed_commitments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fixed_commitments" ADD CONSTRAINT "fixed_commitments_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fixed_commitments" ADD CONSTRAINT "fixed_commitments_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fixed_commitments" ADD CONSTRAINT "fixed_commitments_card_id_credit_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."credit_cards"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fixed_commitments" ADD CONSTRAINT "fixed_commitments_destination_account_id_accounts_id_fk" FOREIGN KEY ("destination_account_id") REFERENCES "public"."accounts"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "fixed_commitments_user_id_idx" ON "fixed_commitments" USING btree ("user_id");