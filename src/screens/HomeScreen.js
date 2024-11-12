import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import auth from '@react-native-firebase/auth';

const HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [yards, setYards] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchFavorites = async () => {
      const currentUser = auth().currentUser;
      if (currentUser) {
        const userId = currentUser.uid;
        const favoriteSnapshot = await firestore()
          .collection('FavoriteField')
          .where('user_id', '==', userId)
          .get();

        const favoriteIds = favoriteSnapshot.docs.map(doc => doc.data().field_id);
        setFavorites(favoriteIds); // Lưu các ID sân yêu thích
      }
    };

    fetchFavorites();

    const subscriber = firestore()
      .collection('Yard')
      .onSnapshot(querySnapshot => {
        if (querySnapshot && !querySnapshot.empty) {
          const fetchedYards = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            key: doc.id,
          }));
          setYards(fetchedYards);
        } else {
          console.log('No yards found');
        }
        setLoading(false);
      });

    return () => subscriber();
  }, []);

  const handleFavorite = async item => {
    const currentUser = auth().currentUser;
    if (!currentUser) {
      console.log('No user is logged in.');
      return;
    }

    const userId = currentUser.uid;
    const fieldId = item.key;

    try {
      const favoriteSnapshot = await firestore()
        .collection('FavoriteField')
        .where('user_id', '==', userId)
        .where('field_id', '==', fieldId)
        .get();

      if (favoriteSnapshot.empty) {
        // Nếu sân chưa được yêu thích, thêm vào Firebase
        await firestore().collection('FavoriteField').add({
          user_id: userId,
          field_id: fieldId,
        });
        setFavorites([...favorites, fieldId]); // Cập nhật danh sách yêu thích trong state
      } else {
        // Nếu sân đã có trong yêu thích, xóa khỏi Firebase
        const docId = favoriteSnapshot.docs[0].id;
        await firestore().collection('FavoriteField').doc(docId).delete();
        setFavorites(favorites.filter(favId => favId !== fieldId)); // Cập nhật lại danh sách yêu thích
      }
    } catch (error) {
      console.log('Error updating favorite status: ', error);
    }
  };

  const handleView = item => {
    navigation.navigate('DetailScreen', { yard: item });
  };
  const handleBook = item => {
    navigation.navigate('BookingScreen', { yard: item });
  };
  const filteredYards = yards.filter(yard =>
    yard.name && yard.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm sân..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredYards}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.textContainer}>
              <TouchableOpacity onPress={() => handleView(item)}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.address}>{item.address}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.orderButton} onPress={() => handleBook(item)}>
                <Text style={styles.detailButtonText}>Đặt sân</Text>
              </TouchableOpacity>
            </View>

            {/* Nút yêu thích */}
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => handleFavorite(item)}
            >
              <Icon
                name="heart"
                size={24}
                color={favorites.includes(item.key) ? 'red' : 'white'} // Màu icon thay đổi khi sân yêu thích
              />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={item => item.key}
        ListEmptyComponent={<Text style={styles.noYardText}>Không có sân nào.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#49A65A',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#3A8948',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  address: {
    fontSize: 14,
    color: '#ddd',
    fontStyle: 'italic',
  },
  orderButton: {
    backgroundColor: '#FDF8B1',
    borderRadius: 5,
    padding: 5,
    marginTop: 5,
  },
  detailButtonText: {
    color: '#5314E6',
    fontSize: 14,
    textAlign: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  noYardText: {
    textAlign: 'center',
    color: '#fff',
    marginTop: 20,
  },
});

export default HomeScreen;
