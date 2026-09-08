import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Assess from './pages/Student/Assess'
import Portfolio from './pages/Student/Portfolio'
import Recommend from './pages/Student/Recommend'
import Academician from './pages/Academician'
import Industry from './pages/Industry'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/student/assess" element={<Assess />} />
        <Route path="/student/portfolio" element={<Portfolio />} />
        <Route path="/student/recommend" element={<Recommend />} />
        <Route path="/academician" element={<Academician />} />
        <Route path="/industry" element={<Industry />} />
      </Routes>
    </BrowserRouter>
  )
}
