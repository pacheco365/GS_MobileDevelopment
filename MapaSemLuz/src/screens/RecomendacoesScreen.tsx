import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const RecomendacoesScreen: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Recomendações e Boas Práticas</Text>

      <Text style={styles.tituloSecao}>1. Antes da Tempestade</Text>
      <View style={styles.item}>
        <MaterialIcons name="flashlight-on" size={20} color="#007aff" />
        <Text style={styles.texto}>
          Mantenha lanternas e pilhas sobressalentes em locais de fácil acesso.
        </Text>
      </View>
      <View style={styles.item}>
        <MaterialIcons name="water" size={20} color="#007aff" />
        <Text style={styles.texto}>
          Armazene água potável em galões (mínimo de 1 L por pessoa) e alimentos não perecíveis.
        </Text>
      </View>
      <View style={styles.item}>
        <MaterialIcons name="phone-iphone" size={20} color="#007aff" />
        <Text style={styles.texto}>
          Identifique pontos de recarga para celulares (power banks, carregadores veiculares).
        </Text>
      </View>
      <View style={styles.item}>
        <MaterialIcons name="phone-in-talk" size={20} color="#007aff" />
        <Text style={styles.texto}>
          Anote telefones de emergência e da concessionária local.
        </Text>
      </View>

      <Text style={styles.tituloSecao}>2. Durante a Falta de Energia</Text>
      <View style={styles.item}>
        <MaterialIcons name="power-off" size={20} color="#007aff" />
        <Text style={styles.texto}>
          Desligue aparelhos elétricos sensíveis (geladeira, ar-condicionado, computador).
        </Text>
      </View>
      <View style={styles.item}>
        <MaterialIcons name="lightbulb-outline" size={20} color="#007aff" />
        <Text style={styles.texto}>
          Use lanternas de LED em vez de velas, para reduzir riscos de incêndio.
        </Text>
      </View>
      <View style={styles.item}>
        <MaterialIcons name="kitchen" size={20} color="#007aff" />
        <Text style={styles.texto}>
          Evite abrir a geladeira/freezer para não perder a refrigeração.
        </Text>
      </View>
      <View style={styles.item}>
        <MaterialIcons name="build" size={20} color="#007aff" />
        <Text style={styles.texto}>
          Se usar gerador, siga o manual e armazene combustível em local ventilado.
        </Text>
      </View>

      <Text style={styles.tituloSecao}>3. Após o Retorno da Energia</Text>
      <View style={styles.item}>
        <MaterialIcons name="check-circle-outline" size={20} color="#007aff" />
        <Text style={styles.texto}>
          Verifique aparelhos antes de ligar novamente (geladeira, equipamentos médicos etc.).
        </Text>
      </View>
      <View style={styles.item}>
        <MaterialIcons name="delete" size={20} color="#007aff" />
        <Text style={styles.texto}>
          Descarte alimentos perecíveis que ficaram mais de 2 h sem refrigeração.
        </Text>
      </View>
      <View style={styles.item}>
        <MaterialIcons name="report-problem" size={20} color="#007aff" />
        <Text style={styles.texto}>
          Se houver danos elétricos (eletrodomésticos queimados), procure assistência técnica.
        </Text>
      </View>
      <View style={styles.item}>
        <MaterialIcons name="photo-camera" size={20} color="#007aff" />
        <Text style={styles.texto}>
          Faça registro dos danos e envie fotos detalhadas à concessionária.
        </Text>
      </View>

      <Text style={styles.tituloSecao}>4. Saúde e Segurança</Text>
      <View style={styles.item}>
        <MaterialIcons name="security" size={20} color="#007aff" />
        <Text style={styles.texto}>
          Mantenha portas e janelas fechadas para evitar acidentes e furtos.
        </Text>
      </View>
      <View style={styles.item}>
        <MaterialIcons name="visibility" size={20} color="#007aff" />
        <Text style={styles.texto}>
          Use lanternas com cuidado—evitando fios soltos ou locais molhados.
        </Text>
      </View>
      <View style={styles.item}>
        <MaterialIcons name="local-hospital" size={20} color="#007aff" />
        <Text style={styles.texto}>
          Cuide de dependentes de aparelhos médicos (respirador, CPAP), tenha bateria extra.
        </Text>
      </View>
      <View style={styles.item}>
        <MaterialIcons name="medical-services" size={20} color="#007aff" />
        <Text style={styles.texto}>
          Mantenha remédios e kit de primeiros socorros acessíveis.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 48,
    backgroundColor: '#f9f9f9',
  },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  tituloSecao: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#007aff',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  texto: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
    lineHeight: 22,
    flex: 1,
    flexWrap: 'wrap',
  },
});

export default RecomendacoesScreen;
