import AsyncStorage from '@react-native-async-storage/async-storage';

export interface EventoFaltaEnergia {
  id: string;
  localizacao: string;
  tempoInterrupcao: string;
  prejuizos: string;
  dataRegistro: string;
  latitude: number;
  longitude: number;
}

const STORAGE_KEY = '@eventos_falta_energia';

export async function carregarEventos(): Promise<EventoFaltaEnergia[]> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (json !== null) {
      return JSON.parse(json);
    }
    return [];
  } catch (error) {
    console.error('Erro ao carregar eventos:', error);
    return [];
  }
}

export async function adicionarEvento(evento: EventoFaltaEnergia): Promise<void> {
  try {
    const lista = await carregarEventos();
    lista.push(evento);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  } catch (error) {
    console.error('Erro ao adicionar evento:', error);
  }
}

export async function limparEventos(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Erro ao limpar eventos:', error);
  }
}

//Remove pelo ID do evento
export async function removerEvento(idRemover: string): Promise<void> {
  try {
    const lista = await carregarEventos();
    const filtrados = lista.filter((evt) => evt.id !== idRemover);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtrados));
  } catch (error) {
    console.error(`Erro ao remover o evento ${idRemover}:`, error);
  }
}
