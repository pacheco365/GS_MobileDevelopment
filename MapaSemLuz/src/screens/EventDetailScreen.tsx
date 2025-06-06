import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Location from 'expo-location';
import { MapaStackParamList } from '../navigation/AppNavigator';

type EventDetailNavProp = StackNavigationProp<MapaStackParamList, 'EventDetail'>;
type EventDetailRouteProp = RouteProp<MapaStackParamList, 'EventDetail'>;

interface Props {
  navigation: EventDetailNavProp;
  route: EventDetailRouteProp;
}

const { width } = Dimensions.get('window');
const MAP_HEIGHT = 200;

const EventDetailScreen: React.FC<Props> = ({ route }) => {
  const { localizacao, tempoInterrupcao, prejuizos, dataRegistro } = route.params;
  const [eventCoords, setEventCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [distanciaKm, setDistanciaKm] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permissão Negada',
            'Não foi possível obter a localização para calcular a distância até o evento.'
          );
          setLoading(false);
          return;
        }
        const resultados = await Location.geocodeAsync(localizacao);
        if (!resultados || resultados.length === 0) {
          Alert.alert(
            'Não Encontrado',
            'Não foi possível determinar coordenadas para este endereço.'
          );
          setLoading(false);
          return;
        }
        //Obteendo as coordenadas do evento
        const { latitude: evLat, longitude: evLng } = resultados[0];
        setEventCoords({ latitude: evLat, longitude: evLng });

        const locUsuario = await Location.getCurrentPositionAsync({});
        const uLat = locUsuario.coords.latitude;
        const uLng = locUsuario.coords.longitude;
        setUserCoords({ latitude: uLat, longitude: uLng });

        //Calcula a distância entre o usuário e o evento
        const toRad = (x: number) => (x * Math.PI) / 180;
        const R = 6371;
        const dLat = toRad(evLat - uLat);
        const dLon = toRad(evLng - uLng);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRad(uLat)) *
            Math.cos(toRad(evLat)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distanciaCalculada = R * c;

        setDistanciaKm(distanciaCalculada);
        setLoading(false);
      } catch (error) {
        console.error('Erro em EventDetailScreen:', error);
        Alert.alert('Erro', 'Houve um problema ao obter a localização ou calcular a distância.');
        setLoading(false);
      }
    })();
  }, [localizacao]);

  if (loading || eventCoords === null || userCoords === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007aff" />
        <Text style={{ marginTop: 8 }}>Carregando detalhes do evento…</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.titulo}>{localizacao}</Text>
        <Text style={styles.subtitulo}>
          Data de registro: {new Date(dataRegistro).toLocaleString()}
        </Text>
        <Text style={styles.texto}>
          <Text style={styles.label}>Tempo sem energia:</Text> {tempoInterrupcao}
        </Text>
        <Text style={styles.texto}>
          <Text style={styles.label}>Prejuízos:</Text> {prejuizos}
        </Text>
        {distanciaKm !== null && (
          <Text style={[styles.texto, { marginTop: 8 }]}>
            <Text style={styles.label}>Distância até o evento:</Text> {distanciaKm.toFixed(1)} km
          </Text>
        )}
      </View>

      <Text style={styles.headerMapa}>Local exato no mapa</Text>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: eventCoords.latitude,
          longitude: eventCoords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005 * (width / MAP_HEIGHT),
        }}
        showsUserLocation={true}
      >
        <Marker
          coordinate={{
            latitude: eventCoords.latitude,
            longitude: eventCoords.longitude,
          }}
          title={localizacao}
          description={`Interrupção: ${tempoInterrupcao}`}
          pinColor="#FF6B6B"
        />
      </MapView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 48,
    backgroundColor: '#f9f9f9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    marginBottom: 16,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitulo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  label: {
    fontWeight: 'bold',
    color: '#007aff',
  },
  texto: {
    fontSize: 16,
    color: '#555',
    marginBottom: 6,
  },
  headerMapa: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#007aff',
  },
  map: {
    width: '100%',
    height: MAP_HEIGHT,
    borderRadius: 8,
  },
});

export default EventDetailScreen;
