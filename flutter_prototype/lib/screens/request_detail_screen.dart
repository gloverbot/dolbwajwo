import 'package:flutter/material.dart';

import '../app_state.dart';
import '../theme.dart';
import '../utils/format.dart';
import '../widgets/app_scope.dart';
import '../widgets/common.dart';
import '../widgets/request_card.dart';

/// 요청 1건을 자세히 보는 화면입니다.
/// 내 요청이면 '취소', 이웃 요청이면 '돌봐주기' 버튼이 나옵니다.
class RequestDetailScreen extends StatelessWidget {
  const RequestDetailScreen({super.key, required this.requestId});

  final String requestId;

  @override
  Widget build(BuildContext context) {
    final state = AppScope.of(context);
    final request = state.findRequest(requestId);

    if (request == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('돌봄 요청')),
        body: const Center(
          child: Text('요청을 찾을 수 없어요.', style: TextStyle(fontSize: 19)),
        ),
      );
    }

    final colors = statusColors(request.status);

    return Scaffold(
      appBar: AppBar(title: const Text('돌봄 요청')),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(20, 18, 20, 40),
        children: [
          // 상태 안내 상자
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: colors.background,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  request.status.label,
                  style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: colors.color,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  _statusMessage(request, state.myName),
                  style: const TextStyle(
                    fontSize: 17,
                    height: 1.5,
                    color: AppColors.subText,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          RequestCard(request: request),
          const SizedBox(height: 16),

          if (request.note.isNotEmpty) ...[
            const SectionTitle('부모님이 남긴 말'),
            AppCard(
              child: Text(
                request.note,
                style: const TextStyle(fontSize: 18, height: 1.5),
              ),
            ),
            const SizedBox(height: 16),
          ],

          if (request.helperName != null) ...[
            const SectionTitle('돌봐주는 분'),
            AppCard(
              child: Row(
                children: [
                  const CircleAvatar(
                    radius: 24,
                    backgroundColor: Color(0xFFE1F4EC),
                    child: Icon(Icons.favorite, color: AppColors.ok),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      '${request.helperName} 부모님',
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  OutlinedButton(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('프로토타입이라 전화 연결은 아직 없어요.'),
                        ),
                      );
                    },
                    style: OutlinedButton.styleFrom(
                      minimumSize: const Size(96, 48),
                    ),
                    child: const Text('연락하기'),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
          ],

          ..._buildActions(context, state, request),

          const SizedBox(height: 20),
          const SafetyNotice(),
        ],
      ),
    );
  }

  /// 상황에 맞는 설명 문구를 만들어 줍니다.
  String _statusMessage(CareRequest request, String myName) {
    switch (request.status) {
      case RequestStatus.waiting:
        return request.isMine
            ? '${request.daycare} 부모님들에게 알림을 보냈어요. 수락하면 바로 알려드릴게요.'
            : '아직 아무도 수락하지 않았어요. 시간이 되면 도와주세요!';
      case RequestStatus.accepted:
        if (request.isMine) {
          return '${request.helperName} 부모님이 돌봐주기로 했어요. 약속 장소에서 만나세요.';
        }
        return request.helperName == myName
            ? '내가 돌봐주기로 한 아이예요. 돌봄이 끝나면 아래 버튼을 눌러주세요.'
            : '다른 부모님이 이미 수락했어요.';
      case RequestStatus.done:
        return '돌봄이 잘 끝났어요. 고맙습니다!';
      case RequestStatus.canceled:
        return '요청이 취소되었어요. 낸 캐시는 돌려드렸습니다.';
    }
  }

  /// 상황에 맞는 버튼들을 만들어 줍니다.
  List<Widget> _buildActions(
    BuildContext context,
    AppState state,
    CareRequest request,
  ) {
    // 이웃의 요청 + 아직 수락 전 → 돌봐주기
    if (!request.isMine && request.status == RequestStatus.waiting) {
      return [
        FilledButton.icon(
          onPressed: () {
            state.acceptRequest(request.id);
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(
                  '${request.childName} 돌봄을 수락했어요! '
                  '끝나면 ${formatCash(request.cash)} 캐시를 받습니다.',
                ),
              ),
            );
          },
          icon: const Icon(Icons.volunteer_activism, size: 28),
          label: Text('돌봐줄게요 (${formatCash(request.cash)} 캐시 받기)'),
        ),
      ];
    }

    // 내가 수락한 요청 → 돌봄 끝내기
    if (!request.isMine &&
        request.status == RequestStatus.accepted &&
        request.helperName == state.myName) {
      return [
        FilledButton.icon(
          onPressed: () {
            state.completeRequest(request.id);
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content:
                    Text('${formatCash(request.cash)} 캐시가 적립됐어요. 고맙습니다!'),
              ),
            );
          },
          icon: const Icon(Icons.check_circle_outline, size: 28),
          label: const Text('돌봄 끝내고 캐시 받기'),
        ),
      ];
    }

    // 내 요청 → 취소하기 / 끝내기
    if (request.isMine &&
        (request.status == RequestStatus.waiting ||
            request.status == RequestStatus.accepted)) {
      return [
        if (request.status == RequestStatus.accepted)
          Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: FilledButton.icon(
              onPressed: () {
                state.completeRequest(request.id);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('돌봄이 끝났어요. 고맙습니다!')),
                );
              },
              icon: const Icon(Icons.check_circle_outline, size: 28),
              label: const Text('아이를 데려왔어요 (돌봄 끝)'),
            ),
          ),
        OutlinedButton(
          onPressed: () => _confirmCancel(context, state, request),
          style: OutlinedButton.styleFrom(
            foregroundColor: AppColors.warn,
            side: const BorderSide(color: AppColors.warn, width: 1.6),
          ),
          child: const Text('요청 취소하기 (캐시 돌려받음)'),
        ),
      ];
    }

    return const [];
  }

  Future<void> _confirmCancel(
    BuildContext context,
    AppState state,
    CareRequest request,
  ) async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('요청을 취소할까요?', style: TextStyle(fontSize: 22)),
        content: Text(
          '낸 캐시 ${formatCash(request.cash)}는 다시 돌려드려요.',
          style: const TextStyle(fontSize: 18, height: 1.5),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(dialogContext).pop(false),
            child: const Text('아니요', style: TextStyle(fontSize: 18)),
          ),
          TextButton(
            onPressed: () => Navigator.of(dialogContext).pop(true),
            child: const Text(
              '취소할게요',
              style: TextStyle(fontSize: 18, color: AppColors.warn),
            ),
          ),
        ],
      ),
    );

    if (ok != true || !context.mounted) return;
    state.cancelMyRequest(request.id);
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('요청을 취소했어요. 캐시를 돌려드렸습니다.')),
    );
  }
}
