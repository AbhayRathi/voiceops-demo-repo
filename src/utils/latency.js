export function formatLatency(value) {
  if (value === null || value === undefined) {
    return 'n/a'
  }

  if (typeof value === 'string') {
    return value
  }

  return `${value} ms`
}

export function elapsed(start) {
  return Math.max(0, Date.now() - start)
}
