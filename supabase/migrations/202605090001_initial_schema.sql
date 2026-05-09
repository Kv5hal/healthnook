create extension if not exists pgcrypto;

create schema if not exists private;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text not null,
  contact_email text not null,
  website_url text,
  created_at timestamptz not null default now(),
  constraint organizations_name_not_blank check (char_length(trim(name)) > 0),
  constraint organizations_contact_email_not_blank check (
    char_length(trim(contact_email)) > 0
  )
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  event_type text not null,
  description text not null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  location text not null,
  max_attendees integer,
  volunteer_slots_needed integer,
  contact_email text not null,
  language_notes text,
  accessibility_notes text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  constraint events_title_not_blank check (char_length(trim(title)) > 0),
  constraint events_type_not_blank check (char_length(trim(event_type)) > 0),
  constraint events_location_not_blank check (char_length(trim(location)) > 0),
  constraint events_contact_email_not_blank check (
    char_length(trim(contact_email)) > 0
  ),
  constraint events_end_after_start check (end_time > start_time),
  constraint events_max_attendees_positive check (
    max_attendees is null or max_attendees > 0
  ),
  constraint events_volunteer_slots_non_negative check (
    volunteer_slots_needed is null or volunteer_slots_needed >= 0
  )
);

create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  guests integer not null default 0,
  notes text,
  checked_in boolean not null default false,
  checked_in_at timestamptz,
  created_at timestamptz not null default now(),
  constraint rsvps_name_not_blank check (char_length(trim(name)) > 0),
  constraint rsvps_email_not_blank check (char_length(trim(email)) > 0),
  constraint rsvps_guests_non_negative check (guests >= 0),
  constraint rsvps_checked_in_timestamp check (
    (checked_in = false and checked_in_at is null)
    or (checked_in = true)
  )
);

create table if not exists public.volunteers (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  preferred_role text,
  notes text,
  created_at timestamptz not null default now(),
  constraint volunteers_name_not_blank check (char_length(trim(name)) > 0)
);

create table if not exists public.generated_messages (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  message_type text not null,
  output text not null,
  created_at timestamptz not null default now(),
  constraint generated_messages_output_not_blank check (
    char_length(trim(output)) > 0
  ),
  constraint generated_messages_type_allowed check (
    message_type in (
      'instagram_caption',
      'parent_announcement',
      'volunteer_reminder',
      'email_announcement',
      'post_event_thank_you',
      'post_event_impact_summary'
    )
  )
);

create index if not exists organizations_owner_id_idx
  on public.organizations(owner_id);

create index if not exists events_organization_id_idx
  on public.events(organization_id);

create index if not exists events_published_start_time_idx
  on public.events(start_time)
  where published = true;

create index if not exists rsvps_event_id_idx
  on public.rsvps(event_id);

create index if not exists rsvps_event_checked_in_idx
  on public.rsvps(event_id, checked_in);

create index if not exists volunteers_event_id_idx
  on public.volunteers(event_id);

create index if not exists generated_messages_event_id_idx
  on public.generated_messages(event_id);

create index if not exists generated_messages_user_id_idx
  on public.generated_messages(user_id);

create or replace function private.is_organization_owner(_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.organizations
    where id = _organization_id
      and owner_id = (select auth.uid())
  );
$$;

create or replace function private.event_is_published(_event_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.events
    where id = _event_id
      and published = true
  );
$$;

create or replace function private.organization_has_published_event(
  _organization_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.events
    where events.organization_id = _organization_id
      and published = true
  );
$$;

create or replace function private.is_event_owner(_event_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.events
    join public.organizations
      on organizations.id = events.organization_id
    where events.id = _event_id
      and organizations.owner_id = (select auth.uid())
  );
$$;

grant usage on schema private to anon, authenticated;
grant execute on all functions in schema private to anon, authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.email, '')
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = coalesce(public.profiles.full_name, excluded.full_name);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.events enable row level security;
alter table public.rsvps enable row level security;
alter table public.volunteers enable row level security;
alter table public.generated_messages enable row level security;

drop policy if exists "Profiles are viewable by their owners"
  on public.profiles;
drop policy if exists "Users can insert their own profile"
  on public.profiles;
drop policy if exists "Users can update their own profile"
  on public.profiles;

create policy "Profiles are viewable by their owners"
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Users can insert their own profile"
  on public.profiles
  for insert
  to authenticated
  with check ((select auth.uid()) = id);

create policy "Users can update their own profile"
  on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop policy if exists "Published event organizations are public"
  on public.organizations;
drop policy if exists "Owners can view their organizations"
  on public.organizations;
drop policy if exists "Owners can create organizations"
  on public.organizations;
drop policy if exists "Owners can update their organizations"
  on public.organizations;
drop policy if exists "Owners can delete their organizations"
  on public.organizations;

create policy "Published event organizations are public"
  on public.organizations
  for select
  to anon, authenticated
  using (private.organization_has_published_event(id));

create policy "Owners can view their organizations"
  on public.organizations
  for select
  to authenticated
  using (owner_id = (select auth.uid()));

create policy "Owners can create organizations"
  on public.organizations
  for insert
  to authenticated
  with check (owner_id = (select auth.uid()));

create policy "Owners can update their organizations"
  on public.organizations
  for update
  to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

create policy "Owners can delete their organizations"
  on public.organizations
  for delete
  to authenticated
  using (owner_id = (select auth.uid()));

drop policy if exists "Published events are public"
  on public.events;
drop policy if exists "Owners can view their events"
  on public.events;
drop policy if exists "Owners can create events"
  on public.events;
drop policy if exists "Owners can update their events"
  on public.events;
drop policy if exists "Owners can delete their events"
  on public.events;

create policy "Published events are public"
  on public.events
  for select
  to anon, authenticated
  using (published = true);

create policy "Owners can view their events"
  on public.events
  for select
  to authenticated
  using (private.is_organization_owner(organization_id));

create policy "Owners can create events"
  on public.events
  for insert
  to authenticated
  with check (private.is_organization_owner(organization_id));

create policy "Owners can update their events"
  on public.events
  for update
  to authenticated
  using (private.is_organization_owner(organization_id))
  with check (private.is_organization_owner(organization_id));

create policy "Owners can delete their events"
  on public.events
  for delete
  to authenticated
  using (private.is_organization_owner(organization_id));

drop policy if exists "Anyone can RSVP to published events"
  on public.rsvps;
drop policy if exists "Event owners can view RSVPs"
  on public.rsvps;
drop policy if exists "Event owners can update RSVPs"
  on public.rsvps;
drop policy if exists "Event owners can delete RSVPs"
  on public.rsvps;

create policy "Anyone can RSVP to published events"
  on public.rsvps
  for insert
  to anon, authenticated
  with check (private.event_is_published(event_id));

create policy "Event owners can view RSVPs"
  on public.rsvps
  for select
  to authenticated
  using (private.is_event_owner(event_id));

create policy "Event owners can update RSVPs"
  on public.rsvps
  for update
  to authenticated
  using (private.is_event_owner(event_id))
  with check (private.is_event_owner(event_id));

create policy "Event owners can delete RSVPs"
  on public.rsvps
  for delete
  to authenticated
  using (private.is_event_owner(event_id));

drop policy if exists "Anyone can volunteer for published events"
  on public.volunteers;
drop policy if exists "Event owners can view volunteers"
  on public.volunteers;
drop policy if exists "Event owners can update volunteers"
  on public.volunteers;
drop policy if exists "Event owners can delete volunteers"
  on public.volunteers;

create policy "Anyone can volunteer for published events"
  on public.volunteers
  for insert
  to anon, authenticated
  with check (private.event_is_published(event_id));

create policy "Event owners can view volunteers"
  on public.volunteers
  for select
  to authenticated
  using (private.is_event_owner(event_id));

create policy "Event owners can update volunteers"
  on public.volunteers
  for update
  to authenticated
  using (private.is_event_owner(event_id))
  with check (private.is_event_owner(event_id));

create policy "Event owners can delete volunteers"
  on public.volunteers
  for delete
  to authenticated
  using (private.is_event_owner(event_id));

drop policy if exists "Event owners can view generated messages"
  on public.generated_messages;
drop policy if exists "Event owners can create generated messages"
  on public.generated_messages;
drop policy if exists "Event owners can update generated messages"
  on public.generated_messages;
drop policy if exists "Event owners can delete generated messages"
  on public.generated_messages;

create policy "Event owners can view generated messages"
  on public.generated_messages
  for select
  to authenticated
  using (
    user_id = (select auth.uid())
    and private.is_event_owner(event_id)
  );

create policy "Event owners can create generated messages"
  on public.generated_messages
  for insert
  to authenticated
  with check (
    user_id = (select auth.uid())
    and private.is_event_owner(event_id)
  );

create policy "Event owners can update generated messages"
  on public.generated_messages
  for update
  to authenticated
  using (
    user_id = (select auth.uid())
    and private.is_event_owner(event_id)
  )
  with check (
    user_id = (select auth.uid())
    and private.is_event_owner(event_id)
  );

create policy "Event owners can delete generated messages"
  on public.generated_messages
  for delete
  to authenticated
  using (
    user_id = (select auth.uid())
    and private.is_event_owner(event_id)
  );
