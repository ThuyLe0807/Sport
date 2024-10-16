import { StyleSheet, Text, View, ImageBackground, Image, FlatList, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native'; 
import firestore from '@react-native-firebase/firestore';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscriber = firestore()
      .collection('User')
      .onSnapshot(
        querySnapshot => {
          if (querySnapshot && !querySnapshot.empty) {
            const fetchedUsers = [];
            querySnapshot.forEach(documentSnapshot => {
              fetchedUsers.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
              });
            });
            setUsers(fetchedUsers);
          } else {
            console.log('No users found');
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

  // Nếu đang load dữ liệu
  if (loading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/img/image.png')}
        style={styles.image}
      >
        {/* Header */}
        <View style={styles.header}>
          {/* Hiển thị danh sách người dùng */}
          <FlatList
            data={users} // Dữ liệu là danh sách người dùng
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.userContainer}
                onPress={() => navigation.navigate('DetailsScreen', { userId: item.key })} // Điều hướng đến màn hình chi tiết
              >
                <Image
                  source={require('../assets/img/avatar.png')} // Ảnh mặc định
                  style={styles.avatar}
                />
                <View style={styles.item}>
                  <Text style={styles.name}>{item.Name}</Text>
                </View>              
              </TouchableOpacity>
            )}
            keyExtractor={item => item.key} // Sử dụng key làm ID duy nhất
          />
        </View>
      </ImageBackground>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#49A65A',
  },
  image: {
    height: '50%',
  },
  header: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Thêm màu nền nhẹ
    borderRadius: 10, // Bo tròn góc
    width: '90%', // Đặt chiều rộng cho userContainer
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#ffffff',
    marginRight: 15,
  },
  name: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
    color: 'white',
  },
});
