import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:dolbwajwo/main.dart';

void main() {
  testWidgets('첫 화면에 가입 버튼이 보인다', (WidgetTester tester) async {
    await tester.pumpWidget(const DolbwajwoApp());
    expect(find.text('가입하고 시작하기'), findsOneWidget);
  });

  testWidgets('가입하면 홈 화면으로 넘어간다', (WidgetTester tester) async {
    await tester.pumpWidget(const DolbwajwoApp());

    await tester.enterText(find.byType(TextField).first, '김하나');
    await tester.tap(find.text('가입하고 시작하기'));
    await tester.pump();

    expect(find.text('지금 아이 맡기기'), findsOneWidget);
  });
}
