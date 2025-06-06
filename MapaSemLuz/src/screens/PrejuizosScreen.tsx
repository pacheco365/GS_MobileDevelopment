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
import { adicionarEvento, EventoFaltaEnergia } from '../services/storage';

type PrejuizosNavProp = StackNavigationProp<ListaStackParamList, 'Prejuizos'>;
type PrejuizosRouteProp = RouteProp<ListaStackParamList, 'Prejuizos'>;

interface Props {
  navigation: PrejuizosNavProp;
  route: PrejuizosRouteProp;
}

const PrejuizosScreen: React.FC<Props> = ({ navigation, route }) => {
  const { localizacao, latitude, longitude, tempoInterrupcao } = route.params;
  const [prejuizos, setPrejuizos] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);

  const salvarEvento = async () => {
    if (!prejuizos.trim()) {
      Alert.alert('Erro', 'Descreva os prejuízos causados.');
      return;
    }

    setSaving(true);

    const novoEvento: EventoFaltaEnergia = {
      id: Date.now().toString(),
      localizacao,
      tempoInterrupcao,
      prejuizos,
      dataRegistro: new Date().toISOString(),
      latitude,
      longitude,
    };

    await adicionarEvento(novoEvento);
    setSaving(false);

    Alert.alert('Sucesso', 'Evento salvo com sucesso!', [
      {
        text: 'OK',
        onPress: () => navigation.navigate('PanoramaGeral'),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Descreva os prejuízos observados:</Text>
      <TextInput
        style={[styles.input, { height: 120 }]}
        placeholder="Ex: Residências sem eletricidade, comércio fechado, alimentos estragados etc."
        value={prejuizos}
        onChangeText={setPrejuizos}
        multiline
      />

      {saving ? (
        <ActivityIndicator size="small" color="#28a745" />
      ) : (
        <TouchableOpacity style={styles.botao} onPress={salvarEvento}>
          <Text style={styles.botaoTexto}>Salvar e Concluir</Text>
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
    borderWidth: 1,
    borderColor: '#ccc',
    textAlignVertical: 'top',
    marginBottom: 24,
  },
  botao: {
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  botaoTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default PrejuizosScreen;
