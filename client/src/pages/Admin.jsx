import api from "../services/api";
import { useEffect, useState } from "react";

const Admin = () => {
  const [news, setNews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); 
  const [deleteId, setDeleteId] = useState(null);              
  const [form, setForm] = useState({
    title: "",
    text: "",
    tags: "",
    pictures: [],
  });

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

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/news/${deleteId}`);
      setNews(news.filter((item) => item._id !== deleteId));
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting news:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("text", form.text);

      const tagsArray = form.tags.split(",").map((tag) => tag.trim());
      tagsArray.forEach((tag) => formData.append("tags", tag));

      for (const picture of form.pictures) {
        formData.append("pictures", picture);
      }

      const response = await api.post("/news/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setNews([...news, response.data]);
      setShowModal(false);
      setForm({ title: "", text: "", tags: "", pictures: [] });
    } catch (error) {
      console.error("Error adding news:", error);
    }
  };

  return (
    <div className="container">
      <button
        className="btn btn-primary text-white"
        onClick={() => setShowModal(true)}
      >
        Add News
      </button>
      <table
        className="table table-light table-striped table-bordered"
        style={{ marginTop: "20px", marginBottom: "20px", width: "80%", marginLeft: "10%" }}
      >
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Title</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {news.map((item, index) => (
            <tr key={item._id}>
              <td>{index + 1}</td>
              <td>{item.title}</td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteClick(item._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Confirm Modal */}
      {showDeleteModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button className="btn-close" onClick={() => setShowDeleteModal(false)} />
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this news? This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleDeleteConfirm}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add News Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add News</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Text</label>
                    <textarea
                      className="form-control"
                      rows={4}
                      value={form.text}
                      onChange={(e) => setForm({ ...form, text: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Tags (comma separated)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="sports, tech, politics"
                      value={form.tags}
                      onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Pictures</label>
                    <input
                      type="file"
                      className="form-control"
                      multiple
                      accept="image/*"
                      onChange={(e) => setForm({ ...form, pictures: Array.from(e.target.files) })}
                    />
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;