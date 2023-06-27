/**
 * Shortens a hash into something a little more user friendly
 * @param hash hash string to shorten
 * @param options formatting options
 * @returns shortened, user-friendly string
 */
export const shorten = (hash: string, options?: { short?: boolean }) => {
  let result

  if (!hash) {
    return null
  }

  const expression = /^(\w{6})\w*(\w{4})$/
  result = expression.exec(hash)
  if (!result) {
    return null
  }

  return options?.short ? `${result[1]}...` : `${result[1]}...${result[2]}`
}
