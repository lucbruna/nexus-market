import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'

export default function App() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>NEXUS Market</Text>
        <Text style={styles.subtitle}>App do Dono</Text>
      </View>
      <View style={styles.kpiRow}>
        <View style={styles.kpi}><Text style={styles.kpiValue}>R$ 45.230</Text><Text style={styles.kpiLabel}>Vendas Hoje</Text></View>
        <View style={styles.kpi}><Text style={styles.kpiValue}>89</Text><Text style={styles.kpiLabel}>Pedidos</Text></View>
      </View>
      <View style={styles.kpiRow}>
        <View style={styles.kpi}><Text style={styles.kpiValue}>5</Text><Text style={styles.kpiLabel}>Estoque Baixo</Text></View>
        <View style={styles.kpi}><Text style={styles.kpiValue}>22,5%</Text><Text style={styles.kpiLabel}>Margem</Text></View>
      </View>
      <Text style={styles.sectionTitle}>Últimas Vendas</Text>
      {[1, 2, 3, 4, 5].map(i => (
        <View key={i} style={styles.saleItem}>
          <Text style={styles.saleText}>Venda #{i}</Text>
          <Text style={styles.saleValue}>R$ {(Math.random() * 500 + 10).toFixed(2)}</Text>
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
  kpiRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  kpi: { flex: 1, backgroundColor: '#161b22', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#30363d' },
  kpiValue: { fontSize: 20, fontWeight: '800', color: '#22c55e', fontFamily: 'monospace' },
  kpiLabel: { fontSize: 11, color: '#6e7681', textTransform: 'uppercase', marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#e6edf3', marginBottom: 12, marginTop: 8 },
  saleItem: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#161b22', padding: 12, borderRadius: 8, marginBottom: 6, borderWidth: 1, borderColor: '#30363d' },
  saleText: { color: '#e6edf3', fontSize: 14 },
  saleValue: { color: '#22c55e', fontWeight: '700', fontFamily: 'monospace' },
})
