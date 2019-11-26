class Scene2 extends Phaser.Scene {
    constructor() {
        super("playGame");
    }
    create() {
        this.background = this.add.image(0, 0, "background");
        this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
        this.background.setOrigin(0, 0);
        this.ship1 = this.add.sprite(config.width/2 - 50, config.height/2, "ship");
        this.ship2 = this.add.sprite(config.width/2, config.height/2, "ship1");
        this.ship3 = this.add.sprite(config.width/2 + 50, config.height/2, "ship2");

        this.powerUps = this.physics.add.group();

        let maxObjects = 4;
        for (let i = 0; i < maxObjects; i++) {
            let powerUp = this.physics.add.sprite(16, 16, "power-up");
            this.powerUps.add(powerUp);
            powerUp.setRandomPosition(0, 0, config.width, config.height);

            if(Math.random() > 0.5) {
                powerUp.play("red");
            } else {
                powerUp.play("gray");
            }

            powerUp.setVelocity(100, 100);
            powerUp.setCollideWorldBounds(true);
            powerUp.setBounce(1);
        }

        this.ship1.play("ship1_anim");
        this.ship2.play("ship2_anim");
        this.ship3.play("ship3_anim");

        this.ship1.setInteractive();
        this.ship2.setInteractive();
        this.ship3.setInteractive();

        this.input.on('gameobjectdown', this.detroyShip, this)

        let graphics = this.add.graphics();
        graphics.fillStyle(0x000000, 1);
        graphics.beginPath();
        graphics.moveTo(0, 0);
        graphics.lineTo(config.width, 0);
        graphics.lineTo(config.width, 25);
        graphics.lineTo(0, 25);
        graphics.lineTo(0, 0);
        graphics.closePath();
        graphics.fillPath();

        this.score = 0;
        this.scoreLabel = this.add.text(10, 5, "SCORE", {font: "15px Arial", fill: "White"});

        this.player = this.physics.add.sprite(config.width / 2 - 8, config.height - 64, "player");
        this.player.play("thrust");
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.player.setCollideWorldBounds(true);

        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.projectiles = this.add.group();

        this.physics.add.collider(this.projectiles, this.powerUps, (projectile, powerUp) => {
            projectile.destroy();
        });

        this.physics.add.overlap(this.player, this.powerUps, this.pickPowerUp, null, this);

        this.enemies = this.physics.add.group();
        this.enemies.add(this.ship1);
        this.enemies.add(this.ship2);
        this.enemies.add(this.ship3);

        this.physics.add.overlap(this.player, this.enemies, this.hurtPlayer, null, this);
        this.physics.add.overlap(this.projectiles, this.enemies, this.hitEnemy, null, this);

        // sound
        this.beamSound = this.sound.add("audio_beam");

        let musicConfig = {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: false,
            delay: 0
        }
        this.beamSound.play(musicConfig);
    }
    pickPowerUp(player, powerUp) {
        powerUp.disableBody(true, true);
    }
    hurtPlayer(player, enemy) {
        this.resetShipPos(enemy);
        if(player.alpha === 1) {
            let explosion = new Explosion(this, player.x, player.y);
            player.disableBody(true, true);
            this.scoreLabel.text = "SCORE: 0";
            this.time.addEvent({
                delay: 1000,
                callback: this.resetPlayer,
                callbackScope: this,
                loop: false
            });
        }
    }
    resetPlayer() {
        let x = config.width / 2 - 8;
        let y = config.height - 64;
        this.player.enableBody(true, x, y, true, true);

        this.player.alpha = 0.5;

        let tween = this.tweens.add({
            targets: this.player,
            y: config.height - 64,
            ease: 'Power1',
            duration: 1500,
            repeat: 0,
            onComplete: () => {
                this.player.alpha = 1;
            },
            callbackScope: this
        });
    }
    hitEnemy(projectiles, enemy) {
        projectiles.destroy();
        this.score += 15;
        this.scoreLabel.text = "SCORE: " + this.score;
        this.resetShipPos(enemy);
        let scoreFormated = this.zeroPad(this.score, 6);
        this.scoreLabel.text = "SCORE: " + scoreFormated;
    }
    update() {
        this.moveShip(this.ship1, 1);
        this.moveShip(this.ship2, 2);
        this.moveShip(this.ship3, 3);

        this.background.tilePositionY -= 0.5;

        this.movePlayerManager();
        if(Phaser.Input.Keyboard.JustDown(this.spacebar)) {
            if(this.player.active) this.shootBeam();
        }
        for (let i = 0; i <this.projectiles.getChildren().length; i++) {
            let beam = this.projectiles.getChildren()[i];
            beam.update()
        }
    }
    moveShip(ship, speed) {
        ship.y += speed;
        if(ship.y > config.height) {
            this.resetShipPos(ship);
        }
    }
    resetShipPos(ship) {
        let explosion = new Explosion(this, ship.x, ship.y);
        ship.y = 0;
        let randomX = Phaser.Math.Between(0, config.width);
        ship.x = randomX;
    }
    detroyShip(pointer, gameObject) {
        gameObject.setTexture("explosion");
        gameObject.play("explode");
    }
    movePlayerManager() {
        if(this.cursorKeys.left.isDown) {
            this.player.setVelocityX(-gameSettings.playerSpeed);
        } else if(this.cursorKeys.right.isDown) {
            this.player.setVelocityX(gameSettings.playerSpeed);
        } else {
            this.player.setVelocityX(0);
        }
        if(this.cursorKeys.up.isDown) {
            this.player.setVelocityY(-gameSettings.playerSpeed);
        } else if(this.cursorKeys.down.isDown) {
            this.player.setVelocityY(gameSettings.playerSpeed);
        } else {
            this.player.setVelocityY(0);
        }
    }
    shootBeam() {
        // let beam = this.physics.add.sprite(this.player.x, this.player.y, "beam"); cách 1 hoặc cách 2 tạo class mới
        let beam = new Beam(this);
        this.beamSound.play();
    }
    zeroPad(number, size) {
        let stringNumber = String(number);
        while(stringNumber.length < (size || 2)) {
            stringNumber = "0" + stringNumber;
        }
        return stringNumber;
    }
}
