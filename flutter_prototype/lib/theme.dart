import 'package:flutter/material.dart';

/// 앱에서 쓰는 색깔을 한 곳에 모아둡니다.
class AppColors {
  static const Color primary = Color(0xFF2F6BE4); // 기본 파랑
  static const Color primaryDark = Color(0xFF1B4CB8);
  static const Color accent = Color(0xFFFF7A3D); // 강조 주황
  static const Color bg = Color(0xFFF4F6FB); // 배경
  static const Color card = Colors.white;
  static const Color text = Color(0xFF15181F); // 진한 글씨
  static const Color subText = Color(0xFF4A5160); // 보조 글씨
  static const Color line = Color(0xFFDFE4EE);
  static const Color ok = Color(0xFF12855A);
  static const Color warn = Color(0xFFD3342E);
}

/// 앱 전체 디자인 기본값입니다.
/// 글씨와 버튼을 크게 만들어 누구나 쓰기 쉽게 했습니다.
ThemeData buildAppTheme() {
  final base = ThemeData(
    useMaterial3: true,
    colorSchemeSeed: AppColors.primary,
    scaffoldBackgroundColor: AppColors.bg,
  );

  return base.copyWith(
    textTheme: base.textTheme
        .apply(bodyColor: AppColors.text, displayColor: AppColors.text)
        .copyWith(
          bodyLarge: const TextStyle(
              fontSize: 19, height: 1.45, color: AppColors.text),
          bodyMedium: const TextStyle(
              fontSize: 18, height: 1.45, color: AppColors.text),
          titleLarge: const TextStyle(
              fontSize: 24, fontWeight: FontWeight.bold, color: AppColors.text),
          titleMedium: const TextStyle(
              fontSize: 20, fontWeight: FontWeight.w700, color: AppColors.text),
        ),
    appBarTheme: const AppBarTheme(
      backgroundColor: Colors.white,
      foregroundColor: AppColors.text,
      surfaceTintColor: Colors.white,
      elevation: 0,
      centerTitle: true,
      titleTextStyle: TextStyle(
        fontSize: 22,
        fontWeight: FontWeight.bold,
        color: AppColors.text,
      ),
    ),
    filledButtonTheme: FilledButtonThemeData(
      style: FilledButton.styleFrom(
        minimumSize: const Size.fromHeight(62),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        textStyle: const TextStyle(fontSize: 21, fontWeight: FontWeight.bold),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        minimumSize: const Size.fromHeight(58),
        foregroundColor: AppColors.primary,
        side: const BorderSide(color: AppColors.primary, width: 1.6),
        textStyle: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: Colors.white,
      contentPadding:
          const EdgeInsets.symmetric(horizontal: 18, vertical: 20),
      labelStyle: const TextStyle(fontSize: 18, color: AppColors.subText),
      hintStyle: const TextStyle(fontSize: 18, color: Color(0xFF98A0B0)),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: AppColors.line),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: AppColors.line),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: AppColors.primary, width: 2),
      ),
    ),
    snackBarTheme: const SnackBarThemeData(
      contentTextStyle: TextStyle(fontSize: 18, color: Colors.white),
      behavior: SnackBarBehavior.floating,
    ),
  );
}
