import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router
import { db } from '../firebase/firebase';
import { collection, addDoc, getDocs, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { FaEdit, FaTrash, FaCheck } from 'react-icons/fa'; // Import icons

const HabitTracker = () => {
  const [habitName, setHabitName] = useState('');
  const [habits, setHabits] = useState([]);
  
  useEffect(() => {
    fetchHabits();
  }, []);
  
  const fetchHabits = async () => {
    try {
      const q = query(collection(db, 'habits'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const habitData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHabits(habitData);
    } catch (error) {
      console.error('Error fetching habits: ', error);
    }
  };

  const addHabit = async (e) => {
    e.preventDefault();
    if (!habitName) return;
    
    try {
      await addDoc(collection(db, 'habits'), {
        name: habitName,
        completed: false, // Add a completion status field
        timestamp: new Date(),
      });
      setHabitName('');
      fetchHabits(); // Fetch updated data
    } catch (error) {
      console.error('Error adding habit: ', error);
    }
  };

  // Handle habit completion toggle
  const toggleCompletion = async (id, completed) => {
    try {
      const habitRef = doc(db, 'habits', id);
      await updateDoc(habitRef, {
        completed: !completed, // Toggle completion status
      });
      fetchHabits(); // Refresh the list after update
    } catch (error) {
      console.error('Error updating habit completion: ', error);
    }
  };

  // Handle habit deletion
  const deleteHabit = async (id) => {
    try {
      const habitRef = doc(db, 'habits', id);
      await deleteDoc(habitRef);
      fetchHabits(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting habit: ', error);
    }
  };

  // Handle habit editing
  const editHabit = async (id, newName) => {
    if (!newName) return;
    try {
      const habitRef = doc(db, 'habits', id);
      await updateDoc(habitRef, {
        name: newName, // Update the habit name
      });
      fetchHabits(); // Refresh the list after update
    } catch (error) {
      console.error('Error updating habit: ', error);
    }
  };

  return (
    <div className="habit-tracker-container">
      <h2 className="text-2xl font-semibold mb-4">Your Habits</h2>

      <form onSubmit={addHabit} className="mb-6">
        <input
          type="text"
          value={habitName}
          onChange={(e) => setHabitName(e.target.value)}
          className="border p-2 rounded"
          placeholder="Enter your habit"
        />
        <button type="submit" className="ml-2 bg-teal-500 text-white px-4 py-2 rounded">Add Habit</button>
      </form>

      <ul>
        {habits.map((habit) => (
          <li key={habit.id} className="mb-2 p-2 border rounded flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={habit.completed}
                onChange={() => toggleCompletion(habit.id, habit.completed)}
                className="mr-2"
              />
              <span className={habit.completed ? 'line-through' : ''}>{habit.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              {/* Edit button */}
              <button
                onClick={() => {
                  const newName = prompt('Edit Habit', habit.name);
                  if (newName) {
                    editHabit(habit.id, newName);
                  }
                }}
                className="text-teal-500 hover:text-teal-600"
              >
                <FaEdit />
              </button>
              {/* Delete button */}
              <button
                onClick={() => deleteHabit(habit.id)}
                className="text-red-500 hover:text-red-600"
              >
                <FaTrash />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Link to Challenges Page */}
      <div className="mt-6">
        <Link
          to="/challenges" // Navigate to the Challenges page
          className="text-slate-500 hover:text-teal-600 font-semibold"
        >
          Explore Challenges
        </Link>
      </div>
    </div>
  );
};

export default HabitTracker;
