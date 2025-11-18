import type{ userType } from '../type'

const BASE = 'https://jsonplaceholder.typicode.com/users'


export async function fetchUsers(): Promise<userType[]> {
const res = await fetch(BASE)
if (!res.ok) throw new Error('Failed to fetch users')
return res.json()
}


export async function createUser(data: userType): Promise<userType> {
const res = await fetch(BASE, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(data)
})
if (!res.ok) throw new Error('Failed to create user')
return res.json()
}


export async function updateUser(id: number, data: userType): Promise<userType> {
const res = await fetch(`${BASE}/${id}`, {
method: 'PUT',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(data)
})
if (!res.ok) throw new Error('Failed to update user')
return res.json()
}


export async function deleteUser(id: number): Promise<{ success: boolean }> {
const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' })
if (!res.ok) throw new Error('Failed to delete user')
return { success: true }
}