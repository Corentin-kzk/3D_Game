import * as THREE from "../node_modules/three/build/three.module.js";
import { renderer } from "./Revenge_of_humanity.js"
/**
 * Get random
 * @param {Number} min 
 * @param {Number} max 
 */
export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Resize Function
 */
export const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    //scene création
export const scene = new THREE.Scene();
const aspect = window.innerWidth / window.innerHeight;
export const camera = new THREE.PerspectiveCamera(60, aspect, 90, 5000);