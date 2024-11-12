// ManageCourts.js
import React, { useState, useEffect } from 'react';
import { db } from './firebase-config';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";

function ManageCourts() {
  const [courts, setCourts] = useState([]);
  const [newCourt, setNewCourt] = useState({ name: '', location: '', capacity: '', price: '' });

  useEffect(() => {
    const fetchCourts = async () => {
      const querySnapshot = await getDocs(collection(db, "courts"));
      const courtsList = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setCourts(courtsList);
    };
    fetchCourts();
  }, []);

  const handleAddCourt = async () => {
    await addDoc(collection(db, "courts"), { ...newCourt });
    setNewCourt({ name: '', location: '', capacity: '', price: '' });
  };

  const handleUpdateCourt = async (courtID, updatedData) => {
    const courtRef = doc(db, "courts", courtID);
    await updateDoc(courtRef, updatedData);
  };

  const handleDeleteCourt = async (courtID) => {
    const courtRef = doc(db, "courts", courtID);
    await deleteDoc(courtRef);
  };

  return (
    <div>
      <h2>Manage Courts</h2>
      <form onSubmit={e => e.preventDefault()}>
        <input
          type="text"
          value={newCourt.name}
          onChange={e => setNewCourt({ ...newCourt, name: e.target.value })}
          placeholder="Court Name"
        />
        <input
          type="text"
          value={newCourt.location}
          onChange={e => setNewCourt({ ...newCourt, location: e.target.value })}
          placeholder="Location"
        />
        <input
          type="number"
          value={newCourt.capacity}
          onChange={e => setNewCourt({ ...newCourt, capacity: e.target.value })}
          placeholder="Capacity"
        />
        <input
          type="number"
          value={newCourt.price}
          onChange={e => setNewCourt({ ...newCourt, price: e.target.value })}
          placeholder="Price"
        />
        <button onClick={handleAddCourt}>Add Court</button>
      </form>

      <ul>
        {courts.map(court => (
          <li key={court.id}>
            {court.name} - {court.location} - {court.capacity} - {court.price}
            <button onClick={() => handleUpdateCourt(court.id, { name: 'Updated Court' })}>Update</button>
            <button onClick={() => handleDeleteCourt(court.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageCourts;
