import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ThemeProvider } from './context/ThemeContext'

// Layout
import Layout from './components/layout/Layout'
import AdminLayout from './components/layout/AdminLayout'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Products from './pages/Products'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Compras from './pages/Compras'
import Profile from './pages/Profile'
import Loyalty from './pages/Loyalty'
import AboutUs from './pages/AboutUs'
import Contact from './pages/Contact'
import Admin from './pages/Admin'

// Protected Route
import ProtectedRoute from './components/common/ProtectedRoute'
import AdminRoute from './components/common/AdminRoute'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Routes>
              {/* Public routes with main layout */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<SignUp />} />
                <Route path="products" element={<Products />} />
                <Route path="cart" element={<Cart />} />
                <Route path="about" element={<AboutUs />} />
                <Route path="contact" element={<Contact />} />
                
                {/* Protected routes */}
                <Route path="checkout" element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } />
                <Route path="compras" element={
                  <ProtectedRoute>
                    <Compras />
                  </ProtectedRoute>
                } />
                <Route path="profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="loyalty" element={
                  <ProtectedRoute>
                    <Loyalty />
                  </ProtectedRoute>
                } />
              </Route>

              {/* Admin routes */}
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }>
                <Route index element={<Admin />} />
              </Route>
            </Routes>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
