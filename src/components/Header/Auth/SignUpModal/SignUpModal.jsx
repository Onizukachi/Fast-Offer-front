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
import {useContext, useEffect, useState} from "react";
import AuthContext from "@context/AuthContext.jsx";
import {toast} from "react-toastify";
import axios from "axios";
import {API_BACK_BASE_URL} from "@constants/api.js";
import { useNavigate } from "react-router-dom";

const SignUpModal = ({ isOpen, onOpenChange, loginModalOnOpen }) => {
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirmation: ""
  });
  const [errors, setErrors] = useState({});
  const { setUser, setAuthToken } = useContext(AuthContext);

  const onLogin = () => {
    onOpenChange()
    loginModalOnOpen()
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    setErrors({});
  }, [isOpen]);

  const emailIsValid = () => {
    if (formData.email === "") return false;

    const EMAIL_REGEXP =
      /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
    return formData.email.match(EMAIL_REGEXP);
  };

  const passwordIsValid = () => {
    return formData.password !== "" && formData.password.length >= 6;
  };

  const passwordConfirmationIsValid = () => {
    return formData.passwordConfirmation === formData.password;
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    // Validate Email
    if (!emailIsValid()) {
      newErrors.email = "Введите корректный Email";
      isValid = false;
    }

    // Validate password
    if (!passwordIsValid()) {
      newErrors.password = "Введите корректный пароль";
      isValid = false;
    }

    // Validate password confirmation
    if (!passwordConfirmationIsValid()) {
      newErrors.passwordConfirmation = "Пароль подтверждения не совпадает с паролем";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const successToast = () => {
    toast.success("Вы успешно зарегистрированы в системе!", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const signUpUser = async () => {
    axios
      .post(`${API_BACK_BASE_URL}/signup`, {
        user: {
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.passwordConfirmation
        },
      })
      .then((response) => {
        setAuthToken(response.headers.getAuthorization());
        setUser(response.data.user);
        onOpenChange();
        navigate("/");
        successToast();
      })
      .catch((error) => {
        console.log(error.response.data.status.errors);
        setErrors({ common: error.response.data.status.errors});
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault;

    if (validateForm()) signUpUser();
  };

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
              {errors.common && <p className="text-danger">{errors.common}</p>}
              <Input
                autoFocus
                label="Email"
                placeholder="Введите email"
                variant="bordered"
                onChange={handleInputChange}
                name="email"
                isInvalid={!!errors.email || !!errors.common}
                color={errors.email || errors.common ? "danger" : ""}
                errorMessage={errors.email}
              />
              <Input
                label="Пароль"
                placeholder="Введите пароль"
                type="password"
                variant="bordered"
                onChange={handleInputChange}
                name="password"
                isInvalid={!!errors.password || !!errors.common}
                color={errors.password || errors.common ? "danger" : ""}
                errorMessage={errors.password}
              />
              <Input
                label="Подтверждение пароля"
                placeholder="Повторите пароль"
                type="password"
                variant="bordered"
                onChange={handleInputChange}
                name="passwordConfirmation"
                isInvalid={!!errors.passwordConfirmation || !!errors.common}
                color={errors.passwordConfirmation || errors.common ? "danger" : ""}
                errorMessage={errors.passwordConfirmation}
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
              <Button color="primary" onPress={handleSubmit}>
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
