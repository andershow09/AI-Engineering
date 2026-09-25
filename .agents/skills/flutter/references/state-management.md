# Gerenciamento de Estado: Riverpod & BLoC / Cubit

Este guia detalha a implementação das duas soluções líderes de mercado para o padrão MVVM no Flutter: **Riverpod** (solução primária recomendada) e **BLoC / Cubit** (solução corporativa alternativa).

---

## 1. Princípio Fundamental de Arquitetura

> **A Camada de Modelo (Repositories, DataSources e Entities) DEVE ser 100% agnóstica ao gerenciador de estado.**
> O mesmo `ProductsRepository` deve funcionar perfeitamente tanto com um `AsyncNotifier` (Riverpod) quanto com um `Cubit` (BLoC).

---

## 2. Riverpod (Padrão Principal)

O Riverpod é uma solução de gerenciamento de estado e injeção de dependência reativa, com checagem em tempo de compilação (*compile-safe*) e independente de `BuildContext`.

### 2.1. Tipos de Providers Essenciais

| Tipo de Provider | Finalidade | Exemplo de Uso |
| :--- | :--- | :--- |
| **`Provider`** | Valores síncronos imutáveis ou injeção de dependências. | Expor instâncias de Repositories e Clientes HTTP. |
| **`NotifierProvider`** | Estado síncrono com mutações através de métodos públicos. | Filtros de busca, alternador de tema (Dark/Light). |
| **`AsyncNotifierProvider`** | Estado assíncrono com ciclo de vida (`AsyncLoading`, `AsyncError`, `AsyncData`). | Listagem de dados de API, formulários de autenticação. |

### 2.2. Implementação do ViewModel com AsyncNotifier (Code-Gen)

```dart
// features/cart/presentation/viewmodels/cart_viewmodel.dart
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../domain/entities/cart_item.dart';
import '../../domain/repositories/cart_repository.dart';

part 'cart_viewmodel.g.dart';

@riverpod
class CartViewModel extends _$CartViewModel {
  late final CartRepository _repository;

  @override
  FutureOr<List<CartItem>> build() async {
    _repository = ref.watch(cartRepositoryProvider);
    return _repository.getCartItems();
  }

  Future<void> addItem(String productId) async {
    // 1. Marca estado como carregando enquanto mantém os dados anteriores se desejar
    state = const AsyncValue.loading();

    // 2. Executa a mutação encapsulada em AsyncValue.guard
    state = await AsyncValue.guard(() async {
      await _repository.addItem(productId);
      return _repository.getCartItems();
    });
  }

  Future<void> removeItem(String itemId) async {
    state = await AsyncValue.guard(() async {
      await _repository.removeItem(itemId);
      return _repository.getCartItems();
    });
  }
}
```

### 2.3. Consumo na View (Widgets e Side-Effects)

```dart
// features/cart/presentation/views/cart_page.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../viewmodels/cart_viewmodel.dart';

class CartPage extends ConsumerWidget {
  const CartPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // 1. Ouvir side-effects (ex: notificações, navegação, erros com SnackBar)
    ref.listen<AsyncValue>(cartViewModelProvider, (previous, next) {
      if (next.hasError && !next.isLoading) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Erro ao atualizar carrinho: ${next.error}'),
            backgroundColor: Theme.of(context).colorScheme.error,
          ),
        );
      }
    });

    // 2. Observar estado reativo para reconstrução da UI
    final cartState = ref.watch(cartViewModelProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Meu Carrinho')),
      body: cartState.when(
        data: (items) => items.isEmpty
            ? const Center(child: Text('Carrinho vazio'))
            : ListView.builder(
                itemCount: items.length,
                itemBuilder: (context, index) {
                  final item = items[index];
                  return ListTile(
                    title: Text(item.productName),
                    subtitle: Text('Qtd: ${item.quantity}'),
                    trailing: IconButton(
                      icon: const Icon(Icons.delete_outline),
                      // 3. Ações pontuais usam ref.read
                      onPressed: () => ref
                          .read(cartViewModelProvider.notifier)
                          .removeItem(item.id),
                    ),
                  );
                },
              ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, _) => Center(child: Text('Falha ao carregar itens: $error')),
      ),
    );
  }
}
```

---

## 3. BLoC / Cubit (Padrão Alternativo)

O ecossistema **`flutter_bloc`** separa estritamente eventos de entrada, lógica de transformação e estados de saída.

### 3.1. Quando usar Cubit vs BLoC
- **`Cubit`:** Indicado para o padrão MVVM na grande maioria das telas. O ViewModel expõe funções normais (`addItem()`) e emite estados imutáveis (`emit(state)`).
- **`Bloc`:** Indicado para fluxos complexos baseados em *Streams*, onde há necessidade de *debounce*, *throttle*, *switchMap* ou auditoria rígida de eventos.

### 3.2. Definição do ViewState Imutável

```dart
// features/cart/presentation/viewmodels/cart_state.dart
import 'package:equatable/equatable.dart';
import '../../domain/entities/cart_item.dart';

sealed class CartState extends Equatable {
  const CartState();

  @override
  List<Object?> get props => [];
}

class CartInitial extends CartState {}

class CartLoading extends CartState {}

class CartLoaded extends CartState {
  final List<CartItem> items;
  const CartLoaded(this.items);

  @override
  List<Object?> get props => [items];
}

class CartError extends CartState {
  final String message;
  const CartError(this.message);

  @override
  List<Object?> get props => [message];
}
```

### 3.3. Implementação do ViewModel com Cubit

```dart
// features/cart/presentation/viewmodels/cart_cubit.dart
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../domain/repositories/cart_repository.dart';
import 'cart_state.dart';

class CartCubit extends Cubit<CartState> {
  final CartRepository _repository;

  CartCubit({required CartRepository repository})
      : _repository = repository,
        super(CartInitial());

  Future<void> loadCart() async {
    emit(CartLoading());
    try {
      final items = await _repository.getCartItems();
      emit(CartLoaded(items));
    } catch (e) {
      emit(CartError(e.toString()));
    }
  }

  Future<void> removeItem(String itemId) async {
    try {
      await _repository.removeItem(itemId);
      final items = await _repository.getCartItems();
      emit(CartLoaded(items));
    } catch (e) {
      emit(CartError('Falha ao remover item: $e'));
    }
  }
}
```

### 3.4. Consumo com BlocConsumer na View

```dart
// features/cart/presentation/views/cart_page_bloc.dart
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../viewmodels/cart_cubit.dart';
import '../viewmodels/cart_state.dart';

class CartPageBloc extends StatelessWidget {
  const CartPageBloc({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Carrinho (BLoC/Cubit)')),
      body: BlocConsumer<CartCubit, CartState>(
        listener: (context, state) {
          // Reage a side effects
          if (state is CartError) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text(state.message)),
            );
          }
        },
        builder: (context, state) {
          return switch (state) {
            CartInitial() || CartLoading() => const Center(
                child: CircularProgressIndicator(),
              ),
            CartError(message: final msg) => Center(
                child: Text('Erro: $msg'),
              ),
            CartLoaded(items: final items) => items.isEmpty
                ? const Center(child: Text('Carrinho vazio'))
                : ListView.builder(
                    itemCount: items.length,
                    itemBuilder: (context, index) {
                      final item = items[index];
                      return ListTile(
                        title: Text(item.productName),
                        trailing: IconButton(
                          icon: const Icon(Icons.delete),
                          onPressed: () => context
                              .read<CartCubit>()
                              .removeItem(item.id),
                        ),
                      );
                    },
                  ),
          };
        },
      ),
    );
  }
}
```

---

## 4. Matriz de Decisão: Riverpod vs BLoC

| Critério | Riverpod | BLoC / Cubit |
| :--- | :--- | :--- |
| **Curva de Aprendizado** | Moderada (requer compreensão de ref e providers). | Média-Alta (exige boilerplate de states/events). |
| **Boilerplate de Código** | Baixo com `riverpod_annotation`. | Médio a Alto com arquivos de State/Event separados. |
| **Independência de BuildContext** | Total (leitura e escuta em qualquer camada). | Parcial (precisa de context para `BlocProvider.of`). |
| **Side Effects (Snackbars, Rotas)** | `ref.listen` no método `build`. | `BlocListener` / `BlocConsumer`. |
| **Tratamento Assíncrono** | Nativo com `AsyncValue` (`when`, `guard`). | Manual (criação de subclasses Loading/Success/Error). |
| **Adotado Principalmente em** | Apps modernos, startups e projetos que prezam por agilidade. | Grandes corporações bancárias e sistemas com auditoria de eventos. |