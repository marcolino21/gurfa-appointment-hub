-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL, -- in minutes
  price NUMERIC(10,2) NOT NULL,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create staff table
CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'receptionist', 'stylist', 'therapist', 'collaborator')),
  availability JSONB DEFAULT '{}',
  color_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('confirmed', 'completed', 'cancelled', 'pending')),
  notes TEXT,
  price NUMERIC(10,2) NOT NULL,
  payment_status TEXT NOT NULL CHECK (payment_status IN ('paid', 'pending', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Staff access policy (all staff can view all appointments)
CREATE POLICY staff_access_policy ON appointments
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM staff 
      WHERE staff.user_id = auth.uid() 
      AND role IN ('admin', 'manager', 'receptionist', 'stylist', 'therapist')
    )
  );

-- Collaborator access policy (limited access)
CREATE POLICY collaborator_access_policy ON appointments
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM staff 
      WHERE staff.user_id = auth.uid() 
      AND role = 'collaborator'
      AND staff_id = appointments.staff_id
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_appointments_start_time ON appointments(start_time);
CREATE INDEX idx_appointments_staff_id ON appointments(staff_id);
CREATE INDEX idx_appointments_client_id ON appointments(client_id);
CREATE INDEX idx_staff_user_id ON staff(user_id);

-- Create function to update appointment end time based on service duration
CREATE OR REPLACE FUNCTION update_appointment_end_time()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.service_id IS NOT NULL AND NEW.start_time IS NOT NULL THEN
    SELECT INTO NEW.end_time
      NEW.start_time + (INTERVAL '1 minute' * services.duration)
    FROM services
    WHERE services.id = NEW.service_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update end time
CREATE TRIGGER update_end_time_trigger
  BEFORE INSERT OR UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_appointment_end_time(); 