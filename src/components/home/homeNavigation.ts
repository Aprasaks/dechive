export const MOBILE_NAV_ITEMS = [
  { label: 'Knowledge', href: '/knowledge', disabled: false },
  { label: 'Lecture', href: '/lecture', disabled: false },
  { label: 'Practice', href: '/practice', disabled: false },
  { label: 'AI Update', href: '/ai-update', disabled: false },
  { label: 'Books', href: '/books', disabled: false },
] as const;

export type HomeNavItem = (typeof MOBILE_NAV_ITEMS)[number];
