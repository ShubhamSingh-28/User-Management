import React, { createContext, useContext, useEffect, useState } from 'react'
import {  fetchUsers, createUser, updateUser, deleteUser } from '../api/user'
import type { userType as User } from '../type'

interface UserContextType {
  users: User[]
  loading: boolean
  error: string | null
  addUser: (data: User) => Promise<void>
  editUser: (id: number, data: User) => Promise<void>
  removeUser: (id: number) => Promise<void>
}

const UserContext = createContext<UserContextType | null>(null)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load all users once
  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      const data = await fetchUsers()
      setUsers(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Add user
  async function addUser(data: User) {
    const created = await createUser(data)
    setUsers(prev => [...prev, created])
  }

  // Edit user
 async function editUser(id: number, data: User) {
  let updated: User

  // If id is within JSONPlaceholder limit, call API
  if (id <= 10) {
    updated = await updateUser(id, data)
  } else {
    // Local-only update for fake users (avoid 500 error)
    updated = { ...data, id }
  }

  setUsers(prev =>
    prev.map(u => (u.id === id ? updated : u))
  )
}



  // Delete user
  async function removeUser(id: number) {
    await deleteUser(id)
    setUsers(prev => prev.filter(u => u.id !== id))
  }

  return (
    <UserContext.Provider value={{ users, loading, error, addUser, editUser, removeUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUserContext() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error("useUserContext must be used inside UserProvider")
  return ctx
}
