-- ===========================================================================
-- 돌봐줘 - 처음 만드는 표(테이블)들
--
-- 로그인은 Supabase Auth를 씁니다. 사용자가 적은 '아이디'는
-- {아이디}@dolbwajwo.app 형태의 가짜 이메일로 바꿔서 가입시킵니다.
-- 그래서 비밀번호는 Supabase가 안전하게 암호화해 보관하고,
-- 우리 표에는 비밀번호를 전혀 저장하지 않습니다.
-- ===========================================================================

-- ── 부모님 정보 ─────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  login_id      text unique not null,
  name          text not null,
  personality   text[] not null default '{}',
  skills        text[] not null default '{}',
  avatar        text,
  video_name    text,
  neighborhood  text not null,
  daycare       text not null,
  cash          integer not null default 0,
  show_guide    boolean not null default true,
  created_at    timestamptz not null default now()
);

-- ── 우리 아이 ───────────────────────────────────────────────────────────────
create table if not exists public.children (
  id         uuid primary key default gen_random_uuid(),
  parent_id  uuid not null references public.profiles(id) on delete cascade,
  name       text not null,
  age        integer not null,
  note       text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists children_parent_idx on public.children(parent_id);

-- ── 돌봄 요청 ───────────────────────────────────────────────────────────────
create table if not exists public.requests (
  id          uuid primary key default gen_random_uuid(),
  parent_id   uuid not null references public.profiles(id) on delete cascade,
  parent_name text not null,
  daycare     text not null,
  -- 아이 정보는 요청한 그 순간의 값을 그대로 적어둡니다(나중에 바뀌어도 기록 유지).
  child_name  text not null,
  child_age   integer not null,
  child_note  text not null default '',
  place       text not null,
  note        text not null default '',
  start_at    timestamptz not null,
  minutes     integer not null,
  status      text not null default 'waiting'
              check (status in ('waiting', 'accepted', 'done', 'canceled')),
  helper_id   uuid references public.profiles(id) on delete set null,
  helper_name text,
  created_at  timestamptz not null default now()
);
create index if not exists requests_daycare_idx on public.requests(daycare);
create index if not exists requests_status_idx on public.requests(status);

-- ── 채팅방 (돌봄이 끝나면 지웁니다) ─────────────────────────────────────────
create table if not exists public.rooms (
  id         uuid primary key default gen_random_uuid(),
  request_id uuid references public.requests(id) on delete cascade,
  parent_id  uuid not null references public.profiles(id) on delete cascade,
  -- AI 매칭 상대는 아직 가입하지 않은 이웃일 수 있어서 비워둘 수 있습니다.
  helper_id  uuid references public.profiles(id) on delete set null,
  title      text not null,
  created_at timestamptz not null default now()
);
create index if not exists rooms_parent_idx on public.rooms(parent_id);
create index if not exists rooms_helper_idx on public.rooms(helper_id);

-- ── 채팅 메시지 ─────────────────────────────────────────────────────────────
create table if not exists public.messages (
  id         uuid primary key default gen_random_uuid(),
  room_id    uuid not null references public.rooms(id) on delete cascade,
  -- 보낸 사람이 없으면(null) 안내 메시지입니다.
  sender_id  uuid references public.profiles(id) on delete set null,
  sender_name text not null default '',
  kind       text not null default 'user' check (kind in ('user', 'system')),
  text       text not null,
  created_at timestamptz not null default now()
);
create index if not exists messages_room_idx on public.messages(room_id, created_at);

-- ── 캐시 기록 ───────────────────────────────────────────────────────────────
create table if not exists public.cash_logs (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title      text not null,
  amount     integer not null,
  created_at timestamptz not null default now()
);
create index if not exists cash_logs_profile_idx on public.cash_logs(profile_id, created_at desc);

-- ── 알림 ────────────────────────────────────────────────────────────────────
create table if not exists public.notifications (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title      text not null,
  body       text not null default '',
  link       text,
  is_new     boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists notifications_profile_idx on public.notifications(profile_id, created_at desc);

-- ── 내가 바꾼 기프티콘 ──────────────────────────────────────────────────────
create table if not exists public.coupons (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.profiles(id) on delete cascade,
  gifticon_id text not null,
  name        text not null,
  brand       text not null,
  code        text not null,
  created_at  timestamptz not null default now()
);
create index if not exists coupons_profile_idx on public.coupons(profile_id, created_at desc);

-- ===========================================================================
-- 보안 규칙(RLS) - 로그인한 사람이 무엇을 보고 고칠 수 있는지 정합니다.
-- ===========================================================================
alter table public.profiles      enable row level security;
alter table public.children      enable row level security;
alter table public.requests      enable row level security;
alter table public.rooms         enable row level security;
alter table public.messages      enable row level security;
alter table public.cash_logs     enable row level security;
alter table public.notifications enable row level security;
alter table public.coupons       enable row level security;

-- 여러 번 실행해도 괜찮도록, 같은 이름의 규칙이 있으면 먼저 지웁니다.
drop policy if exists "프로필 모두 보기"   on public.profiles;
drop policy if exists "내 프로필 만들기"   on public.profiles;
drop policy if exists "내 프로필 고치기"   on public.profiles;
drop policy if exists "내 아이만"          on public.children;
drop policy if exists "요청 모두 보기"     on public.requests;
drop policy if exists "내 요청 올리기"     on public.requests;
drop policy if exists "요청 고치기"        on public.requests;
drop policy if exists "내 채팅방 보기"     on public.rooms;
drop policy if exists "채팅방 만들기"      on public.rooms;
drop policy if exists "내 채팅방 지우기"   on public.rooms;
drop policy if exists "내 방 메시지 보기"  on public.messages;
drop policy if exists "내 방에 메시지 쓰기" on public.messages;
drop policy if exists "내 캐시 기록"       on public.cash_logs;
drop policy if exists "내 알림"            on public.notifications;
drop policy if exists "내 기프티콘"        on public.coupons;

-- 부모님 정보: 이웃을 찾아야 하므로 로그인한 사람은 모두 볼 수 있고,
--              고치는 건 본인만 할 수 있습니다.
create policy "프로필 모두 보기" on public.profiles
  for select to authenticated using (true);
create policy "내 프로필 만들기" on public.profiles
  for insert to authenticated with check (auth.uid() = id);
create policy "내 프로필 고치기" on public.profiles
  for update to authenticated using (auth.uid() = id);

-- 우리 아이: 본인만 보고 고칩니다.
create policy "내 아이만" on public.children
  for all to authenticated using (auth.uid() = parent_id)
  with check (auth.uid() = parent_id);

-- 돌봄 요청: 동네 부모님이 다 같이 봐야 하므로 조회는 모두 가능.
--            만들기는 본인 요청만, 고치기는 올린 사람 또는 수락한 사람만.
create policy "요청 모두 보기" on public.requests
  for select to authenticated using (true);
create policy "내 요청 올리기" on public.requests
  for insert to authenticated with check (auth.uid() = parent_id);
create policy "요청 고치기" on public.requests
  for update to authenticated
  using (auth.uid() = parent_id or auth.uid() = helper_id or helper_id is null);

-- 채팅방: 나와 관련된 방만 보이고 지울 수 있습니다.
create policy "내 채팅방 보기" on public.rooms
  for select to authenticated
  using (auth.uid() = parent_id or auth.uid() = helper_id);
create policy "채팅방 만들기" on public.rooms
  for insert to authenticated
  with check (auth.uid() = parent_id or auth.uid() = helper_id);
create policy "내 채팅방 지우기" on public.rooms
  for delete to authenticated
  using (auth.uid() = parent_id or auth.uid() = helper_id);

-- 메시지: 내가 들어갈 수 있는 방의 메시지만.
create policy "내 방 메시지 보기" on public.messages
  for select to authenticated using (
    exists (
      select 1 from public.rooms r
      where r.id = messages.room_id
        and (r.parent_id = auth.uid() or r.helper_id = auth.uid())
    )
  );
create policy "내 방에 메시지 쓰기" on public.messages
  for insert to authenticated with check (
    exists (
      select 1 from public.rooms r
      where r.id = messages.room_id
        and (r.parent_id = auth.uid() or r.helper_id = auth.uid())
    )
  );

-- 캐시 기록 · 알림 · 기프티콘: 본인 것만.
create policy "내 캐시 기록" on public.cash_logs
  for all to authenticated using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);
create policy "내 알림" on public.notifications
  for all to authenticated using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);
create policy "내 기프티콘" on public.coupons
  for all to authenticated using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

-- ===========================================================================
-- 실시간(Realtime) - 새 요청이나 메시지가 오면 새로고침 없이 화면에 뜨게 합니다.
-- 이미 켜져 있으면 건너뜁니다.
-- ===========================================================================
do $$
declare
  t text;
begin
  foreach t in array array['requests', 'messages', 'rooms'] loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = t
    ) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end $$;
