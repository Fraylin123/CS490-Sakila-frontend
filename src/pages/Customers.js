import { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";

function Customers() {
    const [customers, setCustomers] = useState([])
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchCustomers();
    }, [page, search]);

    const fetchCustomers = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/api/customers?page=${page}`);
            setCustomers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Customers</h2>
            {/* SEARCH */}
            <input
                type="text"
                className="form-control mb-3"
                placeholder="Search by id, first name, or last name..."
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
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Currently Active</th>
                    </tr>
                </thead>

                <tbody>
                    {customers.map(customer => (
                        <tr
                            key={customer.customer_id}
                            style={{ cursor: "pointer" }}
                        >
                            <td>{customer.customer_id}</td>
                            <td>{customer.first_name}</td>
                            <td>{customer.last_name}</td>
                            <td>{customer.email}</td>
                            <td>{customer.active}</td>
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
                    disabled={customers.length < 50}
                    onClick={() => setPage(page + 1)}
                >
                    Next
                </Button>
            </div>


        </div>
    )
}

export default Customers;