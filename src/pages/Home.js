import Navigation from '../components/Navigation';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';

function Home() {
    const [topFilms, setTopFilms] = useState([]);
    const [topActors, setTopActors] = useState([]);

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

    return (
        <div>
            <Navigation />

            <h1>🎬 Sakila Movie Store</h1>

            <h2>Top 5 Rented Films</h2>
            <div className="grid">
                {topFilms.map(film => (
                    <Link key={film.film_id} to={`/films/${film.film_id}`}>
                        <div className="card">
                            <h3>{film.title}</h3>
                            <p>Rentals: {film.rental_count}</p>
                        </div>
                    </Link>
                ))}
            </div>












        </div>
    )

}
export default Home;