import React from "react";
import { Canvas, } from "@react-three/fiber";
import { Environment, OrbitControls, useEnvironment } from "@react-three/drei";
import * as THREE from "three";
import { MeshReflectorMaterial } from "@react-three/drei/materials/MeshReflectorMaterial";

// Lanes (linhas do fretboard)
const lanes = [-1.5, -0.5, 0.5, 1.5];

const envMap = useEnvironment(
    ['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'],
    { path: '/cube/pisa/' }
);

const Line = ({ start, end }) => {
  const ref = React.useRef();
  React.useLayoutEffect(() => {
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

const Scene = ({ notes }) => {
  return (
    <Canvas camera={{ position: [0, 2, 6], fov: 55 }}>
      <ambientLight intensity={0.8} />
      <spotLight position={[5, 5, 5]} angle={0.2} />
      <OrbitControls />

      {/* Renderiza as notas que vêm do Game.js */}
      {notes.map((note) => (
        <mesh key={note.id} position={[note.lane, 2, -5]}>
          <boxGeometry args={[0.3, 0.3, 0.2]} />
          <meshStandardMaterial color="red" />
        </mesh>
      ))}

      {/* Fretboard */}
      <mesh position={[0, -1, -5]} rotation={[1.8, 0, 0]}>
        <boxGeometry args={[7, 50, 0.2]} />
        <MeshReflectorMaterial color="brown" />
      </mesh>

      {/* Linhas das lanes */}
      {lanes.map((lane) => (
        <Line key={lane} start={[lane, 2, -5]} end={[lane, -1, 5]} />
      ))}

    </Canvas>
  );
};

export default Scene;
