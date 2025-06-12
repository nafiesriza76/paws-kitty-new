import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

const CAT_COUNT = 10;

const names = ["Mochi", "Luna", "Simba", "Oreo", "Coco", "Milo", "Ginger", "Pumpkin"];
const colors = ["White", "Black", "Tabby", "Gray", "Orange", "Calico", "Tortoiseshell"];
const genders = ["Male", "Female"];

const generateCatProfile = () => {
  return {
    img: `https://cataas.com/cat?${Date.now() + Math.random()}`, // from Cataas ✅
    name: names[Math.floor(Math.random() * names.length)],
    color: colors[Math.floor(Math.random() * colors.length)],
    gender: genders[Math.floor(Math.random() * genders.length)]
  };
};

const App = () => {
  const [cats, setCats] = useState([]);
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState([]);
  const [finished, setFinished] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);

  useEffect(() => {
    loadCats();
  }, []);

  const loadCats = () => {
    const newCats = [];
    for (let i = 0; i < CAT_COUNT; i++) {
      newCats.push(generateCatProfile());
    }
    setCats(newCats);
    setIndex(0);
    setLiked([]);
    setFinished(false);
  };

  const handleSwipe = (direction) => {
    setSwipeDirection(direction);
    if (direction === 'right') {
      setLiked([...liked, cats[index]]);
    }

    setTimeout(() => {
      setSwipeDirection(null);
      const nextIndex = index + 1;
      if (nextIndex >= cats.length) {
        setFinished(true);
      } else {
        setIndex(nextIndex);
      }
    }, 10);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('left'),
    onSwipedRight: () => handleSwipe('right'),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  const restart = () => {
    setCats([]); // clear first to trigger loading state
    setTimeout(loadCats, 200); // reload with delay
  };

  return (
    <div className="app">
      <h1>Paws & Preferences <span role="img" aria-label="paw">🐾</span></h1>
      <p className="intro-text">Swipe through adorable cats and discover your favorites!</p>

      {!finished && cats.length > 0 && cats[index] ? (
        <AnimatePresence>
          <motion.div
            key={index}
            className="card"
            {...handlers}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{
              opacity: 0,
              x: swipeDirection === 'right' ? 300 : -300,
              scale: 0.9
            }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            {swipeDirection === 'right' && <div className="badge like">LIKE 🐾</div>}
            {swipeDirection === 'left' && <div className="badge nope">NOPE 🙀</div>}

            <div className="card-img-wrapper">
              <img src={cats[index].img} alt="Cat" className="swipe-img" />
            </div>

            <div className="cat-details">
            <p className="cat-name">{cats[index].name}</p>
            <p className={`cat-meta ${cats[index].gender.toLowerCase()}`}>
            {cats[index].gender} • {cats[index].color}
            </p>
            </div>
            <p className="swipe-instruction">👈 Swipe left to skip | Swipe right to like! 👉</p>
          </motion.div>
        </AnimatePresence>
      ) : finished ? (
        <div className="summary">
          <h2 className="liked-title">You liked {liked.length} cats! 🐱💖</h2>
          <div className="liked-gallery">
            {liked.map((cat, i) => (
              <div key={i}>
                <img src={cat.img} alt={`Liked Cat ${i}`} />
                <p>{cat.name} • {cat.gender} • {cat.color}</p>
              </div>
            ))}
          </div>
          <button className="retry-btn" onClick={restart}>Try Again</button>
        </div>
      ) : (
        <p className="loading-text">🐾 Summoning some adorable cats...</p>
      )}
    </div>
  );
};

export default App;
