import 'package:flutter/material.dart';

import '../app_state.dart';
import '../theme.dart';
import '../utils/format.dart';
import '../widgets/app_scope.dart';
import '../widgets/common.dart';

/// 첫 화면: 이름 · 동네 · 어린이집을 적고 가입합니다.
/// 가입하면 축하 캐시를 바로 받습니다.
class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final _nameController = TextEditingController();

  // 프로토타입이라 동네와 어린이집은 고르는 방식으로 간단히 했습니다.
  final _neighborhoods = ['행복동', '푸른동', '한빛동'];
  final _daycares = ['행복어린이집', '푸른숲어린이집', '한빛어린이집'];

  String _neighborhood = '행복동';
  String _daycare = '행복어린이집';

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  void _join() {
    final name = _nameController.text.trim();
    if (name.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('이름을 적어주세요.')),
      );
      return;
    }
    AppScope.of(context).join(
      name: name,
      neighborhood: _neighborhood,
      daycare: _daycare,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(20, 30, 20, 30),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 10),
              const Text('🧸', style: TextStyle(fontSize: 56)),
              const SizedBox(height: 12),
              const Text(
                '돌봐줘',
                style: TextStyle(
                  fontSize: 40,
                  fontWeight: FontWeight.bold,
                  color: AppColors.primary,
                ),
              ),
              const SizedBox(height: 10),
              const Text(
                '급할 때, 같은 동네 부모님이\n아이를 잠깐 돌봐줍니다.',
                style: TextStyle(
                  fontSize: 20,
                  height: 1.5,
                  color: AppColors.subText,
                ),
              ),
              const SizedBox(height: 28),

              // 가입 선물 안내
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: const Color(0xFFE4ECFD),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.card_giftcard,
                        size: 32, color: AppColors.primary),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        '가입하면 ${formatCash(CashPolicy.welcomeCash)} 캐시를 드려요!\n'
                        '캐시로 아이를 맡길 수 있어요.',
                        style: const TextStyle(
                          fontSize: 18,
                          height: 1.45,
                          fontWeight: FontWeight.w600,
                          color: AppColors.primaryDark,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 26),

              const Text('내 이름',
                  style: TextStyle(fontSize: 19, fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              TextField(
                controller: _nameController,
                style: const TextStyle(fontSize: 20),
                decoration: const InputDecoration(hintText: '예) 김하나'),
              ),
              const SizedBox(height: 22),

              const Text('우리 동네',
                  style: TextStyle(fontSize: 19, fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              _ChoiceRow(
                options: _neighborhoods,
                selected: _neighborhood,
                onChanged: (v) => setState(() => _neighborhood = v),
              ),
              const SizedBox(height: 22),

              const Text('우리 아이 어린이집',
                  style: TextStyle(fontSize: 19, fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              _ChoiceRow(
                options: _daycares,
                selected: _daycare,
                onChanged: (v) => setState(() => _daycare = v),
              ),
              const SizedBox(height: 30),

              FilledButton(
                onPressed: _join,
                child: const Text('가입하고 시작하기'),
              ),
              const SizedBox(height: 20),
              const SafetyNotice(),
            ],
          ),
        ),
      ),
    );
  }
}

/// 여러 개 중 하나를 고르는 버튼 묶음
class _ChoiceRow extends StatelessWidget {
  const _ChoiceRow({
    required this.options,
    required this.selected,
    required this.onChanged,
  });

  final List<String> options;
  final String selected;
  final ValueChanged<String> onChanged;

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 10,
      runSpacing: 10,
      children: options.map((option) {
        final isSelected = option == selected;
        return GestureDetector(
          onTap: () => onChanged(option),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
            decoration: BoxDecoration(
              color: isSelected ? AppColors.primary : Colors.white,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(
                color: isSelected ? AppColors.primary : AppColors.line,
                width: 1.6,
              ),
            ),
            child: Text(
              option,
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: isSelected ? Colors.white : AppColors.text,
              ),
            ),
          ),
        );
      }).toList(),
    );
  }
}
