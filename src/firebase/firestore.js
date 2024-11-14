// src/firebase/firestore.js
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase'; // Import the firestore instance from your firebase config file

// Function to get user data from Firestore
export async function getUserData(uid) {
  try {
    // Reference to the document in Firestore
    const docRef = doc(db, "users", uid); // 'users' is the collection name
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // If the document exists, return the data
      return docSnap.data();
    } else {
      // Document doesn't exist
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting user data: ", error);
    return null;
  }
}
