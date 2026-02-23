const MAX_WIDTH = 800
const MAX_HEIGHT = 800
const QUALITY = 0.7

export function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('הקובץ אינו תמונה'))
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      reject(new Error('התמונה גדולה מדי (מקסימום 10MB)'))
      return
    }

    const reader = new FileReader()
    reader.onerror = () => reject(new Error('שגיאה בקריאת הקובץ'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('שגיאה בטעינת התמונה'))
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let { width, height } = img

        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height)
          width = Math.round(width * ratio)
          height = Math.round(height * ratio)
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('שגיאה ביצירת canvas'))
          return
        }

        ctx.drawImage(img, 0, 0, width, height)
        const dataUrl = canvas.toDataURL('image/jpeg', QUALITY)
        resolve(dataUrl)
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })
}
