import 'package:flutter/material.dart';

import '../app_state.dart';
import '../theme.dart';
import '../utils/format.dart';
import '../widgets/app_scope.dart';
import '../widgets/common.dart';

/// 내 정보: 프로필, 캐시 잔액, 캐시가 오간 기록, 캐시 규칙 안내
class MyPageScreen extends StatelessWidget {
  const MyPageScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final state = AppScope.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('내 정보'),
        automaticallyImplyLeading: false,
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(20, 18, 20, 40),
        children: [
          AppCard(
            child: Row(
              children: [
                CircleAvatar(
                  radius: 30,
                  backgroundColor: const Color(0xFFE4ECFD),
                  child: Text(
                    state.myName.isNotEmpty ? state.myName[0] : '나',
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: AppColors.primary,
                    ),
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '${state.myName} 부모님',
                        style: const TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${state.neighborhood} · ${state.daycare}',
                        style: const TextStyle(
                          fontSize: 17,
                          color: AppColors.subText,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // 캐시 잔액
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppColors.primary,
              borderRadius: BorderRadius.circular(18),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  '내 캐시',
                  style: TextStyle(fontSize: 17, color: Color(0xFFD5E2FB)),
                ),
                const SizedBox(height: 4),
                Text(
                  '${formatCash(state.cash)} 캐시',
                  style: const TextStyle(
                    fontSize: 34,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          const SectionTitle('캐시 규칙'),
          AppCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _RuleLine(
                  icon: Icons.card_giftcard,
                  text: '가입하면 ${formatCash(CashPolicy.welcomeCash)} 캐시를 드려요.',
                ),
                const SizedBox(height: 12),
                _RuleLine(
                  icon: Icons.volunteer_activism,
                  text:
                      '아이를 1시간 돌봐주면 ${formatCash(CashPolicy.cashPerHour)} 캐시를 받아요.',
                ),
                const SizedBox(height: 12),
                _RuleLine(
                  icon: Icons.child_care,
                  text:
                      '아이를 맡길 때 1시간에 ${formatCash(CashPolicy.cashPerHour)} 캐시를 써요.',
                ),
                const SizedBox(height: 12),
                _RuleLine(
                  icon: Icons.timer_outlined,
                  text: '한 번에 맡길 수 있는 시간은 최대 ${CashPolicy.maxHours}시간이에요.',
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          const SectionTitle('캐시 기록'),
          if (state.cashLogs.isEmpty)
            const AppCard(
              child: Text(
                '아직 기록이 없어요.',
                style: TextStyle(fontSize: 18, color: AppColors.subText),
              ),
            )
          else
            ...state.cashLogs.map(
              (log) => Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: AppCard(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 18,
                    vertical: 16,
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              log.title,
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '${formatDay(log.at)} ${formatClock(log.at)}',
                              style: const TextStyle(
                                fontSize: 15,
                                color: Color(0xFF98A0B0),
                              ),
                            ),
                          ],
                        ),
                      ),
                      Text(
                        '${log.amount > 0 ? '+' : ''}${formatCash(log.amount)}',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: log.amount > 0 ? AppColors.ok : AppColors.warn,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),

          const SizedBox(height: 16),
          const SafetyNotice(),
        ],
      ),
    );
  }
}

class _RuleLine extends StatelessWidget {
  const _RuleLine({required this.icon, required this.text});

  final IconData icon;
  final String text;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 24, color: AppColors.primary),
        const SizedBox(width: 10),
        Expanded(
          child: Text(
            text,
            style: const TextStyle(fontSize: 18, height: 1.45),
          ),
        ),
      ],
    );
  }
}
