import {
  Button,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import PropTypes from "prop-types";

const SignUpModal = ({ isOpen, onOpenChange, loginModalOnOpen }) => {
  const onLogin = () => {
    onOpenChange()
    loginModalOnOpen()
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
            <ModalHeader className="flex flex-col gap-1">Регистрация</ModalHeader>
            <ModalBody>
              <Input
                autoFocus
                label="Email"
                placeholder="Введите email"
                variant="bordered"
              />
              <Input
                label="Пароль"
                placeholder="Введите пароль"
                type="password"
                variant="bordered"
              />
              <Input
                label="Подтверждение пароля"
                placeholder="Повторите пароль"
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
              </div>
            </ModalBody>
            <ModalFooter className="justify-between">
              <Button color="default" onPress={onLogin}>
                Войти
              </Button>
              <Button color="primary" onPress={onClose}>
                Зарегистрироваться
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

SignUpModal.propTypes = {
  isOpen: PropTypes.bool,
  onOpenChange: PropTypes.func,
  loginModalOnOpen: PropTypes.func
};

export default SignUpModal;
