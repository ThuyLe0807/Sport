import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, ScrollView, TextInput, Linking, PermissionsAndroid } from 'react-native';
import Section from '../components/Section'; 
import firestore from '@react-native-firebase/firestore';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/FontAwesome';

const HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [yard, setYard] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null); // To store the user's current location

  useEffect(() => {
    // Request permission and get current location
    const requestLocationPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "This app needs access to your location to find nearby yards.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setCurrentLocation({ latitude, longitude });
            },
            (error) => {
              console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
          );
        } else {
          console.log("Location permission denied");
        }
      } catch (err) {
        console.warn(err);
      }
    };

    requestLocationPermission();

    const subscriber = firestore()
      .collection('Yard')
      .onSnapshot(
        querySnapshot => {
          if (querySnapshot && !querySnapshot.empty) {
            const yards = [];
            querySnapshot.forEach(documentSnapshot => {
              yards.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
              });
            });
            setYard(yards);
          } else {
            console.log('No yards found');
          }
          setLoading(false);
        },
        error => {
          console.log('Error fetching data: ', error);
          setLoading(false);
        }
      );

    return () => subscriber();
  }, []);

  const handleView = (item) => {
    navigation.navigate('DetailScreen', { yard: item });
  };

  const handleBook = (item) => {
    navigation.navigate('BookingScreen', { yard: item });
  };

  const handleFavorite = async (item) => {
    const updatedFavoriteStatus = !item.Favorite;

    try {
      await firestore()
        .collection('Yard')
        .doc(item.key)
        .update({ Favorite: updatedFavoriteStatus });

      setYard(prevYards =>
        prevYards.map(yard =>
          yard.key === item.key ? { ...yard, Favorite: updatedFavoriteStatus } : yard
        )
      );
    } catch (error) {
      console.log('Error updating favorite status: ', error);
    }
  };

  const handleNavigateToFavorite = () => {
    navigation.navigate('FavoriteScreen');
  };

  const handleOpenMap = (Latitude, Longitude) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${Latitude},${Longitude}`;
    Linking.openURL(url);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const filteredYards = yard.filter(yard =>
    yard.Name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm sân..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity onPress={handleNavigateToFavorite}>
          <Icon name="heart" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Section>
          {filteredYards.length > 0 ? (
            <FlatList
              data={filteredYards}
              renderItem={({ item }) => (
                <View style={styles.itemContainer}>
                  <Image source={{ uri: item.Image }} style={styles.image} />
                  <View style={styles.textContainer}>
                    <TouchableOpacity style={styles.detailButton} onPress={() => handleView(item)}>
                      <Text style={styles.name}>{item.Name}</Text>
                      <TouchableOpacity onPress={() => handleOpenMap(item.Latitude, item.Longitude)}>
                        <Text style={styles.address}>{item.Address}</Text>
                      </TouchableOpacity>
                    </TouchableOpacity>

                    {/* Nút Đặt Sân */}
                    <TouchableOpacity style={styles.orderButton} onPress={() => handleBook(item)}>
                      <Text style={styles.detailButtonText}>Đặt sân</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity style={styles.favoriteButton} onPress={() => handleFavorite(item)}>
                    <Icon name="heart" size={24} color={item.Favorite ? 'red' : 'white'} />
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={item => item.key}
            />
          ) : (
            <Text style={styles.noYardText}>Không có sân nào.</Text>
          )}
        </Section>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#49A65A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    flex: 1,
    marginRight: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#3A8948',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 5,
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
    color: '#000000',
  },
  address: {
    fontSize: 14,
    color: '#333',
    textDecorationLine: 'underline', // Gạch chân
    fontStyle: 'italic', // In nghiêng
  },
  orderButton: {
    backgroundColor: '#FDF8B1',
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
  detailButtonText: {
    color: '#5314E6',
    fontSize: 16,
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
  },
});

export default HomeScreen;   
