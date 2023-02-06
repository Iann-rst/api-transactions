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

  app.get('/:id', async (request, response) => {
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getTransactionParamsSchema.parse(request.params)

    const transaction = await knex('transactions').where('id', id).first()

    if (!transaction) {
      return response.status(404).send({
        message: 'Transaction not found',
      })
    }

    return { transaction }
  })

  app.get('/summary', async () => {
    const summary = await knex('transactions')
      .sum('amount', { as: 'amount' })
      .first()

    return { summary }
  })
}
