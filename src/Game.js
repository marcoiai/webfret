import React, { useEffect, useState, useRef } from "react";

// Lanes das notas (posição no fretboard)
const lanes = [-1.5, -0.5, 0.5, 1.5];

const Note = ({ lane, onHit }) => {
  const noteRef = useRef();

  useEffect(() => {
    const interval = setInterval(() => {
      if (noteRef.current) {
        noteRef.current.position.y -= 0.05;
        noteRef.current.position.z += 0.1;

        if (noteRef.current.position.y < -6) {
          onHit(noteRef.current.position.x);
        }
      }
    }, 16);

    return () => clearInterval(interval);
  }, [onHit]);

  return (
    <mesh ref={noteRef} position={[lane, 2, -5]}>
      <boxGeometry args={[0.3, 0.3, 0.2]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
};

const Game = ({ onRenderNotes }) => {
  const [notes, setNotes] = useState([]);
  const [score, setScore] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    // Música toca ao interagir
    const playAudio = () => {
      if (audioRef.current) audioRef.current.play();
      window.removeEventListener("click", playAudio);
    };

    window.addEventListener("click", playAudio);

    // Gera notas aleatórias
    const interval = setInterval(() => {
      const lane = lanes[Math.floor(Math.random() * lanes.length)];
      setNotes((prev) => [...prev, { id: Date.now(), lane }]);
    }, 1500);

    return () => {
      clearInterval(interval);
      window.removeEventListener("click", playAudio);
    };
  }, []);

  useEffect(() => {
    onRenderNotes(notes);
  }, [notes, onRenderNotes]);

  const handleKeyPress = (event) => {
    const keyMap = { a: -1.5, s: -0.5, d: 0.5, f: 1.5 };
    if (keyMap[event.key]) {
      setNotes((prev) =>
        prev.filter((note) => {
          if (Math.abs(note.lane - keyMap[event.key]) < 0.2) {
            setScore((prev) => prev + 100);
            let soundFret = new Audio("/sounds/crunch1.ogg");
            soundFret.play();
            return false;
          }
          return true;
        })
      );
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <div>
      <h1>Web Frets</h1>
      <h2>Score: {score}</h2>
      <audio ref={audioRef} src="/songs/defy/song.ogg" preload="auto" />
    </div>
  );
};

export default Game;
