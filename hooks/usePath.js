'use client';
import { usePathname } from "next/navigation"

const usePath = () => {
  const pathname = usePathname()
  return pathname;
}

export default usePath