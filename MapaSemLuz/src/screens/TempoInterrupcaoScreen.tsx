import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { ListaStackParamList } from '../navigation/AppNavigator';

type TempoNavProp = StackNavigationProp<ListaStackParamList, 'TempoInterrupcao'>;
type TempoRouteProp = RouteProp<ListaStackParamList, 'TempoInterrupcao'>;

interface Props {
  navigation: TempoNavProp;
  route: TempoRouteProp;
}

const TempoInterrupcaoScreen: React.FC<Props> = ({ navigation, route }) => {
  const { localizacao, latitude, longitude } = route.params;
  const [tempoInterrupcao, setTempoInterrupcao] = useState<string>('');
  const [loadingNav, setLoadingNav] = useState<boolean>(false);

  const irParaPrejuizos = () => {
    if (!tempoInterrupcao.trim()) {
      Alert.alert('Erro', 'Preencha o tempo de interrupção.');
      return;
    }
    setLoadingNav(true);
    navigation.navigate('Prejuizos', {
      localizacao,
      latitude,
      longitude,
      tempoInterrupcao,
    });
    setLoadingNav(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Tempo estimado/real sem energia (em {localizacao}):
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 3 horas, 2 dias, 45 minutos"
        value={tempoInterrupcao}
        onChangeText={setTempoInterrupcao}
      />

      {loadingNav ? (
        <ActivityIndicator size="small" color="#007aff" />
      ) : (
        <TouchableOpacity style={styles.botao} onPress={irParaPrejuizos}>
          <Text style={styles.botaoTexto}>Próximo</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 48,
    backgroundColor: '#f2f2f2',
    justifyContent: 'flex-start',
  },
  label: { fontSize: 16, marginBottom: 8 },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  botao: {
    backgroundColor: '#007aff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  botaoTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default TempoInterrupcaoScreen;
