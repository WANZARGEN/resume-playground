export const useImageUrl = () => {
  const getImageUrl = (imageSource: string) => {
    if (!imageSource) return ''
    
    if (imageSource.startsWith('data:')) return imageSource
    if (imageSource.startsWith('http')) return imageSource
    return `${import.meta.env.BASE_URL}${imageSource}`
  }

  return { getImageUrl }
} 