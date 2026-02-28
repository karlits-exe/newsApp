const News = require("../models/News");
const { cloudinary } = require("../config/cloudinary");
const socket = require("../socket/socket");

exports.getNews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 3;

    const total = await News.countDocuments();
    const news = await News.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      news,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      hasMore: page < Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createNews = async (req, res) => {
  try {
    const pictures = req.files ? req.files.map((file) => file.path) : [];
    const tags = Array.isArray(req.body.tags) 
      ? req.body.tags.map((tag) => tag.toLowerCase())
      : [req.body.tags.toLowerCase()];

    const news = new News({
      title: req.body.title,
      text: req.body.text,
      tags,
      pictures,
    });
    const newNews = await news.save();
    return res.status(201).json(newNews);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: "News not found" });
    return res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateNews = async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!news) return res.status(404).json({ message: "News not found" });
    return res.json(news);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteNews = async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) return res.status(404).json({ message: "News not found" });
    //delete image from cloudinary
    if (news.pictures && news.pictures.length > 0) {
      for (const url of news.pictures) {
        const publicId = url.split("/").slice(-2).join("/").split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }
    }
    return res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: "News not found" });
    news.comments.push({ userId: req.body.userId, comment: req.body.comment });
    await news.save();

    const io = socket.getIO();
    io.emit("newComment", {
      newsId: news._id,
      comment: news.comments[news.comments.length - 1],
    });

    return res.json(news);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.likeNews = async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true },
    );

    const io = socket.getIO();
    io.emit("updateLikes", {
      newsId: news._id,
      likes: news.likes,
      dislikes: news.dislikes,
    });

    return res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.dislikeNews = async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(
      req.params.id,
      { $inc: { dislikes: 1 } },
      { new: true },
    );

    const io = socket.getIO();
    io.emit("updateLikes", {
      newsId: news._id,
      likes: news.likes,
      dislikes: news.dislikes,
    });

    return res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.incrementViews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: "News not found" });
    news.views += 1;
    await news.save();
    return res.json(news);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getNewsByTag = async (req, res) => {
  try {
    const news = await News.find({ tags: req.params.tag });
    return res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.unlikeNews = async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: -1 } },
      { new: true },
    );

    const io = socket.getIO();
    io.emit("updateLikes", {
      newsId: news._id,
      likes: news.likes,
      dislikes: news.dislikes,
    });

    return res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.undislikeNews = async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(
      req.params.id,
      { $inc: { dislikes: -1 } },
      { new: true },
    );

    const io = socket.getIO();
    io.emit("updateLikes", {
      newsId: news._id,
      likes: news.likes,
      dislikes: news.dislikes,
    });

    return res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllTags = async (req, res) => {
    try {
        const tags = await News.distinct("tags");
        res.json(tags);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
