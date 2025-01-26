import UserModel from "../models/User.mjs";

export default class UserController {
  static async getUsers(req, res) {
    try {
      const content = await UserModel.find();
      if (content.length == 0) {
        return res
          .status(400)
          .json({ message: "Пользователи отссутствуют", content });
      }
      return res
        .status(200)
        .json({ message: "Пользователи успешно получены", content });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Ошибка при получении пользователей", err });
    }
  }
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
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const content = await UserModel.findByIdAndDelete(id);
      return res.status(200).json({ message: "Пользователь успешно удален", content });
    } catch (err) {
      res.status(500).json({ message: "Ошибка при удалении пользователя", err });
    }
  }
}
