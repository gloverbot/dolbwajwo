-- ═══════════════════════════════════════════════════════════════════════════
-- 캐시를 안전하게 더하고 빼는 함수
-- ═══════════════════════════════════════════════════════════════════════════
--
-- [무엇이 문제였나]
--
-- 예전에는 앱(브라우저)이 '결과값'을 보냈습니다.
--     앱: "지금 6,000이니까 3,000으로 바꿔줘"
--
-- 그런데 버튼을 빠르게 두 번 누르면 두 번의 요청이 겹칩니다.
--     첫 번째: "6,000이었으니 3,000으로 바꿔줘"
--     두 번째: "6,000이었으니 3,000으로 바꿔줘"   ← 아직 첫 번째가 안 끝나서 6,000으로 읽음
--     결과: 두 번 썼는데 한 번만 빠짐 (또는 타이밍이 어긋나면 캐시가 통째로 사라짐)
--
-- [어떻게 고치나]
--
-- 이제 앱은 '얼마만큼'만 보냅니다.
--     앱: "3,000 빼줘"
-- 더하고 빼는 계산은 데이터베이스가 직접 하고, 한 번에 하나씩만 처리하도록
-- 그 줄에 자물쇠를 겁니다(for update). 그래서 겹쳐도 절대 틀리지 않습니다.
--
-- [적용하는 법]
-- Supabase 대시보드 → 왼쪽 메뉴 SQL Editor → 이 파일 내용을 통째로 붙여넣고 Run
-- 여러 번 실행해도 안전합니다.

create or replace function public.change_cash(p_amount integer, p_title text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid  uuid := auth.uid();
  v_cash integer;
begin
  -- 로그인한 사람 본인의 캐시만 바꿀 수 있습니다.
  if v_uid is null then
    raise exception '로그인이 필요합니다.';
  end if;

  -- 이 줄에 자물쇠를 겁니다. 다른 요청은 여기서 기다립니다.
  select cash into v_cash
    from public.profiles
   where id = v_uid
     for update;

  if v_cash is null then
    raise exception '프로필을 찾을 수 없습니다.';
  end if;

  -- 가진 캐시보다 많이 쓰려고 하면 막습니다.
  if v_cash + p_amount < 0 then
    raise exception '캐시가 부족합니다.';
  end if;

  update public.profiles
     set cash = v_cash + p_amount
   where id = v_uid
  returning cash into v_cash;

  -- 잔액과 기록을 같은 순간에 남깁니다. (하나만 남는 일이 없도록)
  insert into public.cash_logs (profile_id, title, amount)
  values (v_uid, p_title, p_amount);

  return v_cash;
end;
$$;

-- 로그인한 사람만 부를 수 있게 합니다.
revoke all on function public.change_cash(integer, text) from public;
revoke all on function public.change_cash(integer, text) from anon;
grant execute on function public.change_cash(integer, text) to authenticated;


-- ═══════════════════════════════════════════════════════════════════════════
-- '데이터 초기화' 버튼이 요청을 못 지우던 문제
-- ═══════════════════════════════════════════════════════════════════════════
--
-- requests 표에는 '보기 / 만들기 / 고치기' 규칙만 있고 '지우기' 규칙이 없었습니다.
-- Supabase는 규칙이 없으면 막기 때문에, 초기화 버튼을 눌러도 요청이 그대로
-- 남아 있었습니다. (오류도 안 나서 알아채기 어려웠습니다)
--
-- 내가 올린 요청만 지울 수 있게 규칙을 추가합니다.

drop policy if exists "내 요청 지우기" on public.requests;
create policy "내 요청 지우기" on public.requests
  for delete to authenticated
  using (auth.uid() = parent_id);
