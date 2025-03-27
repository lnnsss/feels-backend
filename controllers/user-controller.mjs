import { validationResult } from "express-validator";
import UserModel from "../models/User.mjs";
import PostModel from "../models/Post.mjs";

export default class UserController {
  // Получение количества пользователей
  static async getUsersCount(req, res) {
    try {
      const count = await UserModel.countDocuments({ roles: { $ne: "ADMIN" } });
      return res.status(200).json({
        message: "Количество пользователей (исключая админов) успешно получено",
        content: count,
      });
    } catch (err) {
      console.error(
        "Ошибка при получении количества пользователей (исключая админов):",
        err
      );
      return res.status(500).json({
        message:
          "Ошибка при получении количества пользователей (исключая админов)",
        err,
      });
    }
  }
  // Получение всех пользователей
  static async getUsers(req, res) {
    try {
      const content = await UserModel.find(
          { roles: { $ne: "ADMIN" } },
          { _id: 1, userName: 1, name: 1, lastName: 1, avatarURL: 1 }
      );

      if (content.length === 0) {
        return res
            .status(200)
            .json({ message: "Пользователи отсутствуют", content });
      }

      return res
          .status(200)
          .json({ message: "Пользователи успешно получены", content });
    } catch (err) {
      return res
          .status(500)
          .json({ message: "Ошибка при получении пользователей", err });
    }
  }
  // Получение пользователя по id
  static async getUser(req, res) {
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
  // Получение информации о пользователе по userName
  static async getUserInfoByUserName(req, res) {
    try {
      const { userName } = req.params;

      // Находим пользователя с нужными полями
      const user = await UserModel.findOne(
          { userName },
          { _id: 1, userName: 1, name: 1, lastName: 1, avatarURL: 1, subscriptions: 1 }
      );

      if (!user) {
        return res.status(400).json({ message: "Пользователь не найден", content: null });
      }

      // Получаем все посты пользователя
      const posts = await PostModel.find({ userID: user._id });

      return res.status(200).json({
        message: "Пользователь успешно получен",
        content: { ...user._doc, posts }
      });
    } catch (err) {
      res.status(500).json({ message: "Ошибка при получении пользователя", content: null, err });
    }
  }
  // Получение информации о пользователе по id
  static async getUserInfoById(req, res) {
    try {
      const { id } = req.params;

      // Находим пользователя с нужными полями
      const user = await UserModel.findById(
          id,
          { _id: 1, userName: 1, name: 1, lastName: 1, avatarURL: 1, subscriptions: 1 }
      );

      if (!user) {
        return res.status(400).json({ message: "Пользователь не найден", content: null });
      }

      // Получаем все посты пользователя
      const posts = await PostModel.find({ userID: id });

      return res.status(200).json({
        message: "Пользователь успешно получен",
        content: { ...user._doc, posts }
      });
    } catch (err) {
      res.status(500).json({ message: "Ошибка при получении пользователя", content: null, err });
    }
  }
  // Получение подписок пользователя по id
  static async getUserSubscriptions(req, res) {
    try {
      const { id } = req.params;

      const user = await UserModel.findById(id).populate(
        "subscriptions",
        "userName name lastName avatarURL"
      );
      if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }

      return res.status(200).json({
        message: "Подписки успешно получены",
        content: user.subscriptions,
      });
    } catch (err) {
      console.error("Ошибка при получении подписок пользователя:", err);
      return res
        .status(500)
        .json({ message: "Ошибка при получении подписок пользователя", err });
    }
  }
  // Редактирование пользователя по id
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
  // Подписка
  static async subscribe(req, res) {
    try {
      const { id } = req.params;
      const { subscriptionID } = req.body;

      // Находим пользователя по ID
      const user = await UserModel.findById(id);
      if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }

      // Проверяем, подписан ли уже пользователь
      if (!user.subscriptions.includes(subscriptionID)) {
        user.subscriptions.push(subscriptionID);
        await user.save();
        return res.status(200).json({
          message: "Успешная подписка",
          content: user.subscriptions,
        });
      } else {
        return res
          .status(400)
          .json({ message: "Уже подписаны на пользователя" });
      }
    } catch (err) {
      console.error("Ошибка при попытке подписки:", err);
      res.status(500).json({ message: "Ошибка при попытке подписки", err });
    }
  }
  // Отписка
  static async unsubscribe(req, res) {
    try {
      const { id } = req.params;
      const { subscriptionID } = req.body;

      // Находим пользователя по ID
      const user = await UserModel.findById(id);
      if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }

      const index = user.subscriptions.indexOf(subscriptionID);
      if (index > -1) {
        user.subscriptions.splice(index, 1);
        await user.save();
        return res.status(200).json({
          message: "Успешная отписка",
          content: user.subscriptions,
        });
      } else {
        return res.status(400).json({ message: "Подписка не найдена" });
      }
    } catch (err) {
      console.error("Ошибка при попытке отписки:", err);
      res.status(500).json({ message: "Ошибка при попытке отписки", err });
    }
  }
  // Удаление пользователя по id
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;

      // Удаление всех постов пользователя
      await PostModel.deleteMany({ userID: id });

      // Удаление пользователя
      const content = await UserModel.findByIdAndDelete(id);

      if (!content) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }

      return res.status(200).json({
        message: "Пользователь и все его посты успешно удалены",
        content,
      });
    } catch (err) {
      console.error("Ошибка при удалении пользователя и его постов:", err);
      res.status(500).json({
        message: "Ошибка при удалении пользователя и его постов",
        err,
      });
    }
  }
}