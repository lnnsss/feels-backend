import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import UserModel from "../models/User.mjs";
import { validationResult } from "express-validator";

dotenv.config();
const secret = process.env.JWT_SECRET;

export default class AuthController {
  // Регистрация
  static async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }

      const { name, lastName, email, password, userName } = req.body;

      const existingUserByEmail = await UserModel.findOne({ email });
      if (existingUserByEmail) {
        return res
          .status(400)
          .json({ message: "Пользователь с таким email уже есть на сайте" });
      }

      const existingUserByUserName = await UserModel.findOne({ userName });
      if (existingUserByUserName) {
        return res
          .status(400)
          .json({ message: "Пользователь с таким userName уже есть на сайте" });
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const doc = new UserModel({
        name,
        lastName,
        email,
        passwordHash: hash,
        userName,
        avatarURL: "",
        status: "",
        roles: ["USER"],
      });
      const user = await doc.save();

      const token = jwt.sign(
        {
          _id: user._id,
          roles: user.roles,
        },
        secret,
        {
          expiresIn: "24h",
        }
      );

      const { passwordHash, ...userData } = user._doc;

      return res
        .status(200)
        .json({ message: "Успешная регистрация", ...userData, token });
    } catch (err) {
      return res.status(500).json({ message: "Ошибка регистрации", err });
    }
  }
  // Вход
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Неверный email или пароль" });
      }

      const isValidPassword = await bcrypt.compare(
        password,
        user._doc.passwordHash
      );
      if (!isValidPassword) {
        return res.status(400).json({ message: "Неверный email или пароль" });
      }

      const token = jwt.sign(
        {
          _id: user._id,
          roles: user.roles,
        },
        secret,
        {
          expiresIn: "24h",
        }
      );

      const { passwordHash, ...userData } = user._doc;

      return res
        .status(200)
        .json({ message: "Успешный вход", ...userData, token });
    } catch (err) {
      return res.status(500).json({ message: "Ошибка входа", err });
    }
  }
}
