import 'package:flutter/material.dart';

import '../app_state.dart';

/// 앱 어디에서든 AppState(데이터 창고)를 꺼내 쓸 수 있게 해줍니다.
/// 사용법:  final state = AppScope.of(context);
class AppScope extends InheritedNotifier<AppState> {
  const AppScope({
    super.key,
    required AppState state,
    required super.child,
  }) : super(notifier: state);

  static AppState of(BuildContext context) {
    final scope = context.dependOnInheritedWidgetOfExactType<AppScope>();
    assert(scope != null, 'AppScope를 찾지 못했습니다. main.dart를 확인하세요.');
    return scope!.notifier!;
  }
}
