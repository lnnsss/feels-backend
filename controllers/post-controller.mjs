import PostModel from "../models/Post.mjs";
import UserModel from "../models/User.mjs";

export default class PostController {
  static async createPost(req, res) {
    try {
      const { userID, text, color } = req.body;

      const user = await UserModel.findOne({ _id: userID });
      if (!user) {
        return res.status(400).json({ message: "Пользователя не существует" });
      }

      const doc = await new PostModel({
        userID,
        text,
        color: color || "#000000",
      });
      const content = await doc.save();

      return res.status(200).json({ message: "Пост успешно создан", content });
    } catch (err) {
      res.status(500).json({ message: "Ошибка при создании поста", err });
    }
  }
  static async getPostsCount(req, res) {
    try {
      const count = await PostModel.countDocuments();
      return res.status(200).json({
        message: "Количество постов успешно получено",
        content: count,
      });
    } catch (err) {
      console.error("Ошибка при получении количества постов:", err);
      return res.status(500).json({
        message: "Ошибка при получении количества постов",
        err,
      });
    }
  }
  static async getPosts(req, res) {
    try {
      const { userID, userName } = req.query;
      let content;

      if (userName) {
        const user = await UserModel.findOne({ userName });
        if (!user) {
          return res.status(404).json({ message: "Пользователь не найден" });
        }

        content = await PostModel.find({ userID: user._id });
      } else if (userID) {
        content = await PostModel.find({ userID });
      } else {
        content = await PostModel.find();
      }

      if (content.length === 0) {
        return res
          .status(204)
          .json({ message: "Посты отсутствуют", content: [] });
      }

      return res
        .status(200)
        .json({ message: "Посты успешно получены", content });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Ошибка при получении постов", err });
    }
  }
  static async getAllPosts(req, res) {
    try {
      // Находим все посты и заполняем информацию о пользователе
      const posts = await PostModel.find().populate(
        "userID",
        "userName name lastName"
      );

      if (posts.length === 0) {
        return res
          .status(204)
          .json({ message: "Посты отсутствуют", content: [] });
      }

      return res
        .status(200)
        .json({ message: "Посты успешно получены", content: posts });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Ошибка при получении постов", err });
    }
  }
  static async deletePost(req, res) {
    try {
      const { id } = req.params;
      const content = await PostModel.findByIdAndDelete(id);
      return res.status(200).json({ message: "Пост успешно удален", content });
    } catch (err) {
      res.status(500).json({ message: "Ошибка при получении постов", err });
    }
  }
}
