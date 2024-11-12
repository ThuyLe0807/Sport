import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, ImageBackground, Alert } from 'react-native';
import { format } from 'date-fns';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const BookingScreen = ({ route, navigation }) => {
  const { yard } = route.params; // Nhận thông tin sân từ route params
  const [bookedSlots, setBookedSlots] = useState({}); // Dữ liệu các slots đã đặt
  const [selectedDate, setSelectedDate] = useState(new Date()); // Ngày chọn
  const [showDatePicker, setShowDatePicker] = useState(false); // Hiển thị hoặc ẩn DatePicker
  const [loading, setLoading] = useState(true); // Biến trạng thái tải dữ liệu

  // Fetch các lịch đặt đã có cho sân
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const snapshot = await firestore()
          .collection('Booking')
          .where('yard_id', '==', yard.id)
          .where('booking_time', '>=', firestore.Timestamp.fromDate(new Date()))
          .get();

        const booked = {};
        snapshot.forEach(doc => {
          const booking = doc.data();
          const court = booking.court; // Tên sân
          const timeSlot = booking.booking_time.toDate().getHours(); // Giờ đã đặt

          if (!booked[court]) booked[court] = [];
          booked[court].push(timeSlot);
        });

        setBookedSlots(booked);
        setLoading(false);
      } catch (error) {
        console.log('Error fetching bookings:', error);
        setLoading(false);
      }
    };

    fetchBookings();
  }, [yard.id]);

  // Toggle trạng thái của một slot khi người dùng click
  const toggleBooking = (court, timeSlot) => {
    const isBooked = bookedSlots[court]?.includes(timeSlot);
    const updatedSlots = isBooked
      ? bookedSlots[court].filter(slot => slot !== timeSlot)
      : [...(bookedSlots[court] || []), timeSlot];

    setBookedSlots({
      ...bookedSlots,
      [court]: updatedSlots,
    });
  };

  // Quay lại trang trước
  const handleBack = () => {
    navigation.goBack();
  };

  // Chọn ngày cho lịch
  const onDateChange = (event, selected) => {
    const currentDate = selected || selectedDate;
    setShowDatePicker(Platform.OS === 'ios');
    setSelectedDate(currentDate);
  };

  // Xem bảng giá
  const handleViewPrice = () => {
    if (yard.price_per_hour && Array.isArray(yard.price_per_hour)) {
      const priceInfo = yard.price_per_hour
        .map(slot => `Từ ${slot.start} đến ${slot.end}: ${slot.price} VND/giờ`)
        .join("\n");

      Alert.alert("Bảng giá", priceInfo);
    } else {
      Alert.alert("Bảng giá", "Không có thông tin về bảng giá cho sân này.");
    }
  };

  // Xác nhận đặt lịch
  const handleBook = async () => {
    const hasBookedSlot = Object.values(bookedSlots).some(slots => slots.length > 0);
  
    if (hasBookedSlot) {
      try {
        const currentUser = auth().currentUser;
        const userId = currentUser ? currentUser.uid : null;
  
        if (!userId) {
          Alert.alert("Lỗi", "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
          return;
        }
  
        let total_price = 0;
  
        // Kiểm tra và tính giá cho các slot đã đặt
        for (const courtName in bookedSlots) {
          if (bookedSlots[courtName].length > 0) {
            bookedSlots[courtName].forEach((slot) => {
              // Kiểm tra giá trị của yard.price_per_hour trước khi tìm kiếm
              if (yard.price_per_hour && Array.isArray(yard.price_per_hour)) {
                const priceInfo = yard.price_per_hour.find(p =>
                  slot >= p.start && slot < p.end
                );
  
                // Nếu tìm thấy giá trị cho slot này, cộng vào tổng
                if (priceInfo) {
                  total_price += priceInfo.price;
                }
              } else {
                console.log(`Không có thông tin giá cho sân: ${courtName}`);
              }
            });
          }
        }
  
        // Kiểm tra giá trị tổng
        if (total_price <= 0) {
          Alert.alert("Lỗi", "Không thể tính giá. Vui lòng kiểm tra lại.");
          return;
        }
  
        const bookingTime = firestore.FieldValue.serverTimestamp();
        const bookingPromises = [];
  
        // Đặt lịch cho các sân và slot
        for (const courtName in bookedSlots) {
          if (bookedSlots[courtName].length > 0) {
            bookedSlots[courtName].forEach((slot) => {
              bookingPromises.push(firestore().collection('Booking').add({
                status: "Đã thanh toán",
                total_price: total_price || 0,
                user_id: userId,
                yard_id: yard.id,
                court: courtName,
                booking_time: bookingTime,
              }));
            });
          }
        }
  
        await Promise.all(bookingPromises);
        Alert.alert("Xác nhận", "Đặt lịch thành công!");
      } catch (error) {
        Alert.alert("Lỗi", "Không thể đặt lịch. Vui lòng thử lại sau.");
        console.error("Lỗi khi đặt lịch:", error);
      }
    } else {
      Alert.alert("Thông báo", "Vui lòng chọn ít nhất một slot trước khi đặt.");
    }
  };

  return (
    <ImageBackground source={require('../assets/img/image.png')} style={styles.container}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.iconButton} onPress={handleBack}>
          <Icon name="angle-left" size={30} color="#000" />
        </TouchableOpacity>

        <Text style={styles.title}>Đặt lịch</Text>

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

        <View>
          <TouchableOpacity onPress={handleViewPrice}>
            <Text style={styles.priceText}>Xem bảng giá</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal>
          <View>
            <View style={styles.row}>
              <Text style={styles.headerCell}>Thời gian</Text>
              {Array.from({ length: 24 }, (_, i) => (
                <Text key={i} style={styles.headerCell}>{i + 1}:00</Text>
              ))}
            </View>

            {Array.from({ length: yard.quantity }, (_, courtIndex) => {
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

        <TouchableOpacity style={styles.confirmButton} onPress={handleBook}>
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
  priceText: {
    color: '#FDF8B1',
    textAlign: 'right',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textDecorationLine: 'underline',
  },
});

export default BookingScreen;
