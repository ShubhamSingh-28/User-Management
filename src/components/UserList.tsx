
import { Link, useNavigate } from 'react-router-dom'
import { useUserContext } from '../context/userContext'
import { UserSkeleton } from './UserSkeleton'

// Importing icons for a cleaner look
import { PlusCircle, Edit2, Trash2 } from 'lucide-react' 

export default function UserList() {
  const { users, loading, error, removeUser } = useUserContext()
  const nav = useNavigate()

  if (loading) return <UserSkeleton />
  if (error) return <p className="text-red-500 font-medium text-center py-4 bg-red-50 border border-red-200 rounded-lg mx-auto max-w-lg">{error}</p>

  // Render a message if the user list is empty
  if (!users || users.length === 0) {
    return (
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-4xl mx-auto mt-10 text-center border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">No Users Found</h2>
        <p className="text-gray-500 mb-6">It looks like you haven't created any users yet.</p>
        <button 
          onClick={() => nav('/create')} 
          className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Create Your First User
        </button>
      </div>
    )
  }

  return (
    // Outer container with better shadow and rounded corners
    <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 max-w-5xl mx-auto mt-10 border border-gray-100">
      
      {/* Header with a prominent call-to-action button */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">👤 User Directory</h2>
        <button 
          onClick={() => nav('/create')} 
          className="inline-flex items-center cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl transition duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Create User
        </button>
      </div>
      
      {/* User Table with improved styling */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Name</th>
              <th className="py-3 px-4 text-sm font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">Email</th>
              <th className="py-3 px-4 text-sm font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">Phone</th>
              <th className="py-3 px-4 text-sm font-semibold text-gray-600 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-100">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-blue-50 transition duration-150 ease-in-out">
                {/* Name - primary link */}
                <td className="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">
                  <Link 
                    to={`/users/${u.id}`} 
                    state={{ user: u }} 
                    className="text-blue-600 hover:text-blue-800 transition duration-150 hover:underline"
                  >
                    {u.name}
                  </Link>
                </td>
                
                {/* Email */}
                <td className="py-3 px-4 text-gray-600 hidden sm:table-cell">{u.email}</td>
                
                {/* Phone */}
                <td className="py-3 px-4 text-gray-600 hidden md:table-cell">{u.phone}</td>

                {/* Actions with icons and better buttons */}
                <td className="flex justify-end gap-3 py-3 px-4 whitespace-nowrap">
                  
                  {/* Edit Button */}
                  <button
                    onClick={() => nav(`/edit/${u.id}`, { state: { user: u } })}
                    className="inline-flex cursor-pointer items-center text-sm font-medium text-indigo-600 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    title="Edit User"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span className="ml-1 hidden sm:inline">Edit</span>
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => removeUser(u.id!)}
                    className="inline-flex cursor-pointer items-center text-sm font-medium bg-red-600 text-white hover:bg-red-700 px-3 py-1.5 rounded-lg transition duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    title="Delete User"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="ml-1 hidden sm:inline">Delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </div>
  )
}