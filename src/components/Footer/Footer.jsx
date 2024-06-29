import React from "react"
import imgLogo from "./img/logo.svg"
import 'boxicons'

const Footer = () => {
  return (
    <footer className="flex w-full flex-col border-t border-divider">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-6 py-8 lg:px-8 gap-3">
        <div className="flex items-center justify-center">
          <img className="h-6 w-6 mr-2" src={imgLogo}/>
          <span className="text-medium font-medium">Fast Offer by Alexey Glazkov</span>
        </div>
        <div className="flex justify-center gap-x-4">
          <a href="https://github.com/Onizukachi">
            <box-icon name='github' type='logo'></box-icon>
          </a>
          <a href="https://vk.com/onizukachi">
            <box-icon name='vk' type='logo'></box-icon>
          </a>
          <a href="https://t.me/onizukachi">
            <box-icon type='logo' name='telegram'></box-icon>
          </a>
        </div>
      </div>

    </footer>
  )
}

export default Footer
