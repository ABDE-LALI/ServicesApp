import { useState } from "react";

const LeaveTable = ({ leaveRequests, onStatusChange, setLeaveRequests1}) => {
    const [postponeStates, setPostponeStates] = useState({}); // Manages postponed states per row
    const [formDates, setFormDates] = useState({ newStartDate: "", newEndDate: "" });

    const handleSubmit = (id) => {
        if (!formDates.newStartDate || !formDates.newEndDate) {
            alert("Please select new start and end dates!");
            return;
        }
        onStatusChange(id, "Postponed", formDates);
        setPostponeStates((prev) => ({ ...prev, [id]: false })); // Close postpone form after submission
    };

    const togglePostpone = (id) => {
        setPostponeStates((prev) => ({
            ...prev,
            [id]: !prev[id], // Toggle visibility for the specific request
        }));
    };

    return (
        <table
            style={{
                width: "100%",
                borderCollapse: "collapse",
                margin: "20px 0",
                fontSize: "18px",
                textAlign: "left",
            }}
        >
            <thead>
                <tr style={{ backgroundColor: "#f4f4f4", borderBottom: "2px solid #ddd" }}>
                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>Employee ID</th>
                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>Start Date</th>
                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>End Date</th>
                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>Status</th>
                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>Actions</th>
                </tr>
            </thead>
            <tbody>
                {leaveRequests &&
                    leaveRequests.map((request) => (
                        <tr
                            key={request.id}
                            style={{
                                backgroundColor: request.status === "approved" ? "lightgreen" : "white",
                                borderBottom: "1px solid #ddd",
                            }}
                        >
                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>{request.employeeId}</td>
                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>{request.startDate}</td>
                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>{request.endDate}</td>
                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>{request.status}</td>
                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                                <button
                                    style={{
                                        margin: "5px",
                                        padding: "5px 10px",
                                        backgroundColor: "green",
                                        color: "white",
                                        border: "none",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => onStatusChange(request.id, "approved")}
                                >
                                    Approve
                                </button>
                                <button
                                    style={{
                                        margin: "5px",
                                        padding: "5px 10px",
                                        backgroundColor: "red",
                                        color: "white",
                                        border: "none",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => onStatusChange(request.id, "rejected")}
                                >
                                    Reject
                                </button>
                                <button
                                    style={{
                                        margin: "5px",
                                        padding: "5px 10px",
                                        backgroundColor: "orange",
                                        color: "white",
                                        border: "none",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => togglePostpone(request.id)}
                                >
                                    Postpone
                                </button>

                                {postponeStates[request.id] && (
                                    <div style={{ marginTop: "10px", display: "flex", gap: "5px", flexDirection: "column" }}>
                                        <input
                                            type="date"
                                            style={{ padding: "5px", border: "1px solid #ccc" }}
                                            onChange={(e) => setFormDates((prev) => ({ ...prev, newStartDate: e.target.value }))}
                                        />
                                        <input
                                            type="date"
                                            style={{ padding: "5px", border: "1px solid #ccc" }}
                                            onChange={(e) => setFormDates((prev) => ({ ...prev, newEndDate: e.target.value }))}
                                        />
                                        <button
                                            style={{
                                                padding: "5px 10px",
                                                backgroundColor: "blue",
                                                color: "white",
                                                border: "none",
                                                cursor: "pointer",
                                            }}
                                            onClick={() => handleSubmit(request.id)}
                                        >
                                            Submit
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
            </tbody>
        </table>
    );
};

export default LeaveTable;
