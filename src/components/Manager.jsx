import { useState, useEffect } from "react";
import db from "../db.json";
import LeaveTable from "./LeaveTable";

const Manager = () => {
    const [leaveRequests, setLeaveRequests] = useState([]);

    useEffect(() => {
        const managerId = 1;
        const requests = db.leaveRequests.filter(request => request.managerId === managerId);
        setLeaveRequests(requests);
    }, []);

    const handleStatusChange = (id, status, newDates = null) => {
        setLeaveRequests(prevRequests => 
            prevRequests.map(request => 
                request.id === id ? { 
                    ...request, 
                    status, 
                    startDate: newDates?.newStartDate || request.startDate, 
                    endDate: newDates?.newEndDate || request.endDate 
                } : request
            )
        );
    };

    return (
        <div>
            <h1>Manager</h1>
            <LeaveTable leaveRequests={leaveRequests} setLeaveRequests1 = {setLeaveRequests} onStatusChange={handleStatusChange} />
        </div>
    );
}

export default Manager;