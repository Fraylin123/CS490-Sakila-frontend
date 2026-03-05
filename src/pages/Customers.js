import { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import "./Customers.css"
function Customers() {
    const [customers, setCustomers] = useState([])
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [showAdd, setShowAdd] = useState(false);
    const [newCustomer, setNewCustomer] = useState({
        first_name: "",
        last_name: "",
        email: ""
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [show, setShow] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editCustomer, setEditCustomer] = useState(null);

    useEffect(() => {
        fetchCustomers();
    }, [page, search]);

    const fetchCustomers = async () => {
        try {
            let url = "";

            if (search.trim() === "") {
                url = `http://localhost:5000/api/customers?page=${page}`;
            } else {
                url = `http://localhost:5000/api/customers/search?q=${search}&page=${page}`;
            }

            const res = await axios.get(url);
            setCustomers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const addCustomer = async () => {
        try {
            const res = await axios.post("http://localhost:5000/api/customers", newCustomer);
            setMessage(res.data.message);
            setError("");
            setShowAdd(false);
            fetchCustomers();

        } catch (err) {
            setError(err.response?.data?.error || "Error adding customer");
            setMessage("");
        }
    };

    const openCustomer = async (id) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/customers/${id}`);

            setSelectedCustomer(res.data);
            setEditCustomer(res.data.customer);
            setIsEditing(false);
            setShow(true);

        } catch (err) {
            console.error(err);
        }
    };

    const returnFilm = async (rental_id) => {
        try {
            const res = await axios.put(`http://localhost:5000/api/customers/return/${rental_id}`);

            setMessage(res.data.message);
            setError("");

            openCustomer(selectedCustomer.customer.customer_id);

        } catch (err) {
            setError(err.response?.data?.error || "Error returning film");
            setMessage("");
        }
    };

    const updateCustomer = async () => {
        try {
            const res = await axios.put(`http://localhost:5000/api/customers/${editCustomer.customer_id}`, editCustomer);

            setMessage(res.data.message);
            setError("");
            setIsEditing(false);

            openCustomer(editCustomer.customer_id);
            fetchCustomers();

        } catch (err) {
            setError(err.response?.data?.error || "Error updating customer");
            setMessage("");
        }
    };

    return (
        <div className="container mt-4">
            <h2>Customers</h2>
            {/* SEARCH */}
            <div className="search-button-pair">
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
                <Button className="mb-3" onClick={() => setShowAdd(true)}>Add Customer</Button>
            </div>
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
                            onClick={() => openCustomer(customer.customer_id)}
                        >
                            <td>{customer.customer_id}</td>
                            <td>{customer.first_name}</td>
                            <td>{customer.last_name}</td>
                            <td>{customer.email}</td>
                            <td>{customer.active == "1" ? "Yes" : "No"}</td>
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
            <Modal show={show} onHide={() => setShow(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {selectedCustomer?.customer.first_name}{" "}
                        {selectedCustomer?.customer.last_name}{"'S Details"}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {selectedCustomer && (
                        <>
                            <p><strong>ID:</strong> {editCustomer?.customer_id}</p>

                            {isEditing ? (
                                <>
                                    <div className="mb-2">
                                        <label className="form-label">First Name</label>
                                        <input
                                            className="form-control"
                                            value={editCustomer.first_name}
                                            onChange={(e) =>
                                                setEditCustomer({ ...editCustomer, first_name: e.target.value })
                                            }
                                        />
                                    </div>

                                    <div className="mb-2">
                                        <label className="form-label">Last Name</label>
                                        <input
                                            className="form-control"
                                            value={editCustomer.last_name}
                                            onChange={(e) =>
                                                setEditCustomer({ ...editCustomer, last_name: e.target.value })
                                            }
                                        />
                                    </div>

                                    <div className="mb-2">
                                        <label className="form-label">Email</label>
                                        <input
                                            className="form-control"
                                            value={editCustomer.email}
                                            onChange={(e) =>
                                                setEditCustomer({ ...editCustomer, email: e.target.value })
                                            }
                                        />
                                    </div>

                                </>
                            ) : (
                                <>
                                    <p><strong>First Name:</strong> {editCustomer?.first_name}</p>
                                    <p><strong>Last Name:</strong> {editCustomer?.last_name}</p>
                                    <p><strong>Email:</strong> {editCustomer?.email}</p>
                                </>
                            )}

                            <h5 className="mt-4">Rental History</h5>
                            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                                <table className="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>Rental ID</th>
                                            <th>Film</th>
                                            <th>Rental Date</th>
                                            <th>Return Date</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedCustomer.rentals.map((rental, index) => (
                                            <tr key={index}>
                                                <td>{rental.rental_id}</td>
                                                <td>{rental.title}</td>
                                                <td>{new Date(rental.rental_date).toLocaleDateString()}</td>
                                                <td>
                                                    {rental.return_date
                                                        ? new Date(rental.return_date).toLocaleDateString()
                                                        : "—"}
                                                </td>
                                                <td>
                                                    {rental.return_date ? (
                                                        <span className="badge bg-success">Returned</span>
                                                    ) : (
                                                        <>
                                                            <span className="badge bg-warning me-2">Currently Rented</span>
                                                            <Button
                                                                size="sm"
                                                                onClick={() => returnFilm(rental.rental_id)}
                                                            >
                                                                Return
                                                            </Button>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>

                    {!isEditing ? (
                        <Button variant="primary" onClick={() => setIsEditing(true)}>
                            Edit
                        </Button>
                    ) : (
                        <>
                            <Button variant="success" onClick={updateCustomer}>
                                Save
                            </Button>
                            <Button
                                variant="outline-secondary"
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditCustomer(selectedCustomer.customer);
                                }}
                            >
                                Cancel
                            </Button>
                        </>
                    )}
                </Modal.Footer>
            </Modal>

            <Modal show={showAdd} onHide={() => setShowAdd(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Customer</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <input
                        type="text"
                        placeholder="First Name"
                        className="form-control mb-2"
                        value={newCustomer.first_name}
                        onChange={(e) =>
                            setNewCustomer({ ...newCustomer, first_name: e.target.value })
                        }
                    />

                    <input
                        type="text"
                        placeholder="Last Name"
                        className="form-control mb-2"
                        value={newCustomer.last_name}
                        onChange={(e) =>
                            setNewCustomer({ ...newCustomer, last_name: e.target.value })
                        }
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        className="form-control mb-2"
                        value={newCustomer.email}
                        onChange={(e) =>
                            setNewCustomer({ ...newCustomer, email: e.target.value })
                        }
                    />

                    {message && <p className="text-success">{message}</p>}
                    {error && <p className="text-danger">{error}</p>}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAdd(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={addCustomer}>
                        Add Customer
                    </Button>
                </Modal.Footer>
            </Modal>


        </div>
    )
}

export default Customers;