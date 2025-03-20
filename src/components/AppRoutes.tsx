import type React from "react"
import { Routes, Route } from "react-router-dom"
import { Services } from "../pages/Services"
import { Categories } from "../pages/Categories"
import { ServicesList } from "../pages/ServicesList"
import ServiceDetails from "../pages/ServiceDetails"
import { Login } from "../pages/Login"
import { SignUp } from "../pages/SignUp"
import { MyServices } from "../pages/MyServices"
import { Account } from "../pages/Account"
import { Stats } from "../pages/Stats"
import { ProtectedRoute } from "./ProtectedRoute"

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Services />} />
      <Route path="/services" element={<ServicesList />} />
      <Route path="/services/:id" element={<ServiceDetails />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Protected Routes */}
      <Route
        path="/my-services"
        element={
          <ProtectedRoute>
            <MyServices />
          </ProtectedRoute>
        }
      />
      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        }
      />
      <Route
        path="/stats"
        element={
          <ProtectedRoute>
            <Stats />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

