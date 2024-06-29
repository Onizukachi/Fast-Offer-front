import { Routes, Route } from 'react-router-dom'
import routesConfig from '@routes/routesConfig.js'
import { NextUIProvider } from '@nextui-org/react'
import {useNavigate} from 'react-router-dom';
import Header from '@components/Header'
import styles from './App.module.css'

function App() {
  const navigate = useNavigate()

  return (
    <NextUIProvider navigate={navigate}>
      <Header />

      <div className={styles.bodyWrapper}>
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
    </NextUIProvider>
  )
}

export default App
