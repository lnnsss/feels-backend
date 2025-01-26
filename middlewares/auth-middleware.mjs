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
];
