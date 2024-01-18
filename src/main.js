import kaboom from "kaboom"

const k = kaboom()

//Variables
const floorHeight = 100;
const jumpForce = 700;
const obstacleSpeed = 480;


k.loadSprite("bean", "sprites/bean.png")
k.loadSprite("dino", "sprites/dino.webp")


scene("game", () => {
	
	setGravity(1800)
	let score = 0;
	const scoreLabel = add([
		text(score),
		pos(24, 24)
	])
	
	// onUpdate runs every frame
	onUpdate(() => { 
		score++;
		scoreLabel.text = score;
	});
	
	const player = k.add([
		sprite("dino"),
		pos(80, 40),
		scale(.5),
		area(),
		body(),
	])
	
	// Platform/Floor
	add([
		rect(width(), floorHeight),
		pos(0, height() - floorHeight),
		outline(4), //outline of 4 pixels, kinda like css borders
		area(), //adds collision
		body({ isStatic: true }), //makes object immovable, and none static objects can't move past it
		color('#ff69b4'),
	])
	

	//Collision
	player.onCollide("obstacle", () => {
		addKaboom(player.pos);
		shake();
		go("lose", score)
	});
	
	// Playermovement
	onKeyPress("space", () => {
		if (player.isGrounded()) {
			player.jump(jumpForce)
		}
	})
	onKeyDown("down", () => {
		setGravity(9000)
	})
	onKeyRelease("down", () => {
		setGravity(1800)
	})
	
	function spawnObstacle() {
		add([
			rect(40, rand(50, 100)),
			area(),
			outline(4),
			pos(width(), height() - floorHeight),
			anchor("botleft"),
			color(255, 0, 0),
			move(LEFT, obstacleSpeed), //Move a direction (direction, movementspeed in pixel pr second)
			"obstacle", //this is called a "tag", objects can have multiple of these
		]);
		wait(rand(0.5, 2), () => {
			spawnObstacle();
		})
	};
	spawnObstacle()

})


scene("lose", (score) => {
	add([
		text("Game Over"),
        pos(center()),
        anchor("center"),
    ])

	add([
		text("Press space to try again"),
		pos(width() / 2, height() - 100 ),
        anchor("center"),
    ])
	
	add([
		text(score),
        pos(width() / 2, height() / 2 + 80),
        scale(2),
        anchor("center"),
    ]);

	// go back to game with space is pressed
    onKeyPress("space", () => go("game"));
})

go("game")