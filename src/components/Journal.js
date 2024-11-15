import React, { useState } from 'react';
import { db } from '../firebase/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Journal = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title && content) {
      setIsSubmitting(true);

      try {
        await addDoc(collection(db, 'journalEntries'), {
          title,
          content,
          createdAt: serverTimestamp(),
        });
        setTitle('');
        setContent('');
        alert('Journal entry saved!');
      } catch (error) {
        console.error('Error adding journal entry: ', error);
        alert('Error saving your journal entry.');
      }

      setIsSubmitting(false);
    } else {
      alert('Please fill in both the title and content!');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-center mb-4">Write Your Journal</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            placeholder="Title of your journal"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            rows="6"
            placeholder="Write your thoughts here..."
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-teal-500 text-white py-2 rounded-md hover:bg-teal-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Entry'}
        </button>
      </form>

      {/* Redirection link to Journal List */}
      <div className="mt-4 text-center">
        <Link to="/journal-list" className="text-black-500 rounded bg-white/70 p-2 hover:underline">
          View Your Journal Entries
        </Link>
      </div>
    </div>
  );
};

export default Journal;
