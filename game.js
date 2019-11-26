const config = {
    width: 256,
    height: 272,
    scene: [Scene1, Scene2],
    backgroundColor: 0x000000,
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    }
}
const gameSettings = {
    playerSpeed: 200,
}
window.onload = () => {
    let game = new Phaser.Game(config);
}