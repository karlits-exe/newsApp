import React from "react";
import { Link } from "react-router-dom";

const NewsCard = ({ news }) => {
  return (
    <>
      <div className="card mb-3" style={{ maxWidth: "540px" }}>
        <img
          src={news.pictures[0]}
          className="card-img-top img-fluid"
          alt={news.title}
        />
        <div className="card-body">
          <h5 className="card-title">{news.title}</h5>
          <p className="card-text">{news.text}</p>
          <p className="card-text">
            <small className="text-body-secondary d-flex gap-1 flex-wrap">
              {news.tags.map((tag) => (
                <span key={tag} className="badge bg-secondary">
                  {tag}
                </span>
              ))}
            </small>
          </p>
          <Link to={`/news/${news._id}`} className="btn btn-primary">
            Read more
          </Link>
        </div>
      </div>
    </>
  );
};

export default NewsCard;
