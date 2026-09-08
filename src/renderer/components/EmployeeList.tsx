import React from 'react'

export default function EmployeeList({ employees, onEdit, onRefresh }: any) {
  const handleDelete = async (id: number) => {
    if (!confirm('Delete this employee?')) return
    await window.api.deleteEmployee(id)
    onRefresh()
  }

  return (
    <div className="list">
      <h2>Employees</h2>
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Position</th>
            <th>Department</th>
            <th>Phone</th>
            <th>Email</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {employees.map((e: any) => (
            <tr key={e.id}>
              <td>{e.employee_code}</td>
              <td>{e.surname}, {e.forename} {e.middle_name || ''}</td>
              <td>{e.current_position}</td>
              <td>{e.department}</td>
              <td>{e.phone_number}</td>
              <td>{e.email_address}</td>
              <td>
                <button onClick={() => onEdit(e)}>Edit</button>
                <button onClick={() => handleDelete(e.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
