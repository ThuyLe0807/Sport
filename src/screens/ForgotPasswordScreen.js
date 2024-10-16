import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [code, setCode] = useState(''); // Verification code

  // Gửi email đặt lại mật khẩu
  const handleResetPassword = () => {
    if (!email) {
      Alert.alert('Lỗi', 'Vui lòng nhập email.');
      return;
    }

    auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        Alert.alert('Thành công', 'Email đặt lại mật khẩu đã được gửi. Kiểm tra hộp thư của bạn!');
      })
      .catch((error) => {
        console.error(error);
        Alert.alert('Lỗi', 'Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại.');
      });
  };

  // Đăng nhập với số điện thoại và gửi OTP
  async function signInWithPhoneNumber() {
    if (!phoneNumber) {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại.');
      return;
    }
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirm(confirmation); // Lưu lại trạng thái xác nhận
    } catch (error) {
      console.log('Lỗi khi gửi OTP: ', error);
      Alert.alert('Lỗi', 'Không thể gửi mã OTP. Vui lòng thử lại.');
    }
  }

  // Xác nhận mã OTP
  async function confirmCode() {
    try {
      await confirm.confirm(code);
      Alert.alert('Thành công', 'Số điện thoại đã được xác nhận!');
    } catch (error) {
      console.log('Mã OTP không hợp lệ: ', error);
      Alert.alert('Lỗi', 'Mã OTP không hợp lệ.');
    }
  }

  return (
    <View style={styles.container}>
      {/* Nút trở về */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="angle-left" size={30} color="#000" />
      </TouchableOpacity>

      <Text style={styles.headerText}>Quên Mật Khẩu</Text>

      {/* Nhập email để đặt lại mật khẩu */}
      <TextInput
        style={styles.input}
        placeholder="Nhập email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Nhập số điện thoại để xác minh bằng OTP */}
      <TextInput
        style={styles.input}
        placeholder="Nhập số điện thoại"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      <TouchableOpacity style={styles.resetButton} onPress={handleResetPassword}>
        <Text style={styles.resetButtonText}>Gửi email đặt lại mật khẩu</Text>
      </TouchableOpacity>

      {/* Nhập mã OTP và xác nhận */}
      {confirm && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Nhập mã OTP"
            value={code}
            onChangeText={setCode}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.resetButton} onPress={confirmCode}>
            <Text style={styles.resetButtonText}>Xác nhận mã OTP</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  backButton: {
    position: 'absolute',
    top: 40, // Can adjust this value to fit better with your UI (padding from the top)
    left: 20, // Padding from the left
    zIndex: 1, // Make sure it's on top of other elements
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
  resetButton: {
    backgroundColor: '#49A65A',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  resetButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ForgotPasswordScreen;
