import "./App.css";
import { useState } from "react";
import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Employee from "./components/Employee";
import Manager from "./components/Manager";


function App() {
  const [isConnected, setIsConnected] = useState({ status: false, role: "", id: null });

  console.log(isConnected);

  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login setIsConnected={setIsConnected} />} />
          <Route
            path="/employee/:id"
            element={<Employee setIsConnected={setIsConnected} />}
          />
          <Route
            path="/manager/:id"
            element={<Manager setIsConnected={setIsConnected} />}
          />
        </Routes>
    </BrowserRouter>
  );
}

export default App;