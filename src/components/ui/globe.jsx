import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import ThreeGlobe from "three-globe";
import countries from "@/data/globe.json";

function GlobeScene({ globeConfig, data }) {
  const globeRef = useRef();
  const { scene } = useThree();

  useEffect(() => {
  const globe = new ThreeGlobe()
    .hexPolygonsData(countries.features)
    .hexPolygonResolution(3)
    .hexPolygonMargin(0.7)
    .showAtmosphere(globeConfig.showAtmosphere)
    .atmosphereColor(globeConfig.atmosphereColor)
    .atmosphereAltitude(globeConfig.atmosphereAltitude)
    .hexPolygonColor(() => globeConfig.polygonColor || "rgba(255,255,255,0.7)");

  // Arc setup
  if (data?.length) {
    globe
      .arcsData(data)
      .arcColor('color')
      .arcAltitude('arcAlt')
      .arcStroke(0.5)
      .arcDashLength(0.4)
      .arcDashGap(2)
      .arcDashInitialGap(() => Math.random() * 2)
      .arcDashAnimateTime(globeConfig.arcTime || 1000);
  }

  const globeMaterial = globe.globeMaterial();
  globeMaterial.color = new THREE.Color(globeConfig.globeColor || "#1d072e");
  globeMaterial.emissive = new THREE.Color(globeConfig.emissive || "#000");
  globeMaterial.emissiveIntensity = globeConfig.emissiveIntensity || 0.1;
  globeMaterial.shininess = globeConfig.shininess || 0.9;

  scene.add(globe);
  globeRef.current = globe;

  return () => {
    scene.remove(globe);
  };
}, [scene, globeConfig, data]);


  return null;
}

export function Globe({ globeConfig = {}, data = [] }) {
  return (
    <div style={{ width: "100%", height: "500px" }}>
      <Canvas camera={{ position: [0, 0, 300], fov: 45 }}>
        <ambientLight />
        <pointLight position={[100, 100, 100]} />
        <OrbitControls />
        <GlobeScene globeConfig={globeConfig} data={data} />
      </Canvas>
    </div>
  );
}
