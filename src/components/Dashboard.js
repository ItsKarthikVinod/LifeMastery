import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/authContext';
import { useNavigate } from 'react-router-dom';
import HabitTracker from './HabitTracker';
import GoalTracker from './GoalTracker';
import ToDoList from './TodoList';
import { getUserData } from '../firebase/firestore'; // Assuming you have this function
import Journal from './Journal';
import Pomodoro from './Pomodoro';

const Dashboard = () => {
  const { currentUser, userLoggedIn } = useAuth();
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // Fetch user data once logged in
  useEffect(() => {
    if (userLoggedIn && currentUser) {
      // Fetch user data from Firestore
      getUserData(currentUser.uid)
        .then((data) => {
          setUserData(data);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    }
  }, [currentUser, userLoggedIn]);

  if (!userLoggedIn) {
    navigate('/login'); // Redirect to login if not logged in
  }

  return (
    <div className="bg-gradient-to-r from-teal-400 to-blue-500 min-h-screen p-6">
      <div className="p-8 mt-12">
        <div className="text-center mb-6 bg-white shadow-lg rounded-lg p-3">
          <h1 className="text-4xl font-bold text-gray-800">Welcome to your Dashboard</h1>
          <p className="text-gray-600 mt-2 text-lg">Hi, {currentUser.displayName ? currentUser.displayName : currentUser.email}!</p>
        </div>
        
        {/* Dashboard main section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* GoalTracker Component (Largest) */}
          <div className=" border-white col-span-1 lg:col-span-2 p-6 shadow-xl rounded-lg backdrop-blur-lg bg-white/50 transition-transform transform hover:scale-105 hover:shadow-2xl ">
            <GoalTracker userData={userData} />
          </div>

          {/* ToDoList Component (Second largest) */}
          <div className="col-span-1 lg:col-span-1 p-6 shadow-xl rounded-lg backdrop-blur-lg bg-white/30 transition-transform transform hover:scale-105 hover:shadow-2xl">
            <ToDoList userData={userData} />
          </div>

          {/* HabitTracker Component (Smallest) */}
          <div className="col-span-1 lg:col-span-1 p-6 shadow-xl rounded-lg backdrop-blur-lg bg-white/30 transition-transform transform hover:scale-105 hover:shadow-2xl">
            <HabitTracker userData={userData} />
          </div>

          {/* Journal Component */}
          <div className="col-span-1 lg:col-span-2 p-6 shadow-xl rounded-lg backdrop-blur-lg bg-white/40 transition-transform transform hover:scale-105 hover:shadow-2xl">
            <Journal /> {/* Added Journal component */}
          </div>
        </div>

        {/* Pomodoro Timer */}
        <Pomodoro />

        {/* Logout Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/login')}
            className="bg-teal-500 text-white px-6 py-3 rounded-lg shadow hover:bg-teal-400 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
