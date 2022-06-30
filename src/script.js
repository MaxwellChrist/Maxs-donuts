import './style.css';
import * as THREE from 'three';
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

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
// now I am going to create a perspective camera that the user can move. I need to first remove the 
// mesh rotation in the looper function. Then I will grab the mouse coordinates. The most effective
// way to do this is to define the cursor coordinates in an object, then manipulate them in the event
// handler by setting a value between 0 and -1 or -0.5 and 0.5. Then within the looper function, I
// will update the camera position
const cursor = {
    x: 0,
    y: 0
}
window.addEventListener('mousemove', e => {
    cursor.x = -(e.clientX / sizes.width - 0.5);
    cursor.y = (e.clientY /sizes.height - 0.5);

})


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

// I will try to demonstrate orbit controls by importing the class from node modules. It takes
// two parameters, the camera and a DOM element, which I will use the canvas tag selected above
// you can rotate with left mouse click, move up and down with right mouse click, and zoom in with wheel
// you can also change the middle with the target property and update method
const orbit = new OrbitControls(camera, canvas);
orbit.target.y = -2;
orbit.update()
// there's also a concept called damping which smoothes the animation by adding an extra speed after a user's movement
// It makes it look really smooth in some of the examples in the docs, so of course I gotta give it a try, but in order
// to enable this, we have to update it frame by frame, which means we have to update this effect in the looper function
orbit.enableDamping = true

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
    // mesh.rotation.y = newTime * Math.PI // this is to rotate the cube 180 degrees every second
    // If you want to rotate the cube in a complete circle, use the following methods in tandem
    // mesh.position.x = Math.sin(newTime) // this is to move the cube left and right
    // mesh.position.y = Math.cos(newTime) // this is to move the cube up and down

    // this is doing the same as above, but with the camera moving instead of the cube and the camera tilted towards the cube
    // camera.position.x = Math.sin(newTime) 
    // camera.position.y = Math.cos(newTime) 
    // camera.lookAt(mesh.position)

    // this is to update the position of the camera with a certain amount of space (the multiple of 10 below)
    // camera.position.x = cursor.x * 10 ;
    // camera.position.y = cursor.y * 10;

    // what I want to do is see a 360 view of the shape, so we have to implement a litte math to do so
    // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 2;
    // camera.position.y = cursor.y * 5;
    // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 4;

    // camera.lookAt(new THREE.Vector3()); // this sets the camera coordinates to zero, so it will be the middle of the screen
    // camera.lookAt(mesh.position); // this sets the camera coordinates to the red cube, so it will start at the middle of the cube

    // this is what allow the damping effect for the orbit controls to occur
    orbit.update();

    // this is to render everything every frame
    renderer.render(scene, camera);
    window.requestAnimationFrame(looper)
}
looper()

/* additional notes for cameras:
- Camera class -> do not use directly (all other cameras inherit from camera class)
- ArrayCamera -> renders the scene from multiple cameras on specific areas of the render
- useful for multiplayer games that used split screen
- StereoCamera -> render the scene through two cameras that mimic the eyes to create a parallax effect
- use this with devices like VR headsets, red and blue glasses, or cardboard
- CubeCamera -> does 6 renders, each one facing a different direction
- can render the surrounding for things like environment map, reflection, or shadow map
- OrthographicCamera -> render the scene without perspective (objects will all have same size regardless of distance)
*/

/* additional notes for controls:
- Device Oriented controls will automatically retrieve the device orientation of your device, operating system,
- and browser allow it and rotate the camera accordingly. It can be used to create immersive universes or for VR
- Fly Controls enable moving the camera like if you were on a spaceship. You can rotate on all 3 axes, and go 
- forwards and backwards
- First person control is like fly control but you cannot change the up axes. It's kind of like the view of a bird
- Pointer lock control uses the pointer lock JS API to move around using the WSAD controls on a keyboard while 
- moving the perspective with your mouse
- Orbit controls are similar to the controls I made previously. You cannot go below the floor or upside down, but you
- can go 360 degrees while also zooming in and out
- Tackball control is like orbit controls but you can loop the vertical axis indefinitely
- Transform controls allow someone to move an object upon the x, y, and z axis
- Drag controls also allow one to move an object but more like a drag and drop control system

*/