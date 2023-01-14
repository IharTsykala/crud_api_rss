export const removeLastSlash = (pathname: string) => {
  if (pathname[pathname.length - 1] === '/') {
    return pathname.slice(0, -1)
  }
  return pathname
}
