import Nav from './components/Nav'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import Builder from './pages/Builder'
import Pricing from './pages/Pricing'
import Docs from './pages/Docs'
import Faq from './pages/Faq'
import Teardown from './pages/Teardown'
import Contact from './pages/Contact'

function currentPage() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  switch (path) {
    case '/builder': return <Builder />
    case '/pricing': return <Pricing />
    case '/docs': return <Docs />
    case '/faq': return <Faq />
    case '/teardown': return <Teardown />
    case '/contact': return <Contact />
    default: return <Landing />
  }
}

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  const fullBleed = path === '/builder'
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className={fullBleed ? 'flex-1 flex flex-col' : 'flex-1'}>
        {currentPage()}
      </main>
      {!fullBleed && <Footer />}
    </div>
  )
}
