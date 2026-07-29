# 돌봐줘 — 데이터베이스 구조 (ERD)

Supabase(PostgreSQL)에 만든 표 8개와 서로의 관계입니다.

- `PK` = 각 줄을 구분하는 고유 번호
- `FK` = 다른 표를 가리키는 연결 고리
- `||--o{` = 하나가 여러 개를 가진다는 뜻 (예: 부모 1명 ↔ 아이 여러 명)

```mermaid
erDiagram
    auth_users ||--|| profiles : "로그인 계정"

    profiles ||--o{ children : "우리 아이"
    profiles ||--o{ requests : "내가 올린 요청"
    profiles ||--o{ cash_logs : "캐시 기록"
    profiles ||--o{ notifications : "알림"
    profiles ||--o{ coupons : "기프티콘"
    profiles ||--o{ rooms : "참여한 채팅방"
    profiles ||--o{ messages : "보낸 메시지"

    requests ||--o| rooms : "수락하면 방 생성"
    rooms ||--o{ messages : "주고받은 말"

    auth_users {
        uuid id PK "Supabase가 관리"
        text email "아이디@example.com"
        text encrypted_password "암호화 보관"
    }

    profiles {
        uuid id PK "auth_users와 동일"
        text login_id "로그인 아이디"
        text name "부모님 이름"
        text_array personality "성격"
        text_array skills "잘하는 것"
        text avatar "프로필 사진"
        text video_name "자기소개 영상 이름"
        text neighborhood "동네"
        text daycare "어린이집"
        int cash "가진 캐시"
        bool show_guide "첫 안내문 표시 여부"
        timestamptz created_at "가입일"
    }

    children {
        uuid id PK
        uuid parent_id FK "부모님"
        text name "아이 이름"
        int age "나이"
        text note "알아둘 것 (알레르기 등)"
    }

    requests {
        uuid id PK
        uuid parent_id FK "맡기는 부모님"
        uuid helper_id FK "돌봐주는 부모님"
        text parent_name "맡기는 분 이름"
        text daycare "어린이집 (같은 곳끼리 보임)"
        text child_name "아이 이름"
        int child_age "아이 나이"
        text child_note "아이에 대해 알아둘 것"
        text place "만날 장소"
        text note "하고 싶은 말"
        timestamptz start_at "언제부터"
        int minutes "30 60 90 120"
        text status "waiting accepted done canceled"
        text helper_name "돌봐주는 분 이름"
    }

    rooms {
        uuid id PK
        uuid request_id FK "어떤 요청의 방인지"
        uuid parent_id FK "맡기는 부모님"
        uuid helper_id FK "돌봐주는 부모님"
        text parent_name "표시용 이름"
        text helper_name "표시용 이름"
        text title "예) 민서 돌봄 1시간 30분"
    }

    messages {
        uuid id PK
        uuid room_id FK "어느 방인지"
        uuid sender_id FK "보낸 사람"
        text sender_name "보낸 사람 이름"
        text kind "user 또는 system"
        text text "메시지 내용"
        timestamptz created_at "보낸 시각"
    }

    cash_logs {
        uuid id PK
        uuid profile_id FK "누구의 기록인지"
        text title "예) 민서 돌봄 완료"
        int amount "플러스는 적립 마이너스는 사용"
        timestamptz created_at "시각"
    }

    notifications {
        uuid id PK
        uuid profile_id FK "받는 사람"
        text title "알림 제목"
        text body "알림 내용"
        text link "누르면 갈 주소"
        bool is_new "안 읽었으면 true"
    }

    coupons {
        uuid id PK
        uuid profile_id FK "산 사람"
        text gifticon_id "상품 번호"
        text name "상품 이름"
        text brand "브랜드"
        text code "교환 번호"
    }
```

## 한눈에 보는 흐름

```mermaid
flowchart LR
    A["부모님 가입<br/>profiles + children"] --> B["요청 올리기<br/>requests<br/>캐시 차감"]
    B --> C["같은 어린이집<br/>부모님에게 보임"]
    C --> D["수락<br/>requests.status = accepted"]
    D --> E["채팅방 자동 생성<br/>rooms + messages"]
    E --> F["돌봄 끝<br/>status = done"]
    F --> G["캐시 적립<br/>cash_logs"]
    F --> H["채팅방 삭제<br/>rooms 정리"]
    G --> I["상점에서 교환<br/>coupons"]
```

## 누가 무엇을 볼 수 있나 (보안 규칙 · RLS)

| 표 | 볼 수 있는 사람 | 이유 |
|---|---|---|
| `profiles` | 로그인한 모두 | 이웃을 찾아야 하므로 |
| `requests` | 로그인한 모두 | 동네에 요청이 공유돼야 하므로 |
| `children` | **본인만** | 아이 정보는 민감 |
| `rooms` · `messages` | **참여자만** | 남의 대화는 못 봄 |
| `cash_logs` · `notifications` · `coupons` | **본인만** | 개인 기록 |

> 비밀번호는 어느 표에도 없습니다. Supabase의 `auth.users`가 암호화해서 따로 보관합니다.
