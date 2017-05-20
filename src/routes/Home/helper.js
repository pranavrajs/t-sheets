export default function colNameResolver (n) {
  const nMod = n % 26
  const nDiv = parseInt(n / 26)
  if (!nDiv) {
    return String.fromCharCode(65 + nMod)
  }
  return `${colNameResolver(nDiv - 1)}${String.fromCharCode(65 + nMod)}`
}
