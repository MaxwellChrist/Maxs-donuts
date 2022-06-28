// creating the scene
const scene = new THREE.Scene();

// creating the cube
// created geometry variable to store the dimensions of the cube. Its parameters are the dimensions of the cube
// created material variable to store the material/color the cube will be covered with
// created mesh variable to combine the geometry and material into something we can add to the scene
// lastly add it to the scene
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 'red' });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// creating the camera angle
// I used a perspective camera, meaning objects far away will appear small and objects close up will appear large
// takes in two parameters. The first is the field of view in degrees and the second is the aspect ratio
const sizes = {
    width: 800,
    height: 600
};
const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height);
// This will not work because everything is in the center. The camera is inside the cube itself
// we need to move the camera backwards with the position, rotation, and scale properties
// the set method below is shorthand for editing the x, y, and z axis
camera.position.set(1.25, 1.25, 3);
scene.add(camera);

// creating a renderer (renders the scene from the camera's point of view)
// this result is drawn into a canvas, which is an HTML element that you can draw stuff in
// in order to renderer it properly, I created a class in html to select the canvas
// I then added it to the parameter of the WebGLRenderer method and set the size of the renderer
// Last is for call the render method on the renderer while passing the scene and camera
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ 
    canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);