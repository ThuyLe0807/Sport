import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const WelcomeScreen = () => {
  const navigation = useNavigation(); // Sử dụng hook useNavigation để điều hướng

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/img/image.png')}
        style={styles.image}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>FOBA | ĐẶT SÂN ONLINE</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.loginButton} 
              onPress={() => navigation.navigate('LoginScreen')} // Chuyển sang màn hình Login khi nhấn
            >
              <Text style={styles.buttonText}>Đăng Nhập</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.registerButton}
             onPress={() => navigation.navigate('SigninScreen')}
            
            >
              <Text style={styles.buttonText}>Đăng Kí</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <Text style={styles.loginPrompt}>Đăng nhập để xem lịch</Text>
        </View>
      </ImageBackground>
    </View>
  );
};

export default WelcomeScreen;

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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%', // Adjusted width to ensure proper spacing
  },
  loginButton: {
    backgroundColor: '#49A65A',
    borderColor: 'black',
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginRight: 10,
    borderRadius: 5,
  },
  registerButton: {
    backgroundColor: 'white',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: 'black',
    fontSize: 14,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginPrompt: {
    color: 'white',
    fontSize: 18,
  },
});
