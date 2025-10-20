// import React from "react";
// import { Canvas } from "@react-three/fiber";
// import { OrbitControls, Environment, Stage } from "@react-three/drei";
// import CandleModel from "../../../public/models/Candle.glb";

// const CandleViewer = () => {
//   return (
//     <div className="w-full h-[500px]">
//       <Canvas camera={{ position: [0, 1, 3], fov: 50 }}>
//         {/* Lights */}
//         <ambientLight intensity={0.5} />
//         <directionalLight position={[5, 5, 5]} intensity={1} />
        
//         {/* Model */}
//         <Stage environment="city" intensity={0.6}>
//           <CandleModel scale={1} />
//         </Stage>

//         {/* Controls */}
//         <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
//       </Canvas>
//     </div>
//   );
// };

// export default CandleViewer;
