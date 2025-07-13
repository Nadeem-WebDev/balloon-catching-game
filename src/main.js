import './style.css'
import Phaser from 'phaser';

const config = {
    type: Phaser.WEBGL,
    width: 1000,
    height: 550,
    canvas:gameCanvas,
    physics: {
        default: 'arcade',
        arcade: {
            // gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config); 
let floatingBalloons=[];

function startFloating(obj) {  
  obj.setImmovable(false);
  obj.setVelocity(
      -200,Phaser.Math.Between(-200, 200)
  );

  obj.setBounce(1); 
}

function createNewBalloon(scene, x, y) {
  let balloon=scene.physics.add.sprite(x, y, 'balloon').setScale(0.05).setOrigin(0,0);
  balloon.setGravityY(0);
  balloon.setCollideWorldBounds(true);
  balloon.setImmovable(true);
  balloon.setInteractive();
  balloon.setDepth(1);
  return balloon;
}






function preload() {
    this.load.image('sky', '../graphics/Symbol 3 copy.png'); 
    this.load.image('pump', '../graphics/Symbol 320001.png'); 
    this.load.image('pipe', './graphics/Symbol 320002.png'); 
    this.load.image('machine', './graphics/Symbol 320003.png'); 
    this.load.image('balloon', './graphics/Symbol 100001.png'); 
}

function create() {
    this.physics.world.setBounds(0, 0, 900, 550);


    this.add.image(0, 0, 'sky').setScale(0.5).setOrigin(0,0);

    let activeBalloon = createNewBalloon(this, 553, 320);
    let score=0;
    let scoreText = this.add.text(20, 20, 'Score: 0', { fontSize: '24px', fill: 'red' });
    this.input.on('gameobjectdown', (_, gameObject) => {
      if (floatingBalloons.includes(gameObject)) {
        score+=1;
        scoreText.setText('Score: ' + score);
        this.tweens.add({
          targets: gameObject,
          scaleX: 0,
          scaleY: 0,
          alpha: 0, // Fade out effect
          duration: 300,
          ease: 'Power2',
      });
      }
    })

    let pump=this.add.sprite(650, 170, 'pump').setScale(0.5).setOrigin(0,0).setDepth(10);
    pump.setInteractive()
    let size=0.05;
    this.input.on('gameobjectdown', (_, gameObject) => {
      if (gameObject === pump) {
        console.log(activeBalloon.scaleX);
        
          this.tweens.add({
              targets: pump,
              y: 230, 
              duration: 200,
              ease: 'Power1',
              yoyo: true, 
              repeat: 0,
              onStart: () => {
                if (activeBalloon.scaleX < 0.25) {
                  size+=0.05

                  this.tweens.add({
                      targets: activeBalloon,
                      scaleX:size,
                      scaleY:size,
                      x: activeBalloon.x-15,
                      y: activeBalloon.y-20,
                      duration: 500,
                      yoyo: false,
                      repeat: 0,
                      onComplete: () => {
                          if (activeBalloon.scaleX >= 0.25) {
                            size=0.05;
                            startFloating(activeBalloon);
                            floatingBalloons.push(activeBalloon);                            
                            activeBalloon = createNewBalloon(this, 553,320); // Create a new balloon
                          }
                      }
                  });                  
              }
              },
          });
      }
  });

  this.add.image(500, 280, 'pipe').setScale(0.5).setOrigin(0,0).setDepth(10);
  this.add.image(650, 300, 'machine').setScale(0.5).setOrigin(0,0).setDepth(10);

}

function update() {
}

export default game;