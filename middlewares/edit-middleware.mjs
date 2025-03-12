import { body } from "express-validator";

// Проверка, что URL ведет на изображение
const isImageUrl = (value) => {
  if (!value) return true;

  try {
    new URL(value);
  } catch (err) {
    throw new Error("Некорректный URL аватарки");
  }

  return true;
};

export const editValidation = [
  body("name")
      .optional()
      .isAlpha("ru-RU")
      .withMessage("Имя должно содержать только русские буквы")
      .isLength({ max: 14 })
      .withMessage("Имя не должно быть длиннее 14 символов"),

  body("lastName")
      .optional()
      .isAlpha("ru-RU")
      .withMessage("Фамилия должна содержать только русские буквы")
      .isLength({ max: 20 })
      .withMessage("Фамилия не должна быть длиннее 20 символов"),

  body("userName")
      .optional()
      .isLength({ min: 3, max: 15 })
      .withMessage("Юзернейм должен быть от 3 до 15 символов")
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage("Юзернейм может содержать только английские буквы и цифры")
      .matches(/[A-Za-z]/)
      .withMessage("Юзернейм должен содержать хотя бы одну букву")
      .not()
      .contains(" ")
      .withMessage("Юзернейм не должен содержать пробелов"),

  body("status")
      .optional()
      .isLength({ max: 30 })
      .withMessage("Статус не должен быть длиннее 30 символов"),

  body("avatarURL")
      .optional()
      .custom(isImageUrl)
      .withMessage("URL аватарки должен быть корректной ссылкой на изображение"),
];