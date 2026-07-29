import 'package:flutter/material.dart';

import '../app_state.dart';
import '../theme.dart';
import '../utils/format.dart';
import '../widgets/app_scope.dart';
import '../widgets/common.dart';
import '../widgets/request_card.dart';
import 'request_detail_screen.dart';
import 'request_form_screen.dart';

/// 홈 화면: 내 캐시, 맡기기 버튼, 내 요청, 우리 동네 요청 목록
class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final state = AppScope.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('돌봐줘'),
        automaticallyImplyLeading: false,
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(20, 18, 20, 40),
        children: [
          _CashHeader(state: state),
          const SizedBox(height: 18),

          // 핵심 기능 버튼
          FilledButton.icon(
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute<void>(
                  builder: (_) => const RequestFormScreen(),
                ),
              );
            },
            icon: const Icon(Icons.notifications_active, size: 28),
            label: const Text('지금 아이 맡기기'),
          ),
          const SizedBox(height: 10),
          const Text(
            '버튼을 누르면 같은 동네·같은 어린이집 부모님들에게 알림이 갑니다.',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 16, color: AppColors.subText),
          ),
          const SizedBox(height: 28),

          if (state.myOngoingRequests.isNotEmpty) ...[
            const SectionTitle('내가 올린 요청'),
            ...state.myOngoingRequests.map(
              (request) => Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: RequestCard(
                  request: request,
                  onTap: () => _openDetail(context, request),
                ),
              ),
            ),
            const SizedBox(height: 16),
          ],

          if (state.myHelpingRequests.isNotEmpty) ...[
            const SectionTitle('내가 돌봐주기로 한 아이'),
            ...state.myHelpingRequests.map(
              (request) => Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: RequestCard(
                  request: request,
                  onTap: () => _openDetail(context, request),
                ),
              ),
            ),
            const SizedBox(height: 16),
          ],

          SectionTitle('우리 동네 도움 요청 (${state.neighborOpenRequests.length})'),
          if (state.neighborOpenRequests.isEmpty)
            const AppCard(
              child: Text(
                '지금은 도움을 기다리는 요청이 없어요.\n새 요청이 오면 알림으로 알려드릴게요.',
                style: TextStyle(fontSize: 18, height: 1.5, color: AppColors.subText),
              ),
            )
          else
            ...state.neighborOpenRequests.map(
              (request) => Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: RequestCard(
                  request: request,
                  onTap: () => _openDetail(context, request),
                ),
              ),
            ),

          const SizedBox(height: 20),
          const SafetyNotice(),
        ],
      ),
    );
  }

  void _openDetail(BuildContext context, CareRequest request) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => RequestDetailScreen(requestId: request.id),
      ),
    );
  }
}

/// 맨 위 파란 상자: 내 캐시와 동네 정보
class _CashHeader extends StatelessWidget {
  const _CashHeader({required this.state});

  final AppState state;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [AppColors.primary, AppColors.primaryDark],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '${state.myName} 님, 안녕하세요',
            style: const TextStyle(
              fontSize: 19,
              color: Colors.white,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            '${state.neighborhood} · ${state.daycare}',
            style: const TextStyle(fontSize: 16, color: Color(0xFFD5E2FB)),
          ),
          const SizedBox(height: 18),
          const Text(
            '내 캐시',
            style: TextStyle(fontSize: 17, color: Color(0xFFD5E2FB)),
          ),
          const SizedBox(height: 2),
          Row(
            crossAxisAlignment: CrossAxisAlignment.baseline,
            textBaseline: TextBaseline.alphabetic,
            children: [
              Text(
                formatCash(state.cash),
                style: const TextStyle(
                  fontSize: 40,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              const SizedBox(width: 6),
              const Text(
                '캐시',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w600,
                  color: Colors.white,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            '1시간 돌봄 = ${formatCash(CashPolicy.cashPerHour)} 캐시 · '
            '한 번에 최대 ${CashPolicy.maxHours}시간',
            style: const TextStyle(fontSize: 16, color: Color(0xFFD5E2FB)),
          ),
        ],
      ),
    );
  }
}
