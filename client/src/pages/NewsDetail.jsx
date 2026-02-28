import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import socket from "../services/socket";

const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [reaction, setReaction] = useState(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/news/${id}`);
        setNews(response.data);
        await api.patch(`/news/${id}/views`);

        const saved = sessionStorage.getItem(`reaction_${id}`);
        if (saved) setReaction(saved);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [id]);

  useEffect(() => {
    socket.on("updateLikes", (data) => {
      if (data.newsId.toString() === id && data.socketId !== socket.id) {
        setNews((prev) => ({
          ...prev,
          likes: data.likes,
          dislikes: data.dislikes,
        }));
      }
    });

    socket.on("newComment", (data) => {
      if (data.newsId.toString() === id && data.socketId !== socket.id) {
        setNews((prev) => ({
          ...prev,
          comments: [...prev.comments, data.comment],
        }));
      }
    });

    return () => {
      socket.off("updateLikes");
      socket.off("newComment");
    };
  }, [id]);

  const handleLike = async () => {
    try {
      if (reaction === "liked") {
        const response = await api.patch(`/news/${id}/unlike`, { socketId: socket.id });
        setNews(response.data);
        setReaction(null);
        sessionStorage.removeItem(`reaction_${id}`);
      } else if (reaction === null) {
        const response = await api.patch(`/news/${id}/like`, { socketId: socket.id });
        setNews(response.data);
        setReaction("liked");
        sessionStorage.setItem(`reaction_${id}`, "liked");
      }
    } catch (error) {
      console.error("Error liking news:", error);
    }
  };

  const handleDislike = async () => {
    try {
      if (reaction === "disliked") {
        const response = await api.patch(`/news/${id}/undislike`, { socketId: socket.id });
        setNews(response.data);
        setReaction(null);
        sessionStorage.removeItem(`reaction_${id}`);  
      } else if (reaction === null) {
        const response = await api.patch(`/news/${id}/dislike`, { socketId: socket.id });
        setNews(response.data);
        setReaction("disliked");
        sessionStorage.setItem(`reaction_${id}`, "disliked");  
      }
    } catch (error) {
      console.error("Error disliking news:", error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/news/${id}/comments`, {
        userId: socket.id,
        comment,
      });
      setComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  if (loading) return <div className="container mt-4">Loading...</div>;
  if (!news) return <div className="container mt-4">News not found</div>;

  return (
    <div className="container mt-4" style={{ maxWidth: "720px" }}>
      {news.pictures.length > 0 && (
        <img src={news.pictures[0]} className="img-fluid rounded mb-3 w-100" alt={news.title} />
      )}

      <h2>{news.title}</h2>

      <div className="d-flex gap-2 mb-3">
        {news.tags.map((tag) => (
          <span key={tag} className="badge bg-secondary">{tag}</span>
        ))}
      </div>

      <p>{news.text}</p>

      <div className="d-flex gap-3 mb-4 text-muted">
        <span>👁 {news.views} views</span>
        <span>💬 {news.comments.length} comments</span>
      </div>

      <div className="d-flex gap-2 mb-4">
        <button
          className={`btn ${reaction === "liked" ? "btn-success" : "btn-outline-success"}`}
          onClick={handleLike}
        >
          👍 {news.likes}
        </button>
        <button
          className={`btn ${reaction === "disliked" ? "btn-danger" : "btn-outline-danger"}`}
          onClick={handleDislike}
        >
          👎 {news.dislikes}
        </button>
        {reaction && (
          <small className="text-muted align-self-center">
            You already reacted to this article
          </small>
        )}
      </div>

      <h5>Comments</h5>
      <div className="mb-3">
        {news.comments.length === 0 ? (
          <p className="text-muted">No comments yet. Be the first!</p>
        ) : (
          news.comments.map((c) => (
            <div key={c._id} className="card mb-2 p-2">
              <small className="text-muted">{c.userId}</small>
              <p className="mb-0">{c.comment}</p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleComment}>
        <div className="mb-2">
          <textarea
            className="form-control"
            rows={3}
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Post Comment
        </button>
      </form>
    </div>
  );
};

export default NewsDetail;