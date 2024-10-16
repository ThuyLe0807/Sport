import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, TouchableOpacity, Linking, PermissionsAndroid } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import Geolocation from 'react-native-geolocation-service';

const FavoriteScreen = ({ navigation }) => { // Thêm navigation vào props
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState([]);
    const [currentLocation, setCurrentLocation] = useState(null);

    useEffect(() => {
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
                            console.error("Error getting location: ", error.message);
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

        const unsubscribe = firestore()
            .collection('Yard')
            .where('Favorite', '==', true)
            .onSnapshot(querySnapshot => {
                const favoriteYards = [];
                querySnapshot.forEach(documentSnapshot => {
                    favoriteYards.push({
                        ...documentSnapshot.data(),
                        key: documentSnapshot.id,
                    });
                });
                setFavorites(favoriteYards);
                setLoading(false);
            }, error => {
                console.error('Error fetching favorite yards: ', error);
                setLoading(false);
            });

        requestLocationPermission();

        return () => unsubscribe(); // Hủy đăng ký khi component unmount
    }, []);

    const handleFavoriteToggle = async (item) => {
        const updatedFavoriteStatus = !item.Favorite;

        try {
            await firestore()
                .collection('Yard')
                .doc(item.key)
                .update({ Favorite: updatedFavoriteStatus });

            setFavorites(prevFavorites =>
                prevFavorites.map(favorite =>
                    favorite.key === item.key ? { ...favorite, Favorite: updatedFavoriteStatus } : favorite
                )
            );
        } catch (error) {
            console.error('Error updating favorite status: ', error);
        }
    };

    const handleView = (item) => {
        navigation.navigate('DetailScreen', { yard: item });
    };

    const handleOpenMap = (latitude, longitude) => {
        const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
        Linking.openURL(url);
    };

    const handleBook = (item) => {
        navigation.navigate('BookingScreen', { yard: item });
      };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            {favorites.length > 0 ? (
                <FlatList
                    data={favorites}
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

                                <TouchableOpacity style={styles.orderButton} onPress={() => handleBook(item)}>
                                    <Text style={styles.detailButtonText}>Đặt sân</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                style={styles.favoriteButton}
                                onPress={() => handleFavoriteToggle(item)}
                            >
                                <Icon
                                    name={item.Favorite ? "heart" : "heart-o"}
                                    size={24}
                                    color={item.Favorite ? 'red' : 'black'}
                                />
                            </TouchableOpacity>
                        </View>
                    )}
                    keyExtractor={item => item.key}
                />
            ) : (
                <Text style={styles.noYardText}>Không có sân yêu thích nào.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#49A65A',
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
        position: 'relative',
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

export default FavoriteScreen;
