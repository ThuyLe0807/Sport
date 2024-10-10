// import React, { createContext, useState, useContext } from 'react';
// import { Text } from 'react-native';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [loggedInUserId, setLoggedInUserId] = useState(null);

//     // Ví dụ về một component con để hiển thị thông tin người dùng
//     const DisplayUserInfo = () => {
//         if (!loggedInUserId) return null;
//         return <Text>Logged in user ID: {loggedInUserId}</Text>;
//     };

//     return (
//         <AuthContext.Provider value={{ loggedInUserId }}>
//             {children}
//             <DisplayUserInfo />
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => useContext(AuthContext);
