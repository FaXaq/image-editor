const Jimp = require('jimp')
const path = require('path')

module.exports = {
  getPixelColor (image, x, y) {
    return Jimp.intToRGBA(image.getPixelColor(x, y))
  },

  getImageWidth (image) {
    return image.bitmap.width;
  },

  getImageHeight (image) {
    return image.bitmap.height;
  },

  getImage (imageName) {
    return new Promise(function(resolve, reject) {
      Jimp.read(path.join(__dirname, '../public/images-available/', imageName), function(err, img) {
        if (err) {
          reject(err)
        } else {
          resolve(img)
        }
      })
    })
  },

  setRenderedImageName (name) {
    let ext = path.extname(name)
    let newName = path.basename(name, ext)
    newName += '-rendered'
    return newName + ext;
  },

  convolute (img, k, imgName) {
    let rendered = []
    let newName = this.setRenderedImageName(imgName)
    let width = this.getImageWidth(img)
    let height = this.getImageHeight(img)

    /* create new image */
    var newImg = new Jimp(width, height)

    console.log(newImg)
    console.log(img)

    // going through the image
    for (let x = 0; x <= width; x++) {
      for (let y = 0; y <= height; y++) {
        /* creating rendering matrix */
        let pcol = x === 0 ? 0 : x-1;
        let col = x;
        let ncol = x === width-1 ? width : x+1;
        let prow = y === 0 ? 0 : y-1;
        let row = y;
        let nrow = y === height-1 ? height : y+1;
        let renderingMatrix = [
          [{ x: pcol, y: prow}, { x: col, y: prow }, { x: ncol, y: prow}],
          [{ x: pcol, y: row }, { x: col, y: row }, { x: ncol, y: row }],
          [{ x: pcol, y: nrow}, { x: col, y: nrow }, { x: ncol, y: nrow }]
        ];

        /* console.log('rendering matrix', renderingMatrix)*/

        /* apply kernel */
        let kernelSum = 0,
            newColors = {
              r: 0,
              g: 0,
              b: 0,
              a: 0
            };
        for (var i = 0; i < renderingMatrix.length; i++) {
          for (var j = 0; j < renderingMatrix[i].length; j++) {
            let colors = this.getPixelColor(img, renderingMatrix[i][j].x, renderingMatrix[i][j].y)
            /* console.log('current colors of pixel', renderingMatrix[i][j].x, renderingMatrix[i][j].y, colors)
             * console.log('kernel multiplier', k[i][j])*/
            kernelSum += k[i][j];
            /* apply kernel factor on colors for the image */
            for (var color in colors) {
              newColors[color] += k[i][j] * colors[color];
            }
          }
        }

        /* console.log('new colors after applying the kernel', newColors)*/

        /* ensure each color is between 0 and 255 and a between 0 and 1 */
        for (var color in newColors) {
          let lowLimit = 0,
              highLimit = 255,
              newColor

          /* hack to prevent outline kernel from failing */
          if (kernelSum === 0 && color === 'a') newColor = 255

          /* new Color is the current color sum dividing by the sum of the kernel */
          else if (kernelSum === 0) newColor = newColors[color]
          else newColor = newColors[color] / kernelSum

          /* apply boundaries */
          if (newColor < lowLimit) newColor = lowLimit
          if (newColor > highLimit) newColor = highLimit

          newColors[color] = newColor;
        }

        /* console.log('after applying limits', newColors)*/

        newColors = Jimp.rgbaToInt(newColors.r, newColors.g, newColors.b, newColors.a)
        newImg.setPixelColor(newColors, x, y)
      }
    }

    newImg.write(path.join(__dirname, '../public/rendered/', newName))
    console.log('fininshed')

    return newName;
  },
}
