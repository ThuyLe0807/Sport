// ManageUsers.js
import React, { useState, useEffect } from 'react';
import { db } from './firebase-config';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', role: '', email: '', phone: '' });

  // Lấy dữ liệu người dùng từ Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersList = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setUsers(usersList);
    };
    fetchUsers();
  }, []);

  // Thêm người dùng
  const handleAddUser = async () => {
    await addDoc(collection(db, "users"), { ...newUser });
    setNewUser({ name: '', role: '', email: '', phone: '' }); // Reset form
  };

  // Cập nhật người dùng
  const handleUpdateUser = async (userID, updatedData) => {
    const userRef = doc(db, "users", userID);
    await updateDoc(userRef, updatedData);
  };

  // Xóa người dùng
  const handleDeleteUser = async (userID) => {
    const userRef = doc(db, "users", userID);
    await deleteDoc(userRef);
  };

  return (
    <div>
      <h2>Manage Users</h2>
      <form onSubmit={e => e.preventDefault()}>
        <input
          type="text"
          value={newUser.name}
          onChange={e => setNewUser({ ...newUser, name: e.target.value })}
          placeholder="Name"
        />
        <input
          type="text"
          value={newUser.role}
          onChange={e => setNewUser({ ...newUser, role: e.target.value })}
          placeholder="Role"
        />
        <input
          type="email"
          value={newUser.email}
          onChange={e => setNewUser({ ...newUser, email: e.target.value })}
          placeholder="Email"
        />
        <input
          type="text"
          value={newUser.phone}
          onChange={e => setNewUser({ ...newUser, phone: e.target.value })}
          placeholder="Phone"
        />
        <button onClick={handleAddUser}>Add User</button>
      </form>
      
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} - {user.role}
            <button onClick={() => handleUpdateUser(user.id, { name: 'Updated Name' })}>Update</button>
            <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageUsers;
