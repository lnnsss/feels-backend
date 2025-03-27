import ChatModel from "../models/Chat.mjs";
import UserModel from "../models/User.mjs";
import MessageModel from "../models/Message.mjs"

export default class ChatController {

  // Создание чата
  static async createChat(req, res) {
    try {
      // Проверка на id пользователей
      const userId = req.user._id;
      if (!userId) {
        return res.status(401).json({ message: "Нет доступа" });
      }
      const { partnerId } = req.body;
      if (!partnerId) {
        return res.status(400).json({ message: "ID собеседника не передан" });
      }
  
      // Проверяем, существует ли собеседник
      const partner = await UserModel.findById(partnerId);
      if (!partner) {
        return res.status(404).json({ message: "Собеседник не найден" });
      }
  
      // Проверяем, существует ли уже чат между пользователями
      const existingChat = await ChatModel.findOne({
        users: { $all: [userId, partnerId] },
      });
      if (existingChat) {
        return res.status(201).json({ message: "Чат уже существует", content: existingChat });
      }
  
      // Создаем новый чат
      const chat = new ChatModel({
        users: [userId.toString(), partnerId.toString()],
        messages: [],
      });
      await chat.save();
  
      return res.status(201).json({ message: "Чат успешно создан", content: chat });
    } catch (err) {
      console.error(err);
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ message: "Ошибка валидации", errors: err.errors });
      } else {
        return res.status(500).json({ message: "Ошибка при создании чата", err });
      }
    }
  }

  // Создание сообщения
  static async createMessage(req, res) {
    try {
      const chatId = req.params.chatID; 
      const { text } = req.body; 
      const userId = req.user._id;
      
  
      // Проверяем, существует ли чат
      const chat = await ChatModel.findById(chatId);
      if (!chat) {
        return res.status(404).json({ message: "Чат не найден" });
      }
  
      // Проверяем, является ли пользователь участником чата
      if (!chat.users.includes(userId.toString())) {
        return res.status(403).json({ message: "Нет доступа к этому чату" });
      }
  
      // Создаем новое сообщение
      const message = new MessageModel({
        userID: userId,
        text,
      });
  
      // Добавляем сообщение в чат
      chat.messages.push(message);
      await chat.save();
  
      return res.status(201).json({ message: "Сообщение отправлено" });
    } catch (err) {
      console.error(err);
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ message: "Ошибка валидации", errors: err.errors });
      } else {
        return res.status(500).json({ message: "Ошибка при отправке сообщения", err });
      }
    }
  }

  // Получение всех чатов пользователя
  static async getChats(req, res) {
    try {
      const userId = req.user._id;

      // Получаем все чаты пользователя
      const chats = await ChatModel.find({
        users: { $in: [userId] },
      })
          .populate("users", "_id name lastName avatarURL") // Добавили avatarURL
          .populate("messages");

      const result = [];
      for (const chat of chats) {
        // Находим собеседника
        const partner = chat.users.find((user) => user._id.toString() !== userId.toString());

        // Находим последнее сообщение
        const lastMessage = chat.messages[chat.messages.length - 1];

        result.push({
          chatID: chat._id, // Добавили chatID
          id: partner._id,
          name: partner.name,
          lastName: partner.lastName,
          avatarURL: partner.avatarURL, // Добавили avatarURL
          lastMessage: lastMessage ? lastMessage.text : "",
        });
      }

      return res.json({ message: "Чаты успешно получены", content: result });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Ошибка при получении чатов", err });
    }
  }
  
  // Получение конкретного чата пользователя
  static async getChat(req, res) {
    try {
      const chatId = req.params.chatID;
      const userId = req.user._id;

      // Проверяем, существует ли чат
      const chat = await ChatModel.findById(chatId)
          .populate("users", "_id userName name lastName avatarURL")
          .populate("messages");

      if (!chat) {
        return res.status(404).json({ message: "Чат не найден" });
      }

      // Проверяем, является ли пользователь участником чата
      if (!chat.users.some((user) => user._id.toString() === userId.toString())) {
        return res.status(403).json({ message: "Нет доступа к этому чату" });
      }

      // Находим собеседника
      const partner = chat.users.find((user) => user._id.toString() !== userId.toString());

      const result = {
        userID: partner._id,
        userName: partner.userName,
        name: partner.name,
        lastName: partner.lastName,
        avatarURL: partner.avatarURL,
        messages: chat.messages,
      }
      return res.json({ message: "Чат успешно получен", content: result });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Ошибка при получении чата", err });
    }
  }
}
