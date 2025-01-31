import { validationResult } from "express-validator";
import UserModel from "../models/User.mjs";

export default class UserController {
  static async getUsers(req, res) {
    try {
      const { userName } = req.query;
      let content;

      if (userName) {
        content = await UserModel.findOne({ userName });
        if (!content) {
          return res.status(404).json({ message: "Пользователь не найден" });
        }
        return res
          .status(200)
          .json({ message: "Пользователь успешно получен", content });
      } else {
        content = await UserModel.find();
        if (content.length === 0) {
          return res
            .status(400)
            .json({ message: "Пользователи отсутствуют", content });
        }
        return res
          .status(200)
          .json({ message: "Пользователи успешно получены", content });
      }
    } catch (err) {
      console.error("Ошибка при получении пользователей:", err);
      return res
        .status(500)
        .json({ message: "Ошибка при получении пользователей", err });
    }
  }
  static async getUserByID(req, res) {
    try {
      const { id } = req.params;
      const content = await UserModel.findById(id);
      if (!content) {
        return res.status(400).json({ message: "Пользователь не найден" });
      }
      return res
        .status(200)
        .json({ message: "Пользователь успешно получен", content });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Ошибка при получении пользователя", err });
    }
  }
  static async editUser(req, res) {
    try {
      const { id } = req.params;
      const { name, lastName, userName, status, avatarURL } = req.body;

      // Валидация
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }

      // Фильтруем пустые поля
      const body = Object.fromEntries(
        Object.entries({
          name,
          lastName,
          userName,
          status,
          avatarURL,
        }).filter(([_, value]) => value !== "")
      );

      // Если после фильтрации body пустой, возвращаем ошибку
      if (Object.keys(body).length === 0) {
        return res.status(400).json({ message: "Нет данных для обновления" });
      }

      // Обновляем пользователя
      const updatedUser = await UserModel.findByIdAndUpdate(
        id,
        { $set: body }, // Используем $set для обновления только указанных полей
        { new: true } // Возвращаем обновленный документ
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }

      return res.status(200).json({
        message: "Пользователь успешно обновлен",
        content: updatedUser,
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Ошибка при редактировании пользователя", err });
    }
  }
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const content = await UserModel.findByIdAndDelete(id);
      return res
        .status(200)
        .json({ message: "Пользователь успешно удален", content });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Ошибка при удалении пользователя", err });
    }
  }
}
