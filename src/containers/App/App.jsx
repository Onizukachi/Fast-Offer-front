import { Routes, Route } from 'react-router-dom'
import routesConfig from '@routes/routesConfig.js'
import { NextUIProvider } from '@nextui-org/react'
import {useNavigate} from 'react-router-dom';
import Header from '@components/Header'
import Footer from '@components/Footer'
import styles from './App.module.css'
import imgLogo from "../../components/Header/img/logo.svg";
import React from "react";

function App() {
  const navigate = useNavigate()

  return (
    <NextUIProvider navigate={navigate}>
      <div className={styles.bodyWrapper}>
        <Header />

        <div className={styles.main}>
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

        <Footer />
      </div>
    </NextUIProvider>
  )
}

export default App
