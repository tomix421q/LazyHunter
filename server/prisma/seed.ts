// import { prisma } from '../src/db/db'
// import { normalizeText } from '../src/utils/normalize' // Použijeme tvoju utilitku

// // 1. Dataset - Základné potraviny (tu ich bude reálne 1000, ukážka 20)
// const rawData = [
//   // Mliečne
//   'Maslo 250g',
//   'Mlieko polotučné 1.5%',
//   'Mlieko plnotučné 3.5%',
//   'Tvaroh jemný',
//   'Smotana na šľahanie',
//   'Eidam tehla',
//   'Gouda plátky',
//   'Mozzarella',
//   'Jogurt biely',
//   'Jogurt ovocný',
//   // Pečivo
//   'Rožok biely',
//   'Chlieb konzumný',
//   'Chlieb zemiakový',
//   'Vianočka',
//   'Bageta',
//   // Mäso
//   'Kuracie prsia',
//   'Kuracie stehná',
//   'Bravčové karé',
//   'Hovädzie zadné',
//   'Šunka dusená',
//   // Ovocie/Zelenina
//   'Zemiaky',
//   'Cibuľa',
//   'Mrkva',
//   'Banány',
//   'Jablká Gala',
//   'Paradajky',
//   'Uhorky šalátové',
//   // Nápoje
//   'Pivo 10%',
//   'Pivo 12%',
//   'Kofola',
//   'Minerálka sýtená',
//   'Džús pomaranč 100%',
//   // Trvanlivé
//   'Cukor kryštálový',
//   'Múka hladká',
//   'Múka polohrubá',
//   'Olej slnečnicový',
//   'Ryža guľatozrnná',
//   'Cestoviny špagety',
// ]

// export async function seedDatabase() {
//   const count = await prisma.dictionary.count()
//   if (count !== 0) {
//     return
//   }

//   console.log(`🌱 Začínam sadiť ${rawData.length} produktov...`)

//   for (const name of rawData) {
//     const normalized = normalizeText(name)

//     await prisma.dictionary.upsert({
//       where: { normalizedName: normalized },
//       update: {},
//       create: {
//         productName: name,
//         normalizedName: normalized,
//         hitCount: 0,
//       },
//     })
//   }

//   console.log('✅ Hotovo! Slovník je naplnený.')
// }
