import 'package:flutter/material.dart';

import '../app_state.dart';
import '../theme.dart';
import '../utils/format.dart';
import 'common.dart';

/// 상태에 맞는 글씨색과 배경색을 정해줍니다.
({Color color, Color background}) statusColors(RequestStatus status) {
  switch (status) {
    case RequestStatus.waiting:
      return (color: AppColors.accent, background: const Color(0xFFFFEEE2));
    case RequestStatus.accepted:
      return (color: AppColors.primary, background: const Color(0xFFE4ECFD));
    case RequestStatus.done:
      return (color: AppColors.ok, background: const Color(0xFFE1F4EC));
    case RequestStatus.canceled:
      return (color: AppColors.subText, background: const Color(0xFFECEFF4));
  }
}

/// 돌봄 요청 1건을 보여주는 카드
class RequestCard extends StatelessWidget {
  const RequestCard({super.key, required this.request, this.onTap});

  final CareRequest request;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final colors = statusColors(request.status);

    return AppCard(
      onTap: onTap,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 24,
                backgroundColor: const Color(0xFFE4ECFD),
                child: Text(
                  request.childName.isNotEmpty ? request.childName[0] : '아',
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: AppColors.primary,
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '${request.childName} (${request.childAge}살)',
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      request.isMine
                          ? '내가 올린 요청'
                          : '${request.parentName} 부모님 · ${request.daycare}',
                      style: const TextStyle(
                        fontSize: 16,
                        color: AppColors.subText,
                      ),
                    ),
                  ],
                ),
              ),
              StatusChip(
                text: request.status.label,
                color: colors.color,
                background: colors.background,
              ),
            ],
          ),
          const SizedBox(height: 14),
          _InfoLine(
            icon: Icons.schedule,
            text: formatTimeRange(request.startAt, request.hours),
          ),
          const SizedBox(height: 8),
          _InfoLine(icon: Icons.place_outlined, text: request.place),
          const SizedBox(height: 14),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            decoration: BoxDecoration(
              color: const Color(0xFFF3F6FC),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              children: [
                const Icon(Icons.savings_outlined,
                    size: 22, color: AppColors.primary),
                const SizedBox(width: 8),
                Text(
                  '${formatCash(request.cash)} 캐시',
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: AppColors.primary,
                  ),
                ),
                const Spacer(),
                Text(
                  request.isMine ? '내가 내는 캐시' : '돌봐주면 받는 캐시',
                  style: const TextStyle(fontSize: 15, color: AppColors.subText),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _InfoLine extends StatelessWidget {
  const _InfoLine({required this.icon, required this.text});

  final IconData icon;
  final String text;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 22, color: AppColors.subText),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            text,
            style: const TextStyle(fontSize: 17, color: AppColors.text),
          ),
        ),
      ],
    );
  }
}
