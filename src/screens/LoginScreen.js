import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import auth from '@react-native-firebase/auth';

const LoginScreen = ({ navigation }) => {
  const [initializing, setInitializing] = useState(true);
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Trạng thái để hiển thị hoặc ẩn mật khẩu

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((user) => {
      if (user) {
        navigation.replace('HomeScreen'); // Nếu người dùng đã đăng nhập, điều hướng về Home
      }
      if (initializing) setInitializing(false);
    });
    return subscriber; // Unsubscribe on unmount
  }, [initializing]);

  if (initializing) return null;

  const login = () => {
    if (!phoneOrEmail || !password) {
      setErrorMessage('Vui lòng nhập số điện thoại hoặc email và mật khẩu!');
      return;
    }

    auth()
      .signInWithEmailAndPassword(phoneOrEmail, password)
      .then(() => {
        console.log('User signed in!');
        navigation.navigate('HomeScreen');
      })
      .catch((error) => {
        if (error.code === 'auth/invalid-email') {
          setErrorMessage('Email không hợp lệ!');
        } else if (error.code === 'auth/wrong-password') {
          setErrorMessage('Mật khẩu không đúng!');
        } else if (error.code === 'auth/user-not-found') {
          setErrorMessage('Tài khoản không tồn tại!');
        } else {
          setErrorMessage('Đăng nhập thất bại! Vui lòng thử lại.');
        }
      });
  };

  return (
    <ImageBackground
      source={require('../assets/img/image.png')}
      style={styles.container}
    >
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="chevron-left" size={20} color="black" />
      </TouchableOpacity>

      <View style={styles.innerContainer}>
        <Text style={styles.headerText}>ĐĂNG NHẬP</Text>

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Số điện thoại hoặc email"
          value={phoneOrEmail}
          onChangeText={(text) => setPhoneOrEmail(text)}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputPassword}
            placeholder="Mật khẩu"
            secureTextEntry={!showPassword} // Nếu `showPassword` là false, mật khẩu sẽ được ẩn
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Icon
              name={showPassword ? 'eye-slash' : 'eye'} // Biểu tượng thay đổi dựa trên trạng thái
              size={20}
              color="#333"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotPasswordText}>QUÊN MẬT KHẨU</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={login}>
          <Text style={styles.loginButtonText}>ĐĂNG NHẬP</Text>
        </TouchableOpacity>

        <View style={styles.separatorContainer}>
          <Text style={styles.separatorText}>HOẶC</Text>
        </View>

        <TouchableOpacity style={styles.googleButton}>
          <Icon name="google" size={20} color="#4285F4" />
          <Text style={styles.googleButtonText}>Đăng nhập bằng Google</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>BẠN CHƯA CÓ TÀI KHOẢN?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SigninScreen')}>
            <Text style={styles.signupText}>ĐĂNG KÍ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 50,
  },
  innerContainer: {
    padding: 20,
    marginHorizontal: 20,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#ffffffaa',
    elevation: 3,
  },
  headerText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    alignSelf: 'center',
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  inputPassword: {
    flex: 1,
    height: 50,
    paddingLeft: 10,
  },
  eyeIcon: {
    paddingRight: 10,
  },
  forgotPasswordText: {
    color: '#FF6347',
    textAlign: 'right',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#49A65A',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  separatorContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  separatorText: {
    fontSize: 16,
    color: '#8e8e8e',
  },
  googleButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
  },
  googleButtonText: {
    marginLeft: 10,
    color: '#4285F4',
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    color: '#000',
  },
  signupText: {
    color: '#FF6347',
    marginLeft: 5,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
