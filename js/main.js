
enchant();

/* to fix iPhone/iPad "Touch to Start" freeze issue */
enchant.ENV.SOUND_ENABLED_ON_MOBILE_SAFARI = false;

window.onload = function(){

	var Param = (function() {

		var instance;

		function init(){
			// private method sample
			function publicMethodxxx() {
			};

			// private member sample
			var _random = 0;
        	var bgSprite = new Sprite(game.width, game.height);

    		return {
				// public method
    			getRandomPos : function(_ratio) {
					_random = Math.floor(Math.random()*_ratio);
    		   		return _random;
    		  	},
				clear : function() {
				},
				// public member
    		};
		};

		return {
			getInstance: function () {
				if( !instance ) {
					instance = init();
				}
				return instance;
			}
		};
	})();

	var touch_pos_x = 0;
	var touch_pos_y = 0;

	var sDestBlockArray = new Array();

    var game = new Core(320, 320);
    game.fps = 60;
	game.preload('image/yamochi.png');
	game.preload('image/gameover.png');
	game.preload('image/clear.png');
	game.preload('image/bomb_1.png');
	game.preload('image/3ca.png');
	game.preload('image/ytitle.png');
	game.keybind( 71, 'g' );
	game.keybind( 84, 't' );
	game.keybind( 90, 'z' );
	game.keybind( 66, 'b' );
	game.keybind( 82, 'r' );
	game.keybind( 76, 'l' );

	function bomb(_scene, _x, _y, _block){
		var bomb = new PhyBoxSprite( 256, 256, enchant.box2d.STATIC_SPRITE, 1000.0, 1000.0, 1000.0, true);
		//var bomb = new Sprite(256, 256);
		var pm = Param.getInstance();

    	bomb.image = game.assets['image/bomb_1.png'];
    	bomb.frame = 0;
		bomb.position = { x: _x, y : _y };
		bomb.kind = "bomb";

		bomb.tl.repeat(function(){
			bomb.frame++;
		}, 14).and().scaleTo(2.2, 30, enchant.Easing.LINEAR).
		fadeOut(15).then(function(){
			bomb.destroy();
		});

		_scene.addChild(bomb);
		destroyBlockXY(_x, _y, _block);
	}

	function buildWall(_player, _scene, _world){
		var surface1	= new Surface( 1, game.height*2);
		var surface2	= new Surface( game.width*2, 1);
		var left_sprite = new PhyBoxSprite( 1, game.height*2, enchant.box2d.STATIC_SPRITE, 1.0, 0.3, 1.0, true);
		var right_sprite = new PhyBoxSprite( 1, game.height*2, enchant.box2d.STATIC_SPRITE, 1.0, 0.3, 1.0, true);
		var top_sprite = new PhyBoxSprite( game.width*2, 1, enchant.box2d.STATIC_SPRITE, 1.0, 0.0, 3.0, true);
		var bottom_sprite = new PhyBoxSprite( game.width*2, 1, enchant.box2d.STATIC_SPRITE, 1.0, 0.0, 3.0, true);

		surface1.context.fillStyle = "green";
		surface1.context.fillRect(0, 0, surface1.width, surface1.height);
		surface2.context.fillStyle = "green";
		surface2.context.fillRect(0, 0, surface2.width, surface2.height);

		left_sprite.image = surface1;
		left_sprite.position = { x : 0, y : 0 };
		left_sprite.kind = "left_wall";
		right_sprite.image = surface1;
		right_sprite.position = { x : game.width - 1, y : 0 };
		right_sprite.kind = "right_wall";
		top_sprite.image = surface2;
		top_sprite.position = { x : 0, y : 0 };
		top_sprite.kind = "top_wall";
		bottom_sprite.image = surface2;
		//bottom_sprite.position.x = 0;
		//bottom_sprite.position.y = (_player.y + _player.height);
		bottom_sprite.position = { x : 0, y : (_player.y + (_player.height*3)) };
		bottom_sprite.kind = "bottom_wall";

console.log("x = " + bottom_sprite.x + " y = " + bottom_sprite.y);
console.log("pos x = " + bottom_sprite.position.x + " y = " + bottom_sprite.position.y);

		_scene.addChild(left_sprite);
		_scene.addChild(right_sprite);
		_scene.addChild(top_sprite);
		_scene.addChild(bottom_sprite);
	};

	function buildPlayerBlock(/*_posX, _posY */ _width, _height, _pad, _world){
		var surface = new Surface( _width, _height);
		var sprite = new PhyBoxSprite( _width, _height, enchant.box2d.STATIC_SPRITE, 1.0, 10.0, 0.3, true);
		var s_x = Math.floor(game.width/2) - Math.floor(surface.width/2);
		var s_y = Math.floor(game.height) - Math.floor(surface.height) - _pad.height;

		surface.context.fillStyle = "green";
		surface.context.fillRect(0, 0, surface.width, surface.height);

		sprite.image = surface;
		sprite.position = { x : s_x, y : s_y };
		sprite.kind = "player";


		console.log("player x = " + s_x + " player y = " + s_y);

		return sprite;
	};

	var upPower = false;
	var downPower = false;
	var boundRatio = game.fps * 2;
	var isFirstTime = true;

	function checkRange(_x, _y, _block){
		var isInsideRange = false;
		var sx = _x - 128;
		var sy = _y - 128;
		var dx = _x + 128;
		var dy = _y + 128;

		if( (_block.x < dx) && (sx < _block.x + _block.width) &&
			(_block.y < dy) && (sy < _block.y + _block.height)) {
			isInsideRange = true;
		}
		return isInsideRange;
	}

	function destroyBlockXY(_x, _y, _block){
		if(isYamochiMode == false){ 
			do{
				var tmp_block = _block.pop();
				tmp_block.destroy();
			}while(_block.length > 0);
		}
		else{
			for(var ii=0; ii<_block.length; ii++){
				var tmp_block = _block[ii];
				if(checkRange(_x, _y, tmp_block) == true){
					sDestBlockArray.push(tmp_block);
					_block.splice(ii, 1);
					tmp_block.destroy();
				}
			}
		}
	}

	function destroyBlock(_target, _block){
		var ii;
		for(ii=0; ii<_block.length; ii++){
			var tmp_block = _block[ii];
			if(_target == tmp_block){
				sDestBlockArray.push(tmp_block);
				_block.splice(ii, 1);
				tmp_block.destroy();
			}
		}
	}

	function setPlayerCallback(_player, _ball){
		_player.addEventListener(Event.TOUCH_MOVE, function(e) {
			var tmp_x = e.x;
			var tmp_y = e.y;
			var dest_x = tmp_x;

			_player.x = dest_x;

			if(_ball.isAwake == false){
				_ball.x -= dest_x;
			}

			if(_player.x >= game.width - _ball.width - 5){
				_player.x = game.width - _ball.width - 5;
			}
			else if(_player.x <= 0 + 5){
				_player.x = 5;
			}
		});
	}

	function buildSquare(_player, _color, _width, _height, _x, _y){
		var surface = new Surface( _width, _height);
		var sprite = new PhyBoxSprite( surface.width, surface.height, enchant.box2d.DYNAMIC_SPRITE, 1.0, 0.0, 0.0, true);
		var s_x;
		var s_y;

		surface.context.fillStyle = _color;
		surface.context.fillRect(0, 0, surface.width, surface.height);

		if(_x == undefined){
			s_x = Math.floor(_player.x) + Math.floor(_player.width/2) - Math.floor(surface.width/2);
		}
		else{
			s_x = _x;
		}
		if(_y == undefined){
			//s_y = Math.floor(_player.y) - Math.floor(surface.height);
			s_y = 150;
		}
		else{
			s_y = _y;
		}

		console.log("ball x = " + s_x + " ball y = " + s_y);

        sprite.image = game.assets['image/3ca.png'];
		sprite.frame = 0;
		sprite.position = { x : s_x, y : s_y };
		sprite.isAwake = true;
		sprite.kind = "ball";

		return sprite;
	};

	function buildBall(_player, _color, _rad, _x, _y){
		var surface = new Surface( _rad*2, _rad*2);
		var sprite = new PhyCircleSprite(_rad, enchant.box2d.DYNAMIC_SPRITE, 1.0, 0.0, 0.0, false);
		var s_x;
		var s_y;

		surface.context.beginPath();
		surface.context.fillStyle = _color;
		surface.context.arc(_rad, _rad, _rad, 0, Math.PI*2, false);
		surface.context.fill();

		if(_x == undefined){
			s_x = Math.floor(_player.x) + Math.floor(_player.width/2) - Math.floor(surface.width/2);
		}
		else{
			s_x = _x;
		}
		if(_y == undefined){
			//s_y = Math.floor(_player.y) - Math.floor(surface.height);
			s_y = 150;
		}
		else{
			s_y = _y;
		}

		console.log("ball x = " + s_x + " ball y = " + s_y);

//		sprite.image = surface;
        sprite.image = game.assets['image/yamochi.png'];
		sprite.frame = 0;
		sprite.position = { x : s_x, y : s_y };
		sprite.isAwake = true;
		sprite.kind = "ball";

		return sprite;
	};

	function setBallCallback(_ball, _world) {

		_ball.addEventListener(Event.ENTER_FRAME, function(e){
			_world.step(game.fps);
		});
	}

	function divideBall(_player, _scene, _world, _x, _y){
		var ball; 
		ball = buildBall(_player, "red", 50/2, _x, _y); 
		sBallArray.push(ball);
		ball.applyImpulse(new b2Vec2(0.0, 10.0));
		setBallCallback(ball, _world);
		_scene.addChild(ball);
	}

	var sBlockGroup;

	function buildBlocks(_scene, _lines, _player, _pad, _world){
		var s_w = 30;
		var s_h = 10;
		var term_line = 10*10;
		var surface;
		var sprite = Array(0);
		var ii, jj, cnt;
		var s_x, s_y;

		sBlockGroup = new Group();

		cnt = 0;
		for(ii=0; ii<game.width; ii+=s_w){
			for(jj=0; jj<term_line; jj+=s_h){
				var i_col = cnt%4;

				surface = new Surface(s_w, s_h);
				switch(i_col) {
					case 0:
						surface.context.fillStyle = "blue";
						break;
					case 1:
						surface.context.fillStyle = "red";
						break;
					case 2:
						surface.context.fillStyle = "yellow";
						break;
					case 3:
						surface.context.fillStyle = "black";
						break;
				}
				surface.context.fillRect(0, 0, surface.width, surface.height);

				sprite[cnt] = new PhyBoxSprite( s_w, s_h,
												enchant.box2d.STATIC_SPRITE,
												1.0, 0.0, 0.0, true);
				sprite[cnt].image = surface;
				sprite[cnt].color = surface.context.fillStyle;
				sprite[cnt].position = { x : ii, y : jj };
				sprite[cnt].kind = "block";

				sBlockGroup.addChild(sprite[cnt]);
				cnt++;
			}
		}
		_scene.addChild(sBlockGroup);

		if(isYamochiMode == true){
			sBlockGroup.addEventListener(Event.CHILD_REMOVED, function(e){
				var tmp_block = sDestBlockArray.pop();
				var col = tmp_block.color;
				var x = tmp_block.position.x;
				var y = tmp_block.position.y;

				if(isYamochiMode == true){
					if(((col == "#0000ff") && (sBallArray.length < 5)) && (isBomberMode == false))
						divideBall(_player, _scene, _world, x, y);
				}
			});
		}

		return sprite;
	};

	var gameclearScene = function() {
		var scene = new Scene();
		var screen_x = game.width;
		var screen_y = game.height;
		var retryButton = new Button("retry", "light");
		var over_logo = new Sprite(267, 48);

    	over_logo.image = game.assets['image/clear.png'];
		over_logo.x = Math.floor(screen_x/2) - Math.floor(267/2);
		over_logo.y = Math.floor(screen_y/2) - Math.floor(48/2);
    	scene.addChild(over_logo);
		scene.backgroundColor = 'rgba(0, 255, 255, 0.5)';

		retryButton.moveTo(180, 240);
		scene.addChild(retryButton);

        retryButton.addEventListener(Event.TOUCH_END, function(){
			game.popScene();
			game.replaceScene(titleScene());
        });

		return scene;
	};

	var gameoverScene = function() {
		var scene = new Scene();
		var screen_x = game.width;
		var screen_y = game.height;

		var over_logo = new Sprite(189, 97);
    	over_logo.image = game.assets['image/gameover.png'];
		over_logo.x = Math.floor(screen_x/2) - Math.floor(189/2);
		over_logo.y = Math.floor(screen_y/2) - Math.floor(97/2);

    	scene.addChild(over_logo);
		scene.backgroundColor = 'rgba(0, 0, 255, 0.5)';

		scene.addEventListener(Event.TOUCH_START, function(e) {
			game.popScene();
			game.replaceScene(titleScene());
		});

		return scene;
	};

	var sBallArray;
	var sBombArray;

	var isBomberMode = false;

	var isYamochiMode = false;

	var prevLength = 0;
	var currentLength = 0;
	var assertCount = 0;
	var WATCH_DOG_COUNT = 180;
	var sWatchDogCount = 0;

	var startScene = function (){
		//var world = new PhysicsWorld( 0.0, 9.8 );
		var world = new PhysicsWorld( 0.0, 0.01 );
		var scene = new Scene();
		var pad = new Pad();
		var ii = 0;

		var player = buildPlayerBlock(100, 12, pad, scene, world);
		var block = buildBlocks(scene, 10, player, pad, world);
		sBallArray = new Array(0);

		for(ii=0; ii<1; ii++){
			var ball; 
			if(isYamochiMode == true){
				ball = buildBall(player, "red", 50/2); 
			}
			else{
				ball = buildSquare(player, "red", 43, 23); 
			}
			ball.isAwake = true;
			ball.setAwake(ball.isAwake);
			ball.applyImpulse( new b2Vec2(0.3, 2.0) )
			scene.addChild(ball);
			sBallArray.push(ball);

console.log("sBallArray.length = " + sBallArray.length);

			setPlayerCallback(player, ball);
			setBallCallback(ball, world);
		}
		buildWall(player, scene, world);

		scene.addChild(player);

		scene.addEventListener(Event.ENTER_FRAME, function(e){
			var move_distance = player.position.x;
			var input = game.input;
			{
				/* focus on player */
				if (input.up)    {
					upPower = true;
				}

				if(input.g){
					for(var ii=0; ii<sBallArray.length; ii++){
						var ball = sBallArray[ii];
						ball.applyImpulse(new b2Vec2(0.0, 5.0));
					}
				}

				if(input.z){
					for(var ii=0; ii<sBallArray.length; ii++){
						var ball = sBallArray[ii];
						ball.applyImpulse(new b2Vec2(0.0, -5.0));
					}
				}

				if(input.r){
					for(var ii=0; ii<sBallArray.length; ii++){
						var ball = sBallArray[ii];
						ball.applyImpulse(new b2Vec2(5.0, 0.0));
					}
				}

				if(input.l){
					for(var ii=0; ii<sBallArray.length; ii++){
						var ball = sBallArray[ii];
						ball.applyImpulse(new b2Vec2(-5.0, 0.0));
					}
				}

				if(input.t){
					for(var ii=0; ii<sBallArray.length; ii++){
						var ball = sBallArray[ii];
						ball.applyTorque(0.3);
					}
				}

				if(input.b){
					isBomberMode = true;
				}

				if (input.down)  {
					downPower = true;
				}
	
				if (input.left)  {
					player.x -= 8;
				}
				if (input.right) {
					player.x += 8;
				}
	
				if(player.x <= 0) {
					player.x = 0;
				}
	
				if(player.x + player.width > game.width) {
					player.x = game.width - player.width;
				}
			}

			{
				/* focus on ball */
				if(sBallArray.length <= 0){
					game.pushScene(gameoverScene());
				}
				else{
					sWatchDogCount++;
					if(sWatchDogCount >= WATCH_DOG_COUNT){
						if((prevLength == 0) && (currentLength == 0)){
							prevLength = sBallArray.length;
						}
						else {
							currentLength = sBallArray.length;
							if(prevLength == currentLength){
								assertCount++;
								if(assertCount > 3){
									for(var ii=0; ii<sBallArray.length; ii++){
										if((sBallArray[ii].position.x > game.width) ||
										   (sBallArray[ii].position.x < 0)		  	||
										   (sBallArray[ii].position.y > game.height)||
										   (sBallArray[ii].position.y < 0))
										{
											if(sBallArray[ii].destroy != undefined){
												sBallArray[ii].destroy();
											}
											sBallArray.splice(ii, 1);
											assertCount = 0;
										}
									}
								}
								else if(assertCount > 50){
									for(var ii=0; ii<sBallArray.length; ii++){
										if(sBallArray[ii].destroy != undefined){
											sBallArray[ii].destroy();
										}
										sBallArray.splice(ii, 1);
									}
								}
							}
						}
					}
				}

				if(block.length <= 0){
					game.replaceScene(gameclearScene());
				}

				for(var ii=0; ii<sBallArray.length; ii++){
					var ball = sBallArray[ii];
					var moveX = sBallArray[ii].x;
					var moveY = sBallArray[ii].y;

					if(ball.isAwake == false){
						move_distance -= player.position.x;
						//ball.x -= move_distance;
						if (input.up) {
							ball.isAwake = true;
						}
						if(input.left) {
							ball.applyTorque(-1.0);
						}
						if(input.right) {
							ball.applyTorque(1.0);
						}
						ball.setAwake(ball.isAwake);
					}
					else{
						ball.contact(function(obj){
							if(obj.kind == "player"){
								if(upPower == true){
									upPower = false;
									downPower = false;
									ball.applyImpulse( new b2Vec2(0.0, -10.0) );
									console.log("upPower");
									ball.isAwake = true;
								}
								else if(downPower == true){
									if(ball.y+ball.height <= player.y){
										ball.y = player.y - ball.height;
									}
									upPower = false;
									downPower = false;
									console.log("downPower");
									ball.isAwake = false;
								}
								ball.setAwake(ball.isAwake);
							}
							else if(obj.kind == "block") {
								ball.setAwake(false);
								destroyBlock(obj, block);

								if(isYamochiMode == true){
									ball.applyImpulse(new b2Vec2(0.0, 2.0));
								}
								else {
									var zx = ball.vx;
									var zy = ball.vy - 2.0;
									if(zx > 0){
										zx += 1.0;
									}
									else {
										zx -= 1.0;
									}
									ball.applyImpulse(new b2Vec2(zx, zy));
									ball.applyTorque(zx);
								}
								
								ball.setAwake(true);
								if(isBomberMode == true){
									bomb(scene, ball.x, ball.y, block);
									for(var ii=0; ii<sBallArray.length; ii++){
										if(ball == sBallArray[ii]){
											sBallArray.splice(ii, 1);
											ball.destroy();
										}
									}
									isBomberMode = false;
								}
							}
							else if(obj.kind == "ball"){
//								obj.destroy();
							}
							else if(obj.kind == "bottom_wall"){
								var isFoundBall = false;
								ball.setAwake(false);
								for(var ii=0; ii<sBallArray.length; ii++){
									console.log("pos x = " + sBallArray[ii].position.x + " y = " + sBallArray[ii].position.y);
									console.log("x = " + sBallArray[ii].x + " y = " + sBallArray[ii].y);
									if(ball == sBallArray[ii]){
										sBallArray.splice(ii, 1);
										ball.destroy();
										isFoundBall = true;
									}
									else if((sBallArray[ii].position.x > game.width) ||
									   (sBallArray[ii].position.x < 0)		  		 ||
									   (sBallArray[ii].position.y > game.height) 	 ||
									   (sBallArray[ii].position.y < 0))
									{
										console.log("delete orphan ball");
										if(sBallArray[ii].destroy != undefined){
											console.log("probably ok?");
											sBallArray[ii].destroy();
										}
										sBallArray.splice(ii, 1);
									}
								}
								ball.setAwake(true);
								console.log("is found destroy target ball = " + isFoundBall);
							}
						});
					}
				}
			}
		});

		pad.moveTo(game.width/2 - (pad.width/2), game.height-pad.height);
		scene.addChild(pad);

		return scene;
	};

	var titleScene = function (){
		var scene = new Scene();

		var titleSprite = new Sprite(252, 320);
		var startButton = new Button("START", "light");
		var yamochiButton = new Button("Yamochi", "light");

    	titleSprite.image = game.assets['image/ytitle.png'];

		startButton.moveTo(50, 230);
		yamochiButton.moveTo(130, 230);

		scene.addChild(titleSprite);
		scene.addChild(startButton);
		scene.addChild(yamochiButton);

        startButton.addEventListener(Event.TOUCH_END, function(){
			isYamochiMode = false;
			game.replaceScene(startScene());
        });

		yamochiButton.addEventListener(Event.TOUCH_END, function(){
			isYamochiMode = true;
			game.replaceScene(startScene());
        });

		return scene;
	};

	game.onload = function(){
		game.replaceScene(titleScene());
	}

    game.start();
};

