import { date, numeric, pgTable, serial, text } from 'drizzle-orm/pg-core'

export const calculatorResults = pgTable('calculator_results', {
  id: serial('id').primaryKey(),
  result: numeric().notNull(),
  formula: text().notNull(),
  calculated_at: date({ mode: 'date' }).notNull(),
})
