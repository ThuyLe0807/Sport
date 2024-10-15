import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';

const FavoriteScreen = () => {
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const subscriber = firestore()
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
                console.log('Error fetching favorite yards: ', error);
                setLoading(false);
            });

        return () => subscriber();
    }, []);

    const handleFavoriteToggle = async (item) => {
        const updatedFavoriteStatus = !item.Favorite;

        try {
            await firestore()
                .collection('Yard')
                .doc(item.key)
                .update({ Favorite: updatedFavoriteStatus });

            // Cập nhật trạng thái yêu thích của item
            setFavorites(prevFavorites => 
                prevFavorites.map(favorite => 
                    favorite.key === item.key ? { ...favorite, Favorite: updatedFavoriteStatus } : favorite
                )
            );
        } catch (error) {
            console.log('Error updating favorite status: ', error);
        }
    };

    const handleView = (item) => {
        // Thêm xử lý sự kiện khi nhấn vào sân
        console.log('View details for: ', item.Name);
    };

    const handleBook = (item) => {
        // Thêm xử lý sự kiện khi nhấn vào nút "Đặt sân"
        console.log('Order yard: ', item.Name);
        
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
                                    <Text style={styles.address}>{item.Address}</Text>
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
