import React, { useMemo } from "react";
import * as THREE from "three";

interface FlowerHeadProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  isOpen?: boolean; // true = tulipán abierto (6 flores), false = tulipán cerrado (2 flores)
  petalColor?: string;
  centerColor?: string;
}

// Generador de pétalo de tulipán con curvatura convexa real (estilo copa de tulipán en arcilla)
const createTulipPetalGeometry = () => {
  const shape = new THREE.Shape();
  // Silueta ancha y redondeada de pétalo de tulipán
  shape.moveTo(0, 0);
  shape.bezierCurveTo(-0.07, 0.08, -0.15, 0.24, -0.13, 0.38);
  shape.bezierCurveTo(-0.1, 0.48, -0.04, 0.52, 0, 0.54);
  shape.bezierCurveTo(0.04, 0.52, 0.1, 0.48, 0.13, 0.38);
  shape.bezierCurveTo(0.15, 0.24, 0.07, 0.08, 0, 0);

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: 0.016,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 2,
    bevelSize: 0.012,
    bevelThickness: 0.012,
  };

  const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geom.center();
  // Trasladar la base del pétalo al punto de rotación
  geom.translate(0, 0.26, 0);

  // Curvar el pétalo en 3D para darle la concavidad de copa del tulipán
  const pos = geom.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    // Curvatura longitudinal (hacia adentro en la base y medio, suave en la punta)
    const normalizedY = Math.max(0, Math.min(1, y / 0.54));
    const longitudinalCurve = Math.sin(normalizedY * Math.PI * 0.9) * 0.075;

    // Curvatura transversal (ahuecado en forma de cuchara)
    const lateralCurve = (x * x) * 0.75;

    pos.setZ(i, z - longitudinalCurve - lateralCurve);
  }

  geom.computeVertexNormals();
  return geom;
};

export const FlowerHead: React.FC<FlowerHeadProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  isOpen = true,
  petalColor = "#FFD53D",
  centerColor = "#E07818",
}) => {
  const petalGeometry = useMemo(() => createTulipPetalGeometry(), []);

  // Material de pétalos: arcilla mate suave y luminosa
  const petalMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: petalColor,
        roughness: 0.62,
        metalness: 0.04,
        side: THREE.DoubleSide,
      }),
    [petalColor]
  );

  // Material de pétalos interiores (ligeramente más cálido y dorado)
  const innerPetalMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isOpen ? "#FFC420" : petalColor,
        roughness: 0.65,
        metalness: 0.04,
        side: THREE.DoubleSide,
      }),
    [isOpen, petalColor]
  );

  const calyxMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#46632B",
        roughness: 0.75,
        metalness: 0.05,
      }),
    []
  );

  const pistilMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: centerColor,
        roughness: 0.75,
        metalness: 0.05,
      }),
    [centerColor]
  );

  // Configuración de los 6 pétalos (3 exteriores y 3 interiores alternados)
  // En tulipanes abiertos: pétalos exteriores inclinados hacia afuera (~38°), interiores erguidos (~22°)
  // En tulipanes cerrados: pétalos abrazándose casi verticales (~10° a 14°)
  const outerTilt = isOpen ? 0.62 : 0.22;
  const innerTilt = isOpen ? 0.36 : 0.14;
  const outerRadius = isOpen ? 0.055 : 0.035;
  const innerRadius = isOpen ? 0.038 : 0.024;

  const outerAngles = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3];
  const innerAngles = [
    Math.PI / 3,
    Math.PI,
    (5 * Math.PI) / 3,
  ];

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Base / cáliz verde redondeado donde se asientan los pétalos */}
      <mesh position={[0, -0.02, 0]} material={calyxMaterial}>
        <cylinderGeometry args={[0.08, 0.04, 0.06, 16]} />
      </mesh>

      {/* Pistilo central y estambres (visibles en los tulipanes abiertos) */}
      {isOpen && (
        <group position={[0, 0.04, 0]}>
          {/* Pistilo central abombado */}
          <mesh position={[0, 0.1, 0]} material={pistilMaterial}>
            <cylinderGeometry args={[0.025, 0.02, 0.16, 12]} />
          </mesh>
          <mesh position={[0, 0.18, 0]} material={pistilMaterial} scale={[1.2, 0.6, 1.2]}>
            <sphereGeometry args={[0.035, 12, 12]} />
          </mesh>

          {/* 6 estambres diminutos alrededor */}
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const a = (i * Math.PI) / 3;
            return (
              <mesh
                key={`stamen-${i}`}
                position={[Math.cos(a) * 0.04, 0.08, Math.sin(a) * 0.04]}
                rotation={[0.1 * Math.cos(a), 0, 0.1 * Math.sin(a)]}
                material={pistilMaterial}
              >
                <cylinderGeometry args={[0.008, 0.006, 0.12, 8]} />
              </mesh>
            );
          })}
        </group>
      )}

      {/* 3 Pétalos Interiores */}
      {innerAngles.map((angle, idx) => (
        <group key={`inner-${idx}`} rotation={[0, angle, 0]} position={[0, 0.01, 0]}>
          <group position={[0, 0, innerRadius]} rotation={[innerTilt, 0, 0]}>
            <mesh geometry={petalGeometry} material={innerPetalMaterial} scale={0.96} />
          </group>
        </group>
      ))}

      {/* 3 Pétalos Exteriores (abrazan o abren la copa del tulipán) */}
      {outerAngles.map((angle, idx) => (
        <group key={`outer-${idx}`} rotation={[0, angle, 0]} position={[0, 0, 0]}>
          <group position={[0, 0, outerRadius]} rotation={[outerTilt, 0, 0]}>
            <mesh geometry={petalGeometry} material={petalMaterial} />
          </group>
        </group>
      ))}
    </group>
  );
};
