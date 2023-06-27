export const parseQueryParam = (
  key: string,
  options?: { default?: string; validValues?: string[] }
) => {
  if (typeof window === 'undefined') {
    return null
  }
  const url = new URL(window.location.href)
  const queryParams = new URLSearchParams(url.search)
  const value = queryParams.get(key)

  if (
    !value ||
    typeof value !== 'string' ||
    (!!options?.validValues && !options.validValues.includes(value))
  ) {
    return options?.default || null
  }

  return value
}

export const replaceQueryParam = (key: string, value: string) => {
  const url = new URL(window.location.href)
  url.searchParams.set(key, value)
  window.history.replaceState(null, '', url.toString())
}

export const pushQueryParam = (key: string, value: string) => {
  const url = new URL(window.location.href)
  url.searchParams.set(key, value)
  window.history.pushState(null, '', url.toString())
}

export const deleteQueryParam = (key: string) => {
  const url = new URL(window.location.href)
  url.searchParams.delete(key)
  window.history.replaceState(null, '', url.toString())
}
