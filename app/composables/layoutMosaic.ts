export interface APiImageData {
  x: number;
  y: number;
  width: number;
  height: number,
  url: string,
  title: string,
  slug: string,
  type: CMS_API_PROJECT_type,
}

export function layoutMosaic(imagesList: APiImageData[], containerWidth: number): {
  maxY: number;
  dataPositions: APiImageData[]
} {
  const breakPoint = {
    reg: 1200,
    small: 900,
    xs: 700,
  }
  const dataPositions: APiImageData[] = []

  const gap = (() => {
    if(containerWidth < breakPoint.xs) return 50
    if(containerWidth < breakPoint.small) return 100
    if(containerWidth < breakPoint.reg)   return 150
    return 200
  })()

  const collNumber = (() => {
    if(containerWidth < breakPoint.xs) return 10
    if(containerWidth < breakPoint.small) return 15
    if(containerWidth < breakPoint.reg)   return 20
    return 27
  })()

  const collWidthList: {
    archi_horizontale: number;
    archi_verticale: number;
    sceno_horizontale: number;
    sceno_verticale: number;
    mobilier_horizontale: number;
    mobilier_verticale: number
  } = (() => {

    if(containerWidth < breakPoint.xs) return {
      archi_horizontale: 6,
      archi_verticale: 5,
      sceno_horizontale: 5,
      sceno_verticale: 4,
      mobilier_horizontale: 4,
      mobilier_verticale: 3,
    }

    if(containerWidth < breakPoint.small) return {
      archi_horizontale: 7,
      archi_verticale: 6,
      sceno_horizontale: 6,
      sceno_verticale: 5,
      mobilier_horizontale: 5,
      mobilier_verticale: 4,
    }

    if(containerWidth < breakPoint.reg) return {
      archi_horizontale: 10,
      archi_verticale: 7,
      sceno_horizontale: 8,
      sceno_verticale: 6,
      mobilier_horizontale: 6,
      mobilier_verticale: 5,
    }

    return {
      archi_horizontale: 12,
      archi_verticale: 9,
      sceno_horizontale: 9,
      sceno_verticale: 7,
      mobilier_horizontale: 6,
      mobilier_verticale: 5,
    }

  })()

  imagesList.forEach((image) => {

    const imageRatio = image.width / image.height

    let imgCollWidth = 12

    if(image.type === 'Architecture') {
      if(imageRatio < 1) imgCollWidth = collWidthList.archi_verticale
      else imgCollWidth = collWidthList.archi_horizontale
    }
    else if (image.type === 'Mobilier') {
      if(imageRatio < 1) imgCollWidth = collWidthList.mobilier_verticale
      else imgCollWidth = collWidthList.mobilier_horizontale
    }
    else if (image.type === 'Scénographie') {
      if(imageRatio < 1) imgCollWidth = collWidthList.sceno_verticale
      else imgCollWidth = collWidthList.sceno_horizontale
    }

    const imageWidth = Math.floor( (((containerWidth + gap ) / collNumber) * imgCollWidth) - gap )
    const imageHeight = imageWidth / imageRatio

    // Chercher la meilleure position (la plus basse possible, puis la plus à gauche)
    let bestX = 0
    let bestY = 0
    let foundPosition = false

    // Essayer de placer l'image à différentes positions
    for (let y = 0; y < 1_000_000; y += 10) {
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
      y += gap
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
      type: image.type,
    })
  })

  // Calculer la hauteur totale
  const maxY = Math.max(...dataPositions.map(p => p.y + p.height))
  return {
    maxY,
    dataPositions,
  }
}
