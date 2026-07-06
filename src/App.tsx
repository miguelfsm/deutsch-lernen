import { type ReactElement } from 'react'
import { HashRouter, Routes, Route, NavLink, Link } from 'react-router-dom'
import { tools } from './tools/registry.js'
import Home from './pages/Home.jsx'
import GermanVerbs from './tools/verbs/GermanVerbs.jsx'
import GermanNouns from './tools/nouns/GermanNouns.jsx'
import GermanAdjectives from './tools/adjectives/GermanAdjectives.jsx'
import GermanPhrases from './tools/phrases/GermanPhrases.jsx'
import GermanSatzbau from './tools/satzbau/GermanSatzbau.jsx'
import PracticeTool from './tools/practice/PracticeTool.jsx'
import GlobalSearch from './components/GlobalSearch.jsx'

// Route path → tool component. Kept beside the registry so adding a tool is a
// two-line change (registry entry + element) and touches no existing tool.
const ELEMENTS: Record<string, ReactElement> = {
  '/verben': <GermanVerbs />,
  '/nomen': <GermanNouns />,
  '/adjektive': <GermanAdjectives />,
  '/redemittel': <GermanPhrases />,
  '/satzbau': <GermanSatzbau />,
  '/uben': <PracticeTool />,
}

function NavBar() {
  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: '#fdfcfb',
        borderBottom: '1px solid #e7e5e0',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        padding: '10px 16px',
      }}
    >
      <Link
        to="/"
        style={{
          fontFamily: "'Georgia', serif",
          fontWeight: 700,
          fontSize: 16,
          color: '#1c1917',
          textDecoration: 'none',
          letterSpacing: '-0.3px',
        }}
      >
        Deutsch Lernen
      </Link>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {tools.map((t) => (
          <NavLink
            key={t.path}
            to={t.path}
            style={({ isActive }) => ({
              fontFamily: "'Arial', sans-serif",
              fontSize: 13,
              textDecoration: 'none',
              padding: '5px 12px',
              borderRadius: 99,
              color: isActive ? '#faf9f7' : '#57534e',
              background: isActive ? '#1c1917' : '#e7e5e0',
            })}
          >
            {t.label}
          </NavLink>
        ))}
        <NavLink
          to="/suchen"
          aria-label="Suchen"
          style={({ isActive }) => ({
            fontFamily: "'Arial', sans-serif",
            fontSize: 13,
            textDecoration: 'none',
            padding: '5px 12px',
            borderRadius: 99,
            color: isActive ? '#faf9f7' : '#57534e',
            background: isActive ? '#1c1917' : '#e7e5e0',
          })}
        >
          🔍 Suchen
        </NavLink>
      </div>
    </nav>
  )
}

export default function App() {
  return (
    <HashRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/suchen" element={<GlobalSearch />} />
        {tools.map((t) => (
          <Route key={t.path} path={t.path} element={ELEMENTS[t.path]} />
        ))}
        <Route path="*" element={<Home />} />
      </Routes>
    </HashRouter>
  )
}
