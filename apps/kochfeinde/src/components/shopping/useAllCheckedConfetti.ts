import { useEffect, type RefObject } from 'react'
import type { ConfettiRef } from '#/components/list/confetti'

const BURSTS = [
  { origin: { x: 0.5, y: 0.8 }, spread: 60, particleCount: 80 },
  { origin: { x: 0, y: 0.9 }, spread: 40, angle: 60, particleCount: 50 },
  { origin: { x: 0, y: 0.7 }, spread: 30, angle: 70, particleCount: 40 },
  { origin: { x: 1, y: 0.9 }, spread: 40, angle: 120, particleCount: 50 },
  { origin: { x: 1, y: 0.7 }, spread: 30, angle: 110, particleCount: 40 },
  { origin: { x: 0.5, y: 1 }, spread: 80, particleCount: 50 },
  { origin: { x: 0.5, y: 0.3 }, spread: 120, particleCount: 60 },
]

export function useAllCheckedConfetti(
  checked: boolean[],
  confettiRef: RefObject<ConfettiRef | null>,
) {
  useEffect(() => {
    if (!checked.every(a => a)) return
    BURSTS.forEach(b => confettiRef.current?.fire(b))
  }, [checked, confettiRef])
}
