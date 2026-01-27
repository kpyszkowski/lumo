import { z } from 'zod'

const STRING_VARIABLE = z.string().nonempty()

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  DATABASE_URL: STRING_VARIABLE,
})

export type Env = z.infer<typeof envSchema>

export default envSchema.parse(process.env)
