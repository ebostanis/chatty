ALTER TABLE public.users ALTER COLUMN password_hash TYPE VARCHAR(255);
ALTER TABLE public.users ADD CONSTRAINT uk_users_email UNIQUE (email);