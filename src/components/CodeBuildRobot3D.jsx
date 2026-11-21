 "use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, ContactShadows, Environment, Html, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function RobotModel() {
  const root = useRef();
  const { scene } = useGLTF("../../public/models/codebuild-robot.glb");

  // Clone so this component can animate its own copy safely.
  const robot = useMemo(() => scene.clone(true), [scene]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!root.current) return;

    // Friendly idle motion: gentle floating and a small side-to-side turn.
    root.current.position.y = Math.sin(t * 1.5) * 0.07;
    root.current.rotation.y = Math.sin(t * 0.65) * 0.10;

    // Subtle head/antenna movement.
    const headParts = [
      "head_shell", "face_screen", "face_border", "face_screen_inner",
      "left_eye", "right_eye", "left_eye_glint", "right_eye_glint",
      "smile_0", "smile_1", "smile_2", "smile_3",
      "ear_pod_-1", "ear_dark_-1", "ear_light_-1",
      "ear_pod_1", "ear_dark_1", "ear_light_1",
      "antenna_stem", "antenna_tip", "head_top_accent", "head_top_glow"
    ];
    for (const name of headParts) {
      const mesh = robot.getObjectByName(name);
      if (mesh) mesh.rotation.y = Math.sin(t * 1.1) * 0.035;
    }

    // A small waving gesture. The model parts are separate named meshes.
    const wave = Math.sin(t * 3.0) * 0.13;
    for (const name of ["right_forearm", "right_wrist", "right_palm",
                        "finger_0", "finger_1", "finger_2", "finger_3", "thumb"]) {
      const mesh = robot.getObjectByName(name);
      if (mesh) mesh.rotation.z = wave;
    }

    // Blink the eyes briefly every few seconds.
    const blinkCycle = t % 4.8;
    const blink = blinkCycle > 0.12 && blinkCycle < 0.24
      ? 0.12
      : blinkCycle > 0.28 && blinkCycle < 0.36
        ? 0.45
        : 1;
    for (const name of ["left_eye", "right_eye", "left_eye_glint", "right_eye_glint"]) {
      const mesh = robot.getObjectByName(name);
      if (mesh) mesh.scale.y = blink;
    }
  });

  return (
    // The source model is Z-up, so rotate it to Three.js Y-up.
    <group ref={root} rotation={[-Math.PI / 2, 0, 0]}>
      <Center>
        <primitive object={robot} />
      </Center>
    </group>
  );
}

function Loader() {
  return (
    <Html center>
      <span style={{ color: "#168cff", font: "600 14px system-ui" }}>Loading robot…</span>
    </Html>
  );
}

export default function CodeBuildRobot3D({
  height = 520,
  className = "",
}) {
  return (
    <div className={className} style={{ width: "100%", height, position: "relative" }}>
      <Canvas
        camera={{ position: [0, 0.5, 8.5], fov: 34 }}
        dpr={[1, 1.75]}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={1.35} />
        <directionalLight position={[4, 7, 5]} intensity={2.2} />
        <pointLight position={[-4, 2, 3]} intensity={1.2} color="#168cff" />
        <Suspense fallback={<Loader />}>
          <Environment preset="city" />
          <RobotModel />
          <ContactShadows position={[0, -2.45, 0]} opacity={0.28} scale={5} blur={2.5} />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload("../../public/models/codebuild-robot.glb");
