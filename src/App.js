
import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

const CAT_COUNT = 10;

const App = () => {
  const [cats, setCats] = useState([]);
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState([]);
  const [finished, setFinished] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);

  useEffect(() => {
    const fetchCats = async () => {
      const newCats = [];
      for (let i = 0; i < CAT_COUNT; i++) {
        newCats.push(`https://cataas.com/cat?${Date.now() + i}`);
      }
      setCats(newCats);
    };
    fetchCats();
  }, []);

 const handleSwipe = (direction) => {
  setSwipeDirection(direction); // track for exit animation
  if (direction === 'right') {
    setLiked([...liked, cats[index]]);
  }

  setTimeout(() => {
    setSwipeDirection(null); // clear for next card
    const nextIndex = index + 1;
    if (nextIndex >= cats.length) {
      setFinished(true);
    } else {
      setIndex(nextIndex);
    }
  }, 10); // small delay helps the exit animation kick in
};

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('left'),
    onSwipedRight: () => handleSwipe('right'),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  const restart = () => {
    const newCats = [];
    for (let i = 0; i < CAT_COUNT; i++) {
      newCats.push(`https://cataas.com/cat?${Date.now() + i}`);
    }
    setCats(newCats);
    setIndex(0);
    setLiked([]);
    setFinished(false);
  };

  return (
    <div className="app">
      <h1>Paws & Preferences <span role="img" aria-label="paw">🐾</span></h1>
      <p className="intro-text">Swipe through adorable cats and discover your favorites!</p>

      {!finished && cats.length > 0 ? (
        <AnimatePresence>
         <motion.div
              key={index}
              className="card"
              {...handlers}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{
                opacity: 0,
                x: swipeDirection === 'right' ? 300 : -300, // 👈 EXIT direction
                scale: 0.9
              }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
            {swipeDirection === 'right' && <div className="badge like">LIKE 🐾</div>}
            {swipeDirection === 'left' && <div className="badge nope">NOPE 🙀</div>}
           <div className="card-img-wrapper">
            <img src={cats[index]} alt="Cat" className="swipe-img" />
          </div>
         <p className="swipe-instruction">👈 Swipe left to skip | 👉 Swipe right to like!</p>
          </motion.div>
        </AnimatePresence>
      ) : finished ? (
        <div className="summary">
          <h2 className="liked-title">You liked {liked.length} cats! 🐱💖</h2>
          <div className="liked-gallery">
            {liked.map((cat, i) => (
              <img key={i} src={cat} alt={`Liked Cat ${i}`} />
            ))}
          </div>
          <button className="retry-btn" onClick={restart}>Try Again</button>
        </div>
      ) : (
        <p>Loading cats...</p>
      )}
    </div>
  );
};

export default App;