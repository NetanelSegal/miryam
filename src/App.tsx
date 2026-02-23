import { Suspense } from 'react'
import { Routes, Route } from 'react-router'
import { routes, type RouteConfig } from './config/routes'
import { RootLayout } from './components/layout/RootLayout'
import { PartyLayout } from './components/layout/PartyLayout'
import { AdminGuard } from './components/guards/AdminGuard'

function RouteElement({ route }: { route: RouteConfig }) {
  const Component = route.component
  const element = <Component />

  if (route.access === 'admin') {
    return <AdminGuard>{element}</AdminGuard>
  }

  return element
}

export function App() {
  const rootRoutes = routes.filter(r => r.layout === 'root')
  const partyRoutes = routes.filter(r => r.layout === 'party')
  const noLayoutRoutes = routes.filter(r => r.layout === 'none')

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-accent-indigo border-t-transparent rounded-full animate-spin" /></div>}>
      <Routes>
        <Route element={<RootLayout />}>
          {rootRoutes.map(r => (
            <Route
              key={r.path}
              index={r.path === '/'}
              path={r.path === '/' ? undefined : r.path}
              element={<RouteElement route={r} />}
            />
          ))}
        </Route>
        <Route path="party" element={<PartyLayout />}>
          {partyRoutes.map(r => {
            const subpath = r.path.replace('/party', '') || undefined
            return (
              <Route
                key={r.path}
                index={r.path === '/party'}
                path={subpath && subpath !== '' ? subpath.replace(/^\//, '') : undefined}
                element={<RouteElement route={r} />}
              />
            )
          })}
        </Route>
        {noLayoutRoutes.map(r => (
          <Route
            key={r.path}
            path={r.path}
            element={<RouteElement route={r} />}
          />
        ))}
      </Routes>
    </Suspense>
  )
}
