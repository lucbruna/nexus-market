import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'

export default function App() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>NEXUS Market</Text>
        <Text style={styles.subtitle}>App do Estoque</Text>
      </View>
      <View style={styles.searchBar}><Text style={{ color: '#6e7681' }}>🔍 Escaneie ou busque um produto...</Text></View>
      {[1, 2, 3, 4, 5, 6].map(i => (
        <View key={i} style={styles.product}>
          <View style={{ flex: 1 }}><Text style={styles.productName}>Produto #{i}</Text><Text style={styles.productSku}>SKU: {String(7891234567890 + i).padStart(13, '0')}</Text></View>
          <View style={styles.stockBadge}><Text style={styles.stockText}>{Math.floor(Math.random() * 50)} un</Text></View>
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
  searchBar: { backgroundColor: '#21262d', padding: 16, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#30363d' },
  product: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#161b22', padding: 14, borderRadius: 8, marginBottom: 6, borderWidth: 1, borderColor: '#30363d' },
  productName: { color: '#e6edf3', fontSize: 14, fontWeight: '600' },
  productSku: { color: '#8b949e', fontSize: 11, marginTop: 2 },
  stockBadge: { backgroundColor: 'rgba(34,197,94,0.15)', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 20 },
  stockText: { color: '#22c55e', fontSize: 12, fontWeight: '600' },
})
