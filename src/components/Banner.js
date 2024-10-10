import { View, Text, Image, StyleSheet, FlatList } from 'react-native';
import React from 'react';

const Banner = ({ banners }) => {
  const renderBanner = ({ item }) => (
    <View style={styles.bannerContainer}>
      <Image source={{ uri: item.uri_img }} style={styles.bannerImage} />
    </View>
  );

  return (
    <FlatList
      data={banners}
      renderItem={renderBanner}
      keyExtractor={(item, index) => index.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToAlignment="start"
      snapToInterval={300} // Đặt kích thước của một banner
      decelerationRate="fast"
    />
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    marginRight: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  bannerImage: {
    width: 300, // Thay đổi kích thước của mỗi banner
    height: 150, // Thay đổi kích thước của mỗi banner
  },
});

export default Banner;
