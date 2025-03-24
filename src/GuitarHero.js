import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const lanes = [-1.5, -0.5, 0.5, 1.5];

let soundGuitar = new Audio('/songs/defy/guitar.ogg');
let soundFret = new Audio('/songs/defy/song.ogg');
let sounds = [];

//const envMap = useEnvironment({ path: "/cube/pisa/" });

const Line = ({ start, end }) => {
  const ref = useRef();
  useLayoutEffect(() => {
    ref.current.geometry.setFromPoints(
      [start, end].map((point) => new THREE.Vector3(...point))
    );
  }, [start, end]);
  return (
    <line ref={ref}>
      <bufferGeometry />
      <lineBasicMaterial color="white" linewidth={4} />
    </line>
  );
};

const Note = ({ lane, onHit }) => {
  const noteRef = useRef();
  useFrame(() => {
    if (noteRef.current) {
      noteRef.current.position.y -= 0.05;
      noteRef.current.position.z += 0.1;

      if (noteRef.current.position.y < -2) {  //&& noteRef.current.position.y < -6) {
        onHit(noteRef.current.position.x);
      }
    }
  });

  return (
    <mesh ref={noteRef} position={[lane, 2, -5]}>
      <boxGeometry args={[0.3, 0.3, 0.2]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
};

const GuitarHero = () => {
  const [notes, setNotes] = useState([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const lane = lanes[Math.floor(Math.random() * lanes.length)];
      setNotes((prev) => [...prev, { id: Date.now(), lane }]);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const handleKeyPress = (event) => {
    const keyMap = { a: -1.5, s: -0.5, d: 0.5, f: 1.5 };
    if (keyMap[event.key]) {
      setNotes((prev) =>
        prev.filter((note) => {
          if (Math.abs(note.lane - keyMap[event.key]) < 0.2) {
            setScore((prev) => prev + 100);
            
            console.log(`handleKeyPress: ${event.key}`)
            
            sounds = {
                "a": { lane: `${note.lane}`, fileName: "/sounds/crunch1.ogg" },
                "s": { lane: `${note.lane}`, fileName: "/sounds/crunch2.ogg" },
                "d": { lane: `${note.lane}`, fileName: "/sounds/crunch3.ogg" },
                "f": { lane: `${note.lane}`, fileName: "/sounds/crunch4.ogg" },
                //"g": { lane: `${note.lane}`, fileName: "/sounds/crunch5.ogg" }
            };

            console.log(sounds[event.key].fileName)

            new Audio(sounds[event.key].fileName).play();
            
            return false;
          }
          return true;
        })
      );
    }
  };

  const startGame = () => {
    soundGuitar.play();
    soundFret.play();
  }

  const pauseGame = () => {
    soundGuitar.pause();
    soundFret.pause();
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <div>
      <h1>Web Frets</h1>
      <h2>Score: {score}</h2>
      <button onClick={startGame}>Start</button>
      <button onClick={pauseGame}>Pause</button>
      <Canvas camera={{ position: [0, 2, 5], fov: 55 }}>
        <ambientLight intensity={0.8} />
        <spotLight position={[5, 5, 5]} angle={0.2} />

        {notes.map((note) => (
          <Note key={note.id} lane={note.lane} onHit={() => {}} />
        ))}

        <mesh position={[0, -1, -5]} rotation={[1.8, 0, 0]}>
          <boxGeometry args={[7, 50, 0.2]} />
          <meshToonMaterial intensity="0.9" color="brown" />
        </mesh>

        {lanes.map((lane) => (
          <Line
            key={lane}
            start={[lane, 2, -5]}
            end={[lane, -1, 5]}
          />
        ))}
      </Canvas>
    </div>
  );
};

export default GuitarHero;
