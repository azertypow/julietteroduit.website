export interface APiImageData {
  x: number;
  y: number;
  width: number;
  height: number,
  url: string,
  title: string,
  slug: string
}

export function layoutMosaic(imagesList: APiImageData[], containerWidth: number): {
  maxY: number;
  dataPositions: APiImageData[]
} {
  const gap = 100
  const dataPositions: APiImageData[] = []

  imagesList.forEach((image) => {
    const imageRatio = image.width / image.height
    const imageWidth = Math.floor( ((containerWidth + gap ) / 5) - gap )
    const imageHeight = imageWidth / imageRatio

    // Chercher la meilleure position (la plus basse possible, puis la plus à gauche)
    let bestX = 0
    let bestY = 0
    let foundPosition = false

    // Essayer de placer l'image à différentes positions
    for (let y = 0; y < 1_000_000; y += gap) {
      for (let x = 0; x <= containerWidth - imageWidth; x += 1) {
        // Vérifier si cette position est libre
        const rect = { x, y, width: imageWidth, height: imageHeight }
        const hasCollision = dataPositions.some(pos =>
          !(rect.x + rect.width + gap <= pos.x ||
            rect.x >= pos.x + pos.width + gap ||
            rect.y + rect.height + gap <= pos.y ||
            rect.y >= pos.y + pos.height + gap)
        )

        if (!hasCollision) {
          bestX = x
          bestY = y
          foundPosition = true
          break
        }
      }
      if (foundPosition) break
    }

    image.x = bestX
    image.y = bestY
    dataPositions.push({
      x: bestX,
      y: bestY,
      width: imageWidth,
      height: imageHeight,
      slug: image.slug,
      title: image.title,
      url: image.url,
    })
  })

  // Calculer la hauteur totale
  const maxY = Math.max(...dataPositions.map(p => p.y + p.height))
  return {
    maxY,
    dataPositions,
  }
}
