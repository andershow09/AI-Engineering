# Integração Nativa com Capacitor

O **Capacitor** é o runtime nativo multiplataforma padrão do ecossistema Ionic, conectando a aplicação web às APIs nativas do iOS, Android e Web.

---

## 1. Fluxo de Trabalho e Comandos Essenciais

```bash
# 1. Compilar os assets web do projeto
npm run build

# 2. Sincronizar os assets web e plugins nativos com as pastas iOS/Android
npx cap sync

# 3. Abrir o projeto no ambiente nativo correspondente
npx cap open android   # Abre no Android Studio
npx cap open ios       # Abre no Xcode

# 4. Executar diretamente em dispositivo/emulador conectado com live-reload
npx cap run android -l --external
npx cap run ios -l --external
```

---

## 2. Uso de Plugins Oficiais

Sempre prefira os plugins oficiais mantidos pelo time do Ionic/Capacitor:

```bash
npm install @capacitor/camera @capacitor/preferences @capacitor/network @capacitor/dialog
npx cap sync
```

### Exemplo de Uso Limpo e Tipado (Camera):
```typescript
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export async function takePicture(): Promise<string | undefined> {
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: false,
    resultType: CameraResultType.Uri,
    source: CameraSource.Prompt // Pergunta ao usuário: Câmera ou Galeria
  });

  return image.webPath;
}
```

---

## 3. Gestão de Permissões

Antes de invocar APIs sensíveis de hardware (câmera, localização, microfone):
1. **Verifique permissões:** Chame `checkPermissions()`.
2. **Requisite permissões:** Chame `requestPermissions()` apenas quando o usuário solicitar a ação no fluxo (just-in-time permissions).
3. **Configure os Manifestos:**
   - **Android:** Declare as permissões necessárias em `android/app/src/main/AndroidManifest.xml`.
   - **iOS:** Adicione as chaves de descrição de uso (ex: `NSCameraUsageDescription`) em `ios/App/App/Info.plist`.

---

## 4. Armazenamento Seguro e Persistência

- **Dados Leves de Preferências/Tokens:** Use `@capacitor/preferences` (substituto moderno do Storage legado).
- **Dados Críticos/Biometria:** Use plugins de *Secure Storage* ou *Biometric Auth* para chaves criptográficas e senhas.
- **Bancos Locais Volumosos:** Para suporte offline complexo, utilize `@capacitor-community/sqlite`.
