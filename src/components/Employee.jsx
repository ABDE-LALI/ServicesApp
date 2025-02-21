import { useEffect, useState } from "react";
import db from "../db.json";

const Employee = ({ setIsConnected }) => {
    const [employeeForm, setEmployeeForm] = useState({ name: "", appointmentDate: "" });
    const [reservations, setReservations] = useState([]);
    const [leaveForm, setLeaveForm] = useState({ startDate: "", endDate: "" });

    // Load reservations from DB on component mount
    useEffect(() => {
        setReservations(db.leaveRequests);
    }, []);

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        const userExists = db.users.some((user) => user.name === employeeForm.name);
        if (!userExists) {
            console.error("User not found!");
            return;
        }

        const newRequest = {
            id: reservations.length + 1,
            employeeName: employeeForm.name,
            startDate: leaveForm.startDate,
            endDate: leaveForm.endDate,
            status: "pending",
        };

        setReservations([...reservations, newRequest]);
    };

    return (
        <>
            {/* Reservations Table */}
            <div style={{ width: "80%", margin: "20px auto", textAlign: "center" }}>
                <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>Reservations</h1>
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        background: "#fff",
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                        borderRadius: "8px",
                    }}
                >
                    <thead>
                        <tr style={{ backgroundColor: "#f4f4f4" }}>
                            <th style={{ padding: "12px", border: "1px solid #ddd", textAlign: "left" }}>Name</th>
                            <th style={{ padding: "12px", border: "1px solid #ddd", textAlign: "left" }}>Start Date</th>
                            <th style={{ padding: "12px", border: "1px solid #ddd", textAlign: "left" }}>End Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservations
                            .filter((reservation) => reservation.employeeName === employeeForm.name)
                            .map((reservation) => (
                                <tr
                                    key={reservation.id}
                                    style={{
                                        backgroundColor: reservation.status === "approved" ? "lightgreen" : "white",
                                    }}
                                >
                                    <td style={{ padding: "12px", border: "1px solid #ddd" }}>{reservation.status}</td>
                                    <td style={{ padding: "12px", border: "1px solid #ddd" }}>{reservation.startDate}</td>
                                    <td style={{ padding: "12px", border: "1px solid #ddd" }}>{reservation.endDate}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {/* Employee Form */}
            <div
                style={{
                    width: "300px",
                    margin: "20px auto",
                    padding: "20px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                    textAlign: "center",
                    backgroundColor: "#f9f9f9",
                }}
            >
                <h1 style={{ fontSize: "20px", marginBottom: "15px", color: "#333" }}>Employee</h1>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <input
                        type="text"
                        placeholder="Name"
                        onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })}
                        style={{
                            padding: "8px",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                            outline: "none",
                            fontSize: "16px",
                        }}
                    />

                    <input
                        type="date"
                        onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                        style={{
                            padding: "8px",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                            outline: "none",
                            fontSize: "16px",
                        }}
                    />

                    <input
                        type="date"
                        onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                        style={{
                            padding: "8px",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                            outline: "none",
                            fontSize: "16px",
                        }}
                    />

                    <button
                        onClick={handleSubmit}
                        style={{
                            width: "100px",
                            height: "35px",
                            backgroundColor: "blue",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "16px",
                        }}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </>
    );
};

export default Employee;
