import React, { useEffect, useState } from 'react'
import EmployeeList from './components/EmployeeList'
import EmployeeForm from './components/EmployeeForm'

export default function App() {
  const [employees, setEmployees] = useState<any[]>([])
  const [editing, setEditing] = useState<any | null>(null)

  const load = async () => {
    const list = await window.api.listEmployees()
    setEmployees(list)
  }

  useEffect(() => { load() }, [])

  return (
    <div className="app">
      <h1>PeopleCore — Employee Information System</h1>
      <div className="container">
        <EmployeeList employees={employees} onEdit={setEditing} onRefresh={load} />
        <EmployeeForm employee={editing} onSaved={() => { setEditing(null); load() }} />
      </div>
    </div>
  )
}
