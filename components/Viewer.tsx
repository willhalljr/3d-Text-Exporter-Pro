
import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { FontService } from '../services/fontService';
import { TextSettings, MaterialSettings } from '../types';

interface ViewerProps {
  textSettings: TextSettings;
  materialSettings: MaterialSettings;
  currentFontUrl: string;
  autoRotate: boolean;
}

export interface ViewerRef {
  exportGLB: (filename: string) => void;
  exportImage: (scale?: number) => void;
  importGLB: (file: File) => void;
  resetView: () => void;
}

const Viewer = forwardRef<ViewerRef, ViewerProps>(({ textSettings, materialSettings, currentFontUrl, autoRotate }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    textMesh: THREE.Mesh | THREE.Group | null;
    material: THREE.MeshStandardMaterial;
    textureLoader: THREE.TextureLoader;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);

    const camera = new THREE.PerspectiveCamera(50, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      preserveDrawingBuffer: true,
      alpha: true 
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    containerRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(5, 10, 7.5);
    scene.add(dirLight);

    new RGBELoader()
      .load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/equirectangular/venice_sunset_1k.hdr', (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture;
      });

    const material = new THREE.MeshStandardMaterial({
      color: materialSettings.color,
      metalness: materialSettings.metalness,
      roughness: materialSettings.roughness,
      side: THREE.DoubleSide // Ensure visibility of backfaces if holes are messy
    });

    const textureLoader = new THREE.TextureLoader();

    sceneRef.current = { scene, camera, renderer, controls, textMesh: null, material, textureLoader };

    const animate = () => {
      requestAnimationFrame(animate);
      if (sceneRef.current?.controls) {
        sceneRef.current.controls.autoRotate = autoRotate;
        sceneRef.current.controls.update();
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (containerRef.current) containerRef.current.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;
    const { material, textureLoader } = sceneRef.current;
    
    material.color.set(materialSettings.color);
    material.metalness = materialSettings.metalness;
    material.roughness = materialSettings.roughness;
    material.envMapIntensity = materialSettings.envMapIntensity;
    material.emissive.set(materialSettings.emissive);
    material.emissiveIntensity = materialSettings.emissiveIntensity;

    const updateMap = (type: 'map' | 'normalMap' | 'roughnessMap' | 'metalnessMap', url?: string) => {
      if (url) {
        textureLoader.load(url, (tex) => {
          tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
          tex.repeat.set(materialSettings.repeatX, materialSettings.repeatY);
          tex.rotation = (materialSettings.rotation * Math.PI) / 180;
          tex.offset.set(materialSettings.offsetX, materialSettings.offsetY);
          material[type] = tex;
          material.needsUpdate = true;
        });
      } else {
        material[type] = null;
        material.needsUpdate = true;
      }
    };

    updateMap('map', materialSettings.map);
    updateMap('normalMap', materialSettings.normalMap);
    updateMap('roughnessMap', materialSettings.roughnessMap);
    updateMap('metalnessMap', materialSettings.metalnessMap);
  }, [materialSettings]);

  useEffect(() => {
    const updateGeometry = async () => {
      if (!sceneRef.current || !textSettings.text.trim()) return;
      const { scene, material, textMesh: oldMesh } = sceneRef.current;

      try {
        const font = await FontService.loadFont(currentFontUrl);
        const shapes = FontService.createShapesFromFont(
          textSettings.text,
          font,
          textSettings.size,
          textSettings.letterSpacing,
          textSettings.lineHeight,
          textSettings.invertHoles
        );

        if (shapes.length === 0) return;

        const extrudeSettings = {
          depth: textSettings.height,
          bevelEnabled: textSettings.bevelEnabled,
          bevelThickness: textSettings.bevelThickness,
          bevelSize: textSettings.bevelSize,
          bevelOffset: textSettings.bevelOffset,
          bevelSegments: textSettings.bevelSegments,
          curveSegments: textSettings.curveSegments
        };

        const geometry = new THREE.ExtrudeGeometry(shapes, extrudeSettings);
        
        // Accurate sizing & scaling
        geometry.computeBoundingBox();
        if (geometry.boundingBox) {
          const size = new THREE.Vector3();
          geometry.boundingBox.getSize(size);
          const currentWidth = size.x;
          
          if (currentWidth > 0) {
            const scaleFactor = textSettings.targetLength / currentWidth;
            if (textSettings.lockThickness) {
              geometry.scale(scaleFactor, scaleFactor, 1);
            } else {
              geometry.scale(scaleFactor, scaleFactor, scaleFactor);
            }
          }
        }

        geometry.center();
        geometry.computeVertexNormals();
        
        const mesh = new THREE.Mesh(geometry, material);

        if (oldMesh) {
          scene.remove(oldMesh);
          if (oldMesh instanceof THREE.Mesh) {
            oldMesh.geometry.dispose();
          }
        }

        scene.add(mesh);
        sceneRef.current.textMesh = mesh;
      } catch (err) {
        console.error("3D Text Generation Error:", err);
      }
    };

    const timer = setTimeout(updateGeometry, 50);
    return () => clearTimeout(timer);
  }, [textSettings, currentFontUrl]);

  useImperativeHandle(ref, () => ({
    exportGLB: (filename: string) => {
      if (!sceneRef.current?.textMesh) return;
      
      const exporter = new GLTFExporter();
      exporter.parse(
        sceneRef.current.textMesh,
        (gltf) => {
          const blob = new Blob([gltf as ArrayBuffer], { type: 'application/octet-stream' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${filename}.glb`;
          link.click();
          URL.revokeObjectURL(url);
        },
        (error) => console.error(error),
        { binary: true }
      );
    },
    exportImage: (scale = 1) => {
      if (!sceneRef.current) return;
      const { renderer, scene, camera } = sceneRef.current;
      
      const originalWidth = renderer.domElement.width;
      const originalHeight = renderer.domElement.height;

      if (scale > 1) {
        renderer.setSize(3840, 2160);
        camera.aspect = 3840 / 2160;
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
      }

      const dataURL = renderer.domElement.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = `3d-text-${Date.now()}.png`;
      link.click();

      if (scale > 1) {
        renderer.setSize(originalWidth, originalHeight);
        camera.aspect = originalWidth / originalHeight;
        camera.updateProjectionMatrix();
      }
    },
    importGLB: (file: File) => {
      const loader = new GLTFLoader();
      const url = URL.createObjectURL(file);
      loader.load(url, (gltf) => {
        if (!sceneRef.current) return;
        const { scene, textMesh: oldMesh } = sceneRef.current;
        if (oldMesh) scene.remove(oldMesh);
        
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const center = box.getCenter(new THREE.Vector3());
        gltf.scene.position.sub(center);
        
        scene.add(gltf.scene);
        sceneRef.current.textMesh = gltf.scene;
        URL.revokeObjectURL(url);
        alert("GLB Loaded Successfully! Validation complete.");
      });
    },
    resetView: () => {
      if (!sceneRef.current) return;
      sceneRef.current.camera.position.set(0, 0, 10);
      sceneRef.current.controls.target.set(0, 0, 0);
      sceneRef.current.controls.update();
    }
  }));

  return <div ref={containerRef} className="w-full h-full" />;
});

Viewer.displayName = "Viewer";

export default Viewer;
