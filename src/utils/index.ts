// truncate a float to n decimal places
export const truncateFloat = (n: number, places: number) => {
    const multiplier = Math.pow(10, places || 0)
    return Math.round(n * multiplier) / multiplier
}

// quotient of n / divisor
export const quot = (n: number, divisor: number) => n - (n % divisor)

// unix timestamp in seconds
export const timestamp = (dt: Date = new Date()) => (dt.getTime() / 1000) | 0

// truncate timestamp to the nearest n seconds
export const truncateTimestamp = (dt: Date = new Date(), n: number) => quot(timestamp(dt), n)
