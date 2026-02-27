import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import {
  Home, PartyPopper, Gamepad2, MessageSquareHeart,
  BookOpen, Vote,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type AccessLevel = 'public' | 'authenticated' | 'admin'
export type LayoutType = 'root' | 'party' | 'none'

export interface RouteConfig {
  path: string
  title: string
  component: LazyExoticComponent<ComponentType>
  layout: LayoutType
  access: AccessLevel
  showInNav?: boolean
  navLabel?: string
  navIcon?: LucideIcon
  meta?: {
    description?: string
    noIndex?: boolean
  }
}

export const routes: RouteConfig[] = [
  {
    path: '/',
    title: 'מרים סגל',
    component: lazy(() => import('@/pages/HomePage').then(m => ({ default: m.HomePage }))),
    layout: 'root',
    access: 'public',
    showInNav: true,
    navLabel: 'בית',
    navIcon: Home,
  },
  {
    path: '/party',
    title: 'מתחם המסיבה — מרים סגל',
    component: lazy(() => import('@/pages/party/PartyHub').then(m => ({ default: m.PartyHub }))),
    layout: 'party',
    access: 'public',
    showInNav: true,
    navLabel: 'מתחם המסיבה',
    navIcon: PartyPopper,
  },
  {
    path: '/party/trivia',
    title: 'טריוויה — מרים סגל',
    component: lazy(() => import('@/pages/party/TriviaPage').then(m => ({ default: m.TriviaPage }))),
    layout: 'party',
    access: 'public',
    showInNav: true,
    navLabel: 'טריוויה',
    navIcon: Gamepad2,
  },
  {
    path: '/party/blessings',
    title: 'קיר ברכות — מרים סגל',
    component: lazy(() => import('@/pages/party/BlessingsPage').then(m => ({ default: m.BlessingsPage }))),
    layout: 'party',
    access: 'public',
    showInNav: true,
    navLabel: 'קיר ברכות',
    navIcon: MessageSquareHeart,
  },
  {
    path: '/party/dictionary',
    title: 'מילון — מרים סגל',
    component: lazy(() => import('@/pages/party/DictionaryPage').then(m => ({ default: m.DictionaryPage }))),
    layout: 'party',
    access: 'public',
    showInNav: true,
    navLabel: 'מילון',
    navIcon: BookOpen,
  },
  {
    path: '/party/vote',
    title: 'הצבעות — מרים סגל',
    component: lazy(() => import('@/pages/party/VotingPage').then(m => ({ default: m.VotingPage }))),
    layout: 'party',
    access: 'public',
    showInNav: true,
    navLabel: 'הצבעות',
    navIcon: Vote,
  },
  {
    path: '/live',
    title: 'Live — מרים סגל',
    component: lazy(() => import('@/pages/LivePage').then(m => ({ default: m.LivePage }))),
    layout: 'none',
    access: 'public',
    showInNav: false,
    meta: { noIndex: true },
  },
  {
    path: '/seed',
    title: 'Seed — מרים סגל',
    component: lazy(() => import('@/pages/SeedPage').then(m => ({ default: m.SeedPage }))),
    layout: 'none',
    access: 'admin',
    showInNav: false,
    meta: { noIndex: true },
  },
  {
    path: '/admin',
    title: 'Admin — מרים סגל',
    component: lazy(() => import('@/pages/AdminPage').then(m => ({ default: m.AdminPage }))),
    layout: 'none',
    access: 'admin',
    showInNav: false,
    meta: { noIndex: true },
  },
]

export function getNavRoutes(): RouteConfig[] {
  return routes.filter(r => r.showInNav)
}

