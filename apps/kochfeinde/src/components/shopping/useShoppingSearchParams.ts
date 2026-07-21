import { useEffect } from 'react'
import type { useNavigate } from '@tanstack/react-router'

const LS_R = 'kochfeinde_shopping_r'
const LS_M = 'kochfeinde_shopping_m'

export function useShoppingSearchParams(
  urlR: string,
  urlM: string,
  navigate: ReturnType<typeof useNavigate>,
) {
  const restoredR =
    !urlR ? localStorage.getItem(LS_R) || '' : ''
  const restoredM =
    !urlM ? localStorage.getItem(LS_M) || '' : ''

  const r = urlR || restoredR
  const m = urlM || restoredM

  // Redirect to restored URL on first render if needed
  useEffect(() => {
    if (restoredR) {
      navigate({
        to: '/shopping-list',
        search: { r: restoredR, m: restoredM },
        replace: true,
        resetScroll: false,
      })
    }
  }, [])

  // Save to localStorage whenever r/m change
  useEffect(() => {
    if (r) localStorage.setItem(LS_R, r)
    else localStorage.removeItem(LS_R)
    if (m) localStorage.setItem(LS_M, m)
    else localStorage.removeItem(LS_M)
  }, [r, m])

  return { r, m }
}