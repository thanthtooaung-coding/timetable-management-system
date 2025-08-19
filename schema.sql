--
-- Timetable Management System Schema
--
DROP TABLE IF EXISTS public.timetable_entries;
DROP TABLE IF EXISTS public.activity_types;
DROP TABLE IF EXISTS public.time_slots;
DROP TABLE IF EXISTS public.days;
DROP TABLE IF EXISTS public.profiles;

CREATE TABLE public.profiles (
  id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text,
  email text,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.profiles IS 'Public profile information for each user, linked to Supabase Auth.';

CREATE TABLE public.days (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  display_name text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT unique_day_name_per_user UNIQUE (user_id, name)
);

COMMENT ON TABLE public.days IS 'Stores the custom days for each user''s timetable.';
COMMENT ON COLUMN public.days.name IS 'Internal identifier for the day, used for linking.';
COMMENT ON COLUMN public.days.display_name IS 'User-facing name for the day.';

CREATE TABLE public.time_slots (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  period integer NOT NULL,
  display_name text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT unique_period_per_user UNIQUE (user_id, period),
  CONSTRAINT period_must_be_positive CHECK (period > 0)
);

COMMENT ON TABLE public.time_slots IS 'Stores the custom time slots (periods) for each user''s timetable.';
COMMENT ON COLUMN public.time_slots.period IS 'The numerical order of the time slot.';
COMMENT ON COLUMN public.time_slots.display_name IS 'User-facing name for the time slot.';


CREATE TABLE public.activity_types (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  color text NOT NULL,
  needs_subject boolean DEFAULT false NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT unique_activity_name_per_user UNIQUE (user_id, name)
);

COMMENT ON TABLE public.activity_types IS 'Defines different types of activities with custom colors.';
COMMENT ON COLUMN public.activity_types.name IS 'The name of the activity, e.g., "Lecture".';
COMMENT ON COLUMN public.activity_types.color IS 'Hex color code for the activity type.';
COMMENT ON COLUMN public.activity_types.needs_subject IS 'Whether this activity requires a subject name.';


CREATE TABLE public.timetable_entries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  day_id uuid NOT NULL REFERENCES public.days(id) ON DELETE CASCADE,
  time_slot_id uuid NOT NULL REFERENCES public.time_slots(id) ON DELETE CASCADE,
  activity_type_id uuid NOT NULL REFERENCES public.activity_types(id) ON DELETE CASCADE,
  subject text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT unique_entry_per_slot UNIQUE (user_id, day_id, time_slot_id)
);

COMMENT ON TABLE public.timetable_entries IS 'The core table linking days, time slots, and activities for each user.';
COMMENT ON COLUMN public.timetable_entries.subject IS 'The subject name, if required by the activity type.';

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage their own days" ON public.days
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own time slots" ON public.time_slots
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own activity types" ON public.activity_types
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own timetable entries" ON public.timetable_entries
  FOR ALL USING (auth.uid() = user_id);


CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (new.id, new.raw_user_meta_data->>'name', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (new.id, new.raw_user_meta_data->>'name', new.email);

  INSERT INTO public.days (user_id, name, display_name)
  VALUES
    (new.id, 'MONDAY', 'Monday'),
    (new.id, 'TUESDAY', 'Tuesday'),
    (new.id, 'WEDNESDAY', 'Wednesday'),
    (new.id, 'THURSDAY', 'Thursday'),
    (new.id, 'FRIDAY', 'Friday');

  INSERT INTO public.time_slots (user_id, period, display_name)
  VALUES
    (new.id, 1, 'Period 1'),
    (new.id, 2, 'Period 2'),
    (new.id, 3, 'Period 3'),
    (new.id, 4, 'Period 4'),
    (new.id, 5, 'Period 5'),
    (new.id, 6, 'Period 6');

  INSERT INTO public.activity_types (user_id, name, color, needs_subject)
  VALUES
    (new.id, 'Lecture', '#fecaca', true),
    (new.id, 'Tutorial', '#fed7aa', true),
    (new.id, 'Lunch Time', '#fde68a', false),
    (new.id, 'Free Period', '#d1fae5', false);

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;