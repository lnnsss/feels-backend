import { body } from "express-validator";

export const registerValidation = [
  body("email").isEmail().withMessage("Неверный формат электронной почты"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Пароль должен содержать не меньше 6 символов")
    .matches(/[a-z]/)
    .withMessage("Пароль должен содержать строчные буквы")
    .matches(/[A-Z]/)
    .withMessage("Пароль должен содержать заглавные буквы")
    .matches(/[!#$%&?]/)
    .withMessage("Пароль должен содержать специальные символы (! # $ % & ?)")
    .not()
    .matches(/[а-яА-Я]/)
    .withMessage("Пароль не должен содержать русские буквы"),
  body("name")
    .isLength({ max: 14 })
    .withMessage("Имя не должно быть длиннее 14 символов")
    .not()
    .matches(/[!#$%&?]/)
    .withMessage("Имя не может содержать специальные символы (! # $ % & ?)"),
  body("lastName")
    .isLength({ max: 20 })
    .withMessage("Фамилия не должна быть длиннее 20 символов")
    .not()
    .matches(/[!#$%&?]/)
    .withMessage(
      "Фамилия не может содержать специальные символы (! # $ % & ?)"
    ),
];
