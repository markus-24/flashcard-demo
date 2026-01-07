import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [view, setView] = useState('student'); // 'student' or 'teacher'
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Load cards from Local Storage on startup
  useEffect(() => {
    const savedCards = localStorage.getItem('flashcards');
    if (savedCards) {
      setCards(JSON.parse(savedCards));
    } else {
      // HAWAII THEMED DEFAULTS 🌺
      const defaults = [
        { id: 1, question: "🐠 What is the state fish of Hawaii?", answer: "Humuhumunukunukuapua'a" },
        { id: 2, question: "🤙 What does 'Ohana' mean?", answer: "Family" },
        { id: 3, question: "🌋 What is the name of the volcano on the Big Island?", answer: "Mauna Loa" },
        { id: 4, question: "🌺 What is the state flower?", answer: "Yellow Hibiscus" },
        { id: 5, question: "🍧 What is a popular icy treat in Hawaii?", answer: "Shave Ice" },
        { id: 6, question: "🏝️ Which island is known as 'The Gathering Place'?", answer: "Oahu" }
      ];
      setCards(defaults);
      localStorage.setItem('flashcards', JSON.stringify(defaults));
    }
  }, []);

  // Save to Local Storage helper
  const saveCards = (newCards) => {
    setCards(newCards);
    localStorage.setItem('flashcards', JSON.stringify(newCards));
  };

  const handleAddCard = (e) => {
    e.preventDefault();
    const form = e.target;
    const newCard = {
      id: Date.now(), // simple unique ID
      question: form.question.value,
      answer: form.answer.value,
    };
    saveCards([...cards, newCard]);
    form.reset();
    // alert("Card Added!"); 
  };

  const handleDelete = (id) => {
    const updated = cards.filter(c => c.id !== id);
    saveCards(updated);
    // Adjust index if we deleted the last card
    if (currentIndex >= updated.length) setCurrentIndex(0);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 200); // small delay for animation
  };

  // --- TEACHER VIEW ---
  if (view === 'teacher') {
    return (
      <div className="container admin-theme">
        <header>
            <h1>👩‍🏫 Teacher Dashboard</h1>
            <button onClick={() => setView('student')}>Play Mode ▶️</button>
        </header>
        
        <div className="card-form">
            <h3>Create New Card</h3>
            <form onSubmit={handleAddCard}>
            <input name="question" placeholder="Question" required />
            <input name="answer" placeholder="Answer" required />
            <button type="submit">Add</button>
            </form>
        </div>

        <div className="card-list">
            <h3>Current Cards ({cards.length})</h3>
            {cards.map(card => (
            <div key={card.id} className="list-item">
                <span><b>Q:</b> {card.question}</span>
                <button onClick={() => handleDelete(card.id)}>🗑️</button>
            </div>
            ))}
        </div>
      </div>
    );
  }

  // --- STUDENT VIEW ---
  return (
    <div className="container student-theme">
      <header>
        <h1>⚡ Fun Flashcards ⚡</h1>
        <button className="small-btn" onClick={() => setView('teacher')}>⚙️ Teacher</button>
      </header>

      <div className="game-area">
        {cards.length > 0 ? (
          <>
            <div 
                className={`flashcard ${isFlipped ? 'flipped' : ''}`} 
                onClick={() => setIsFlipped(!isFlipped)}
            >
                <div className="front">
                    {cards[currentIndex].question}
                    <span className="hint">Tap to flip</span>
                </div>
                <div className="back">
                    {cards[currentIndex].answer}
                </div>
            </div>
            <div className="controls">
                <p>Card {currentIndex + 1} of {cards.length}</p>
                <button className="next-btn" onClick={handleNext}>Next Card ➡️</button>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <p>No cards yet! Ask your teacher to add some.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;