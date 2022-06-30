import './style.css';
import * as THREE from 'three';
import gsap from 'gsap';

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
mesh.position.set(0, -1, 1);
scene.add(mesh);

// if you had to build a house, you would have to add walls, doors, windows, etc.
//this would be tricky constructing all independently, but luckly there's the Group class
// you can put objects inside groups with any of the transition properties like position and rotation
const group = new THREE.Group()
scene.add(group)
const cube1 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 'limegreen' }));
group.add(cube1);
const cube2 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 'yellow' }));
cube2.position.set(-2, 0, 0);
group.add(cube2);
const cube3 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 'cyan' }));
cube3.position.set(2, 0, 0);
group.add(cube3);
group.position.set(0, 1, 0);


// scale changes the value of the geometry to "scale" with the coordinates you choose
mesh.scale.set(0.5, 0.5, 0.5)

// rotation is not a vector but an euler, which is a class that represents euler angles
// it has much less methods available, but it's specifically used to rotate something
// if you want to rotate something 180 degrees, you can use Math.PI
// the rotation order goes in order (x, then y, then z) and depending on the value previously altered,
// you might get unintended consequences or even an axis no longer working. This is called gimbal lock.
// you can change the order with the reorder method and with the angles specified in uppercase
mesh.rotation.reorder('YXZ')
mesh.rotation.set(Math.PI * 0.25, Math.PI * 0.25, 0);

// quaternion is a representation of rotation but in a more mathematical way
// it updates when you change a rotation. Since you can only rotate with one of the two,
// I will keep the code above with the rotation property

//axes helper class shows a representation of the x, y, and z axis of the camera
// x is red, y is green, and z is blue. The value in the parameter is the length of each axis
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper)

// creating the camera angle
// I used a perspective camera, meaning objects far away will appear small and objects close up will appear large
// takes in four parameters. The first is the field of view in degrees and the second is the aspect ratio, which is
// the width of the render divided by the height of the render. The third and fourth are called near and far, which
// corespond to how close and how far the camera can see. Any object or part of the object closer than near or 
// further than far will not show up. Do not use really small and really large values for these. This is called
// z-fighting and will potentially cause your GPU to have trouble putting one object infron of another
const sizes = {
    width: 800,
    height: 800
};
const camera = new THREE.PerspectiveCamera(100, sizes.width/sizes.height, 0.1, 100);
// This will not work because everything is in the center. The camera is inside the cube itself
// we need to move the camera backwards with the position, rotation, and scale properties
// the set method below is shorthand for editing the x, y, and z axis
camera.position.set(0, 0, 3);
scene.add(camera);

// orthographic camera differs from perspective camera by its lack of perspective
// objects have the same size regardless of their distance to the camera
// the parameters are left, right, top, bottom, near and far
// The cube can look flat since you can render a square into a rectangular canvas. 
// For this specifically, we use the canvas ratio (width by width)
// const aspectRatio = sizes.width/sizes.height;
// const camera = new THREE.OrthographicCamera(-5 * aspectRatio, 5 * aspectRatio, 5, -5, 0.01, 100);
// camera.position.set(0, 0, 3);
// scene.add(camera);

//these are a few methods worth exploring
// console.log(mesh.position.length());
// console.log(mesh.position.distanceTo(camera.position));
// console.log(mesh.position.normalize());
// console.log(mesh.position.length());

// one I will demonstrate is the lookAt method
// it roates the object so that its -z faces the target you provide
// camera.lookAt(new THREE.Vector3(0, -1, 0)) -> this changes it relative to the angles you input in the vector3
// camera.lookAt(mesh.position) // this changes the camera to look straight at the cube without any calculations

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

// this is to take the previous time and subtract it from the current time to get whats call the delta time
let time = Date.now();

// clock class has methods in which you can count exact seconds. I will use that to rotate the cube with 
// this animation trick instead of the requestAnimationFrame method
const clock = new THREE.Clock();

// this is using the green sock library to do an animation where we move the red cube to the right of the page after 1 sec,
// then to the middle after 2 seconds with a longer duration to make it look about the same speed
// gsap.to(mesh.position, { duration: 1, x: 2, delay: 1 })
// gsap.to(mesh.position, { duration: 2, x: 0, delay: 2 })

// animations with requestAnimationFrame. This is implemented with a function being called on each frame forever
// the requestAnimationFrame methods is to call the function provided on the next frame. It is not to do animations
const looper = () => {
    // // these calculations are to make sure the cube is rotating at the same speed, regardless of its frame rate
    // const current = Date.now();
    // const delta = current - time;
    // time = current

    // // this updates the red cube to rotate every frame by the specified amount below
    // // the delta is to make sure every computer shares the same speed at which it is rotating
    // mesh.rotation.y += 0.001 * delta

    // this is using the clock class to shift the position of the cube by one second, making it another way
    // to use animation and to ensure every computer is rotating it at the same speed
    const newTime = clock.getElapsedTime();
    mesh.rotation.y = newTime * Math.PI // this is to rotate the cube 180 degrees every second
    // If you want to rotate the cube in a complete circle, use the following methods in tandem
    // mesh.position.x = Math.sin(newTime) // this is to move the cube left and right
    // mesh.position.y = Math.cos(newTime) // this is to move the cube up and down

    // this is doing the same as above, but with the camera moving instead of the cube and the camera tilted towards the cube
    // camera.position.x = Math.sin(newTime) 
    // camera.position.y = Math.cos(newTime) 
    // camera.lookAt(mesh.position)

    // this is to render everything every frame
    renderer.render(scene, camera);
    window.requestAnimationFrame(looper)
}
looper()

/* additional notes:
- Camera class -> do not use directly (all other cameras inherit from camera class)
- ArrayCamera -> renders the scene from multiple cameras on specific areas of the render
- useful for multiplayer games that used split screen
- StereoCamera -> render the scene through two cameras that mimic the eyes to create a parallax effect
- use this with devices like VR headsets, red and blue glasses, or cardboard
- CubeCamera -> does 6 renders, each one facing a different direction
- can render the surrounding for things like environment map, reflection, or shadow map
- OrthographicCamera -> render the scene without perspective (objects will all have same size regardless of distance)

*/