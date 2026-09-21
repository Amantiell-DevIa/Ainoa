import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { FlowerHead } from "./Flower";

interface BouquetProps {
  isInteracting: boolean;
  autoRotateSpeed?: number;
  isPaused?: boolean;
}

// Geometría de hoja de tulipán (larga, lanceolada y suavemente curvada)
const createTulipLeafShape = () => {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(-0.06, 0.18, -0.09, 0.45, -0.05, 0.68);
  shape.bezierCurveTo(-0.02, 0.78, 0, 0.82, 0, 0.82);
  shape.bezierCurveTo(0, 0.82, 0.02, 0.78, 0.05, 0.68);
  shape.bezierCurveTo(0.09, 0.45, 0.06, 0.18, 0, 0);

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: 0.014,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 2,
    bevelSize: 0.008,
    bevelThickness: 0.008,
  };

  const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geom.center();
  geom.translate(0, 0.4, 0);

  // Curvar la hoja hacia afuera
  const pos = geom.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const curve = Math.sin((y / 0.82) * Math.PI) * 0.08;
    pos.setZ(i, z - curve);
  }
  geom.computeVertexNormals();
  return geom;
};

// Generador de lazos de tela curvados (lazos reales con forma de gota hueca)
const createBowLoopGeometry = () => {
  const shape = new THREE.Shape();
  // Contorno exterior del bucle
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.06, 0.08, 0.14, 0.08, 0.19, 0.02);
  shape.bezierCurveTo(0.22, -0.04, 0.16, -0.09, 0.09, -0.06);
  shape.bezierCurveTo(0.04, -0.04, 0.01, -0.01, 0, 0);

  // Hueco interior del bucle
  const hole = new THREE.Path();
  hole.moveTo(0.04, 0);
  hole.bezierCurveTo(0.07, 0.04, 0.12, 0.04, 0.15, 0.01);
  hole.bezierCurveTo(0.16, -0.02, 0.12, -0.05, 0.08, -0.02);
  hole.closePath();
  shape.holes.push(hole);

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 0.038, // Ancho de la cinta
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 0.006,
    bevelThickness: 0.006,
  });
  geom.center();
  return geom;
};

// Generador de cintas que caen con corte en "V" (swallowtail)
const createRibbonTailGeometry = (length: number) => {
  const shape = new THREE.Shape();
  const w = 0.038;
  shape.moveTo(-w, 0);
  shape.bezierCurveTo(-w * 0.9, -length * 0.4, -w * 1.05, -length * 0.75, -w, -length);
  shape.lineTo(0, -length + 0.035); // Corte en V
  shape.lineTo(w, -length);
  shape.bezierCurveTo(w * 1.05, -length * 0.75, w * 0.9, -length * 0.4, w, 0);
  shape.closePath();

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 0.008,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 0.004,
    bevelThickness: 0.004,
  });

  // Suave curvatura tridimensional de la cinta que cae
  const pos = geom.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    pos.setZ(i, pos.getZ(i) + Math.sin((-y / length) * Math.PI) * 0.02);
  }
  geom.computeVertexNormals();
  return geom;
};

// Lazo decorativo mejorado: tela suave, nudo natural, bucles y cintas fluidas
const RibbonBow: React.FC<{ position?: [number, number, number] }> = ({
  position = [0, -0.45, 0],
}) => {
  const loopGeometry = useMemo(() => createBowLoopGeometry(), []);
  const tailLeftGeometry = useMemo(() => createRibbonTailGeometry(0.24), []);
  const tailRightGeometry = useMemo(() => createRibbonTailGeometry(0.27), []);

  const ribbonMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#F4B8C5", // Rosa pastel delicado y romántico
        roughness: 0.58,
        metalness: 0.04,
      }),
    []
  );

  return (
    <group position={position}>
      {/* Cinta envolvente que abraza los tallos reunidos */}
      <mesh material={ribbonMaterial} scale={[1.05, 1, 1.05]}>
        <cylinderGeometry args={[0.11, 0.1, 0.11, 24]} />
      </mesh>

      {/* Nudo central redondeado en la parte frontal */}
      <mesh position={[0, 0, 0.11]} scale={[1.25, 0.85, 0.95]} material={ribbonMaterial}>
        <sphereGeometry args={[0.052, 16, 16]} />
      </mesh>

      {/* Bucle izquierdo del lazo de tela */}
      <group
        position={[-0.12, 0.02, 0.11]}
        rotation={[0.18, -0.25, 0.35]}
      >
        <mesh geometry={loopGeometry} material={ribbonMaterial} />
      </group>

      {/* Bucle derecho del lazo de tela */}
      <group
        position={[0.12, 0.02, 0.11]}
        rotation={[0.18, 0.25, -0.35]}
        scale={[-1, 1, 1]}
      >
        <mesh geometry={loopGeometry} material={ribbonMaterial} />
      </group>

      {/* Cinta izquierda que cae suavemente con corte en V */}
      <group
        position={[-0.04, -0.04, 0.12]}
        rotation={[0.18, 0.1, 0.14]}
      >
        <mesh geometry={tailLeftGeometry} material={ribbonMaterial} />
      </group>

      {/* Cinta derecha que cae suavemente con corte en V */}
      <group
        position={[0.04, -0.04, 0.12]}
        rotation={[0.2, -0.12, -0.14]}
      >
        <mesh geometry={tailRightGeometry} material={ribbonMaterial} />
      </group>
    </group>
  );
};

export const Bouquet: React.FC<BouquetProps> = ({
  isInteracting,
  autoRotateSpeed = (Math.PI * 2) / 38,
  isPaused = false,
}) => {
  const bouquetRef = useRef<THREE.Group>(null);
  const leafGeometry = useMemo(() => createTulipLeafShape(), []);

  const stemMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#46632B",
        roughness: 0.75,
        metalness: 0.05,
      }),
    []
  );

  const leafMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#4E6E30",
        roughness: 0.7,
        metalness: 0.05,
      }),
    []
  );

  // 8 flores tipo tulipán: 6 abiertas y exactamente 2 cerradas
  const flowersConfig = useMemo(
    () => [
      // 1. Tulipán central (abierto, dominante)
      {
        id: "center",
        pos: [0, 0.52, 0] as [number, number, number],
        rot: [0.18, 0, 0] as [number, number, number],
        scale: 1.05,
        isOpen: true,
        petalColor: "#FFD53D",
        centerColor: "#E07818",
      },
      // 2. Tulipán frontal (abierto, orientado hacia la cámara)
      {
        id: "front",
        pos: [0, 0.28, 0.42] as [number, number, number],
        rot: [0.5, 0, 0] as [number, number, number],
        scale: 0.98,
        isOpen: true,
        petalColor: "#FFC82A",
        centerColor: "#E07818",
      },
      // 3. Tulipán frontal derecho (abierto)
      {
        id: "front-right",
        pos: [0.36, 0.34, 0.25] as [number, number, number],
        rot: [0.42, -0.65, -0.22] as [number, number, number],
        scale: 0.95,
        isOpen: true,
        petalColor: "#FFD53D",
        centerColor: "#D97706",
      },
      // 4. Tulipán lateral izquierdo (abierto)
      {
        id: "left",
        pos: [-0.44, 0.26, -0.1] as [number, number, number],
        rot: [0.2, 1.25, 0.4] as [number, number, number],
        scale: 0.92,
        isOpen: true,
        petalColor: "#FFD53D",
        centerColor: "#D97706",
      },
      // 5. Tulipán trasero derecho (abierto)
      {
        id: "back-right",
        pos: [0.25, 0.38, -0.36] as [number, number, number],
        rot: [-0.42, -2.1, -0.28] as [number, number, number],
        scale: 0.95,
        isOpen: true,
        petalColor: "#FFD53D",
        centerColor: "#D97706",
      },
      // 6. Tulipán trasero izquierdo (abierto)
      {
        id: "back-left",
        pos: [-0.25, 0.36, -0.36] as [number, number, number],
        rot: [-0.42, 2.1, 0.28] as [number, number, number],
        scale: 0.95,
        isOpen: true,
        petalColor: "#FFC82A",
        centerColor: "#E07818",
      },
      // 7. Tulipán frontal izquierdo (CERRADO - Capullo tierno)
      {
        id: "front-left-closed",
        pos: [-0.34, 0.32, 0.24] as [number, number, number],
        rot: [0.4, 0.62, 0.22] as [number, number, number],
        scale: 0.88,
        isOpen: false, // Cerrada 1
        petalColor: "#FFBE20",
        centerColor: "#D97706",
      },
      // 8. Tulipán lateral derecho (CERRADO - Capullo elegante)
      {
        id: "right-closed",
        pos: [0.44, 0.24, -0.1] as [number, number, number],
        rot: [0.18, -1.25, -0.4] as [number, number, number],
        scale: 0.88,
        isOpen: false, // Cerrada 2
        petalColor: "#FFBE20",
        centerColor: "#E07818",
      },
    ],
    []
  );

  // Tallos continuos y conectados
  const stemsGeometries = useMemo(() => {
    return flowersConfig.map((flower) => {
      const [fx, fy, fz] = flower.pos;
      const p0 = new THREE.Vector3(fx, fy - 0.04, fz);
      const p1 = new THREE.Vector3(fx * 0.55, (fy - 0.45) * 0.5, fz * 0.55);
      const p2 = new THREE.Vector3(fx * 0.12, -0.45, fz * 0.12);
      const p3 = new THREE.Vector3(fx * 0.06, -0.72, fz * 0.06);

      const curve = new THREE.CatmullRomCurve3([p0, p1, p2, p3]);
      return new THREE.TubeGeometry(curve, 20, 0.026, 8, false);
    });
  }, [flowersConfig]);

  // Hojas de tulipán que envuelven los tallos hacia arriba
  const leavesConfig = useMemo(() => {
    return [
      { pos: [0.15, -0.12, 0.22] as [number, number, number], rot: [0.25, -0.4, -0.2] as [number, number, number], scale: 0.85 },
      { pos: [-0.18, -0.1, 0.2] as [number, number, number], rot: [0.28, 0.4, 0.2] as [number, number, number], scale: 0.88 },
      { pos: [0.26, -0.08, -0.1] as [number, number, number], rot: [0.1, -1.2, -0.3] as [number, number, number], scale: 0.82 },
      { pos: [-0.26, -0.08, -0.1] as [number, number, number], rot: [0.1, 1.2, 0.3] as [number, number, number], scale: 0.82 },
      { pos: [0.02, -0.1, -0.26] as [number, number, number], rot: [-0.3, Math.PI, 0] as [number, number, number], scale: 0.86 },
    ];
  }, []);

  useFrame((_, delta) => {
    if (!bouquetRef.current) return;
    if (!isInteracting && !isPaused) {
      bouquetRef.current.rotation.y += autoRotateSpeed * delta;
    }
  });

  return (
    <group ref={bouquetRef} position={[0, -0.17, 0]}>
      {/* 1. Tallos continuos y conectados */}
      {stemsGeometries.map((geom, idx) => (
        <mesh key={`stem-${idx}`} geometry={geom} material={stemMaterial} />
      ))}

      {/* 2. Hojas de tulipán estilizadas */}
      {leavesConfig.map((leaf, idx) => (
        <group
          key={`leaf-${idx}`}
          position={leaf.pos}
          rotation={leaf.rot}
          scale={leaf.scale}
        >
          <mesh geometry={leafGeometry} material={leafMaterial} />
        </group>
      ))}

      {/* 3. Las 8 flores tipo tulipán (6 abiertas y 2 cerradas) */}
      {flowersConfig.map((flower) => (
        <FlowerHead
          key={flower.id}
          position={flower.pos}
          rotation={flower.rot}
          scale={flower.scale}
          isOpen={flower.isOpen}
          petalColor={flower.petalColor}
          centerColor={flower.centerColor}
        />
      ))}

      {/* 4. Lazo decorativo de tela suave mejorado */}
      <RibbonBow position={[0, -0.45, 0]} />
    </group>
  );
};
