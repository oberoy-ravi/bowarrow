// Create a new Phaser game instance
const config = {
  type: Phaser.AUTO,
  width: window.innerWidth * window.devicePixelRatio,
  height: window.innerHeight * window.devicePixelRatio,
  backgroundColor: "#ffffff",
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: 0,
      },
      debug: true,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
  input: {
    activePointers: 2,
  },
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
  this.load.spritesheet(
    "cheerGirl",
    "path/to/cheer-girl-spritesheet.png",
    {
      frameWidth: 64,
      frameHeight: 64,
    }
  );
}

// Create game objects
function create() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  arrow = this.physics.add.sprite(width / 2, height / 2, "arrow");
  arrow.visible = false;

  bow = this.add.sprite(width / 2, height - 100, "bow");
  bow.setScale(0.4, 0.3);
  bow.setPosition(width * 0.15, height * 0.8);

  arrow.setScale(0.3, 0.1);

  target = this.physics.add.sprite(
    width,
    Phaser.Math.Between(height * 0.2, height * 0.8),
    "target"
  );
  target.setScale(0.15);

  cheerGirl = this.add.sprite(width / 2, height / 2, "cheerGirl");
  cheerGirl.visible = false;

  this.anims.create({
    key: "cheer",
    frames: this.anims.generateFrameNumbers("cheerGirl"),
    frameRate: 10,
    repeat: 0,
  });

  this.input.on("pointerdown", handleShoot, this);
  this.input.addPointer(2);

  this.physics.add.collider(arrow, target, handleHit, null, this);

  // Resize the game to fit the new window dimensions
  window.addEventListener("resize", function () {
    const newWidth = window.innerWidth * window.devicePixelRatio;
    const newHeight = window.innerHeight * window.devicePixelRatio;

    game.scale.resize(newWidth, newHeight);
  });

  // Move the target manually
  moveTarget();
}

// Update game state
function update() {
  const width = window.innerWidth;

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
    const touch1X = thisinput.pointer1.x;
    const touch2X = this.input.pointer2.x;
    const targetX = (touch1X + touch2X) / 2;

    this.physics.moveTo(arrow, targetX, bow.y, arrowSpeed);
  } else {
    this.physics.moveTo(arrow, pointer.x, pointer.y, arrowSpeed);
  }
}

// Move the target sprite manually
function moveTarget() {
  const width = window.innerWidth;
  const targetSpeed = 200; // Adjust target speed

  game.time.addEvent({
    delay: width / targetSpeed,
    loop: true,
    callback: () => {
      if (target.x <= target.width) {
        target.setVelocityX(targetSpeed);
      } else if (target.x >= width - target.width) {
        target.setVelocityX(-targetSpeed);
      }
    },
  });
}

// Helper function to get a random element from an array
function getRandom(array) {
  return Phaser.Utils.Array.GetRandom(array);
}

// Handle arrow hitting the target
function handleHit(arrow, target) {
  arrow.x = -1000;
  arrow.y = -1000;

  target.x = Phaser.Math.Between(0.2, 0.8) * window.innerWidth;
  target.y = Phaser.Math.Between(
    window.innerHeight * 0.2,
    window.innerHeight * 0.8
  );

  target.setVelocityX(-200);
  target.setVelocityY(0);

  target.setVelocityX(-200);
}
