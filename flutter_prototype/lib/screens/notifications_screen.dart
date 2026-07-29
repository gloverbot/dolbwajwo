import 'package:flutter/material.dart';

import '../theme.dart';
import '../utils/format.dart';
import '../widgets/app_scope.dart';
import '../widgets/common.dart';
import 'request_detail_screen.dart';

/// 알림함: 동네 요청·수락·캐시 적립 소식이 쌓입니다.
/// (읽음 처리는 아래 탭에서 '알림'을 누를 때 main_shell.dart가 합니다.)
class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final state = AppScope.of(context);
    final notifications = state.notifications;

    return Scaffold(
      appBar: AppBar(
        title: const Text('알림'),
        automaticallyImplyLeading: false,
      ),
      body: notifications.isEmpty
          ? const Center(
              child: Padding(
                padding: EdgeInsets.all(30),
                child: Text(
                  '아직 알림이 없어요.',
                  style: TextStyle(fontSize: 19, color: AppColors.subText),
                ),
              ),
            )
          : ListView.separated(
              padding: const EdgeInsets.fromLTRB(20, 18, 20, 40),
              itemCount: notifications.length,
              separatorBuilder: (_, __) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                final item = notifications[index];
                return AppCard(
                  onTap: item.requestId == null
                      ? null
                      : () {
                          Navigator.of(context).push(
                            MaterialPageRoute<void>(
                              builder: (_) => RequestDetailScreen(
                                requestId: item.requestId!,
                              ),
                            ),
                          );
                        },
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const CircleAvatar(
                        radius: 22,
                        backgroundColor: Color(0xFFE4ECFD),
                        child: Icon(
                          Icons.notifications,
                          color: AppColors.primary,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              item.title,
                              style: const TextStyle(
                                fontSize: 19,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              item.body,
                              style: const TextStyle(
                                fontSize: 17,
                                height: 1.45,
                                color: AppColors.subText,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              formatAgo(item.at),
                              style: const TextStyle(
                                fontSize: 15,
                                color: Color(0xFF98A0B0),
                              ),
                            ),
                          ],
                        ),
                      ),
                      if (item.requestId != null)
                        const Icon(Icons.chevron_right,
                            color: AppColors.subText),
                    ],
                  ),
                );
              },
            ),
    );
  }
}
