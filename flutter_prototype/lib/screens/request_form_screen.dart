import 'package:flutter/material.dart';

import '../app_state.dart';
import '../theme.dart';
import '../utils/format.dart';
import '../widgets/app_scope.dart';
import '../widgets/common.dart';
import 'request_detail_screen.dart';

/// 아이를 맡기는 요청을 적는 화면입니다.
class RequestFormScreen extends StatefulWidget {
  const RequestFormScreen({super.key});

  @override
  State<RequestFormScreen> createState() => _RequestFormScreenState();
}

class _RequestFormScreenState extends State<RequestFormScreen> {
  final _childNameController = TextEditingController();
  final _placeController = TextEditingController();
  final _noteController = TextEditingController();

  int _childAge = 5;
  int _hours = 1;
  late TimeOfDay _startTime;

  @override
  void initState() {
    super.initState();
    // 기본 시작 시각은 '지금부터 1시간 뒤'로 잡아둡니다.
    final later = DateTime.now().add(const Duration(hours: 1));
    _startTime = TimeOfDay(hour: later.hour, minute: 0);
  }

  @override
  void dispose() {
    _childNameController.dispose();
    _placeController.dispose();
    _noteController.dispose();
    super.dispose();
  }

  /// 고른 시각을 오늘 날짜에 붙여서 진짜 날짜/시간으로 만듭니다.
  DateTime get _startAt {
    final now = DateTime.now();
    var result =
        DateTime(now.year, now.month, now.day, _startTime.hour, _startTime.minute);
    // 이미 지난 시각이면 내일로 넘깁니다.
    if (result.isBefore(now)) result = result.add(const Duration(days: 1));
    return result;
  }

  int get _price => _hours * CashPolicy.cashPerHour;

  Future<void> _pickTime() async {
    final picked = await showTimePicker(
      context: context,
      initialTime: _startTime,
      helpText: '몇 시부터 맡길까요?',
    );
    if (picked != null) setState(() => _startTime = picked);
  }

  void _submit() {
    final state = AppScope.of(context);
    final childName = _childNameController.text.trim();
    final place = _placeController.text.trim();

    if (childName.isEmpty) {
      _toast('아이 이름을 적어주세요.');
      return;
    }
    if (place.isEmpty) {
      _toast('만날 장소를 적어주세요.');
      return;
    }
    if (state.cash < _price) {
      _toast('캐시가 부족해요. 이웃 아이를 돌봐주면 캐시를 모을 수 있어요.');
      return;
    }

    final request = state.createRequest(
      childName: childName,
      childAge: _childAge,
      place: place,
      note: _noteController.text.trim(),
      startAt: _startAt,
      hours: _hours,
    );
    if (request == null) {
      _toast('요청을 만들지 못했어요. 다시 시도해주세요.');
      return;
    }

    Navigator.of(context).pushReplacement(
      MaterialPageRoute<void>(
        builder: (_) => RequestDetailScreen(requestId: request.id),
      ),
    );
  }

  void _toast(String message) {
    ScaffoldMessenger.of(context)
        .showSnackBar(SnackBar(content: Text(message)));
  }

  @override
  Widget build(BuildContext context) {
    final state = AppScope.of(context);
    final notEnoughCash = state.cash < _price;

    return Scaffold(
      appBar: AppBar(title: const Text('아이 맡기기')),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(20, 18, 20, 40),
        children: [
          const Text(
            '아래 내용을 적으면 같은 동네 부모님들에게 알림이 갑니다.',
            style: TextStyle(fontSize: 18, color: AppColors.subText, height: 1.5),
          ),
          const SizedBox(height: 24),

          const _Label('아이 이름'),
          TextField(
            controller: _childNameController,
            style: const TextStyle(fontSize: 20),
            decoration: const InputDecoration(hintText: '예) 하준'),
          ),
          const SizedBox(height: 22),

          const _Label('아이 나이'),
          Wrap(
            spacing: 10,
            runSpacing: 10,
            children: List.generate(7, (index) {
              final age = index + 1;
              return _PickButton(
                text: '$age살',
                selected: _childAge == age,
                onTap: () => setState(() => _childAge = age),
              );
            }),
          ),
          const SizedBox(height: 22),

          const _Label('언제부터'),
          OutlinedButton.icon(
            onPressed: _pickTime,
            icon: const Icon(Icons.access_time, size: 26),
            label: Text('${formatDay(_startAt)} ${formatClock(_startAt)}'),
          ),
          const SizedBox(height: 22),

          const _Label('몇 시간 (최대 ${CashPolicy.maxHours}시간)'),
          Row(
            children: List.generate(CashPolicy.maxHours, (index) {
              final hour = index + 1;
              return Expanded(
                child: Padding(
                  padding: EdgeInsets.only(right: index == 0 ? 10 : 0),
                  child: _PickButton(
                    text: '$hour시간',
                    selected: _hours == hour,
                    fullWidth: true,
                    onTap: () => setState(() => _hours = hour),
                  ),
                ),
              );
            }),
          ),
          const SizedBox(height: 22),

          const _Label('만날 장소'),
          TextField(
            controller: _placeController,
            style: const TextStyle(fontSize: 20),
            decoration: const InputDecoration(hintText: '예) 행복어린이집 정문 앞'),
          ),
          const SizedBox(height: 22),

          const _Label('하고 싶은 말 (안 적어도 됩니다)'),
          TextField(
            controller: _noteController,
            style: const TextStyle(fontSize: 19),
            maxLines: 3,
            decoration: const InputDecoration(
              hintText: '예) 갑자기 병원에 가게 됐어요. 간식은 챙겨 보냅니다.',
            ),
          ),
          const SizedBox(height: 26),

          // 캐시 계산 결과
          AppCard(
            borderColor: notEnoughCash ? AppColors.warn : AppColors.primary,
            child: Column(
              children: [
                _CashRow(
                  label: '내가 낼 캐시',
                  value: '- ${formatCash(_price)}',
                  bold: true,
                  color: AppColors.warn,
                ),
                const SizedBox(height: 8),
                _CashRow(
                  label: '지금 내 캐시',
                  value: formatCash(state.cash),
                ),
                const Divider(height: 24),
                _CashRow(
                  label: '맡기고 남는 캐시',
                  value: formatCash(state.cash - _price),
                  bold: true,
                  color: notEnoughCash ? AppColors.warn : AppColors.ok,
                ),
                if (notEnoughCash) ...[
                  const SizedBox(height: 12),
                  const Text(
                    '캐시가 부족해요. 이웃 아이를 돌봐주면 캐시를 모을 수 있어요.',
                    style: TextStyle(
                      fontSize: 16,
                      color: AppColors.warn,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ],
            ),
          ),
          const SizedBox(height: 24),

          FilledButton(
            onPressed: notEnoughCash ? null : _submit,
            child: const Text('동네 부모님께 알림 보내기'),
          ),
          const SizedBox(height: 20),
          const SafetyNotice(),
        ],
      ),
    );
  }
}

class _Label extends StatelessWidget {
  const _Label(this.text);

  final String text;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Text(
        text,
        style: const TextStyle(fontSize: 19, fontWeight: FontWeight.bold),
      ),
    );
  }
}

class _PickButton extends StatelessWidget {
  const _PickButton({
    required this.text,
    required this.selected,
    required this.onTap,
    this.fullWidth = false,
  });

  final String text;
  final bool selected;
  final VoidCallback onTap;
  final bool fullWidth;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: fullWidth ? double.infinity : null,
        alignment: Alignment.center,
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        decoration: BoxDecoration(
          color: selected ? AppColors.primary : Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: selected ? AppColors.primary : AppColors.line,
            width: 1.6,
          ),
        ),
        child: Text(
          text,
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: selected ? Colors.white : AppColors.text,
          ),
        ),
      ),
    );
  }
}

class _CashRow extends StatelessWidget {
  const _CashRow({
    required this.label,
    required this.value,
    this.bold = false,
    this.color,
  });

  final String label;
  final String value;
  final bool bold;
  final Color? color;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(fontSize: 18, color: AppColors.subText)),
        Text(
          '$value 캐시',
          style: TextStyle(
            fontSize: bold ? 21 : 18,
            fontWeight: bold ? FontWeight.bold : FontWeight.w600,
            color: color ?? AppColors.text,
          ),
        ),
      ],
    );
  }
}
