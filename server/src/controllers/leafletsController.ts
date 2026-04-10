import type { Context } from 'hono'
import { runHuntJob } from '../jobs/huntJob'
import { SHOPNAME } from '../../prisma/generated/prisma/enums'

export const leafletsController = {
  get_leaflet: async (c: Context) => {
    const result = await runHuntJob(SHOPNAME.BILLA)

    if (!result || !result.ok) {
      return c.json({ error: 'Job failed or returned no result' }, 400)
    } else {
      return c.json(
        {
          message: 'Hotovo',
          savedPages: result.savedPages,
          savedProducts: result.savedProducts,
          datesUsed: result.dates,
        },
        200,
      )
    }
  },
  get_allAvailableShops: async (c: Context) => {
    return c.json(Object.values(SHOPNAME), 200)
  },
}
