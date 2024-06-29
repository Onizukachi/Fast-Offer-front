import { useState } from 'react';
import React from "react";
import { NavLink } from 'react-router-dom'
import {Navbar, NavbarBrand, NavbarMenuToggle, NavbarMenuItem, NavbarMenu, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react"
import imgLogo from "./img/logo.svg"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    "Собесы",
    "Избранное"
  ];

  return (
    <Navbar
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      maxWidth={'xl'}
      height={'70px'}
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavLink to="/">
          <NavbarBrand>
            <img className="h-11 w-11" src={imgLogo}/>
            <p className="font-bold text-inherit flex ml-2 text-lg">Simple Offer</p>
          </NavbarBrand>
        </NavLink>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavLink to="/">
          <NavbarBrand className="mr-5">
            <img className="h-11 w-11" src={imgLogo}/>
            <p className="font-bold text-inherit flex ml-2 text-lg">
              Fast Offer
            </p>
          </NavbarBrand>
        </NavLink>
        <NavbarItem>
          <Link color="foreground" href="/">
            Вопросы
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/interviews">
            Собесы
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="/favorites">
            Избранное
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
      <NavbarItem className="hidden lg:flex">
        <Link href="/favorites">Войти</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="warning" href="/favorites" variant="flat">
             Регистрация
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              color={
                index === 2 ? "warning" : index === menuItems.length - 1 ? "danger" : "foreground"
              }
              href="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  )
}

export default Header