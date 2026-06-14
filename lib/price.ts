export function calculatePrice(width: number, height: number) {
  const minPixels = 22 * 22
  const maxPixels = 1000 * 1000
  const minPrice = 0.5
  const maxPrice = 1000000
  const pixels = Math.max(minPixels, Math.min(maxPixels, width * height))
  const price = minPrice + ((pixels - minPixels) / (maxPixels - minPixels)) * (maxPrice - minPrice)
  return Math.max(minPrice, Math.min(maxPrice, price))
}
