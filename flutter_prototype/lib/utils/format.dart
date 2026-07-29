/// 숫자를 1,234 처럼 보기 좋게 바꿔줍니다.
String formatCash(int value) {
  final digits = value.abs().toString();
  final buffer = StringBuffer();
  for (var i = 0; i < digits.length; i++) {
    if (i > 0 && (digits.length - i) % 3 == 0) buffer.write(',');
    buffer.write(digits[i]);
  }
  return '${value < 0 ? '-' : ''}$buffer';
}

/// 날짜를 '오늘 / 내일 / 8월 3일' 처럼 바꿔줍니다.
String formatDay(DateTime date) {
  final now = DateTime.now();
  final today = DateTime(now.year, now.month, now.day);
  final target = DateTime(date.year, date.month, date.day);
  final diff = target.difference(today).inDays;
  if (diff == 0) return '오늘';
  if (diff == 1) return '내일';
  if (diff == -1) return '어제';
  return '${date.month}월 ${date.day}일';
}

/// 시각을 '오후 3:30' 처럼 바꿔줍니다.
String formatClock(DateTime date) {
  final isMorning = date.hour < 12;
  var hour = date.hour % 12;
  if (hour == 0) hour = 12;
  final minute = date.minute.toString().padLeft(2, '0');
  return '${isMorning ? '오전' : '오후'} $hour:$minute';
}

/// '오늘 오후 3:30 ~ 오후 5:30 (2시간)' 형태로 만들어 줍니다.
String formatTimeRange(DateTime start, int hours) {
  final end = start.add(Duration(hours: hours));
  return '${formatDay(start)} ${formatClock(start)} ~ ${formatClock(end)} ($hours시간)';
}

/// 알림 시각을 '방금 전 / 5분 전' 처럼 바꿔줍니다.
String formatAgo(DateTime at) {
  final diff = DateTime.now().difference(at);
  if (diff.inMinutes < 1) return '방금 전';
  if (diff.inMinutes < 60) return '${diff.inMinutes}분 전';
  if (diff.inHours < 24) return '${diff.inHours}시간 전';
  return '${diff.inDays}일 전';
}
