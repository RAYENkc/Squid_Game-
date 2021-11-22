const scene = new THREE.Scene();

//scene.background = new THREE.Color(0x5f5f0f);
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

renderer.setClearColor(0xB7C3F3,1);

const light = new THREE.AmbientLight( 0xffffff )
scene.add( light )



//global variables
const start_position = 6;
const end_position = -start_position;
const text = document.querySelector('.text');
const playerT = document.querySelector('.text1');
const startBtn = document.querySelector('.btn');
const btnRestart = document.querySelector('.btn_restart');

const TIME_LIMIT = 20;
let gameStat = "loading ";
let playerStat = "active ";
let FacingBack = true;

let DEAD_PLAYERS = 0;
let SAFE_PLAYERS = 0;

let indexPlayers = [];

//musics
const bgMusic = new Audio('./music/bg.mp3')
//bgMusic.loop = true
const winMusic = new Audio('./music/win.mp3')
const loseMusic = new Audio('./music/lose.mp3')

function createCube(size, posX, rotY = 0, color = 0xfbc851){
    const geometry = new THREE.BoxGeometry( size.w, size.h, size.d )
    const material = new THREE.MeshBasicMaterial( { color } )
    const cube = new THREE.Mesh( geometry, material )
    cube.position.set(posX, 0, 0)
    cube.rotation.y = rotY
    scene.add( cube )
    return cube
}

camera.position.z = 5;


var loader =new  THREE.GLTFLoader();
        console.log(loader);


async function delay(ms){
      return new Promise(resolve => setTimeout(resolve, ms))
}

loader.load( './model/scene.gltf', function ( gltf ){
    scene.add( gltf.scene )
    doll = gltf.scene
    gltf.scene.position.set(0,-1, 0)
    gltf.scene.scale.set(0.4, 0.4, 0.4)
    startBtn.innerText = "start"
})

function lookBackward(){
    gsap.to(doll.rotation, {duration: .45, y: -3.15})
    setTimeout(() => FacingBack = true, 150)
}
function lookForward(){
   gsap.to(doll.rotation, {duration: .45, y: 0})
    setTimeout(() => FacingBack = false, 450)
}

 // bond jaune 
function createTract(){

   
    createCube({w: start_position * 2 + .21, h: 1.5, d: 1}, 0, 0, 0xe5a716).position.z = -1;
    createCube({w: .2, h: 1.5, d: 1}, start_position, -.4)
    createCube({w: .2, h: 1.5, d: 1}, end_position, .4) 

}

createTract();

//class player 
class Player{
    constructor(name = "Player", color = 0xffffff, radius = .25, posY = 0, id= 0){
        const geometry = new THREE.SphereGeometry(  radius, 100, 100 );
        const material = new THREE.MeshBasicMaterial( {color});
        const player = new THREE.Mesh( geometry, material );
        scene.add( player);
        player.position.z=1;
        player.position.x = start_position - .4;
        player.position.y = posY;
      
        this.player = player;
        this.playerInfo = {
            id: id,
            positionX: start_position - .4,
            velocity: 0,
            name,
            isDead: false
        }

    }

    run(){

       if(this.playerInfo.isDead) return
        this.playerInfo.velocity = .03
    
    }

    stop(){
        gsap.to(this.playerInfo, { duration: .1, velocity: 0 })
     
    }



    check(index){
    
        if(this.playerInfo.velocity > 0 && !FacingBack ){
            this.stop();
            console.log( this.playerInfo.name )
            text.innerText = this.playerInfo.name + " lose !";
            this.playerInfo.isDead = true;
            loseMusic.play();
            bgMusic.pause();
            console.log(players.length)
            console.log(players.length)
            players.splice(index,1)
      
    }
        if(this.playerInfo.positionX < end_position + .4){
            this.stop();
            text.innerText = this.playerInfo.name + "win !";
            this.playerInfo.isDead = true;
            winMusic.play();
            bgMusic.pause();   
          
            players.splice(index,1)
        }
        console.log(players.length)
        if(players.length == 0){
            text.innerText = "Game over!!!"
            gameStat = "over";
        }
    
        
      
    }
    
    update(index){
     
        this.check(index);
        this.playerInfo.positionX -= this.playerInfo.velocity;
        this.player.position.x = this.playerInfo.positionX;
        
    }

   
   
}


 
const player1 = new Player("Player 1", 0xD1FFC6, .25, .3, 0);
const player2 = new Player("Player 456", 0xFFCFD2, .25, -.3, 1);
let players = [
    {
        player: player1,
        key: "e",
        name: "Player 1",
        id:0
    },
    {
        player: player2,
        key: "r",
        name: "Player 456",
        id:1
    }
]
console.log(players[0].name);

async function init(){
    await delay(500)
    text.innerText = "Starting in 3"
    await delay(500)
    text.innerText = "Starting in 2"
    await delay(500)
    text.innerText = "Starting in 1"
    lookBackward()
    await delay(500)
    text.innerText = "Gooo!!!"
    bgMusic.play()
    start()
}



function start(){
    gameStat = "started"
    const progressBar = createCube({w: 8, h: .1, d: 1}, 0, 0, 0xebaa12)
    progressBar.position.y = 3.35
    gsap.to(progressBar.scale, {duration: TIME_LIMIT, x: 0, ease: "none"})
    setTimeout(() => {
        if(gameStat != "ended"){
            text.innerText = "Time Out!!!"
            loseMusic.play()
            gameStat = "ended"
        }
    }, TIME_LIMIT * 1000)
    startDall()
}
async function startDall(){
    lookBackward()
    await delay((Math.random() * 1500) + 1500)
    lookForward()
    await delay((Math.random() * 750) + 750)
    startDall()
 }

async function init(){
      await delay(500);
      text.innerHTML= "Starting in 3";

      await delay(500);
      text.innerHTML= "Starting in 2";

      await delay(500);
      text.innerHTML= "Starting in 1";

      await delay(500);
      text.innerHTML= "Gooo !!!!";

      start();
}


//init();
/*setTimeout( () => {
   doll.start();
},1000);
*/



startBtn.addEventListener('click', () => {
        bgMusic.play();
        init();
        document.querySelector('.modal').style.display = "none";


   
})

btnRestart.addEventListener('click', () => {
    document.querySelector('.modal').style.display = "none";
    window.location.reload();
    
   

})

function animate() {
    
	renderer.render( scene, camera );
    
    players.map((player, index)=> {
   
        player.player.update(index);
       
    });
    
   //   cube.rotation.z+=0.01;
   if(gameStat == "over") return
   requestAnimationFrame( animate );
  // player.update();

}
animate();


//resize doll en function de page
window.addEventListener( 'resize', onWindowResize, false )
function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}


//keypress handling
window.addEventListener( "keydown", function(e){
    
    if (gameStat != "started") return
    let p = players.find(player => player.key == e.key)

      if(p){
          p.player.run()
      }
  })

//keypress handling
window.addEventListener( "keyup", function(e){
        let p = players.find(player => player.key == e.key)
        if(p){
            p.player.stop()
        }
    
})
