# MapaSemLuz

## Descrição

MapaSemLuz é um aplicativo móvel multiplataforma (iOS e Android) desenvolvido em **React Native** com **Expo** e **TypeScript**. Permite ao usuário registrar, visualizar e gerenciar localmente eventos de falta de energia causados por desastres naturais ou falhas na rede elétrica. Inclui funcionalidades de mapeamento, cálculo de distância, e recomendações de segurança.

---

## Funcionalidades

* **Registro de eventos**: usuário cadastra localização (CEP, bairro ou cidade), tempo de interrupção e descrição de prejuízos.
* **Armazenamento local**: persistência de dados via AsyncStorage.
* **Lista de eventos**: exibe eventos em cards, com swipe-to-delete para remoção individual e botão para apagar todos.
* **Mapa interativo**: mostra todos os eventos registrados como marcadores no mapa, com ponto azul de localização do usuário.
* **Detalhes do evento**: ao tocar num marcador ou no card da lista, exibe mapa focalizado no local do evento, calcula e mostra a distância entre o usuário e o evento.
* **Recomendações**: seção com orientações preventivas e boas práticas antes, durante e após a falta de energia.
* **Swipe-to-delete**: gesto de deslize para apagar eventos individualmente.
* **Conceito sem protótipo Figma**: foco exclusivo na implementação da aplicação.

---

## Pré-requisitos

* Node.js 18+ (ou LTS mais recente)
* Yarn (ou npm)
* Expo CLI (`npm install -g expo-cli` ou `yarn global add expo-cli`)
* Dispositivo ou emulador Android/iOS

---

## Instalação

1. **Clone o repositório**:

   ```bash
   git clone https://github.com/pacheco365/GS_MobileDevelopment.git
   cd MapaSemLuz
   ```

2. **Instale as dependências**:

   ```bash
   yarn install
   # ou
   npm install
   ```

3. **Inicie o Metro Bundler**:

   ```bash
   yarn start --clear
   # ou
   npm start -- --clear
   ```

4. **Execute no dispositivo/emulador**:

   * Android: aperte `a` no terminal ou use o Expo Go
   * iOS: aperte `i` (macOS) ou abra no Expo Go

---

## Estrutura de diretórios

```
MapaSemLuz/
├─ App.tsx                  # Entry-point, envolve GestureHandlerRootView e navegator
├─ babel.config.js          # Configuração Babel (react-native-reanimated/plugin)
├─ tsconfig.json            # Configuração TypeScript
├─ package.json             # Dependências e scripts
└─ src/
   ├─ navigation/
   │   └─ AppNavigator.tsx  # Configura TabNavigator e Stacks sem header
   ├─ screens/
   │   ├─ PanoramaGeralScreen.tsx    # Lista de eventos + swipe-to-delete
   │   ├─ LocalizacaoScreen.tsx      # Cadastro de CEP/localização
   │   ├─ TempoInterrupcaoScreen.tsx # Cadastro de tempo sem energia
   │   ├─ PrejuizosScreen.tsx        # Descrição de prejuízos
   │   ├─ MapScreen.tsx              # Tela de mapa + bottom-sheet lista
   │   ├─ EventDetailScreen.tsx      # Detalhes do evento + cálculo de distância
   │   └─ RecomendacoesScreen.tsx    # Recomendações e boas práticas
   └─ services/
       └─ storage.ts      # AsyncStorage: carregar, adicionar, remover, limpar
```

---

## Principais dependências

* **Expo**: gerenciador de build e runtime.
* **React Navigation** (`@react-navigation/native`, `stack`, `bottom-tabs`)
* **AsyncStorage** (`@react-native-async-storage/async-storage`)
* **Expo Location** (`expo-location`)
* **React Native Maps** (`react-native-maps`)
* **Gorhom Bottom Sheet** (`@gorhom/bottom-sheet`)
* **Gesture Handler** (`react-native-gesture-handler`)
* **Reanimated** (`react-native-reanimated`)
* **Vector Icons** (`@expo/vector-icons`)

---

## Scripts úteis

* `yarn start` / `npm start`: inicia o bundler
* `yarn ios` / `npm run ios`: abre no simulador iOS (macOS)
* `yarn android` / `npm run android`: abre no emulador Android
* `yarn build:web` / `expo build:web`: gera PWA

---

## Ingerantes

* Danilo Urze Aldred - RM: 99465
* Gabriel Pacheco - RM: 550191
* Pedro Henrique Oliveira Ananias - RM:550689

---

