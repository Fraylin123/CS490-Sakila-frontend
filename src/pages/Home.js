
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { Modal, Button } from "react-bootstrap";
import "./Home.css"
import clapperboard from "../clapperboard.png"
import user from "../user.png"



function Home() {
    const [topFilms, setTopFilms] = useState([]);
    const [topActors, setTopActors] = useState([]);
    const [show, setShow] = useState(false);
    const [modalType, setModalType] = useState(null); // "film" or "actor"
    const [filmData, setFilmData] = useState(null);
    const [actorData, setActorData] = useState(null);


    useEffect(() => {
        fetchTopFilms();
        fetchTopActors();
    }, []);

    const fetchTopFilms = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/films/top-films");
            setTopFilms(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchTopActors = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/actors/top-actors");
            setTopActors(res.data);
        } catch (err) {
            console.error(err);
        }

    };

    const openFilm = async (id) => {
        try {
            const res = await axios.get(`http://localhost:3000/api/films/${id}`);
            setFilmData(res.data);
            setActorData(null);
            setModalType("film");
            setShow(true);
        } catch (err) {
            console.error(err);
        }

    };

    const openActor = async (id, firstName, lastName) => {
    try {
        const res = await axios.get(`http://localhost:3000/api/actors/${id}/top-films`);

        setActorData({
            name: `${firstName} ${lastName}`,
            films: res.data
        });

        setFilmData(null);
        setModalType("actor");
        setShow(true);

    } catch (err) {
        console.error(err);
    }
};


    return (
        <div>
            <h1>Sakila Movie Store</h1>

            <h2 style={{ textAlign: "center", marginTop: "50px" }}>Top 5 Rented Films</h2>
            <div className="film-cards">
                {topFilms.map(film => (
                    <div key={film.film_id} className="film-card">
                        <img className="film-icon" src={clapperboard} alt="clapperboard icon" />
                        <h4>{film.title}</h4>
                        <p>Rentals: {film.rental_count}</p>
                        <button onClick={() => openFilm(film.film_id)}>View</button>
                    </div>

                ))}
            </div>

            <h2 style={{ textAlign: "center", marginTop: "50px" }}>Top 5 Actors</h2>
            <div className="actor-cards">
                {topActors.map(actor => (
                    <div key={actor.actor_id} className="actor-card">
                        <img className="actor-icon" src={user} alt="user icon" />
                        <h4>{actor.first_name} {actor.last_name}</h4>
                        <button onClick={() => openActor(actor.actor_id, actor.first_name, actor.last_name)}>View</button>
                    </div>
                ))}
            </div>

            <Modal
                show={show}
                onHide={() => setShow(false)}
                size="lg"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        {modalType === "film" && filmData?.title}
                        {modalType === "actor" && actorData?.name}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>

                    {/* FILM MODAL */}
                    {modalType === "film" && filmData && (
                        <div>
                            <p><strong>Film ID:</strong> {filmData.film_id}</p>
                            <p><strong>Description:</strong> {filmData.description}</p>
                            <p><strong>Release Year:</strong> {filmData.release_year}</p>
                            <p><strong>Rental Duration:</strong> {filmData.rental_duration} days</p>
                            <p><strong>Length:</strong> {filmData.length} minutes</p>
                            <p><strong>Rating:</strong> {filmData.rating}</p>
                            <p><strong>Replacement Cost:</strong> ${filmData.replacement_cost}</p>
                            <p><strong>Special Features:</strong> {filmData.special_features}</p>
                        </div>
                    )}

                    {/* ACTOR MODAL */}
                    {modalType === "actor" && actorData && (
                        <div>
                            <h5 className="mt-4">Top 5 Rented Films</h5>
                            <ul className="list-group">
                                {actorData.films.map((film) => (
                                    <li
                                        key={film.film_id}
                                        className="list-group-item d-flex justify-content-between"
                                    >
                                        {film.title}
                                        <span className="badge bg-primary">
                                            {film.rental_count} rentals
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>





        </div>
    )

}
export default Home;