create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  category text not null,
  description text not null,
  location text,
  cost text,
  eligibility text,
  what_to_bring text,
  languages_supported text,
  contact_email text not null,
  contact_phone text,
  website_url text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint resources_title_not_blank check (char_length(trim(title)) > 0),
  constraint resources_category_not_blank check (char_length(trim(category)) > 0),
  constraint resources_description_not_blank check (
    char_length(trim(description)) > 0
  ),
  constraint resources_contact_email_not_blank check (
    char_length(trim(contact_email)) > 0
  )
);

create table if not exists public.generated_content (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  model text,
  prompt_version text not null,
  language text not null,
  content_type text not null,
  event_id uuid references public.events(id) on delete cascade,
  resource_id uuid references public.resources(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  output text not null,
  created_at timestamptz not null default now(),
  constraint generated_content_source_allowed check (
    source in ('template', 'openai')
  ),
  constraint generated_content_language_allowed check (
    language in ('en', 'es', 'ne')
  ),
  constraint generated_content_type_allowed check (
    content_type in (
      'simple_explanation',
      'parent_friendly',
      'what_to_bring',
      'what_to_expect',
      'common_questions',
      'sms_summary'
    )
  ),
  constraint generated_content_one_subject check (
    (event_id is not null and resource_id is null)
    or (event_id is null and resource_id is not null)
  ),
  constraint generated_content_output_not_blank check (
    char_length(trim(output)) > 0
  )
);

create index if not exists resources_organization_id_idx
  on public.resources(organization_id);

create index if not exists resources_published_category_idx
  on public.resources(category)
  where published = true;

create index if not exists generated_content_event_id_idx
  on public.generated_content(event_id);

create index if not exists generated_content_resource_id_idx
  on public.generated_content(resource_id);

create index if not exists generated_content_user_id_idx
  on public.generated_content(user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_resources_updated_at on public.resources;

create trigger set_resources_updated_at
  before update on public.resources
  for each row execute function public.set_updated_at();

create or replace function private.is_resource_owner(_resource_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.resources
    join public.organizations
      on organizations.id = resources.organization_id
    where resources.id = _resource_id
      and organizations.owner_id = (select auth.uid())
  );
$$;

create or replace function private.organization_has_published_resource(
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
    from public.resources
    where resources.organization_id = _organization_id
      and published = true
  );
$$;

drop policy if exists "Published event organizations are public"
  on public.organizations;
drop policy if exists "Published event or resource organizations are public"
  on public.organizations;

create policy "Published event or resource organizations are public"
  on public.organizations
  for select
  to anon, authenticated
  using (
    private.organization_has_published_event(id)
    or private.organization_has_published_resource(id)
  );

alter table public.resources enable row level security;
alter table public.generated_content enable row level security;

drop policy if exists "Published resources are public"
  on public.resources;
drop policy if exists "Owners can view their resources"
  on public.resources;
drop policy if exists "Owners can create resources"
  on public.resources;
drop policy if exists "Owners can update their resources"
  on public.resources;
drop policy if exists "Owners can delete their resources"
  on public.resources;

create policy "Published resources are public"
  on public.resources
  for select
  to anon, authenticated
  using (published = true);

create policy "Owners can view their resources"
  on public.resources
  for select
  to authenticated
  using (private.is_organization_owner(organization_id));

create policy "Owners can create resources"
  on public.resources
  for insert
  to authenticated
  with check (private.is_organization_owner(organization_id));

create policy "Owners can update their resources"
  on public.resources
  for update
  to authenticated
  using (private.is_organization_owner(organization_id))
  with check (private.is_organization_owner(organization_id));

create policy "Owners can delete their resources"
  on public.resources
  for delete
  to authenticated
  using (private.is_organization_owner(organization_id));

drop policy if exists "Owners can view generated content"
  on public.generated_content;
drop policy if exists "Owners can create generated content"
  on public.generated_content;
drop policy if exists "Owners can update generated content"
  on public.generated_content;
drop policy if exists "Owners can delete generated content"
  on public.generated_content;

create policy "Owners can view generated content"
  on public.generated_content
  for select
  to authenticated
  using (
    user_id = (select auth.uid())
    and (
      (event_id is not null and private.is_event_owner(event_id))
      or (resource_id is not null and private.is_resource_owner(resource_id))
    )
  );

create policy "Owners can create generated content"
  on public.generated_content
  for insert
  to authenticated
  with check (
    user_id = (select auth.uid())
    and (
      (event_id is not null and private.is_event_owner(event_id))
      or (resource_id is not null and private.is_resource_owner(resource_id))
    )
  );

create policy "Owners can update generated content"
  on public.generated_content
  for update
  to authenticated
  using (
    user_id = (select auth.uid())
    and (
      (event_id is not null and private.is_event_owner(event_id))
      or (resource_id is not null and private.is_resource_owner(resource_id))
    )
  )
  with check (
    user_id = (select auth.uid())
    and (
      (event_id is not null and private.is_event_owner(event_id))
      or (resource_id is not null and private.is_resource_owner(resource_id))
    )
  );

create policy "Owners can delete generated content"
  on public.generated_content
  for delete
  to authenticated
  using (
    user_id = (select auth.uid())
    and (
      (event_id is not null and private.is_event_owner(event_id))
      or (resource_id is not null and private.is_resource_owner(resource_id))
    )
  );
