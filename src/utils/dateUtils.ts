/**
 * Calculate duration between two dates in Korean format
 * @param start - Start date in format "YYYY.MM"
 * @param end - End date in format "YYYY.MM" or null/undefined for current
 * @returns Duration string like "2년 3개월" or empty string if invalid
 */
export function calculateDuration(start: string, end?: string | null): string {
  if (!start) return ''

  // Parse start date
  const [startYear, startMonth] = start.split('.').map(Number)
  if (!startYear || !startMonth) return ''

  // Parse end date or use current date
  let endYear: number
  let endMonth: number

  if (end && end !== '현재') {
    // Remove any existing duration text if present (e.g., "2019.02 (1년 2개월)")
    const cleanEnd = end.split(' ')[0]
    const endParts = cleanEnd.split('.').map(Number)
    endYear = endParts[0]
    endMonth = endParts[1]
    if (!endYear || !endMonth) {
      // If end date is invalid, use current date
      const now = new Date()
      endYear = now.getFullYear()
      endMonth = now.getMonth() + 1
    }
  } else {
    // Use current date if end is not provided or is "현재"
    const now = new Date()
    endYear = now.getFullYear()
    endMonth = now.getMonth() + 1
  }

  // Calculate total months
  let totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth)

  // Handle negative duration
  if (totalMonths < 0) return ''

  // Convert to years and months
  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12

  // Format the output
  const parts: string[] = []
  if (years > 0) {
    parts.push(`${years}년`)
  }
  if (months > 0) {
    parts.push(`${months}개월`)
  }

  // Return formatted string or empty if no duration
  return parts.length > 0 ? parts.join(' ') : ''
}

/**
 * Format period with duration
 * @param start - Start date
 * @param end - End date or null/undefined for current
 * @returns Formatted string like "2020.01 ― 2023.12 (3년 11개월)"
 */
export function formatPeriodWithDuration(start: string, end?: string | null): string {
  if (!start) return ''

  // Clean end date if it contains duration info
  const cleanEnd = end ? end.split(' ')[0] : null

  // Calculate duration
  const duration = calculateDuration(start, cleanEnd)

  // Format the period string
  const endDisplay = cleanEnd || '현재'
  const periodStr = `${start} ― ${endDisplay}`

  // Add duration if calculated
  if (duration) {
    return `${periodStr} (${duration})`
  }

  return periodStr
}