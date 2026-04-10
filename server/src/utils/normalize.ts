export const normalizeText = (text: string): string => {
  return text
    .toLocaleLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, '-')
}

export const normalizeTextSearch = (text: string): string => {
  if (!text) return ''
  return text
    .normalize('NFD') // Rozloží znaky (napr. á -> a + ´)
    .replace(/[\u0300-\u036f]/g, '') // Odstráni diakritické znamienka
    .toLowerCase() // Všetko na malé písmená
    .trim() // Odstráni medzery na začiatku a konci
    .replace(/\s+/g, ' ')
}
