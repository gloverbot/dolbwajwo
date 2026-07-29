-- 채팅방에 '누구와 하는 대화인지' 이름을 담아둡니다.
-- (요청 없이 AI 매칭으로 만들어진 방도 상대 이름을 보여주기 위해서입니다)
-- 여러 번 실행해도 괜찮습니다.

alter table public.rooms
  add column if not exists parent_name text not null default '';

alter table public.rooms
  add column if not exists helper_name text;
