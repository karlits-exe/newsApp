import React from "react";
import api from "../services/api";
import { useEffect, useState } from "react";


const Statistics = () => {
  const [news, setNews] = useState([]);
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get("/news/all");
        setNews(response.data);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };
    fetchNews();
  }, []);


  return (
    <div>
      <table class="table table-light table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Title</th>
            <th scope="col">Likes</th>
            <th scope="col">Views</th>
          </tr>
        </thead>
        <tbody>
            {news.map((item, index) => (
          <tr key={item._id}>
              <td><div>{index + 1}</div></td>
              <td><div>{item.title}</div></td>
              <td><div>{item.likes}</div></td>
              <td><div>{item.views}</div></td>
          </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Statistics;
