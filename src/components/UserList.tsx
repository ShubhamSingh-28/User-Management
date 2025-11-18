import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUserContext } from '../context/userContext'
import { UserSkeleton } from './UserSkeleton'

export default function UserList() {
  const { users, loading, error, removeUser } = useUserContext()
  const nav = useNavigate()

  if (loading) return <UserSkeleton />
  if (error) return <p className="text-red-600">{error}</p>

  return (
    <div className="bg-white shadow rounded p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Users</h2>
        <button onClick={() => nav('/create')} className="bg-blue-600 text-white px-3 py-1 rounded">
          Create User
        </button>
      </div>

      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="py-2">Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map(u => (
            <tr key={u.id} className="border-b">
              <td className="py-2">
                <Link to={`/users/${u.id}`} state={{ user: u }} className="text-blue-600 underline">
                  {u.name}
                </Link>
              </td>
              <td>{u.email}</td>
              <td>{u.phone}</td>

              <td className="flex justify-end gap-2 py-2">
                <button
                  onClick={() => nav(`/edit/${u.id}`, { state: { user: u } })}
                  className="px-2 py-1 border rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => removeUser(u.id!)}
                  className="px-2 py-1 bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
