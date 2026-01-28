-- Add notes column to bookings table for session feedback
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS notes_updated_at TIMESTAMP WITH TIME ZONE;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_bookings_notes ON bookings(notes) WHERE notes IS NOT NULL;

