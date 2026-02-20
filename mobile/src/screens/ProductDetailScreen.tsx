import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { apiRequest } from '../api';
import { useAuth } from '../state/AuthContext';

function ProductDetailScreen({ route }) {
  const { id } = route.params;
  const { token, user, setFavorites } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      setError('');
      try {
        const data = await apiRequest(`/products/${id}`, { token });
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id, token]);

  const isFavorite = useMemo(
    () => (user?.favorites || []).some((item) => item.toString() === id),
    [id, user]
  );

  const onFavoriteToggle = async () => {
    try {
      const data = await apiRequest(`/products/${id}/favorite`, {
        method: isFavorite ? 'DELETE' : 'POST',
        token
      });
      await setFavorites(data.favorites);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 20 }} />;
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error || 'Product not found'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      <Text style={styles.description}>{product.description}</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable style={[styles.button, isFavorite && styles.buttonActive]} onPress={onFavoriteToggle}>
        <Text style={styles.buttonText}>{isFavorite ? 'Remove Favorite' : 'Add Favorite'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8fafc'
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12
  },
  description: {
    color: '#334155',
    lineHeight: 22,
    marginBottom: 20
  },
  error: {
    color: '#be123c',
    marginBottom: 12
  },
  button: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center'
  },
  buttonActive: {
    backgroundColor: '#e11d48'
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700'
  }
});

export default ProductDetailScreen;
