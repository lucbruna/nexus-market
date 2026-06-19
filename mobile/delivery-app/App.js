import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'

export default function App() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>NEXUS Market</Text>
        <Text style={styles.subtitle}>App do Entregador</Text>
      </View>
      <View style={styles.kpiRow}>
        <View style={styles.kpi}><Text style={styles.kpiValue}>3</Text><Text style={styles.kpiLabel}>Entregas Hoje</Text></View>
        <View style={styles.kpi}><Text style={styles.kpiValue}>2</Text><Text style={styles.kpiLabel}>Pendentes</Text></View>
      </View>
      {[1, 2].map(i => (
        <View key={i} style={styles.delivery}>
          <View style={styles.deliveryHeader}><Text style={styles.deliveryTitle}>Entrega #{i}</Text><Text style={styles.deliveryStatus}>Pendente</Text></View>
          <Text style={styles.deliveryInfo}>Cliente: Fulano de Tal</Text>
          <Text style={styles.deliveryInfo}>Rua Exemplo, 123 - Centro</Text>
          <Text style={styles.deliveryInfo}>R$ {(Math.random() * 100 + 20).toFixed(2)}</Text>
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d1117', padding: 16 },
  header: { marginBottom: 24, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '800', color: '#22c55e' },
  subtitle: { fontSize: 14, color: '#8b949e' },
  kpiRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  kpi: { flex: 1, backgroundColor: '#161b22', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#30363d', alignItems: 'center' },
  kpiValue: { fontSize: 24, fontWeight: '800', color: '#22c55e' },
  kpiLabel: { fontSize: 11, color: '#6e7681', marginTop: 4 },
  delivery: { backgroundColor: '#161b22', padding: 16, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#30363d' },
  deliveryHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  deliveryTitle: { fontSize: 15, fontWeight: '700', color: '#e6edf3' },
  deliveryStatus: { color: '#f59e0b', fontWeight: '600', fontSize: 12 },
  deliveryInfo: { color: '#8b949e', fontSize: 13, marginBottom: 2 },
})
