import {
  Button,
  useDisclosure,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { MdAccountCircle } from "react-icons/md";
import LoginModal from "@components/Header/Auth/LoginModal/index.js";
import SignUpModal from "@components/Header/Auth/SignUpModal/index.js";

const Auth = () => {
  const {
    isOpen: loginModalIsOpen,
    onOpen: loginModalOnOpen,
    onOpenChange: loginModalOnOpenChange,
  } = useDisclosure();
  const {
    isOpen: signUpIsOpen,
    onOpen: signUpOnOpen,
    onOpenChange: signUpOnOpenChange,
  } = useDisclosure();

  return (
    <NavbarContent justify="end">
      <NavbarItem>
        <Button
          onClick={loginModalOnOpen}
          color="warning"
          href="/favorites"
          variant="flat"
          size={"lg"}
        >
          <MdAccountCircle size={"1.6em"} />
          Войти
        </Button>
      </NavbarItem>

      <LoginModal
        isOpen={loginModalIsOpen}
        onOpenChange={loginModalOnOpenChange}
        signUpOnOpen={signUpOnOpen}
      />
      <SignUpModal
        isOpen={signUpIsOpen}
        onOpenChange={signUpOnOpenChange}
        loginModalOnOpen={loginModalOnOpen}
      />
    </NavbarContent>
  );
};

export default Auth;
