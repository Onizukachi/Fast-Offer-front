import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  Input,
  Link,
  NavbarContent, NavbarItem
} from "@nextui-org/react";

const Auth = () => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  return (
    <NavbarContent justify="end">
      <NavbarItem className="flex">
        <Link onClick={onOpen} href="/favorites">
          Войти
        </Link>
      </NavbarItem>
      <NavbarItem>
          <Button
            onClick={onOpen}
            color="warning"
            href="/favorites"
            variant="flat"
          >
            Регистрация
          </Button>
      </NavbarItem>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="auto"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Войти</ModalHeader>
              <ModalBody>
                <Input
                  autoFocus

                  label="Email"
                  placeholder="Введите ваш email"
                  variant="bordered"
                />
                <Input

                  label="Password"
                  placeholder="Введите ваш пароль"
                  type="password"
                  variant="bordered"
                />
                <div className="flex py-2 px-1 justify-between">
                  <Checkbox
                    classNames={{
                      label: "text-small",
                    }}
                  >
                    Запомнить меня
                  </Checkbox>
                  <Link color="primary" href="#" size="sm">
                    Забыли пароль?
                  </Link>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Закрыть
                </Button>
                <Button color="primary" onPress={onClose}>
                  Войти
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </NavbarContent>
  )
}

export default Auth;