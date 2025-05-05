'use client';

import { usePathname } from 'next/navigation';

export function useIsHomePage() {
  const pathname = usePathname();
  return pathname === '/blogflorescerhumano';
}
