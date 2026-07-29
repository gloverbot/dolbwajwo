import 'dart:async';

import 'package:flutter/foundation.dart';

/// ---------------------------------------------------------------------------
/// 캐시(포인트) 정책 - 숫자를 바꾸고 싶으면 여기 한 곳만 고치면 됩니다.
/// ---------------------------------------------------------------------------
class CashPolicy {
  /// 가입하면 바로 주는 축하 캐시
  static const int welcomeCash = 6000;

  /// 1시간 돌봐주면 받는(=맡기면 내는) 캐시
  static const int cashPerHour = 3000;

  /// 한 번에 맡길 수 있는 최대 시간
  static const int maxHours = 2;
}

/// 돌봄 요청의 진행 상태
enum RequestStatus {
  waiting, // 아직 아무도 수락하지 않음
  accepted, // 이웃 부모가 수락함
  done, // 돌봄이 끝남
  canceled, // 취소됨
}

extension RequestStatusText on RequestStatus {
  /// 화면에 보여줄 한국어 이름
  String get label {
    switch (this) {
      case RequestStatus.waiting:
        return '수락 기다리는 중';
      case RequestStatus.accepted:
        return '수락 완료';
      case RequestStatus.done:
        return '돌봄 끝';
      case RequestStatus.canceled:
        return '취소됨';
    }
  }
}

/// 돌봄 요청 1건
class CareRequest {
  CareRequest({
    required this.id,
    required this.parentName,
    required this.daycare,
    required this.childName,
    required this.childAge,
    required this.place,
    required this.note,
    required this.startAt,
    required this.hours,
    required this.isMine,
    this.status = RequestStatus.waiting,
    this.helperName,
  });

  final String id;
  final String parentName; // 아이를 맡기는 부모 이름
  final String daycare; // 같은 어린이집인지 보여주기 위한 정보
  final String childName;
  final int childAge;
  final String place; // 어디서 만날지
  final String note; // 하고 싶은 말
  final DateTime startAt; // 언제부터
  final int hours; // 몇 시간 (최대 2시간)
  final bool isMine; // 내가 올린 요청이면 true

  RequestStatus status;
  String? helperName; // 돌봐주기로 한 사람 이름

  /// 이 요청에 들어가는(=받는) 캐시
  int get cash => hours * CashPolicy.cashPerHour;

  DateTime get endAt => startAt.add(Duration(hours: hours));
}

/// 캐시가 들어오고 나간 기록 1줄
class CashLog {
  CashLog({required this.title, required this.amount, required this.at});

  final String title;
  final int amount; // 플러스면 적립, 마이너스면 사용
  final DateTime at;
}

/// 앱 알림 1건
class AppNotification {
  AppNotification({
    required this.title,
    required this.body,
    required this.at,
    this.requestId,
    this.isNew = true,
  });

  final String title;
  final String body;
  final DateTime at;
  final String? requestId;
  bool isNew;
}

/// ---------------------------------------------------------------------------
/// 앱 전체가 함께 쓰는 데이터 창고입니다.
/// (프로토타입이라 서버 없이 앱 안에서만 기억합니다. 앱을 끄면 사라집니다.)
/// ---------------------------------------------------------------------------
class AppState extends ChangeNotifier {
  String myName = '';
  String neighborhood = '';
  String daycare = '';
  int cash = 0;
  bool joined = false;

  final List<CareRequest> requests = [];
  final List<CashLog> cashLogs = [];
  final List<AppNotification> notifications = [];

  int _idSeed = 0;
  final List<Timer> _timers = [];

  /// 읽지 않은 알림 개수 (빨간 동그라미에 쓰입니다)
  int get newNotificationCount =>
      notifications.where((n) => n.isNew).length;

  /// 내가 올린 요청 중 아직 끝나지 않은 것
  List<CareRequest> get myOngoingRequests => requests
      .where((r) =>
          r.isMine &&
          (r.status == RequestStatus.waiting ||
              r.status == RequestStatus.accepted))
      .toList();

  /// 우리 동네 이웃이 올린, 아직 아무도 수락하지 않은 요청
  List<CareRequest> get neighborOpenRequests => requests
      .where((r) => !r.isMine && r.status == RequestStatus.waiting)
      .toList();

  /// 내가 돌봐주기로 한 요청
  List<CareRequest> get myHelpingRequests => requests
      .where((r) =>
          !r.isMine &&
          r.helperName == myName &&
          r.status == RequestStatus.accepted)
      .toList();

  CareRequest? findRequest(String id) {
    for (final r in requests) {
      if (r.id == id) return r;
    }
    return null;
  }

  String _newId() {
    _idSeed++;
    return 'req_$_idSeed';
  }

  // ---------------------------------------------------------------------------
  // 1) 가입하기
  // ---------------------------------------------------------------------------
  void join({
    required String name,
    required String neighborhood,
    required String daycare,
  }) {
    myName = name;
    this.neighborhood = neighborhood;
    this.daycare = daycare;
    joined = true;

    cash = CashPolicy.welcomeCash;
    cashLogs.insert(
      0,
      CashLog(
        title: '가입 축하 캐시',
        amount: CashPolicy.welcomeCash,
        at: DateTime.now(),
      ),
    );

    _seedNeighborRequests();
    notifyListeners();
  }

  /// 데모용으로 이웃 부모들의 요청을 미리 만들어 둡니다.
  void _seedNeighborRequests() {
    final now = DateTime.now();
    requests.addAll([
      CareRequest(
        id: _newId(),
        parentName: '김소연',
        daycare: daycare,
        childName: '하준',
        childAge: 5,
        place: '$neighborhood 행복어린이집 앞',
        note: '병원 진료가 갑자기 잡혔어요. 1시간만 부탁드립니다!',
        startAt: now.add(const Duration(hours: 1)),
        hours: 1,
        isMine: false,
      ),
      CareRequest(
        id: _newId(),
        parentName: '박민호',
        daycare: daycare,
        childName: '서아',
        childAge: 6,
        place: '$neighborhood 중앙공원 놀이터',
        note: '회사 회의가 길어졌습니다. 2시간 도와주실 분 찾아요.',
        startAt: now.add(const Duration(hours: 3)),
        hours: 2,
        isMine: false,
      ),
      CareRequest(
        id: _newId(),
        parentName: '이지우',
        daycare: daycare,
        childName: '도윤',
        childAge: 4,
        place: '$neighborhood 3단지 아파트 경비실 앞',
        note: '큰아이 학교 상담이 있어요. 놀이터에서 놀아주시면 됩니다.',
        startAt: now.add(const Duration(hours: 5)),
        hours: 1,
        isMine: false,
      ),
    ]);

    notifications.insert(
      0,
      AppNotification(
        title: '우리 동네에 도움 요청이 있어요',
        body: '$daycare 부모님 3분이 도움을 기다리고 있어요.',
        at: DateTime.now(),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // 2) 아이 맡기기 (요청 올리기) - 캐시를 먼저 냅니다
  // ---------------------------------------------------------------------------
  /// 성공하면 만들어진 요청을, 캐시가 부족하면 null을 돌려줍니다.
  CareRequest? createRequest({
    required String childName,
    required int childAge,
    required String place,
    required String note,
    required DateTime startAt,
    required int hours,
  }) {
    final price = hours * CashPolicy.cashPerHour;
    if (cash < price) return null;

    cash -= price;
    cashLogs.insert(
      0,
      CashLog(title: '$childName 돌봄 요청 ($hours시간)', amount: -price, at: DateTime.now()),
    );

    final request = CareRequest(
      id: _newId(),
      parentName: myName,
      daycare: daycare,
      childName: childName,
      childAge: childAge,
      place: place,
      note: note,
      startAt: startAt,
      hours: hours,
      isMine: true,
    );
    requests.insert(0, request);

    notifications.insert(
      0,
      AppNotification(
        title: '동네 부모님들에게 알림을 보냈어요',
        body: '$neighborhood · $daycare 부모님 12명에게 전달했습니다.',
        at: DateTime.now(),
        requestId: request.id,
      ),
    );

    // 프로토타입 데모: 5초 뒤에 이웃 부모가 수락하는 상황을 흉내 냅니다.
    _scheduleDemoAccept(request.id);

    notifyListeners();
    return request;
  }

  void _scheduleDemoAccept(String requestId) {
    final timer = Timer(const Duration(seconds: 5), () {
      final request = findRequest(requestId);
      if (request == null || request.status != RequestStatus.waiting) return;

      request.status = RequestStatus.accepted;
      request.helperName = '최은주';
      notifications.insert(
        0,
        AppNotification(
          title: '최은주 님이 수락했어요! 🎉',
          body: '${request.childName}(이)를 ${request.hours}시간 돌봐주시기로 했어요.',
          at: DateTime.now(),
          requestId: request.id,
        ),
      );
      notifyListeners();
    });
    _timers.add(timer);
  }

  // ---------------------------------------------------------------------------
  // 3) 이웃의 요청 수락하기 (내가 돌봐주기)
  // ---------------------------------------------------------------------------
  void acceptRequest(String requestId) {
    final request = findRequest(requestId);
    if (request == null || request.status != RequestStatus.waiting) return;

    request.status = RequestStatus.accepted;
    request.helperName = myName;

    notifications.insert(
      0,
      AppNotification(
        title: '돌봄을 수락했어요',
        body:
            '${request.parentName} 님의 ${request.childName}(이)를 ${request.hours}시간 돌봐주기로 했어요.',
        at: DateTime.now(),
        requestId: request.id,
      ),
    );
    notifyListeners();
  }

  // ---------------------------------------------------------------------------
  // 4) 돌봄 끝내기 - 돌봐준 사람에게 캐시가 들어옵니다
  // ---------------------------------------------------------------------------
  void completeRequest(String requestId) {
    final request = findRequest(requestId);
    if (request == null || request.status != RequestStatus.accepted) return;

    request.status = RequestStatus.done;

    // 내가 돌봐준 경우에만 캐시를 받습니다.
    // (내가 맡긴 경우는 요청할 때 이미 캐시를 냈습니다.)
    if (!request.isMine && request.helperName == myName) {
      cash += request.cash;
      cashLogs.insert(
        0,
        CashLog(
          title: '${request.childName} 돌봄 완료 (${request.hours}시간)',
          amount: request.cash,
          at: DateTime.now(),
        ),
      );
      notifications.insert(
        0,
        AppNotification(
          title: '캐시 ${request.cash}원이 적립됐어요',
          body: '${request.childName} 돌봄을 끝냈습니다. 고맙습니다!',
          at: DateTime.now(),
          requestId: request.id,
        ),
      );
    } else {
      notifications.insert(
        0,
        AppNotification(
          title: '돌봄이 끝났어요',
          body: '${request.childName}(이)를 잘 돌봐주셨습니다.',
          at: DateTime.now(),
          requestId: request.id,
        ),
      );
    }
    notifyListeners();
  }

  // ---------------------------------------------------------------------------
  // 5) 내 요청 취소하기 - 낸 캐시를 돌려받습니다
  // ---------------------------------------------------------------------------
  void cancelMyRequest(String requestId) {
    final request = findRequest(requestId);
    if (request == null || !request.isMine) return;
    if (request.status == RequestStatus.done ||
        request.status == RequestStatus.canceled) {
      return;
    }

    request.status = RequestStatus.canceled;
    cash += request.cash;
    cashLogs.insert(
      0,
      CashLog(
        title: '${request.childName} 요청 취소 (환불)',
        amount: request.cash,
        at: DateTime.now(),
      ),
    );
    notifyListeners();
  }

  /// 알림함을 열면 모두 '읽음'으로 바꿉니다.
  void markNotificationsRead() {
    var changed = false;
    for (final n in notifications) {
      if (n.isNew) {
        n.isNew = false;
        changed = true;
      }
    }
    if (changed) notifyListeners();
  }

  @override
  void dispose() {
    for (final t in _timers) {
      t.cancel();
    }
    _timers.clear();
    super.dispose();
  }
}
