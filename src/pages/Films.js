import { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";

function Films() {

  const [films, setFilms] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    fetchFilms();
  }, [page, search]);

  const fetchFilms = async () => {
    try {

      let url = "";

      if (search.trim() === "") {
        url = `http://localhost:3000/api/films?page=${page}`;
      } else {
        url = `http://localhost:3000/api/films/search?q=${search}&page=${page}`;
      }

      const res = await axios.get(url);
      setFilms(res.data);

    } catch (err) {
      console.error(err);
    }
  };

  const openFilm = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/films/${id}`
      );
      setSelectedFilm(res.data);
      setShow(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">

      <h2>Films</h2>

      {/* SEARCH */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by title, actor, or genre..."
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
      />

      {/* TABLE */}
      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Genre</th>
            <th>Rating</th>
            <th>Release Year</th>
          </tr>
        </thead>

        <tbody>
          {films.map(film => (
            <tr
              key={film.film_id}
              style={{ cursor: "pointer" }}
              onClick={() => openFilm(film.film_id)}
            >
              <td>{film.film_id}</td>
              <td>{film.title}</td>
              <td>{film.genre}</td>
              <td>{film.rating}</td>
              <td>{film.release_year}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-between">
        <Button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </Button>

        <span>Page {page}</span>

        <Button
          disabled={films.length < 50}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </div>

      {/* FILM DETAILS MODAL */}
      <Modal show={show} onHide={() => setShow(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedFilm?.title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedFilm && (
            <>
              <p><strong>ID:</strong> {selectedFilm.film_id}</p>
              <p><strong>Description:</strong> {selectedFilm.description}</p>
              <p><strong>Release Year:</strong> {selectedFilm.release_year}</p>
              <p><strong>Rating:</strong> {selectedFilm.rating}</p>
              <p><strong>Length:</strong> {selectedFilm.length} mins</p>
              <p><strong>Rental Duration:</strong> {selectedFilm.rental_duration} days</p>
            </>
          )}
        </Modal.Body>
      </Modal>

    </div>
  );
}

export default Films;
