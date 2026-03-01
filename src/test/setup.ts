/**
 * Vitest setup — polyfills and mocks for jsdom.
 */
class IntersectionObserverMock {
  observe = () => {}
  disconnect = () => {}
  unobserve = () => {}
  root = null
  rootMargin = ''
  thresholds = []
}

Object.defineProperty(globalThis, 'IntersectionObserver', {
  value: IntersectionObserverMock,
  writable: true,
})
