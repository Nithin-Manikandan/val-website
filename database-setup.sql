-- Check what tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check what columns exist in profiles
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles';

