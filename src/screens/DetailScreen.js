import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const DetailScreen = ({ route }) => {
    const { yard } = route.params;
    const navigation = useNavigation();
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        // Kiểm tra trạng thái yêu thích của sân từ Firestore khi vào màn hình
        const fetchFavoriteStatus = async () => {
            try {
                const yardDoc = await firestore()
                    .collection('Yard')
                    .doc(yard.key)
                    .get();

                if (yardDoc.exists) {
                    setIsFavorite(yardDoc.data().Favorite || false);
                }
            } catch (error) {
                console.log('Error fetching favorite status: ', error);
            }
        };

        fetchFavoriteStatus();
    }, [yard.key]);

    const handleBack = () => {
        navigation.goBack();
    };

    const handleBook = () => {
        navigation.navigate('BookingScreen', { yard });
    };

    const handleFavoriteToggle = async () => {
        const updatedFavoriteStatus = !isFavorite;

        try {
            await firestore()
                .collection('Yard')
                .doc(yard.key)
                .update({ Favorite: updatedFavoriteStatus });

            setIsFavorite(updatedFavoriteStatus); // Cập nhật trạng thái yêu thích trên UI
        } catch (error) {
            console.log('Error updating favorite status: ', error);
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const halfStars = rating % 1 ? 1 : 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<Icon key={`full-${i}`} name="star" size={20} color="gold" />);
        }

        if (halfStars) {
            stars.push(<Icon key="half" name="star-half-full" size={20} color="gold" />);
        }

        const emptyStars = 5 - fullStars - halfStars;
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<Icon key={`empty-${i}`} name="star-o" size={20} color="gold" />);
        }

        return stars;
    };

    if (!yard) {
        return (
            <View style={styles.container}>
                <Text style={styles.noDataText}>Không có thông tin sân.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Image source={{ uri: yard.Image }} style={styles.detailImage} />

                <View style={styles.item}>
                    <Text style={styles.detailName}>{yard.Name}</Text>

                    <View style={styles.infoContainer}>
                        <Text style={styles.detailAddress}>{yard.Address}</Text>
                        <Text style={styles.detailStatus}>Đánh giá trung bình: {renderStars(yard.Average_rating)}</Text>
                    </View>

                    <Text style={styles.detailRatingsCount}>Số lượt đánh giá: {yard.Ratings_count}</Text>

                    {isFavorite && <Text style={styles.favoriteText}>Đã thêm vào yêu thích!</Text>}
                </View>
            </ScrollView>

            <View style={styles.header}>
                <TouchableOpacity style={styles.iconButton} onPress={handleBack}>
                    <Icon name='angle-left' size={30} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.favoriteButton} onPress={handleFavoriteToggle}>
                    <Icon name={isFavorite ? 'heart' : 'heart-o'} size={30} color={isFavorite ? 'red' : '#000'} />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleBook}>
                <Text style={styles.buttonText}>Đặt sân</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        padding: 20,
    },
    detailImage: {
        width: '100%',
        height: 250,
        borderRadius: 10,
        marginBottom: 10,
    },
    item: {
        padding: 15,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 10,
    },
    detailName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#000',
    },
    infoContainer: {
        marginBottom: 10,
    },
    detailAddress: {
        fontSize: 18,
        color: '#333',
        marginBottom: 5,
    },
    detailStatus: {
        fontSize: 18,
        color: '#467DCF',
        marginBottom: 10,
    },
    detailRatingsCount: {
        fontSize: 16,
        color: '#333',
    },
    header: {
        position: 'absolute',
        top: 40,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        zIndex: 1,
    },
    iconButton: {
        padding: 10,
    },
    favoriteButton: {
        padding: 10,
    },
    button: {
        backgroundColor: '#49A65A',
        borderRadius: 10,
        padding: 15,
        margin: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    noDataText: {
        fontSize: 18,
        color: '#333',
        textAlign: 'center',
        marginTop: 20,
    },
    favoriteText: {
        fontSize: 16,
        color: 'green',
        marginTop: 10,
    },
});

export default DetailScreen;
