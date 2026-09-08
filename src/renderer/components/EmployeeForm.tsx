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
  photo_path: '',
  photo_thumbnail_path: '',
  department: '',
  employee_code: ''
}

export default function EmployeeForm({ employee, onSaved }: any) {
  const [form, setForm] = useState<any>(empty)
  const [errors, setErrors] = useState<any>({})
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (employee) setForm(employee)
    else setForm(empty)
  }, [employee])

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setForm((s: any) => ({ ...s, [name]: value }))
  }

  const validate = () => {
    const e: any = {}
    if (!form.forename) e.forename = 'Required'
    if (!form.surname) e.surname = 'Required'
    if (form.email_address && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email_address)) e.email_address = 'Invalid email'
    if (form.phone_number && !/^[0-9+\-()\s]{6,20}$/.test(form.phone_number)) e.phone_number = 'Invalid phone'
    if (form.year_obtained && !/^[0-9]{4}$/.test(form.year_obtained)) e.year_obtained = 'Invalid year'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    // ensure employee_code
    if (!form.employee_code) {
      form.employee_code = `EMP${Date.now()}`
    }

    if (form.id) {
      await window.api.updateEmployee(form.id, form)
    } else {
      await window.api.addEmployee(form)
    }
    onSaved()
  }

  const handlePhoto = async (e: any) => {
    const file = e.target.files[0]
    if (!file) return
    const sourcePath = (file as any).path // electron file path
    if (!sourcePath) return alert('File path not available')

    setUploading(true)
    const res = await window.api.uploadPhoto(sourcePath)
    setUploading(false)

    if (res && res.error) return alert('Upload failed: ' + res.error)
    setForm((s: any) => ({ ...s, photo_path: res.photoPath, photo_thumbnail_path: res.thumbnailPath }))
  }

  return (
    <div className="form">
      <h2>{form.id ? 'Edit' : 'Add'} Employee</h2>
      <div className="field-row">
        <input name="forename" value={form.forename} onChange={handleChange} placeholder="Forename" />
        <input name="middle_name" value={form.middle_name} onChange={handleChange} placeholder="Middle name" />
        <input name="surname" value={form.surname} onChange={handleChange} placeholder="Surname" />
      </div>
      {errors.forename && <div className="error">{errors.forename}</div>}
      {errors.surname && <div className="error">{errors.surname}</div>}

      <div className="field-row">
        <input name="email_address" value={form.email_address} onChange={handleChange} placeholder="Email" />
        <input name="phone_number" value={form.phone_number} onChange={handleChange} placeholder="Phone" />
      </div>
      {errors.email_address && <div className="error">{errors.email_address}</div>}
      {errors.phone_number && <div className="error">{errors.phone_number}</div>}

      <div className="field-row">
        <input name="current_position" value={form.current_position} onChange={handleChange} placeholder="Position" />
        <input name="employment_type" value={form.employment_type} onChange={handleChange} placeholder="Employment type" />
      </div>

      <div className="field-row">
        <input name="department" value={form.department} onChange={handleChange} placeholder="Department" />
        <input name="employee_code" value={form.employee_code} onChange={handleChange} placeholder="Employee code (auto)" />
      </div>

      <div className="field-row">
        <label>Passport photo</label>
        <input type="file" accept="image/*" onChange={handlePhoto} />
        {uploading && <div>Uploading...</div>}
        {form.photo_thumbnail_path && <img src={`file://${form.photo_thumbnail_path}`} alt="thumb" style={{ width: 80, height: 80, objectFit: 'cover' }} />}
      </div>

      <div className="actions">
        <button onClick={handleSave}>Save</button>
        <button onClick={() => { setForm(empty); onSaved() }}>Cancel</button>
      </div>
    </div>
  )
}
