import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'

export default function App() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>NEXUS Market</Text>
        <Text style={styles.subtitle}>App do Gerente</Text>
      </View>
      <View style={styles.menuGrid}>
        {['📊 Dashboard', '👥 Equipe', '📦 Estoque', '💰 Caixa', '📈 Relatórios', '⚙️ Aprovações'].map((item, i) => (
          <View key={i} style={styles.menuItem}><Text style={styles.menuText}>{item}</Text></View>
        ))}
      </View>
      <Text style={styles.sectionTitle}>Pendências</Text>
      <View style={styles.pending}><Text>📍 3 entregas para aprovar</Text></View>
      <View style={styles.pending}><Text>📤 5 contas a pagar hoje</Text></View>
      <View style={styles.pending}><Text>👤 2 solicitações de férias</Text></View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d1117', padding: 16 },
  header: { marginBottom: 24, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '800', color: '#22c55e' },
  subtitle: { fontSize: 14, color: '#8b949e' },
  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  menuItem: { backgroundColor: '#161b22', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#30363d', width: '48%', alignItems: 'center' },
  menuText: { color: '#e6edf3', fontSize: 13, fontWeight: '600' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#e6edf3', marginBottom: 12 },
  pending: { backgroundColor: '#161b22', padding: 14, borderRadius: 8, marginBottom: 6, borderWidth: 1, borderColor: '#30363d' },
})
