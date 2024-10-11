import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome'; // Sử dụng thư viện Icon

const FavoriteScreen = () => {
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const subscriber = firestore()
            .collection('Yard')
            .where('Favorite', '==', true) // Lấy danh sách sân yêu thích
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
        const updatedFavoriteStatus = !item.Favorite; // Đảo ngược trạng thái yêu thích

        try {
            await firestore()
                .collection('Yard')
                .doc(item.key)
                .update({ Favorite: updatedFavoriteStatus }); // Cập nhật trạng thái "Favorite" trong Firestore

            // Cập nhật lại danh sách sân yêu thích sau khi trạng thái thay đổi
            setFavorites(prevFavorites => 
                prevFavorites.filter(favorite => favorite.key !== item.key)
            );
        } catch (error) {
            console.log('Error updating favorite status: ', error);
        }
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
                                <Text style={styles.name}>{item.Name}</Text>
                                <Text style={styles.address}>{item.Address}</Text>
                            </View>

                            <TouchableOpacity 
                                style={styles.favoriteButton} 
                                onPress={() => handleFavoriteToggle(item)} // Xử lý khi nhấn vào nút "tym"
                            >
                                <Icon 
                                    name={item.Favorite ? "heart" : "heart-o"} // Hiển thị "heart" nếu là yêu thích, "heart-o" nếu không
                                    size={24} 
                                    color={item.Favorite ? "red" : "black"} 
                                />
                            </TouchableOpacity>
                        </View>
                    )}
                    keyExtractor={item => item.key}
                />
            ) : (
                <Text>Không có sân yêu thích nào.</Text>
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
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
        flexDirection: 'column',
        justifyContent: 'center',
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
    favoriteButton: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
});

export default FavoriteScreen;
