import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const LoginScreen = ({ navigation }) => {
  const [initializing, setInitializing] = useState(true);
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((user) => {
      if (user) {
        // Optional: Handle user state if needed
      }
      if (initializing) setInitializing(false);
    });
    return subscriber; // Unsubscribe on unmount
  }, [initializing]);

  // Initialize Google Sign-In
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: 'User', // Replace with your webClientId from Google Developers Console
    });
  }, []);

  const login = () => {
    if (!phoneOrEmail || !password) {
      setErrorMessage('Vui lòng nhập số điện thoại hoặc email và mật khẩu!');
      return;
    }
    setLoading(true);
    if (validateEmail(phoneOrEmail)) {
      // Login with email and password
      auth()
        .signInWithEmailAndPassword(phoneOrEmail, password)
        .then(() => {
          console.log('User signed in!');
          navigation.navigate('ProfileScreen'); // Chuyển đến ProfileScreen
        })
        .catch(handleFirebaseAuthError)
        .finally(() => setLoading(false));
    } else if (validatePhoneNumber(phoneOrEmail)) {
      setErrorMessage('Đăng nhập bằng số điện thoại chưa được hỗ trợ trong demo này.');
      setLoading(false);
    } else {
      setErrorMessage('Email hoặc số điện thoại không hợp lệ!');
      setLoading(false);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[0-9]{10,12}$/;
    return phoneRegex.test(phone);
  };

  const handleFirebaseAuthError = (error) => {
    switch (error.code) {
      case 'auth/invalid-email':
        setErrorMessage('Email không hợp lệ!');
        break;
      case 'auth/wrong-password':
        setErrorMessage('Mật khẩu không đúng!');
        break;
      case 'auth/user-not-found':
        setErrorMessage('Tài khoản không tồn tại!');
        break;
      default:
        setErrorMessage('Đăng nhập thất bại! Vui lòng thử lại.');
        break;
    }
  };

  const googleLogin = async () => {
    setLoading(true);
    try {
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
      navigation.navigate('ProfileScreen'); // Chuyển đến ProfileScreen
    } catch (error) {
      setErrorMessage('Đăng nhập Google thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/img/image.png')}
      style={styles.container}
    >
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="angle-left" size={20} color="black" />
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
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Icon
              name={showPassword ? 'eye-slash' : 'eye'}
              size={20}
              color="#333"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPasswordScreen')}>
          <Text style={styles.forgotPasswordText}>QUÊN MẬT KHẨU</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={login} disabled={loading}>
          {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.loginButtonText}>ĐĂNG NHẬP</Text>}
        </TouchableOpacity>

        <View style={styles.separatorContainer}>
          <Text style={styles.separatorText}>HOẶC</Text>
        </View>

        <TouchableOpacity style={styles.googleButton} onPress={googleLogin} disabled={loading}>
          {loading ? <ActivityIndicator size="small" color="#4285F4" /> : (
            <>
              <Icon name="google" size={20} color="#4285F4" />
              <Text style={styles.googleButtonText}>Đăng nhập bằng Google</Text>
            </>
          )}
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
    marginRight: 5,
  },
  signupText: {
    color: '#FF6347',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
