import { Link, Route, Routes } from 'react-router-dom'
import UserList from './components/UserList'
import UserForm from './components/UseForm' 
import UserDetail from './components/UserDetail'
import { Home } from 'lucide-react'


function App() {

  return (
    // Main container uses Inter font (default in Tailwind) and applies responsive padding
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section - Modern, clean, and separated */}
        <header className="flex items-center justify-between py-6 mb-8 border-b border-gray-200">
          
          {/* Title Block */}
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              👤 User Management System
            </h1>
            <p className="text-md text-gray-500 mt-1">
              A simple CRUD application using JSONPlaceholder and modern React patterns.
            </p>
          </div>
          
          {/* Navigation Link */}
          <Link 
            to="/" 
            className="inline-flex items-center text-md font-semibold text-blue-600 hover:text-blue-700 transition duration-150 p-2 rounded-lg hover:bg-blue-50"
            title="Go to Home"
          >
            <Home className="w-5 h-5 mr-1.5" />
            Dashboard
          </Link>
        </header>

        {/* Router Views */}
        <main className="pb-10">
          <Routes>
            <Route path="/" element={<UserList />} />
            <Route path="/create" element={<UserForm mode="create" />} />
            <Route path="/edit/:id" element={<UserForm mode="edit" />} />
            <Route path="/users/:id" element={<UserDetail />} />
          </Routes>
        </main>
        
      </div>
    </div>
  )
}

export default App