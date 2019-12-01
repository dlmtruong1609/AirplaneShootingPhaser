import Scene1 from './scene/scene1'
import Scene2 from './scene/scene2'
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
    },
    gameSettings: {
        playerSpeed: 200,
    }
}
window.onload = () => {
    let game = new Phaser.Game(config);
}
export default config