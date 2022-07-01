import './style.css';
import * as THREE from 'three';
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as lil from 'lil-gui';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
// one way to import a typeface
import typefaceFont1 from 'three/examples/fonts/optimer_regular.typeface.json';
// the other is to add them to a folder you can grab (grabbed them out of the node modules first)
// import typefaceFont2 from '../static/fonts/optimer_bold.typeface.json';

// creating the scene
const scene = new THREE.Scene();

// clock class has methods in which you can count exact seconds. I will use that to rotate the cube with 
// this animation trick instead of the requestAnimationFrame method
const clock = new THREE.Clock();

//axes helper class shows a representation of the x, y, and z axis of the camera
// x is red, y is green, and z is blue. The value in the parameter is the length of each axis
// const axesHelper = new THREE.AxesHelper(2);
// scene.add(axesHelper)

// textures for the 3D text
const wordTextureLoader = new THREE.TextureLoader();
const matcapWordTextureLoader = wordTextureLoader.load('./textures/matcaps/7.png');
const matcapDonutTextureLoader = wordTextureLoader.load('./textures/matcaps/1.png');

// the geometry and material for the donuts (put above load to improve performance)
const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45);
const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapDonutTextureLoader });

// to load the fonts, you need to import FontLoader, TextGeometry, then do the following
const fontLoader = new FontLoader()
fontLoader.load(
    './fonts/optimer_bold.typeface.json',
    (font) => {
        const textGeometry = new TextGeometry(
            'Max Christ',
            { 
                font, size: 0.5, 
                height: 0.2, 
                curveSegments: 4, 
                bevelEnabled: true, 
                bevelThickness: 0.05, 
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 2
            }
        );

        const textGeometry2 = new TextGeometry(
            'Full Stack Web Developer',
            { 
                font, size: 0.5, 
                height: 0.2, 
                curveSegments: 4, 
                bevelEnabled: true, 
                bevelThickness: 0.05, 
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 2
            }
        );

        textGeometry.computeBoundingBox();
        textGeometry2.computeBoundingBox();
        textGeometry.translate(
            -(textGeometry.boundingBox.max.x - 0.02) * 0.5,
            -(textGeometry.boundingBox.max.y - 1.52) * 0.5,
            -(textGeometry.boundingBox.max.z - 0.05) * 0.5,
        )
        textGeometry2.center();
        const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapWordTextureLoader });
        const text = new THREE.Mesh(textGeometry, textMaterial);
        const text2 = new THREE.Mesh(textGeometry2, textMaterial);
        scene.add(text, text2);

        for (let i = 0; i < 300; i++) {
            const donut = new THREE.Mesh(donutGeometry, donutMaterial);

            donut.position.x = (Math.random() - 0.5) * 10;
            donut.position.y = (Math.random() - 0.5) * 10;
            donut.position.z = (Math.random() - 0.5) * 10;

            donut.rotation.x = Math.random() * Math.PI;
            donut.rotation.y = Math.random() * Math.PI;

            const scale = Math.random();
            donut.scale.set(scale, scale, scale);

            scene.add(donut)
        }
    }
)

// this is for the debugger to dynamically change the color of the main cube as well as add a spin feature
// the function has to be within an object in order for it to be used (since the properties of the debugger are objects)
const param = {
    color: 0xff0000,
    spin: function() {
        gsap.to(mesh.rotation, { duration: 2, y: mesh.rotation.y + Math.PI * 2 })
    }
};

// this is one way to load an image, which is by grabbing it in a folder called static and using the Image class
// we cannot use the image directly however, so we need to transform it into a texture
// we do so by declaring the colorTexture variable outside the function, and upon the load event, the texture 
// will be updated. We then add it to the material with the map property instead of color
// const images = new Image();
// const colorTexture = new THREE.Texture(images);
// images.addEventListener('load', () => {
//     colorTexture.needsUpdate = true;
// })
// images.src = './textures/door/color.jpg';

// this is another way to load an image and it makes it somewhat easier
// you will still have to add it to the material with the map property, but it's much less code and complication
// this can also load multiple textures
// you can send three functions after the path, which are the load, progress, and error functions
// const textureLoader = new THREE.TextureLoader();
// const colorTexture = textureLoader.load('./textures/door/color.jpg',
//     () => console.log('load'), // this will fire when the image loads successfully
//     () => console.log('progress'), // this will fire when the image loading is in progress
//     () => console.log('error') // this will fire when the image can't load and something goes wrong
// );


// to make sure everythig we need is loaded before the user can experience the page, we use a loading manager
// it is useful if we want to know the global loading progress or to be information when everything is loaded
// you can use the loadingManager variable with things like onStart, onProgress, etc. to see certain events
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => {
    console.log('on start')
}
loadingManager.onLoaded = () => {
    console.log('on load')
}
loadingManager.onProgress = () => {
    console.log('on progress')
}
const textureLoader = new THREE.TextureLoader(loadingManager);
const cubeTextureLoader = new THREE.CubeTextureLoader();
let colorTexture = textureLoader.load('/textures/door/color.jpg');
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const heightTexture = textureLoader.load('/textures/door/height.jpg');
const normalTexture = textureLoader.load('/textures/door/normal.jpg');
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg');

const gradientTexture = textureLoader.load('./textures/gradients/3.jpg');
const matcapTexture = textureLoader.load('./textures/matcaps/3.png');

const environmentMapTexture = cubeTextureLoader.load([
    './textures/environmentMaps/0/px.jpg',
    './textures/environmentMaps/0/nx.jpg',
    './textures/environmentMaps/0/py.jpg',
    './textures/environmentMaps/0/ny.jpg',
    './textures/environmentMaps/0/pz.jpg',
    './textures/environmentMaps/0/nz.jpg',
])

// we can repeate the texture by using the repeat property. It's a vector2 with x and y properties
// colorTexture.repeat.x = 2;
// colorTexture.repeat.y = 3;

// by default, the texture doesn't repeat and the last pixel gets stretched, so we can change that feature
// with repeat wrapping on the wrapS and wrapT properties
// colorTexture.wrapS = THREE.RepeatWrapping;
// colorTexture.wrapT = THREE.RepeatWrapping;

// you can alternate the direction with mirrored repeat wrapping
// colorTexture.wrapS = THREE.MirroredRepeatWrapping;
// colorTexture.wrapT = THREE.MirroredRepeatWrapping;

// we can offset the texture using the offset property, which is a vector2
// colorTexture.offset.x = 0.5;
// colorTexture.offset.y = 0.5;

// we can rotate the texture using the rotation property
// colorTexture.rotation = Math.PI * 0.25;

// by deselecting everything execept the above line, you'll notice the rotation offcurs around one specific corner of the cube
// we can change this pivot point with the cetner property. It is a vector2, so we only need to fix the x and y axis
// colorTexture.center.x = 0.5;
// colorTexture.center.y = 0.5;

//this is a filtering feature when a texture undergoes mipmapping. I will change the texture to show that you can see 
// both the minification filter and magnification filter
// something called moire patterns
// colorTexture = textureLoader.load('/textures/checkerboard-1024x1024.png');
// colorTexture.minFilter = THREE.NearestFilter;
// colorTexture = textureLoader.load('/textures/checkerboard-8x8.png');
// colorTexture.magFilter = THREE.NearestFilter;

// if you are using nearest filter on minFilter, you don't need mipmaps. So we can deactive the mipmapping generation
// with the following( keep in mind smaller textures on the GPU is better but don't make them smaller if you don't have to):
// colorTexture.generateMipmaps = false;
// colorTexture.minFilter = THREE.NearestFilter;

// creating the cube
// created geometry variable to store the dimensions of the cube. Its parameters are the dimensions of the cube
// created material variable to store the material/color the cube will be covered with
// created mesh variable to combine the geometry and material into something we can add to the scene
// lastly add it to the scene
const geometry = new THREE.BoxBufferGeometry(1, 1, 1);
// console.log(geometry.attributes.uv);

// If I wanted to create a specific triangle instead of the box, I could do the following
// these are broken down into three vertices, each containing an x, y, and z axis, which is why we used 9 values 
// we could add more and it will keep continuting with however many vertices you add
// This is a one dimensional array, but we are storing the array to a buffer attribute and the 3 is how many
// values are composed in one vertex (3 for x, y, and z)
// I then create a buffer geometry to be able to store a buffer attribute, and since I passed the array to the
// buffer attribute, I then set that attribute with the name of position
// your can also name posArr like so for the specified length, which is passed to the parameter (in this case 9) 
// const posArr = new Float32Array(9);
// posArr[0] = 0;
// posArr[1] = 0;
// ...

// const posArr = new Float32Array([
//     0, 1, 0,
//     -1, 0, 0,
//     1, 1, 1,
// ])
// const posAtt = new THREE.BufferAttribute(posArr, 3);
// const geometry = new THREE.BufferGeometry();
// geometry.setAttribute('position', posAtt)

// this is creating 100 triangles, each composed of three vertices and each vertex will have three values
// const counter = 100;
// const posArr = new Float32Array(counter * 3 * 3);
// for(let i = 0; i < counter * 3 * 3; i++) {
//     posArr[i] = (Math.random() - 0.5) * 5;
// };
// const posAtt = new THREE.BufferAttribute(posArr, 3);
// const geometry = new THREE.BufferGeometry();
// geometry.setAttribute('position', posAtt);

// const material = new THREE.MeshBasicMaterial({ color: param.color });
// the above way was for the red cube, but we use map to use a texture
const material = new THREE.MeshBasicMaterial({ color: 'red' });
// const material = new THREE.MeshBasicMaterial({ map: colorTexture });
const mesh = new THREE.Mesh(geometry, material);
mesh.position.set(0, 0, 0);
// scene.add(mesh);

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
group.visible = false

// This section I will try to create new materials with new geometries

// there are a couple different ways to add colors or textures to materials and I'll show them below:
// keep in mind that once you instantiate the material, the color property becomes a color class, meaning
// you cannot just add something like material1.color = 'blue'. I will show below how to do this as well
// const material1 = new THREE.MeshBasicMaterial({ 
//     color: 'red',
//     map: colorTexture
//  });
// const material1 = new THREE.MeshBasicMaterial(); // this is the line instantiating the material
// material1.map = colorTexture;
// material1.color = new THREE.Color('blue'); // after instantiation, this is one way to change the color
// material1.color.set('#ff00ff'); // after instantiation, this is another way to change the color
// material1.wireframe = true;

// material1.opacity = 0.5; // when using opacity or alpha, you have to add the transparent property for it to work
// material1.transparent = true;
// material1.alphaMap = alphaTexture;
// material1.transparent = true;

// side lets you decide which side of a face is visible. Front side is set by default
// try to avoid using doubleside if you can since its more stressful on you gpu
// material1.side = THREE.DoubleSide

// This part I will test using a new material called mesh normal material. This displays
// a nice purple color to the material. Normals are information that contains the direction
// of the outside of the face of the geometric pattern. They share common properties with
// mesh basic material like the ones above, but also flatShading property. This property
// will flatten the faces, meaning that the normals won't be interpolated between the vertices.
// Mesh normal material is usually used to debug normals.
// const material2 = new THREE.MeshNormalMaterial();
// material2.flatShading = true;

// This part I will test using a new material called mesh matcap material. This displays
// a color by using the normals as a reference to pick the right color on a texture that 
// looks like a sphere. It takes a picture and picks the colors in it, then compares it
// to the normals related to the camera angle to render a color. This creates an illusion
// that the objects are being struck with light, so you can simulate light in the scene
// without actually adding it
// const material3 = new THREE.MeshMatcapMaterial();
// material3.matcap = matcapTexture

// This new material will color the geometry in white if it's close to the camera and 
// black if it's far from the camera
// const material4 = new THREE.MeshDepthMaterial();

// The mesh lambert material has new properties related to light. It has great performance
// but it sometimes shows strange patterns on the geometry, like blurry lines in the torus
// geometry shape I made
// const material5 = new THREE.MeshLambertMaterial();

// this material is similar to the mesh lambert material, but it has less performance. It 
// does make up for the fact that it does not show the possibility of strange patterns like
// mesh lambert material. You can also add a shininess property to it. You can change the
// color of the shine with the specular property
// const material6 = new THREE.MeshPhongMaterial();
// material6.shininess = 100;
// material6.specular = new THREE.Color(0x0000ff);

// this material is called mesh toon material and it is similar to the lambert, but cartoonish.
// You can add extra properties like gradientMap and gradientTexture. 
// const material7 = new THREE.MeshToonMaterial();
// material7.gradientMap = gradientTexture;
// this removes the cartoon effect because the gradient is small and the magFilter tries to fix
// this with minmapping. What I did below is a way to correct this
// gradientTexture.minFilter = THREE.NearestFilter;
// gradientTexture.magFilter = THREE.NearestFilter;
// gradientTexture.generateMipmaps = false;

// this material is called mesh standard material and it seems to be the most popular. It
// uses physically based rendering principles (PBR), making it react to lights in the scene
// and more realistic conditions with additional properties like the ones light below. One
// called ambient occlusion map will add shadows where the texture is darker, but I need to
// add a second set of UV, and it is called uv2 (which we will add to in the area the geometry
// is defined). You can also change the intensity of the shadows with aoMapIntensity and you 
// can move the vertices with displacementMap. Also instead of using roughness and metalness 
// for the geometry, we can use it on the texture. Be careful not to combine them since it will
// affect the texture by the value you choose in the geometry. Normal map will fake the normals
// orientation and add details on the surface regardless of the divisions you input in the shape.
// You can also change the strength of the intensity with normalScale property, but it is a 
// vector2. You can also you the alpha using alphaMap property, but keep in ming to use the
// transparent property after
const material8 = new THREE.MeshStandardMaterial();
material8.roughness = 0.2;
material8.metalness = 0.7;
// material8.map = colorTexture;
// material8.aoMap = ambientOcclusionTexture;
// material8.aoMapIntensity = 1;
// material8.displacementMap = heightTexture;
// material8.displacementScale = 0.05;
// material8.roughnessMap = roughnessTexture;
// material8.metalnessMap = metalnessTexture;
// material8.normalMap = normalTexture;
// material8.normalScale.set(0.5, 0.5);
// material8.alphaMap = alphaTexture;
// material8.transparent = true;
material8.envMap = environmentMapTexture

// The next material is called mesh physical material, and it is similar to the mesh standard
// material but with a support of a clear coat effect
const material9 = new THREE.MeshPhysicalMaterial()

// the next material is called points material

// now I will add some lights to show the other materials in store. The first light is
// called an ambient light and the second is calls a point light
const ambientLight = new THREE.AmbientLight(0xffffff , 0.5);
const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(2, 3, 4);
scene.add(ambientLight, pointLight)

const sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(0.5, 64, 64), material8);
const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material8);
const torus = new THREE.Mesh(new THREE.TorusBufferGeometry(0.3, 0.2, 64, 128), material8)
sphere.position.set(-1.5, 0, 0);
plane.position.set(0, 0, 0);
torus.position.set(1.5, 0, 0);
sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2));
plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2));
torus.geometry.setAttribute('uv2', new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2));
// scene.add(sphere, plane, torus);

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

// creating the camera angle
// I used a perspective camera, meaning objects far away will appear small and objects close up will appear large
// takes in four parameters. The first is the field of view in degrees and the second is the aspect ratio, which is
// the width of the render divided by the height of the render. The third and fourth are called near and far, which
// corespond to how close and how far the camera can see. Any object or part of the object closer than near or 
// further than far will not show up. Do not use really small and really large values for these. This is called
// z-fighting and will potentially cause your GPU to have trouble putting one object infron of another
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

// this is to listen to the resize event and make sure the viewport is the same with every time the browser is resized
window.addEventListener('resize', e => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width/sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

// this will add support for fullscreen mode by double clicking anywhere
// this would normally work with one simple if statement, but for older browers, it will not without webkit
window.addEventListener('dblclick', e => {
    const fullscreen = document.fullscreenElement || document.webkitFullscreenElement
    if (!fullscreen) {
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen();
        } else {
            canvas.webkitRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
});

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
camera.position.set(0, 0, 4);
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

// this allows to see a better quality picture depending on the device and limit the pixel ration to no more than 2
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

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

// this is using the green sock library to do an animation where we move the red cube to the right of the page after 1 sec,
// then to the middle after 2 seconds with a longer duration to make it look about the same speed
// gsap.to(mesh.position, { duration: 1, x: 2, delay: 1 })
// gsap.to(mesh.position, { duration: 2, x: 0, delay: 2 })

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

    // this is for the new shapes I added
    sphere.rotation.x = 0.15 * newTime;
    plane.rotation.x = 0.15 * newTime;
    torus.rotation.x = 0.15 * newTime;
    sphere.rotation.y = 0.1 * newTime;
    plane.rotation.y = 0.1 * newTime;
    torus.rotation.y = 0.1 * newTime;

    // this is what allow the damping effect for the orbit controls to occur
    orbit.update();

    // this is to render everything every frame
    renderer.render(scene, camera);

    // animations with requestAnimationFrame. This is implemented with a function being called on each frame forever
    // the requestAnimationFrame methods is to call the function provided on the next frame. It is not to do animations
    window.requestAnimationFrame(looper)
}
looper();

// using the lil-gui library to debug app and make sure you place it below the things in your code you're debugging
//first values have to be an object, then the property you're looking to debug, then the minimum
// value, maximum value, and the step to show the precision by which the position can be moved by
const debug = new lil.GUI({ width: 400 });
// starts the program with the panel closed
debug.close();
//the below features can also be written like so:
// debug.add(mesh.position, 'y').min(- 3).max(3).step(0.01)

//you can also change the name of each of these labels with the name method
//debug.add(mesh.position, 'x').name('something');
debug.add(mesh.position, 'x', -3, 3, 0.1);
debug.add(mesh.position, 'y', -3, 3, 0.1);
debug.add(mesh.position, 'z', -3, 3, 0.1);

// gives the ability to toggle the visibility of the object you pass it
debug.add(mesh, 'visible').name('main box visible');
debug.add(group, 'visible').name('box group visible');

// this can also be done with the wireframe property
debug.add(material, 'wireframe').name('main box wireframe');
debug.addColor(param, 'color').name('main box color');
debug.onChange(() => {
    material.color.set(param.color)
});
debug.add(param, 'spin').name('main box spin button');
debug.add(material8, 'roughness').min(0).max(1).step(0.001).name('new shapes roughness');
debug.add(material8, 'metalness').min(0).max(1).step(0.001).name('new shapes metalness');
debug.add(material8, 'aoMapIntensity').min(0).max(10).step(0.001).name('new shapes shadow intensity');
debug.add(material8, 'displacementScale').min(0).max(1).step(0.001).name('new shapes vertices scale');

// this allows users to toggle the debugger by pressing the enter key
window.addEventListener('keydown', (e) => {
    if (e.key === "Enter") {
        if (debug._hidden) {
            debug.show();
        } else {
            debug.hide();
        }
    }
});
///////////////////////////////////////////The end of my code///////////////////////////////////////////////////////////////////
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

/* additional notes for geometry:
- What is it really? It's compoised of vertices, which are coordiate points in a 3D space) as well as faces
- (triangles that join those vertices to create a surface)
- They can be used for meshes but also for particles 

- if we want to create our own geometry, we need to store it in a class called buffer geometry (always use buffer
- geometry instead of geometry except when using planes, just use PlaneGeometry instead). After which,
- we will use a native javascript array method to store the data. It is important to note that it is a typed
- array, which means it can only store one type of value, which in this case is floats and is what I will
- exploit or use to my advantage by calling Math.random on each value

- some geometry have faces that share commom vertices. When creating a buffer geometry class, we can specify
- a bunch of vertices and then the indices to create faces and re-use vertices multiple times. This improves 
- the performance greatly and can be seen in the index section of the buffer attribute documentation since it
- largely depends on the variables associated with it, like what kind of shape and 
*/

/* additional notes for debuggin:
- useful libraries: lil-gui (used in this repo),control-panel, ControlKit, Uil, Tweakpane, Guify, Oui
*/


/* additional notes for textures:
- What are they? They are images that will cover the surface of the geometric pattern you choose
- there are meny types with many different effects, and this repo will cover the door textures imported 

- PBR -> physically based rendering-> you have a lot of algorithms that follow real life directions to get realistic results
- PBR is becoming the standard and many different technologies are using it
- more info: https://marmoset.co/posts/basic-theory-of-physically-based-rendering/ 
- more info: https://marmoset.co/posts/physically-based-rendering-and-you-can-too/

- you can extract the url of an image if it is in the src folder by importing it at the top of this page
- this would look like import image from './image.png'
- the other way I'll be doing by using the static folder

- there are a few ways to load the image, but I'm going to load it from a class

- UV unwrapping replaces the box geometry by other geometries. It's like unwrapping an origami of something
- each vertex will have 2D coordinate on a flat (usually square) plane, and you can actually see those UV 2D 
- coordinates in the geometry.attributes.uv property

- If you look at the cube's top face while looking off at a steep angle, you'll notice a blurry surface texture
- This is due to something called filtering and mipmapping. Mipmapping is a technique that consists of creating
- a half smaller version again and again and again until eventually you get a 1x1 texture. All of these versions
- get sent to the GPU and the GPU selects the best version of the texture. Although the GPU handles this process,
- we can give it two types of filtering algorithms. One is called minification filter (the texture is too big for
- the surface it covers) and it has a property called minFilter that has a list of value. The other is called a
- magnification filter (the texture is too small for the surface it covers)

- using nearest filter for filtering is more efficient at making something blurry look sharp, so if the result is fine,
- use THREE.NearestFilter

- When preparing textures, there are three things to keep in mind: the weight, the size of the image (resolution),
- and the data you put inside the texture. 

- Weight: The user will have to download the textures, so choosingt the right type
- is important. jpg is usually lighter but comes at the cost of more likely being distorted from its original shape, 
- while png is heavire and is more likely to be the way you saw the file. There are compression websites to help 
- lower the weight of the file, like TinyPNG.

- Size: Each pixel of the textures you are using will have to be stored on the GPU regardless of the image's weight. 
- And like your hard drive, the GPU has storage limitations. It's even worse because the automatically generated mipmapping 
- increases the number of pixels that have to be stored. Try to reduce the size of your images as much as possible.
- If you remember what we said about the mipmapping, Three.js will produce a half smaller version of the texture repeatedly 
- until it gets a 1x1 texture. Because of that, your texture width and height must be a power of 2. That is mandatory so that 
- Three.js can divide the size of the texture by 2. Some examples: 512x512, 1024x1024 or 512x2048. 512, 1024 and 2048 can be 
- divided by 2 until it reaches 1. If you are using a texture with a width or height different than a power of 2 value, 
- Three.js will try to stretch it to the closest power of 2 number, which can have visually poor results, and you'll also get 
- a warning in the console. If you are suing a normal texture, you will want to have the exact values which is why we shouldn't
- apply compression and why you want to use png files.

- Data: won't get into at the moment

- websites to find textures: poliigon.com, freestocktextures.com, and 3dtextures.me. Also make sure you have the right to 
- use the texture is it's not for personal use. You can also create your own with adobe photoshop and substance designeer,
- but they usually cost money to use
*/

/* additional notes for materials:
- What are they? They are used to put a color on each visible pixel of the geometry you choose. The algorithms to place the color
- are written in programs called shaders.

- I have been testing materials with mesh basic material, which applies a uniform color or a texture on  the geometry, but there
- are plenty of others and I'll try to use some of those

- for a list of matcap textures, visit this page: https://github.com/nidorx/matcaps. Be careful though that you have the right
- to use it if it's for a profession website

- there are things called environment maps, which are like an image of what's surrounding the scene. You can use it to add 
- reflection or refraction to your objects. It can also be used as lighting information. Keep in mind that Three.js only 
- supports cube environment maps. Cube environment maps are 6 images with each one corresponding to a side of the environment.
- You can find some by searching for them, but again you have to make sure you have the right to use them. One is called 
- HDRIHaven, which doesn't ask you to credit the authors. Also there are websites that convert the environment maps to cube maps.
- To convert an HDRI to a cube map, you can use this online tool: https://matheowis.github.io/HDRI-to-CubeMap/ and choose
- the last option when converting it.
*/

/* additional notes for 3D Text:
- Three.js already supports 3D text geometries with the TextGeometry class. The problem is that you must specify a font, 
- and this font must be in a particular json format called typeface. You also have to have the right to use that font.
- There are many ways of getting fonts in that format. First, you can convert your font with converters like this one: 
- https://gero3.github.io/facetype.js/. You have to provide a file and click on the convert button. Three.js also has
- fonts provided right out of the box you can use

-There are several ways to center the text. One way of doing it is by using bounding. The bounding is the information 
- associated with the geometry that tells what space is taken by that geometry. It can be a box or a sphere.
-You cannot actually see those boundings, but it helps Three.js easily calculate if the object is on the screen, and if not, 
- the object won't even be rendered. That is called frustum culling. What we want is to use this bounding to know the size 
- of the geometry and recenter it. By default, Three.js is using sphere bounding, but for the 3D text boxes, you will want
- to use box bounding. To do so, we can ask Three.js to calculate this box bounding by calling computeBoundingBox() 
- on the geometry
*/