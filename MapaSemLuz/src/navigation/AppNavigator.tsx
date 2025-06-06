import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from '@react-navigation/bottom-tabs';


import { MaterialIcons } from '@expo/vector-icons';
import PanoramaGeralScreen from '../screens/PanoramaGeralScreen';
import LocalizacaoScreen from '../screens/LocalizacaoScreen';
import TempoInterrupcaoScreen from '../screens/TempoInterrupcaoScreen';
import PrejuizosScreen from '../screens/PrejuizosScreen';
import MapScreen from '../screens/MapScreen';
import EventDetailScreen from '../screens/EventDetailScreen';
import RecomendacoesScreen from '../screens/RecomendacoesScreen';

export type ListaStackParamList = {
  PanoramaGeral: undefined;
  Localizacao: undefined;
  TempoInterrupcao: {
    localizacao: string;
    latitude: number;
    longitude: number;
  };
  Prejuizos: {
    localizacao: string;
    latitude: number;
    longitude: number;
    tempoInterrupcao: string;
  };
};

export type MapaStackParamList = {
  MapScreen: undefined;
  EventDetail: {
    id: string;
    localizacao: string;
    latitude: number;
    longitude: number;
    tempoInterrupcao: string;
    prejuizos: string;
    dataRegistro: string;
  };
};

export type RecomendacoesStackParamList = {
  Recomendacoes: undefined;
};

export type TabParamList = {
  MapaTab: { screen: string; params?: any } | undefined;
  ListaTab: undefined;
  RecomTab: undefined;
};

const ListaStack = createStackNavigator<ListaStackParamList>();
const MapaStack = createStackNavigator<MapaStackParamList>();
const RecomStack = createStackNavigator<RecomendacoesStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function ListaStackScreen() {
  return (
    <ListaStack.Navigator
      initialRouteName="PanoramaGeral"
      screenOptions={{ headerShown: false }}
    >
      <ListaStack.Screen
        name="PanoramaGeral"
        component={PanoramaGeralScreen}
      />
      <ListaStack.Screen
        name="Localizacao"
        component={LocalizacaoScreen}
      />
      <ListaStack.Screen
        name="TempoInterrupcao"
        component={TempoInterrupcaoScreen}
      />
      <ListaStack.Screen
        name="Prejuizos"
        component={PrejuizosScreen}
      />
    </ListaStack.Navigator>
  );
}

function MapaStackScreen() {
  return (
    <MapaStack.Navigator
      initialRouteName="MapScreen"
      screenOptions={{ headerShown: false }}
    >
      <MapaStack.Screen
        name="MapScreen"
        component={MapScreen}
      />
      <MapaStack.Screen
        name="EventDetail"
        component={EventDetailScreen}
      />
    </MapaStack.Navigator>
  );
}

function RecomStackScreen() {
  return (
    <RecomStack.Navigator
      screenOptions={{ headerShown: false }}
    >
      <RecomStack.Screen
        name="Recomendacoes"
        component={RecomendacoesScreen}
      />
    </RecomStack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="MapaTab"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName: React.ComponentProps<typeof MaterialIcons>['name'] = 'map';
            //Icones para cada aba
            if (route.name === 'MapaTab') {
              iconName = 'map';
            } else if (route.name === 'ListaTab') {
              iconName = 'playlist-add-check';
            } else if (route.name === 'RecomTab') {
              iconName = 'lightbulb';
            }

            return <MaterialIcons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007aff',
          tabBarInactiveTintColor: '#999',
          tabBarLabelStyle: { fontSize: 12 },
          headerShown: false,
        })}
      >
        <Tab.Screen
          name="MapaTab"
          component={MapaStackScreen}
          options={{
            title: 'Mapa',
          }}
        />
        <Tab.Screen
          name="ListaTab"
          component={ListaStackScreen}
          options={{
            title: 'Lista',
          }}
        />
        <Tab.Screen
          name="RecomTab"
          component={RecomStackScreen}
          options={{
            title: 'Recomendações',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
