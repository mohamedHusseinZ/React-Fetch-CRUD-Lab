import React, { useState } from "react";
import AdminNavBar from "./AdminNavBar";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";

function App() {
  const [page, setPage] = useState("List");

  return (
    <main>
      <AdminNavBar onChangePage={setPage} />
      {page === "Form" ? <QuestionForm /> : <QuestionList />}
    </main>
  );
}


// App.js
import React, { useState, useEffect } from 'react';
import QuestionList from './QuestionList';
import NewQuestionForm from './NewQuestionForm';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Fetch questions on component mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('http://localhost:4000/questions');
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []); // Empty dependency array ensures the effect runs only once on mount

  // Handle form submission to add a new question
  const handleFormSubmit = async (formData) => {
    try {
      const response = await fetch('http://localhost:4000/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const newQuestion = await response.json();
      setQuestions([...questions, newQuestion]);
      setShowForm(false);
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  // Handle question deletion
  const handleDeleteQuestion = async (id) => {
    try {
      await fetch(`http://localhost:4000/questions/${id}`, {
        method: 'DELETE',
      });

      setQuestions(questions.filter((question) => question.id !== id));
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  // Handle updating correct answer index
  const handleUpdateCorrectIndex = async (id, correctIndex) => {
    try {
      await fetch(`http://localhost:4000/questions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correctIndex }),
      });

      setQuestions((prevQuestions) =>
        prevQuestions.map((question) =>
          question.id === id ? { ...question, correctIndex } : question
        )
      );
    } catch (error) {
      console.error('Error updating correct answer index:', error);
    }
  };

  return (
    <div>
      <h1>Question App</h1>
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Hide Form' : 'New Question'}
      </button>

      {showForm && <NewQuestionForm onSubmit={handleFormSubmit} />}

      <QuestionList
        questions={questions}
        onDelete={handleDeleteQuestion}
        onUpdateCorrectIndex={handleUpdateCorrectIndex}
      />
    </div>
  );
};


export default App;
