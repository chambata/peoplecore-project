-- peoplecore database schema

CREATE TABLE IF NOT EXISTS employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  forename TEXT,
  middle_name TEXT,
  surname TEXT,
  date_of_birth TEXT,
  nationality TEXT,
  nrc_number TEXT,
  current_position TEXT,
  employment_type TEXT,
  date_first_appointment TEXT,
  date_present_appointment TEXT,
  date_retirement TEXT,
  social_security_number TEXT,
  highest_qualification TEXT,
  institution_obtained TEXT,
  year_obtained TEXT,
  phone_number TEXT,
  email_address TEXT,
  photo_path TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
