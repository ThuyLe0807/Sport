import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Button, Platform , ImageBackground} from 'react-native';
import { format } from 'date-fns';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import firestore from '@react-native-firebase/firestore';

const BookingScreen = ({ route, navigation }) => {
  const { yard } = route.params;

  const [bookedSlots, setBookedSlots] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Hàm toggle khi đặt hoặc bỏ đặt sân
  const toggleBooking = (court, index) => {
    const isBooked = bookedSlots[court]?.includes(index);
    const newSlots = isBooked
      ? bookedSlots[court].filter(i => i !== index)
      : [...(bookedSlots[court] || []), index];

    setBookedSlots({
      ...bookedSlots,
      [court]: newSlots,
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  // Hàm thay đổi ngày khi người dùng chọn
  const onDateChange = (event, selected) => {
    const currentDate = selected || selectedDate;
    setShowDatePicker(Platform.OS === 'ios'); // Chỉ hiển thị trên iOS sau khi chọn
    setSelectedDate(currentDate); // Cập nhật ngày mới
  };

  return (
    <ImageBackground
      source={require('../assets/img/image.png')}
      style={styles.container}
    >
    <View style={styles.container}>
      {/* Nút Back */}
      <TouchableOpacity style={styles.iconButton} onPress={handleBack}>
        <Icon name="angle-left" size={30} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Đặt lịch</Text>
      
      {/* Hiển thị và thay đổi ngày */}
      <TouchableOpacity style={styles.dateContainer} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.date}>{format(selectedDate, 'E-dd-MM-yyyy')}</Text>
      </TouchableOpacity>
      
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      <ScrollView horizontal>
        <View>
          <View style={styles.row}>
            <Text style={styles.headerCell}>Thời gian</Text>
            {Array.from({ length: 24 }, (_, i) => (
              <Text key={i} style={styles.headerCell}>{i + 1}:00</Text>
            ))}
          </View>

          {/* Lặp qua số lượng sân */}
          {Array.from({ length: yard.Quantity }, (_, courtIndex) => {
            const courtName = `Sân ${courtIndex + 1}`;
            return (
              <View key={courtName} style={styles.row}>
                <Text style={styles.cell}>{courtName}</Text>
                {Array.from({ length: 24 }, (_, colIndex) => {
                  const isBooked = bookedSlots[courtName]?.includes(colIndex);
                  return (
                    <TouchableOpacity 
                      key={colIndex}
                      onPress={() => toggleBooking(courtName, colIndex)}
                      style={[styles.cell, isBooked ? styles.cellBooked : styles.cellAvailable]}
                    />
                  );
                })}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Chú thích ô màu */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.cell, styles.cellBooked, { width: 20, height: 20 }]} />
          <Text style={styles.legendText}>Đã đặt</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.cell, styles.cellBlock, { width: 20, height: 20 }]} />
          <Text style={styles.legendText}>Khóa</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.cell, styles.cellAvailable, { width: 20, height: 20 }]} />
          <Text style={styles.legendText}>Trống</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.confirmButton}>
        <Text style={styles.confirmButtonText}>Xác nhận</Text>
      </TouchableOpacity>
    </View>
    </ImageBackground>
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
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
  },
  // Chỉnh ngày hiển thị sang bên phải
  dateContainer: {
    alignItems: 'flex-end',
  },
  date: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
    width: 150,
    height: 30,
    backgroundColor: "#D9D9D9",
    borderRadius: 5,
    padding: 5,
  },
  row: {
    flexDirection: 'row',
  },
  headerCell: {
    flex: 1,
    padding: 10,
    height: 60,
    width: 60,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#000000',
    backgroundColor: '#B9EBF8',
    borderWidth: 1,
    borderColor: '#000000',
  },
  cell: {
    flex: 1,
    padding: 10,
    textAlign: 'center',
    height: 50,
    width: 60,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#000000',
  },
  cellBooked: {
    backgroundColor: 'red',
  },
  cellBlock: {
    backgroundColor: '#D9D9D9',
  },
  cellAvailable: {
    backgroundColor: 'white',
  },
  // Chú thích
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendText: {
    color: '#ffffff',
    marginLeft: 5,
  },
  confirmButton: {
    backgroundColor: '#FDF8B1',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  confirmButtonText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#5314E6',
  },
});

export default BookingScreen;
