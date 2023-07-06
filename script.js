// Create a new Phaser game instance
const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.RESIZE,
    parent: "game-container",
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: "100%",
    height: "100%"
  },
  backgroundColor: "#ffffff",
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: 0
      },
      debug: true
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  input: {
    activePointers: 2
  }
};

const game = new Phaser.Game(config);

let arrow;
let bow;
let target;
let cheerGirl;

// Preload assets
function preload() {
  this.load.image("bow", "bow.png");
  this.load.image("arrow", "arrow.png");
  this.load.image("target", "target.png");
  this.load.spritesheet("cheerGirl", "path/to/cheer-girl-spritesheet.png", {
    frameWidth: 64,
    frameHeight: 64
  });
}

// Create game objects
function create() {
  arrow = this.physics.add.sprite(0, 0, "arrow");
  arrow.visible = false;

  bow = this.add.sprite(0, 0, "bow");
  bow.setScale(0.4, 0.3);

  target = this.physics.add.sprite(0, 0, "target");
  target.setScale(0.15);

  cheerGirl = this.add.sprite(0, 0, "cheerGirl");
  cheerGirl.visible = false;

  // Resize game objects
  resizeGameObjects();

  // Create animations for cheerGirl
  this.anims.create({
    key: "cheer",
    frames: this.anims.generateFrameNumbers("cheerGirl"),
    frameRate: 10,
    repeat: 0
  });

  // Set up input events
  this.input.on("pointerdown", handleShoot, this);
  this.input.addPointer(2);

  // Set collision between arrow and target
  this.physics.add.collider(arrow, target, handleHit, null, this);

  // Resize the game objects when the window is resized
  window.addEventListener("resize", function() {
    resizeGameObjects();
  });

  // Move the target sprite manually
  moveTarget();
}

// Update game state
function update() {
  const pointer = this.input.activePointer;
  const angle = Phaser.Math.Angle.Between(bow.x, bow.y, pointer.x, pointer.y);
  bow.setRotation(angle);
}

// Handle arrow shooting
function handleShoot(pointer) {
  const arrowSpeed = 290;
  arrow.visible = true;
  arrow.x = bow.x;
  arrow.y = bow.y;

  if (this.input.pointer1.isDown && this.input.pointer2.isDown) {
    const touch1X = this.input.pointer1.x;
    const touch2X = this.input.pointer2.x;
    const targetX = (touch1X + touch2X) / 2;
    this.physics.moveTo(arrow, targetX, bow.y, arrowSpeed);
  } else {
    this.physics.moveTo(arrow, pointer.x, pointer.y, arrowSpeed);
  }
}

// Resize game objects
function resizeGameObjects() {
  const width = game.scale.width;
  const height = game.scale.height;

  // Position and scale the bow
  bow.setPosition(width * 015, height * 0.8);

  // Position and scale the arrow
  arrow.setPosition(width / 2, height / 2);

  // Position and scale the target
  target.setPosition(width, Phaser.Math.Between(height * 0.2, height * 0.8));

  // Position and scale the cheerGirl
  cheerGirl.setPosition(width / 2, height / 2);

  // Adjust scale based on screen size
  const scaleFactor = Math.min(width / game.config.width, height / game.config.height);
  bow.setScale(0.4 * scaleFactor, 0.3 * scaleFactor);
  arrow.setScale(0.3 * scaleFactor, 0.1 * scaleFactor);
  target.setScale(0.15 * scaleFactor);
}

// Move the target sprite manually
function moveTarget() {
  const targetSpeed = 200; // Adjust target speed

  game.time.addEvent({
    delay: 1000 / targetSpeed,
    loop: true,
    callback: () => {
      const width = game.scale.width;

      if (target.x <= target.width) {
        target.setVelocityX(targetSpeed);
      } else if (target.x >= width - target.width) {
        target.setVelocityX(-targetSpeed);
      }
    }
  });
}

// Handle arrow hitting the target
function handleHit(arrow, target) {
  arrow.x = -1000;
  arrow.y = -1000;

  target.x = Phaser.Math.Between(0.2, 0.8) * game.scale.width;
  target.y = Phaser.Math.Between(game.scale.height * 0.2, game.scale.height * 0.8);

  target.setVelocityX(-200);
  target.setVelocityY(0);

  target.setVelocityX(-200); // Adjust target speed
}
