import { Cron } from 'croner'
import { SHOPNAME } from '../../../prisma/generated/prisma/enums'
import { prisma } from '../../db/db'
import { runHuntJob } from '../huntJob'
import { cleanupOldProducts } from './cleanupOldProducts'

// CLEANUP JOB
new Cron('30 2 * * *', { name: 'db-cleanup', timezone: 'Europe/Bratislava' }, async () => {
  console.log('🧹 [Cleanup] Spúšťam pravidelnú údržbu...')
  await cleanupOldProducts()
})

// NIGHTLY HUNT
const huntJob = new Cron('0 3 * * *', { name: 'nightly-hunt', protect: true, timezone: 'Europe/Bratislava' }, async () => {
  console.log('🕒 [Hunter] Spúšťam nočný lov...')

  const shops = Object.values(SHOPNAME)

  for (const shop of shops) {
    try {
      console.log(`🛒 [${shop}] Pracujem...`)
      await runHuntJob(shop)
    } catch (err) {
      console.error(`❌ [${shop}] Kritická chyba:`, err)
      await prisma.errorNotifier.create({
        data: {
          shopName: shop,
          errorType: 'DBWRITE',
          message: `Nočný lov pre ${shop} zlyhal na úrovni workera.`,
          moreInfo: String(err),
        },
      })
    }
  }
  console.log(`✅ [Hunter] Hotovo. Ďalší štart: ${huntJob.nextRun()?.toLocaleString()}`)
})

/**
 * 3. HEARTBEAT (Každú hodinu)
 */
new Cron('0 * * * *', () => {
  console.log(`💓 [Status] Worker beží. Aktuálny čas: ${new Date().toLocaleString()}`)
})
