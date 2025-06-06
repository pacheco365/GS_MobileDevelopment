import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  Animated,
} from 'react-native';
import { useIsFocused, CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import {
  carregarEventos,
  limparEventos,
  removerEvento,
  EventoFaltaEnergia,
} from '../services/storage';
import {
  ListaStackParamList,
  TabParamList,
  MapaStackParamList,
} from '../navigation/AppNavigator';
import { MaterialIcons } from '@expo/vector-icons';
import {
  Swipeable,
  RectButton,
} from 'react-native-gesture-handler';

type PanoramaNavProp = CompositeNavigationProp<
  StackNavigationProp<ListaStackParamList, 'PanoramaGeral'>,
  CompositeNavigationProp<
    BottomTabNavigationProp<TabParamList>,
    StackNavigationProp<MapaStackParamList>
  >
>;

interface Props {
  navigation: PanoramaNavProp;
}

const PanoramaGeralScreen: React.FC<Props> = ({ navigation }) => {
  const [eventos, setEventos] = useState<EventoFaltaEnergia[]>([]);
  const isFocused = useIsFocused();

  //Função que carrega todos os eventos do AsyncStorage e atualiza o estado local.
  const carregarLista = async () => {
    const lista = await carregarEventos();
    setEventos(lista);
  };

  useEffect(() => {
    if (isFocused) {
      carregarLista();
    }
  }, [isFocused]);

  const confirmarRemocao = (id: string) => {
    Alert.alert(
      'Apagar evento?',
      'Tem certeza que deseja apagar este evento específico?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sim, apagar',
          style: 'destructive',
          onPress: async () => {
            await removerEvento(id);
            carregarLista();
          },
        },
      ]
    );
  };

  /**
   * renderRightActionsForItem: dado um itemId, retorna uma função (progress, dragX) =>
   * ReactNode. Essa função será usada pelo Swipeable para exibir o botão vermelho.
   */
  const renderRightActionsForItem = (itemId: string) => {
    return (progress: any, dragX: any) => {
      // Se quiser animar a escala baseada no arrasto, use:
      const scale = dragX.interpolate
        ? dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [1, 0.5],
            extrapolate: 'clamp',
          })
        : 1;

      return (
        <RectButton
          style={styles.rightActionContainer}
          onPress={() => confirmarRemocao(itemId)}
        >
          <Animated.View style={[styles.actionIconWrapper, { transform: [{ scale }] }]}>
            <MaterialIcons name="delete" size={28} color="#fff" />
            <Text style={styles.actionText}>Apagar</Text>
          </Animated.View>
        </RectButton>
      );
    };
  };

  //Deslizando para a esquerda em um card exibe o botão "Apagar"
  const renderItem = ({ item }: { item: EventoFaltaEnergia }) => (
    <Swipeable renderRightActions={renderRightActionsForItem(item.id)}>
      <RectButton
        style={styles.card}
        onPress={() => {
          navigation.navigate('MapaTab', {
            screen: 'EventDetail',
            params: {
              id: item.id,
              localizacao: item.localizacao,
              latitude: item.latitude!,
              longitude: item.longitude!,
              tempoInterrupcao: item.tempoInterrupcao,
              prejuizos: item.prejuizos,
              dataRegistro: item.dataRegistro,
            },
          });
        }}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.titulo}>
            {new Date(Number(item.id)).toLocaleDateString()} — {item.localizacao}
          </Text>
          <MaterialIcons name="chevron-right" size={24} color="#888" />
        </View>
        <Text style={styles.subtitulo}>Tempo: {item.tempoInterrupcao}</Text>
        <Text style={styles.prejuizos}>
          {item.prejuizos.length > 50
            ? item.prejuizos.substring(0, 50) + '…'
            : item.prejuizos}
        </Text>
      </RectButton>
    </Swipeable>
  );

  const limparTudo = () => {
    Alert.alert(
      'Confirmar limpeza',
      'Deseja realmente apagar todos os registros?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sim, limpar',
          onPress: async () => {
            await limparEventos();
            setEventos([]);
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Eventos Registrados</Text>

      {eventos.length === 0 ? (
        <Text style={styles.semEventos}>Nenhum evento salvo.</Text>
      ) : (
        <FlatList
          data={eventos}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      )}

      <View style={styles.botaoContainer}>
        <RectButton
          style={styles.botao}
          onPress={() => navigation.navigate('Localizacao')}
        >
          <Text style={styles.botaoTexto}>+ Novo evento</Text>
        </RectButton>

        <RectButton style={styles.botaoApagarTodos} onPress={limparTudo}>
          <Text style={styles.botaoTexto}>Limpar todos</Text>
        </RectButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 48,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  semEventos: {
    textAlign: 'center',
    marginTop: 32,
    color: '#666',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2, //sombra no Android
    shadowColor: '#000', //sombra no iOS
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitulo: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  prejuizos: {
    fontSize: 13,
    color: '#666',
    marginTop: 6,
  },
  rightActionContainer: {
    backgroundColor: '#ff3b30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    marginBottom: 12,
    borderRadius: 8,
    marginLeft: -8,
  },
  actionIconWrapper: {
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 4,
  },
  botaoContainer: {
    marginTop: 'auto',
  },
  botao: {
    backgroundColor: '#007aff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  botaoApagarTodos: {
    backgroundColor: '#ff3b30',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default PanoramaGeralScreen;
