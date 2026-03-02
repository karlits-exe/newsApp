# 📰 News Application

A full-stack news application built with **React.js** on the frontend and **Node.js + Express** on the backend, using **MongoDB** as the database. Features real-time updates via **WebSockets**, infinite scrolling, image uploads via **Cloudinary**, and an admin panel for managing news.

---

## 🚀 Features

- **News listing** with infinite scroll (loads 3 articles at a time)
- **Filter news by tags**
- **View individual news articles**
- **Real-time likes and dislikes** via WebSockets
- **Real-time comments** via WebSockets
- **View tracking** per article
- **Statistics page** showing most viewed articles
- **Admin panel** to add and delete news
- **Delete confirmation modal**
- **Image uploads** via Cloudinary

---

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- Socket.IO
- Cloudinary + Multer (image uploads)
- dotenv

### Frontend
- React.js
- React Router DOM
- Axios
- Socket.IO Client
- Bootstrap 5

---

## 📁 Project Structure

```
project/
├── server/
│   ├── config/
│   │   └── cloudinary.js
│   ├── controllers/
│   │   └── controller.js
│   ├── models/
│   │   └── News.js
│   ├── routes/
│   │   └── newsRoutes.js
│   ├── socket/
│   │   └── socket.js
│   ├── .env
│   └── index.js
│
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── NavBar.jsx
    │   │   └── NewsCard.jsx
    │   ├── pages/
    │   │   ├── NewsPage.jsx
    │   │   ├── NewsDetail.jsx
    │   │   ├── Admin.jsx
    │   │   └── Statistics.jsx
    │   ├── services/
    │   │   ├── api.js
    │   │   └── socket.js
    │   └── App.jsx
    └── index.html
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js installed
- MongoDB Atlas account
- Cloudinary account

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd project
```

### 2. Setup the Backend
```bash
cd server
npm install
```

Create a `.env` file in the `server` folder:
```
MONGODB_STRING=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the server:
```bash
node index.js
```

The server runs on `http://localhost:4000`

### 3. Setup the Frontend
```bash
cd client
npm install
npm run dev
```

The client runs on `http://localhost:5173`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/news` | Get paginated news (3 per page) |
| GET | `/news/all` | Get all news (for admin) |
| GET | `/news/tags` | Get all unique tags |
| GET | `/news/stats/views` | Get news sorted by views |
| GET | `/news/tag/:tag` | Get news filtered by tag |
| GET | `/news/:id` | Get single news article |
| POST | `/news` | Create news article |
| DELETE | `/news/:id` | Delete news article |
| PATCH | `/news/:id/views` | Increment view count |
| PATCH | `/news/:id/like` | Like a news article |
| PATCH | `/news/:id/unlike` | Unlike a news article |
| PATCH | `/news/:id/dislike` | Dislike a news article |
| PATCH | `/news/:id/undislike` | Undislike a news article |
| POST | `/news/:id/comments` | Add a comment |

---

## 🔌 WebSocket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `updateLikes` | Server → Client | Broadcasts updated like/dislike count |
| `newComment` | Server → Client | Broadcasts new comment to all clients |

---

## 📸 Image Uploads

Images are uploaded to **Cloudinary** automatically when creating a news article. When a news article is deleted, its images are also deleted from Cloudinary.

---

## 🔄 Infinite Scroll

The news page uses the **IntersectionObserver API** to detect when the last news card enters the viewport, then fetches the next 3 articles from the backend and appends them to the list.

---

## 👤 Notes

- Since there is no authentication, user reactions (likes/dislikes) are tracked per browser session using `sessionStorage`
- Comments use the Socket.IO `socket.id` as the user identifier
