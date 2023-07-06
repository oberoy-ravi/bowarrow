// Create a new Phaser game instance
const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: "#ffffff",
  physics: {
    default: "arcade",
      arcade: {
        gravity: {
          y: 0
        },
        // Set gravity to 0 for arrow movement
        debug: true,
        // Set to true for physics debugging
      },
    },
    scene: {
      preload: preload,
      create: create,
      update: update,
    },
    input: {
      activePointers: 2,
      // Allow multiple touch pointers
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
    this.load.spritesheet("cheerGirl", "path/to/cheer-girl-spritesheet.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
  }

  // Create game objects
  function create() {
    arrow = this.physics.add.sprite(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      "arrow"
    );
    arrow.visible = false;

    bow = this.add.sprite(
      this.cameras.main.width / 2,
      this.cameras.main.height - 100,
      "bow"
    );

    bow.setScale(0.4, 0.3);
    bow.setPosition(175, 600);

    arrow.setScale(.3, 0.1);
    


    target = this.physics.add.sprite(
      this.cameras.main.width,
      Phaser.Math.Between(
        this.cameras.main.height * 0.2,
        this.cameras.main.height * 0.8
      ),
      "target"
    );
    target.setVelocityX(-200); // Adjust target speed
    target.setScale(0.15)
    cheerGirl = this.add.sprite(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      "cheerGirl"
    );
    cheerGirl.visible = false;

    // Create animations for cheerGirl
    this.anims.create({
      key: "cheer",
      frames: this.anims.generateFrameNumbers("cheerGirl"),
      frameRate: 10,
      repeat: 0,
    });

    // Set up input events
    this.input.on("pointerdown", handleShoot, this);
    this.input.addPointer(2); // Add support for the second pointer

    // Set collision between arrow and target
    this.physics.add.collider(arrow, target, handleHit, null, this);
  }

  // Update game state
  function update() {
    // Rotate bow based on pointer position
    const pointer = this.input.activePointer;
    const angle = Phaser.Math.Angle.Between(bow.x, bow.y, pointer.x, pointer.y);
    bow.setRotation(angle);

// Oscillate target between the maximum width of the screen
    if (target.x >= this.cameras.main.width - target.width) {
      target.setVelocityX(-100); // Adjust target speed
    } else if (target.x <= target.width) {
      target.setVelocityX(100); // Adjust target speed
    }
  }



  // Handle arrow shooting
  function handleShoot(pointer) {
    const arrowSpeed = 290; // Adjust this value for arrow speed

    arrow.visible = true;
    arrow.x = bow.x;
    arrow.y = bow.y;


    // Check if touch input
    if (this.input.pointer1.isDown && this.input.pointer2.isDown) {
      const touch1X = this.input.pointer1.x;
      const touch2X = this.input.pointer2.x;

      // Use the average of both touch positions
      const targetX = (touch1X + touch2X) / 2;

      this.physics.moveTo(arrow, targetX, bow.y, arrowSpeed);
    } else {
      // Single touch input
      this.physics.moveTo(arrow, pointer.x, pointer.y, arrowSpeed);
    }
  }



  // Helper function to get a random element from an array
  function getRandom(array) {
    return Phaser.Utils.Array.GetRandom(array);
  }

  // Handle arrow hitting the target
  function handleHit(arrow, target) {
    //cheerGirl.visible = true;
    //cheerGirl.play("cheer")

    arrow.x = -1000;
    arrow.y = -1000;

    // Reset target position and velocity
    target.x = Phaser.Math.Between(0.2, 0.8) * game.config.width;

    target.y = Phaser.Math.Between(
      game.config.height * 0.2,
      game.config.height * 0.8
    );

    target.setVelocityX(-200)
    target.setVelocityY(0)

    target.setVelocityX(-200); // Adjust target speed
  }