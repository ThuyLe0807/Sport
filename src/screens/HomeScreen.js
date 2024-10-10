import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import Section from '../components/Section'; 
import firestore from '@react-native-firebase/firestore';

const HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [yard, setYard] = useState([]);

  useEffect(() => {
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
            setYard(yards); // Sửa từ setService thành setYard
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

  const handleOrder = (item) => {
    console.log("Dat san", item);
    // Điều hướng đến màn hình chi tiết
    // navigation.navigate('ChiTietScreen', { service: item });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* // tim kiem */}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Section style={{ backgroundColor: '#F5F5F5' }}>
          {yard.length > 0 ? ( // Sửa từ service.length thành yard.length
            <FlatList
              data={yard} // Sửa từ service thành yard
              renderItem={({ item }) => (
                <View style={styles.itemContainer}>
                  <Image source={{ uri: item.image }} style={styles.image} />
                  <Text style={styles.name}>{item.Name}</Text>
                  <Text style={styles.address}>{item.Address}</Text>
                  <TouchableOpacity style={styles.detailButton} onPress={() => handleOrder(item)}>
                    <Text style={styles.detailButtonText}>Dat san</Text>
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={item => item.key}
              numColumns={2}
              columnWrapperStyle={styles.columnWrapper}
            />
          ) : (
            <Text>No yards available.</Text>
          )}
        </Section>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 5,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 5,
    marginBottom: 10,
  },
  name: { // Sửa tên thuộc tính cho chính xác
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  address: { // Sửa tên thuộc tính cho chính xác
    fontSize: 14,
    color: '#333',
  },
  detailButtonText: {
    color: '#5314E6',
    fontSize: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  scrollContainer: {
    flexGrow: 1,
  },
});

export default HomeScreen;
