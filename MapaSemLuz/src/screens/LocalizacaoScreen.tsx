import React, { useState, useEffect } from 'react';
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
import * as Location from 'expo-location';
import { ListaStackParamList } from '../navigation/AppNavigator';

type LocalizacaoNavProp = StackNavigationProp<ListaStackParamList, 'Localizacao'>;

interface Props {
  navigation: LocalizacaoNavProp;
}

const LocalizacaoScreen: React.FC<Props> = ({ navigation }) => {
  const [localizacao, setLocalizacao] = useState<string>('');
  const [loadingGeo, setLoadingGeo] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissão Negada',
          'Precisamos de permissão para converter o endereço em coordenadas.'
        );
      }
    })();
  }, []);

  const irParaTempo = async () => {
    if (!localizacao.trim()) {
      Alert.alert('Erro', 'Preencha a localização afetada.');
      return;
    }

    setLoadingGeo(true);
    try {
      const resultados = await Location.geocodeAsync(localizacao);
      if (!resultados || resultados.length === 0) {
        Alert.alert(
          'Endereço não encontrado',
          'Não foi possível encontrar coordenadas para esse endereço.'
        );
        setLoadingGeo(false);
        return;
      }

      const { latitude, longitude } = resultados[0];
      setLoadingGeo(false);

      navigation.navigate('TempoInterrupcao', {
        localizacao,
        latitude,
        longitude,
      });
    } catch (error) {
      setLoadingGeo(false);
      Alert.alert(
        'Erro ao geocodificar',
        'Houve um problema ao converter o endereço em coordenadas.'
      );
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Localização Atingida (bairro, cidade ou CEP):</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Bairro Centro, Cidade Y ou 01234-567"
        value={localizacao}
        onChangeText={setLocalizacao}
        autoCapitalize="words"
      />

      {loadingGeo ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#007aff" />
          <Text style={{ marginLeft: 8 }}>Obtendo coordenadas…</Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.botao} onPress={irParaTempo}>
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
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LocalizacaoScreen;
