import {
  Button,
  Checkbox,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader
} from "@nextui-org/react";
import PropTypes from 'prop-types';

const LoginModal = ({isOpen, onOpenChange, signUpOnOpen}) => {

  const onRegister = () => {
    onOpenChange()
    signUpOnOpen()
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="auto"
      size={"lg"}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Вход</ModalHeader>
            <ModalBody>
              <Input
                autoFocus
                label="Email"
                placeholder="Введите ваш email"
                variant="bordered"
              />
              <Input
                label="Пароль"
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
            <ModalFooter className="justify-between">
              <Button color="default" variant="faded" onPress={onRegister}>
                Зарегистрироваться
              </Button>
              <Button color="primary" onPress={onClose}>
                Войти
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
};

LoginModal.propTypes = {
  isOpen: PropTypes.bool,
  onOpenChange: PropTypes.func,
  signUpOnOpen: PropTypes.func
}

export default LoginModal;
