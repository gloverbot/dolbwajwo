import 'package:flutter/material.dart';

import 'app_state.dart';
import 'screens/main_shell.dart';
import 'screens/onboarding_screen.dart';
import 'theme.dart';
import 'widgets/app_scope.dart';

void main() {
  runApp(const DolbwajwoApp());
}

/// 앱의 시작점입니다.
/// 데이터 창고(AppState)를 만들어서 앱 전체가 함께 쓰게 합니다.
class DolbwajwoApp extends StatefulWidget {
  const DolbwajwoApp({super.key});

  @override
  State<DolbwajwoApp> createState() => _DolbwajwoAppState();
}

class _DolbwajwoAppState extends State<DolbwajwoApp> {
  final AppState _state = AppState();

  @override
  void dispose() {
    _state.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AppScope(
      state: _state,
      child: MaterialApp(
        title: '돌봐줘',
        debugShowCheckedModeBanner: false,
        theme: buildAppTheme(),
        home: const _RootPage(),
      ),
    );
  }
}

/// 아직 가입 전이면 가입 화면을, 가입했으면 홈을 보여줍니다.
class _RootPage extends StatelessWidget {
  const _RootPage();

  @override
  Widget build(BuildContext context) {
    final state = AppScope.of(context);
    return state.joined ? const MainShell() : const OnboardingScreen();
  }
}
