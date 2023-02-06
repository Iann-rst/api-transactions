import { FastifyInstance } from 'fastify'
import crypto from 'node:crypto'
import { knex } from '../database'
import { z } from 'zod'

export async function transactionsRoute(app: FastifyInstance) {
  app.post('/', async (request, response) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body,
    )

    await knex('transactions').insert({
      id: crypto.randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
    })

    return response.status(201).send()
  })

  app.get('/', async () => {
    const transactions = await knex('transactions').select()

    return { transactions }
  })
}
