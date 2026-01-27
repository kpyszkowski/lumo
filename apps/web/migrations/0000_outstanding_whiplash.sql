CREATE TABLE "calculator_results" (
	"id" serial PRIMARY KEY,
	"result" integer NOT NULL,
	"formula" text NOT NULL,
	"calculation_time" integer NOT NULL,
	"calculated_at" date NOT NULL
);
