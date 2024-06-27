import { BrowserRouter, Routes, Route } from 'react-router-dom'
import routesConfig from '@routes/routesConfig.js'
import Header from '@components/Header'
import styles from './App.module.css'

function App() {
  return (
    <>
      <BrowserRouter>
        <div>
          <Header />

          <Routes>
            { routesConfig.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={< route.element />}
              />
            )) }
          </Routes>
        </div>
      </BrowserRouter>
    </>
  )
}


export default App
