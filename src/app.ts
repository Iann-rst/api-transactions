import fastify from 'fastify'
import { transactionsRoute } from './routes/transactions'
import cookie from '@fastify/cookie'

export const app = fastify()

app.register(cookie)

app.register(transactionsRoute, {
  prefix: 'transactions',
})
