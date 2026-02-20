import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { apiRequest } from '../api';
import { useAuth } from '../state/AuthContext';

function ProductsScreen({ navigation }) {
  const { token, user, logout, setFavorites } = useAuth();
  const [products, setProducts] = useState([]);
  const [queryInput, setQueryInput] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const favoritesSet = useMemo(() => new Set((user?.favorites || []).map((item) => item.toString())), [user]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest(`/products?page=${page}&limit=8&q=${encodeURIComponent(query)}`, { token });
      setProducts(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, query, token]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const onToggleFavorite = async (productId, isFavorite) => {
    try {
      const data = await apiRequest(`/products/${productId}/favorite`, {
        method: isFavorite ? 'DELETE' : 'POST',
        token
      });
      await setFavorites(data.favorites);
    } catch (err) {
      setError(err.message);
    }
  };

  const renderItem = ({ item }) => {
    const isFavorite = favoritesSet.has(item._id);
    return (
      <Pressable style={styles.card} onPress={() => navigation.navigate('ProductDetail', { id: item._id })}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDesc} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.rowBetween}>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          <Pressable onPress={() => onToggleFavorite(item._id, isFavorite)}>
            <Text style={[styles.favorite, isFavorite && styles.favoriteActive]}>♥</Text>
          </Pressable>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Products</Text>
        <Pressable onPress={logout}>
          <Text style={styles.logout}>Logout</Text>
        </Pressable>
      </View>

      <View style={styles.searchRow}>
        <TextInput
          value={queryInput}
          onChangeText={setQueryInput}
          placeholder="Search"
          style={styles.searchInput}
        />
        <Pressable
          style={styles.searchButton}
          onPress={() => {
            setPage(1);
            setQuery(queryInput);
          }}
        >
          <Text style={styles.searchButtonText}>Go</Text>
        </Pressable>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ gap: 12, paddingBottom: 16 }}
          ListFooterComponent={
            <View style={styles.paginationRow}>
              <Pressable
                disabled={pagination.page <= 1}
                onPress={() => setPage((p) => Math.max(1, p - 1))}
                style={[styles.pageButton, pagination.page <= 1 && styles.disabled]}
              >
                <Text>Prev</Text>
              </Pressable>
              <Text>
                {pagination.page}/{Math.max(1, pagination.totalPages)}
              </Text>
              <Pressable
                disabled={pagination.page >= pagination.totalPages}
                onPress={() => setPage((p) => p + 1)}
                style={[styles.pageButton, pagination.page >= pagination.totalPages && styles.disabled]}
              >
                <Text>Next</Text>
              </Pressable>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 14,
    backgroundColor: '#f8fafc'
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  heading: {
    fontSize: 24,
    fontWeight: '700'
  },
  logout: {
    color: '#0f172a',
    fontWeight: '600'
  },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  searchButton: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 14
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: '600'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  cardTitle: {
    fontWeight: '700',
    marginBottom: 6
  },
  cardDesc: {
    color: '#475569',
    marginBottom: 8
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  price: {
    fontWeight: '700'
  },
  favorite: {
    color: '#94a3b8',
    fontSize: 20
  },
  favoriteActive: {
    color: '#f43f5e'
  },
  error: {
    color: '#be123c',
    marginBottom: 8
  },
  paginationRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  pageButton: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fff'
  },
  disabled: {
    opacity: 0.5
  }
});

export default ProductsScreen;
