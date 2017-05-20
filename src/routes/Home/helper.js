export default function colNameResolver (n) {
  const nMod = n % 26
  const nDiv = parseInt(n / 26)
  if (!nDiv) {
    return String.fromCharCode(64 + nMod)
  }
  return `${colNameResolver(nDiv)}${String.fromCharCode(65 + nMod)}`
}
