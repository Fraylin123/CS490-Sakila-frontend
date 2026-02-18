import { Link } from "react-router-dom";
import "./Navigation.css"
function Navigation(){
    return(
        <nav className="navigation-bar">
            <div className="navigation-container">

            <div className="logo">
                <Link to="/">Sakila</Link>
            </div>
            
            <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/films">Films</Link>
                <Link to="/customers">Customers</Link>
            </div>
        </div>

        </nav>
    )
}
export default Navigation;