import path from 'node:path'
import { defineConfig } from 'prisma/config'
import { config } from 'dotenv'

// Load .env from project root
config({ path: path.resolve(__dirname, '.env') })

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL!,
  },
})
