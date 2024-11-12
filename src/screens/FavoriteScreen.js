import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/AntDesign'; // Import icon

const FavoriteScreen = () => {
  const [loading, setLoading] = useState(true);
  const [favoriteYards, setFavoriteYards] = useState([]);

  useEffect(() => {
    const fetchFavoriteYards = async () => {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        console.log('No user is logged in.');
        setLoading(false);
        return;
      }

      const userId = currentUser.uid;
      try {
        // Lấy tất cả các sân yêu thích từ Firestore
        const favoriteSnapshot = await firestore()
          .collection('FavoriteField')
          .where('user_id', '==', userId)
          .get();

        if (!favoriteSnapshot.empty) {
          const favoriteIds = favoriteSnapshot.docs.map(doc => doc.data().field_id);
          
          // Lấy thông tin chi tiết của các sân yêu thích từ collection Yard
          const yardSnapshot = await firestore()
            .collection('Yard')
            .where(firestore.FieldPath.documentId(), 'in', favoriteIds)
            .get();

          const yardsData = yardSnapshot.docs.map(doc => ({
            ...doc.data(),
            key: doc.id,
          }));
          setFavoriteYards(yardsData); // Cập nhật dữ liệu sân yêu thích
        }
      } catch (error) {
        console.log('Error fetching favorite yards: ', error);
      }

      setLoading(false);
    };

    fetchFavoriteYards();
  }, []);

  const handleRemoveFavorite = async (yardId) => {
    const currentUser = auth().currentUser;
    if (!currentUser) return;

    try {
      // Xóa sân yêu thích khỏi Firestore
      const favoriteRef = firestore()
        .collection('FavoriteField')
        .where('user_id', '==', currentUser.uid)
        .where('field_id', '==', yardId);

      const snapshot = await favoriteRef.get();
      if (!snapshot.empty) {
        // Nếu tìm thấy, xóa sân yêu thích
        snapshot.forEach(doc => {
          doc.ref.delete(); // Xóa tài liệu khỏi collection FavoriteField
        });

        // Cập nhật lại danh sách sân yêu thích trên UI
        setFavoriteYards(prevState => prevState.filter(yard => yard.key !== yardId));
      }
    } catch (error) {
      console.log('Error removing favorite yard: ', error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      {favoriteYards.length > 0 ? (
        <FlatList
          data={favoriteYards}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.address}>{item.address}</Text>

              {/* Nút xóa khỏi yêu thích */}
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={() => handleRemoveFavorite(item.key)}
              >
                <Icon name="heart" size={24} color="red" />
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={item => item.key}
        />
      ) : (
        <Text style={styles.noFavoritesText}>Không có sân yêu thích nào.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    position: 'relative',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  address: {
    fontSize: 14,
    color: '#555',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 5,
    marginBottom: 10,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  noFavoritesText: {
    textAlign: 'center',
    color: '#555',
    marginTop: 20,
  },
});

export default FavoriteScreen;
