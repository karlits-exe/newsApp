import React, { useEffect, useState, useRef, useCallback } from "react";
import api from "../services/api";
import NewsCard from "../components/NewsCard";

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [reset, setReset] = useState(false); 
  const observer = useRef();

  const lastNewsRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  useEffect(() => {
    const fetchTags = async () => {
        try {
            const response = await api.get("/news/tags");
            setTags(response.data);
        } catch (error) {
            console.error("Error fetching tags:", error);
        }
    };
    fetchTags();
}, []);

  useEffect(() => {
    if (selectedTag) return;

    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/news?page=${page}`);

        setNews((prev) => {
          const existingIds = new Set(prev.map((n) => n._id));
          const newItems = response.data.news.filter((n) => !existingIds.has(n._id));
          return [...prev, ...newItems];
        });

        setHasMore(response.data.hasMore);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
}, [page, reset]);

  const handleTagFilter = async (tag) => {
    if (tag === null || selectedTag === tag) {
      setSelectedTag(null);
      setNews([]);
      setPage(1);
      setHasMore(true);
      setReset((prev) => !prev);  
      return;
    }

    setSelectedTag(tag);
    setLoading(true);
    try {
      const response = await api.get(`/news/tags/${tag}`);
      setNews(response.data);
      setHasMore(false);
    } catch (error) {
      console.error("Error filtering by tag:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex flex-column align-items-center">
      <div className="d-flex flex-wrap gap-2 my-3">
        <button
          className={`btn btn-sm ${selectedTag === null ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => handleTagFilter(null)}
        >
          All
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            className={`btn btn-sm ${selectedTag === tag ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => handleTagFilter(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      {news.map((n, index) => {
        if (index === news.length - 1) {
          return (
            <div ref={lastNewsRef} key={n._id}>
              <NewsCard news={n} />
            </div>
          );
        }
        return <NewsCard key={n._id} news={n} />;
      })}

      {loading && <div className="my-3">Loading more news...</div>}

      {!hasMore && !loading && (
        <p className="text-muted my-3">You have reached the end</p>
      )}
    </div>
  );
};

export default NewsPage;