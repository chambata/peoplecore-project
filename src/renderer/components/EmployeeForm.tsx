import React, { useEffect, useState } from 'react'

const empty = {
  forename: '',
  middle_name: '',
  surname: '',
  date_of_birth: '',
  nationality: '',
  nrc_number: '',
  current_position: '',
  employment_type: '',
  date_first_appointment: '',
  date_present_appointment: '',
  date_retirement: '',
  social_security_number: '',
  highest_qualification: '',
  institution_obtained: '',
  year_obtained: '',
  phone_number: '',
  email_address: '',
  photo_path: ''
}

export default function EmployeeForm({ employee, onSaved }: any) {
  const [form, setForm] = useState<any>(empty)

  useEffect(() => {
    if (employee) setForm(employee)
    else setForm(empty)
  }, [employee])

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setForm((s: any) => ({ ...s, [name]: value }))
  }

  const handleSave = async () => {
    // very light validation
    if (!form.forename || !form.surname) return alert('Please provide name')
    if (form.id) {
      await window.api.updateEmployee(form.id, form)
    } else {
      await window.api.addEmployee(form)
    }
    onSaved()
  }

  const handlePhoto = (e: any) => {
    const file = e.target.files[0]
    if (!file) return
    // NOTE: scaffold only — actual file copy to data/photos should be implemented in main/db side.
    setForm((s: any) => ({ ...s, photo_path: file.name }))
  }

  return (
    <div className="form">
      <h2>{form.id ? 'Edit' : 'Add'} Employee</h2>
      <div className="field-row">
        <input name="forename" value={form.forename} onChange={handleChange} placeholder="Forename" />
        <input name="middle_name" value={form.middle_name} onChange={handleChange} placeholder="Middle name" />
        <input name="surname" value={form.surname} onChange={handleChange} placeholder="Surname" />
      </div>

      <div className="field-row">
        <input name="email_address" value={form.email_address} onChange={handleChange} placeholder="Email" />
        <input name="phone_number" value={form.phone_number} onChange={handleChange} placeholder="Phone" />
      </div>

      <div className="field-row">
        <input name="current_position" value={form.current_position} onChange={handleChange} placeholder="Position" />
        <input name="employment_type" value={form.employment_type} onChange={handleChange} placeholder="Employment type" />
      </div>

      <div className="field-row">
        <label>Passport photo</label>
        <input type="file" accept="image/*" onChange={handlePhoto} />
        {form.photo_path && <div className="photo-preview">{form.photo_path}</div>}
      </div>

      <div className="actions">
        <button onClick={handleSave}>Save</button>
        <button onClick={() => { setForm(empty); onSaved() }}>Cancel</button>
      </div>
    </div>
  )
}
