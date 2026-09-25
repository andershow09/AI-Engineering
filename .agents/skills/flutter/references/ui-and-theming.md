# UI, Material 3 e Design System no Flutter

Construir interfaces de alto nível estético exige consistência visual, fidelidade a tokens de design e suporte nativo a **Material 3** e temas claro/escuro.

---

## 1. Configuração do ThemeData com Material 3

Sempre habilite `useMaterial3: true` e gere esquemas de cores harmoniosos a partir de uma cor semente (`seedColor`):

```dart
// app/theme/app_theme.dart
import 'package:flutter/material.dart';

class AppTheme {
  static const _seedColor = Color(0xFF0F62FE); // Azul profissional

  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    colorScheme: ColorScheme.fromSeed(
      seedColor: _seedColor,
      brightness: Brightness.light,
    ),
    scaffoldBackgroundColor: const Color(0xFFF4F6F9),
    appBarTheme: const AppBarTheme(
      centerTitle: false,
      elevation: 0,
      scrolledUnderElevation: 2,
    ),
    cardTheme: CardTheme(
      elevation: 1,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
    ),
  );

  static ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    colorScheme: ColorScheme.fromSeed(
      seedColor: _seedColor,
      brightness: Brightness.dark,
    ),
    scaffoldBackgroundColor: const Color(0xFF121417),
    appBarTheme: const AppBarTheme(
      centerTitle: false,
      elevation: 0,
    ),
    cardTheme: CardTheme(
      elevation: 1,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
    ),
  );
}
```

---

## 2. Tokens Customizados com ThemeExtension

Para cores semânticas adicionais (como sucesso, aviso) ou tamanhos específicos de espaçamento que não existem no `ColorScheme` nativo, utilize `ThemeExtension`:

```dart
// app/theme/app_colors_extension.dart
import 'package:flutter/material.dart';

@immutable
class AppColorsExtension extends ThemeExtension<AppColorsExtension> {
  final Color success;
  final Color warning;
  final Color info;

  const AppColorsExtension({
    required this.success,
    required this.warning,
    required this.info,
  });

  @override
  AppColorsExtension copyWith({Color? success, Color? warning, Color? info}) {
    return AppColorsExtension(
      success: success ?? this.success,
      warning: warning ?? this.warning,
      info: info ?? this.info,
    );
  }

  @override
  AppColorsExtension lerp(ThemeExtension<AppColorsExtension>? other, double t) {
    if (other is! AppColorsExtension) return this;
    return AppColorsExtension(
      success: Color.lerp(success, other.success, t)!,
      warning: Color.lerp(warning, other.warning, t)!,
      info: Color.lerp(info, other.info, t)!,
    );
  }

  static const light = AppColorsExtension(
    success: Color(0xFF24A148),
    warning: Color(0xFFF1C21B),
    info: Color(0xFF0043CE),
  );

  static const dark = AppColorsExtension(
    success: Color(0xFF42BE65),
    warning: Color(0xFFFDDc69),
    info: Color(0xFF4589FF),
  );
}

// Extensão utilitária para acesso rápido no BuildContext
extension BuildContextThemeExt on BuildContext {
  AppColorsExtension get customColors =>
      Theme.of(this).extension<AppColorsExtension>() ?? AppColorsExtension.light;
}
```

---

## 3. Boas Práticas de Performance e Renderização

1. **Uso de `const` Constructors:**
   Sempre marque widgets sem dependências dinâmicas com `const`. Isso impede que o Flutter recrie nós do RenderObject desnecessariamente em cada re-build.
2. **Re-renderização Granular:**
   Nunca observe um objeto inteiro no Riverpod quando precisar apenas de um campo.
   ```dart
   // ✅ CORRETO: Reconstrói apenas se o nome mudar
   final userName = ref.watch(userViewModelProvider.select((user) => user.name));

   // ❌ RUIM: Reconstrói toda vez que qualquer propriedade de user mudar
   final user = ref.watch(userViewModelProvider);
   ```
3. **Listas Longas com Builder:**
   Sempre use `ListView.builder` ou `ListView.separated` para carregar apenas os itens visíveis na viewport (virtualização de DOM móvel).
4. **Isolamento de Animações com `RepaintBoundary`:**
   Em widgets com animações contínuas (ex: spinners, gráficos em tempo real), envolva com `RepaintBoundary` para não disparar repaint na tela inteira.