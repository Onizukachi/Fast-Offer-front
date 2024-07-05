import { Routes, Route } from 'react-router-dom'
import routesConfig from '@routes/routesConfig.js'
import { NextUIProvider } from '@nextui-org/react'
import {useNavigate} from 'react-router-dom';
import { AuthProvider } from '@context/AuthContext'
import Header from '@components/Header'
import Footer from '@components/Footer'
import styles from './App.module.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const navigate = useNavigate()

  return (
    <NextUIProvider navigate={navigate}>
      <ToastContainer />
      <AuthProvider>
        <div className={styles.bodyWrapper}>
          <Header />

          <div className={styles.main}>
            <Routes>
              {/*Чтобы сделать маршрут приватным обернем в наш приватный роут*/}
              {/*<Route path="/" element={<PrivateRoute><HomePage/></PrivateRoute>} />*/}
              { routesConfig.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  element={< route.element />}
                />
              )) }
            </Routes>
          </div>

          <Footer />
        </div>
      </AuthProvider>
    </NextUIProvider>
  )
}

export default App
