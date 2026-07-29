import 'package:flutter/material.dart';

import '../theme.dart';

/// 흰 카드 상자. 앱 곳곳에서 재사용합니다.
class AppCard extends StatelessWidget {
  const AppCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(18),
    this.onTap,
    this.borderColor,
  });

  final Widget child;
  final EdgeInsets padding;
  final VoidCallback? onTap;
  final Color? borderColor;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: AppColors.card,
      borderRadius: BorderRadius.circular(18),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(18),
        child: Container(
          padding: padding,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: borderColor ?? AppColors.line, width: 1.4),
          ),
          child: child,
        ),
      ),
    );
  }
}

/// '우리 동네 도움 요청' 같은 구역 제목
class SectionTitle extends StatelessWidget {
  const SectionTitle(this.text, {super.key, this.trailing});

  final String text;
  final Widget? trailing;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          Expanded(
            child: Text(
              text,
              style: const TextStyle(fontSize: 21, fontWeight: FontWeight.bold),
            ),
          ),
          if (trailing != null) trailing!,
        ],
      ),
    );
  }
}

/// 상태를 보여주는 작은 알약 모양 딱지
class StatusChip extends StatelessWidget {
  const StatusChip({
    super.key,
    required this.text,
    required this.color,
    required this.background,
  });

  final String text;
  final Color color;
  final Color background;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: background,
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        text,
        style: TextStyle(
          fontSize: 15,
          fontWeight: FontWeight.bold,
          color: color,
        ),
      ),
    );
  }
}

/// 안전 안내 문구 (프로토타입 고지)
class SafetyNotice extends StatelessWidget {
  const SafetyNotice({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFFFF6EC),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFFFD9B8)),
      ),
      child: const Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(Icons.shield_outlined, color: AppColors.accent, size: 26),
          SizedBox(width: 10),
          Expanded(
            child: Text(
              '이 앱은 아이를 잠깐 맡기도록 도와주는 프로토타입입니다.\n'
              '실제 돌봄은 서로 얼굴을 아는 이웃과 함께하고, 응급 상황에서는 119에 먼저 연락하세요.',
              style: TextStyle(fontSize: 16, height: 1.5, color: AppColors.subText),
            ),
          ),
        ],
      ),
    );
  }
}
