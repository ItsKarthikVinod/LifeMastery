import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase'; // Assuming Firestore is initialized here
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const JournalList = () => {
  const [entries, setEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [filteredEntries, setFilteredEntries] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Fetch journal entries
  useEffect(() => {
    const q = query(collection(db, 'journalEntries'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedEntries = snapshot.docs.map((doc) => doc.data());
      setEntries(fetchedEntries);
      setFilteredEntries(fetchedEntries);
    });

    return unsubscribe; // Cleanup on unmount
  }, []);

  // Filter entries by selected date
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);

    if (e.target.value) {
      const filtered = entries.filter((entry) => {
        const entryDate = new Date(entry.createdAt.seconds * 1000).toLocaleDateString();
        return entryDate === e.target.value;
      });
      setFilteredEntries(filtered);
    } else {
      setFilteredEntries(entries); // Reset to show all entries if no date is selected
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 mt-8">
      <h2 className="text-2xl font-semibold mb-4">Your Journal Entries</h2>

      {/* Date Search Input */}
      <div className="mb-4">
        <label htmlFor="date" className="block text-gray-700 font-medium mb-2">
          Search by Date
        </label>
        <input
          type="date"
          id="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <p>No entries found for the selected date. Try writing a journal entry!</p>
        ) : (
          filteredEntries.map((entry, index) => (
            <div key={index} className="p-4 bg-white shadow-md rounded-md">
              <h3 className="text-xl font-medium">{entry.title}</h3>
              <p className="text-gray-600 mt-2">{entry.content}</p>
              <p className="text-sm text-gray-500 mt-4">{new Date(entry.createdAt?.seconds * 1000).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>

      {/* Go Back to Dashboard Button */}
      <div className="mt-8 text-center">
        <button
          onClick={() => navigate('/dashboard')} // Navigate back to the dashboard
          className="bg-teal-500 text-white px-6 py-3 rounded-lg shadow hover:bg-teal-400 transition"
        >
          Go Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default JournalList;
