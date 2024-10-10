import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';


// định nghĩa section
const Section = ({ title, children, style }) => {
 return (
   <View style={[styles.container, style]}>
     {title && <Text style={styles.title}>{title}</Text>}
     <View style={styles.content}>
       {children}
     </View>
   </View>
 );
};


// giới hạn ràng buộc kiểu dữ liệu nếu cần thiết.
Section.propTypes = {
 title: PropTypes.string,
 children: PropTypes.node.isRequired,
 style: PropTypes.object,
};


const styles = StyleSheet.create({
 container: {
   marginVertical: 10,
   padding: 15,
   backgroundColor: '#fff',
   borderRadius: 5,
   shadowColor: '#000',
   shadowOpacity: 0.1,
   shadowRadius: 10,
   elevation: 5,
 },
 title: {
   fontSize: 18,
   fontWeight: 'bold',
   marginBottom: 10,
   color:'#000000'
 },
 content: {
   marginTop: 10,
 },
});


export default Section;
