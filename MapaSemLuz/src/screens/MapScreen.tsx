// src/screens/MapScreen.tsx
import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useIsFocused } from '@react-navigation/native';
import { carregarEventos, EventoFaltaEnergia } from '../services/storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { MapaStackParamList } from '../navigation/AppNavigator';


type MapNavProp = StackNavigationProp<MapaStackParamList, 'MapScreen'>;
interface Props {
  navigation: MapNavProp;
}

// Define constantes para o mapa
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const MAP_HEIGHT = 200;

const MapScreen: React.FC<Props> = ({ navigation }) => {
  const [eventos, setEventos] = useState<EventoFaltaEnergia[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const isFocused = useIsFocused();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['15%', '60%', '100%'], []);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permissão Negada',
            'Não foi possível obter a localização. Talvez você não consiga ver a distância até eventos.'
          );
          setLoading(false);
          return;
        }

        //obtendo a posição atual do usuário
        const locUsuario = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: locUsuario.coords.latitude,
          longitude: locUsuario.coords.longitude,
        });

        //Carregar eventos do AsyncStorage
        const todosArmazenados = await carregarEventos();

        //Corrigir coordenadas em memória, sem salvar de volta no AsyncStorage
        const eventosCorrigidos: EventoFaltaEnergia[] = [];
        for (let evt of todosArmazenados) {
          let { latitude, longitude } = evt;

          if (
            latitude == null ||
            longitude == null ||
            isNaN(latitude) ||
            isNaN(longitude)
          ) {
            try {
              const resultados = await Location.geocodeAsync(evt.localizacao);
              if (resultados && resultados.length > 0) {
                latitude = resultados[0].latitude;
                longitude = resultados[0].longitude;
                evt = {
                  ...evt,
                  latitude,
                  longitude,
                };
              }
            } catch (err) {
              console.warn(`Falha ao geocodificar evento ${evt.id}:`, err);
            }
          }
          eventosCorrigidos.push(evt);
        }

        setEventos(eventosCorrigidos);
        setLoading(false);
      } catch (error) {
        console.error('Erro em MapScreen:', error);
        Alert.alert('Erro', 'Houve um problema ao carregar o mapa e os eventos.');
        setLoading(false);
      }
    })();
  }, [isFocused]);

  if (loading || userLocation === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007aff" />
        <Text style={{ marginTop: 8 }}>Carregando mapa e eventos…</Text>
      </View>
    );
  }

  // Calcula distância entre usuário e evento
  const calculaDistanciaKm = (evtLat: number, evtLng: number) => {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(evtLat - userLocation.latitude);
    const dLon = toRad(evtLng - userLocation.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(userLocation.latitude)) *
        Math.cos(toRad(evtLat)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  //Renderiza cada item no Bottom Sheet
  const renderBottomItem = ({ item }: { item: EventoFaltaEnergia }) => {
    let dist = NaN;
    if (
      item.latitude != null &&
      item.longitude != null &&
      !isNaN(item.latitude) &&
      !isNaN(item.longitude)
    ) {
      dist = calculaDistanciaKm(item.latitude, item.longitude);
    }
    return (
      <TouchableOpacity
        style={styles.bottomCard}
        onPress={() => {
          navigation.navigate('EventDetail', {
            id: item.id,
            localizacao: item.localizacao,
            latitude: item.latitude!,
            longitude: item.longitude!,
            tempoInterrupcao: item.tempoInterrupcao,
            prejuizos: item.prejuizos,
            dataRegistro: item.dataRegistro,
          });
        }}
      >
        <View style={styles.bottomCardHeader}>
          <Text style={styles.bottomTitulo}>
            {item.localizacao.length > 20
              ? item.localizacao.substring(0, 20) + '…'
              : item.localizacao}
          </Text>
          <Text style={styles.distanciaTexto}>
            {isNaN(dist) ? '— km' : dist.toFixed(1) + ' km'}
          </Text>
        </View>
        <Text style={styles.bottomSubtitulo}>
          Tempo sem energia: {item.tempoInterrupcao}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        showsUserLocation={true}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
      >
        {eventos.map((evt) => (
          <Marker
            key={evt.id}
            coordinate={{
              latitude: evt.latitude!,
              longitude: evt.longitude!,
            }}
            title={evt.localizacao}
            description={`Interrupção: ${evt.tempoInterrupcao}`}
            pinColor="#FF6B6B"
            onPress={() => {
              navigation.navigate('EventDetail', {
                id: evt.id,
                localizacao: evt.localizacao,
                latitude: evt.latitude!,
                longitude: evt.longitude!,
                tempoInterrupcao: evt.tempoInterrupcao,
                prejuizos: evt.prejuizos,
                dataRegistro: evt.dataRegistro,
              });
            }}
          >
            <Callout>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitulo}>{evt.localizacao}</Text>
                <Text style={styles.calloutText}>
                  Tempo: {evt.tempoInterrupcao}
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <BottomSheetFlatList
          data={eventos}
          keyExtractor={(item) => item.id}
          renderItem={renderBottomItem}
          contentContainerStyle={styles.bottomContentContainer}
        />
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calloutContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    elevation: Platform.OS === 'android' ? 4 : 0,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  calloutTitulo: { fontWeight: 'bold', marginBottom: 4, fontSize: 14 },
  calloutText: { fontSize: 12, color: '#333' },

  handleIndicator: {
    backgroundColor: '#ccc',
    width: 40,
  },
  bottomContentContainer: {
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  bottomCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  bottomCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  distanciaTexto: {
    fontSize: 12,
    color: '#777',
  },
  bottomSubtitulo: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
});

export default MapScreen;
