import 'package:flutter/material.dart';

import '../theme.dart';
import '../widgets/app_scope.dart';
import 'home_screen.dart';
import 'my_page_screen.dart';
import 'notifications_screen.dart';

/// 아래쪽 탭 3개(홈·알림·내 정보)를 담고 있는 껍데기 화면입니다.
class MainShell extends StatefulWidget {
  const MainShell({super.key});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  int _index = 0;

  @override
  Widget build(BuildContext context) {
    final state = AppScope.of(context);
    final newCount = state.newNotificationCount;

    const List<Widget> screens = [
      HomeScreen(),
      NotificationsScreen(),
      MyPageScreen(),
    ];

    return Scaffold(
      body: IndexedStack(index: _index, children: screens),
      bottomNavigationBar: NavigationBar(
        height: 74,
        selectedIndex: _index,
        onDestinationSelected: (i) {
          setState(() => _index = i);
          // 알림 탭(1번)을 누르면 모두 '읽음'으로 바꿉니다.
          if (i == 1) state.markNotificationsRead();
        },
        backgroundColor: Colors.white,
        indicatorColor: const Color(0xFFE4ECFD),
        destinations: [
          const NavigationDestination(
            icon: Icon(Icons.home_outlined, size: 28),
            selectedIcon: Icon(Icons.home, size: 28, color: AppColors.primary),
            label: '홈',
          ),
          NavigationDestination(
            icon: Badge(
              isLabelVisible: newCount > 0,
              label: Text('$newCount'),
              child: const Icon(Icons.notifications_outlined, size: 28),
            ),
            selectedIcon: const Icon(Icons.notifications,
                size: 28, color: AppColors.primary),
            label: '알림',
          ),
          const NavigationDestination(
            icon: Icon(Icons.person_outline, size: 28),
            selectedIcon: Icon(Icons.person, size: 28, color: AppColors.primary),
            label: '내 정보',
          ),
        ],
      ),
    );
  }
}
