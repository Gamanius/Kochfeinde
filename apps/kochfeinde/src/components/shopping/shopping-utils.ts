export function decodeBitmask(hex: string, length: number): boolean[] {
  if (!hex) return Array(length).fill(false)
  try {
    const bin = BigInt(`0x${hex}`).toString(2)
    // LSB (rightmost) = ingredient 0, so reverse
    const bits = bin.split('').reverse()
    return Array.from({ length }, (_, i) => bits[i] === '1')
  } catch {
    return Array(length).fill(false)
  }
}

export function encodeBitmask(checked: boolean[]): string {
  if (checked.every(c => !c)) return ''
  // Reverse so LSB = ingredient 0
  let bits = checked.map(c => (c ? '1' : '0')).reverse().join('')
  // Trim leading zeros
  bits = bits.replace(/^0+/, '')
  if (bits.length === 0) return ''
  return BigInt(`0b${bits}`).toString(16)
}

export function formatQuantity(qty: number): string {
  if (qty % 1 === 0) return qty.toString()
  return qty.toFixed(2).replace(/\.?0+$/, '')
}

const UNIT_LABELS: Record<string, string> = {
  LITER: 'l',
  GRAMM: 'g',
  PIECE: '',
}

export function formatUnit(
  qty: number | null,
  unit: string,
): { qty: number; label: string } {
  if (qty === null) return { qty: 0, label: '' }
  if (unit === 'LITER' && qty < 1) return { qty: qty * 1000, label: 'ml' }
  if (unit === 'GRAMM' && qty >= 1000) return { qty: qty / 1000, label: 'kg' }
  return { qty, label: UNIT_LABELS[unit] ?? '' }
}

export function parseSlugEntries(
  r: string,
): { slug: string; amount: number }[] {
  return r
    .split(',')
    .filter(Boolean)
    .map(part => {
      const [slug, amountStr] = part.split(':')
      return { slug, amount: amountStr ? parseInt(amountStr, 10) : 4 }
    })
}
