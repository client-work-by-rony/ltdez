-- Insert profile if missing
INSERT INTO public.profiles (user_id, email, full_name)
VALUES ('a27ba41f-798e-458b-be40-fa6e7b977be4', 'beliversdream247@gmail.com', 'Belivers Dream')
ON CONFLICT (user_id) DO NOTHING;

-- Insert admin role
INSERT INTO public.user_roles (user_id, role)
VALUES ('a27ba41f-798e-458b-be40-fa6e7b977be4', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Also add default user role
INSERT INTO public.user_roles (user_id, role)
VALUES ('a27ba41f-798e-458b-be40-fa6e7b977be4', 'user')
ON CONFLICT (user_id, role) DO NOTHING;