
enchant();

/* to fix iPhone/iPad "Touch to Start" freeze issue */
enchant.ENV.SOUND_ENABLED_ON_MOBILE_SAFARI = false;

window.onload = function(){

	var sImmotalBlockCount = 0;
	var sBlockGroup;

	var upPower = false;
	var downPower = false;
	var isFirstTime = true;

	var sDestBlockArray;
    var game = new Core(320, 320);

	var sBallArray;
	var sBombArray;

	var isBomberMode = false;
	var isYamochiMode = false;

	var prevLength = 0;
	var currentLength = 0;
	var assertCount = 0;
	var WATCH_DOG_COUNT = 180;
	var sWatchDogCount = 0;

    game.fps = 60;
	game.preload('image/yamochi.png', 'image/gameover.png', 'image/clear.png',
				 'image/bomb_1.png', 'image/3ca.png', 'image/ytitle.png');
	game.keybind( 71, 'g' );
	game.keybind( 84, 't' );
	game.keybind( 90, 'z' );
	game.keybind( 66, 'b' );
	game.keybind( 82, 'r' );
	game.keybind( 76, 'l' );
	game.keybind( 83, 's' );

	function initialize_params(){
		sImmotalBlockCount  = 0;
		upPower = false;
		downPower = false;
		isFirstTime = true;
		sDestBlockArray = new Array();
		sBallArray = new Array();
		sBombArray = new Array();
		isBomberMode = false;
		//isYamochiMode = false;

		prevLength = 0;
		currentLength = 0;
		assertCount = 0;
		WATCH_DOG_COUNT = 180;
		sWatchDogCount = 0;
	}

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

	function destroyBall(_ballArray, _obj, _isForceDestroy){
		var isDestroyComplete = false;
		for(var ii=0; ii<_ballArray.length; ii++){
			if((_isForceDestroy == true) ||
			   (_obj == _ballArray[ii])  ||
			   ((_ballArray[ii].position.x > game.width) ||
			    (_ballArray[ii].position.x < 0)		  	 ||
			    (_ballArray[ii].position.y > game.height)||
			    (_ballArray[ii].position.y < 0)))
			{
				if(_ballArray[ii].destroy != undefined){
					_ballArray[ii].destroy();
				}
				_ballArray.splice(ii, 1);
				isDestroyComplete = true;
			}
		}
		return isDestroyComplete;
	}

	function forceDestroyBall(_ball){
		destroyBall(_ball, true);
	}

	function bomb(_scene, _x, _y, _block){
		var bomb = new PhyBoxSprite( 256, 256, enchant.box2d.STATIC_SPRITE, 1000.0, 1000.0, 1000.0, true);

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
		bottom_sprite.position = { x : 0, y : (_player.y + (_player.height*3)) };
		bottom_sprite.kind = "bottom_wall";

		_scene.addChild(left_sprite);
		_scene.addChild(right_sprite);
		_scene.addChild(top_sprite);
		_scene.addChild(bottom_sprite);
	};

	function buildPlayerBlock(_width, _height, _pad, _world){
		var surface = new Surface( _width, _height);
		var sprite = new PhyBoxSprite( _width, _height, enchant.box2d.STATIC_SPRITE, 1.0, 20.0, 0.5, true);
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
				if(tmp_block.color != "#000000"){
					sDestBlockArray.push(tmp_block);
					_block.splice(ii, 1);
					tmp_block.destroy();
				}
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

	var sBlockStage1 = [ 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 
						 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 
						 9, 9, 9, 1, 9, 9, 1, 9, 9, 9, 
						 0, 9, 1, 1, 9, 9, 1, 1, 9, 0, 
						 0, 9, 1, 1, 9, 9, 1, 1, 9, 0, 
						 9, 9, 9, 1, 9, 9, 1, 9, 9, 9, 
						 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 
						 9, 2, 9, 9, 3, 3, 9, 9, 2, 9 ];

	var sBlockStage2 = [ 9, 0, 0, 9, 9, 9, 9, 0, 0, 9, 
						 1, 9, 9, 9, 9, 9, 9, 9, 9, 1, 
						 1, 9, 9, 9, 9, 9, 9, 9, 9, 1, 
						 0, 9, 9, 9, 9, 9, 9, 9, 9, 0, 
						 0, 9, 9, 9, 9, 9, 9, 9, 9, 0, 
						 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 
						 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 
						 9, 2, 9, 9, 3, 3, 9, 9, 2, 9 ];

	var sBlockStage3 = [ 9, 9, 9, 9, 1, 1, 9, 9, 9, 9, 
						 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 
						 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 
						 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 
						 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 
						 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 
						 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 
						 9, 2, 9, 9, 3, 3, 9, 9, 2, 9 ];

	var sBlockStage4 = [ 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 
						 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 
						 9, 9, 9, 9, 1, 1, 9, 9, 9, 9, 
						 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 
						 9, 9, 9, 9, 3, 3, 9, 9, 9, 9, 
						 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 
						 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 
						 9, 2, 9, 9, 9, 9, 9, 9, 2, 9 ];

	function buildBlocks(_scene, _blk_array, _lines, _player, _pad, _world){
		var s_w = 30;
		var s_h = 10;
		var term_line = 10*10;
		var surface;
		var sprite = new Array();
		var ii, jj, cnt;
		var s_x, s_y;

		var start_x = 15;
		var end_x = game.width - 10;
		var start_y = 10;
		var end_y = term_line - 10;

		sBlockGroup = new Group();

		cnt = 0;
		for(jj=start_y; jj<end_y; jj+=s_h){
			NEXT:
			for(ii=start_x; ii<end_x; ii+=s_w){
				var tmp_sprite;
				var pos_x = ii+10;
				var pos_y = jj;
				var i_col = _blk_array[cnt++];

				if(i_col == 9){
					continue NEXT;
				}

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
						sImmotalBlockCount++;
						break;
				}
				surface.context.fillRect(0, 0, surface.width, surface.height);

				tmp_sprite  = new PhyBoxSprite( s_w, s_h,
												enchant.box2d.STATIC_SPRITE,
												1.0, 0.0, 0.0, true);
				tmp_sprite.image = surface;
				tmp_sprite.color = surface.context.fillStyle;
				tmp_sprite.position = { x : pos_x, y : pos_y };
				tmp_sprite.kind = "block";

				sprite.push(tmp_sprite);
				var last_pos = sprite.length - 1; 
				sBlockGroup.addChild(sprite[last_pos]);
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

	function getBlockByStageNumber(_num){
		var retBlocks;
		console.log("num = " + _num);
		switch(_num){
			case 4:
				retBlocks = sBlockStage4;
				break;
			case 3:
				retBlocks = sBlockStage3;
				break;
			case 2:
				retBlocks = sBlockStage2;
				break;
			case 1:
			default:
				retBlocks = sBlockStage1;
				break;
		}
		return retBlocks;
	}

	var gameclearScene = function(_stage_number) {
		var scene = new Scene();
		var screen_x = game.width;
		var screen_y = game.height;
		var retryButton = new Button("retry", "light");
		var nextButton = new Button("next", "light");
		var exitButton = new Button("exit", "light");
		var over_logo = new Sprite(267, 48);

    	over_logo.image = game.assets['image/clear.png'];
		over_logo.x = Math.floor(screen_x/2) - Math.floor(267/2);
		over_logo.y = Math.floor(screen_y/2) - Math.floor(48/2);
    	scene.addChild(over_logo);
		scene.backgroundColor = 'rgba(0, 255, 255, 0.5)';

		retryButton.moveTo(180, 240);
		scene.addChild(retryButton);

        retryButton.addEventListener(Event.TOUCH_END, function(){
			var current_stage = _stage_number;
			game.replaceScene(gameStage(current_stage));
        });

		nextButton.moveTo(120, 240);
		scene.addChild(nextButton);

        nextButton.addEventListener(Event.TOUCH_END, function(){
			var next_stage = _stage_number+1;
			game.replaceScene(gameStage(next_stage));
        });

		exitButton.moveTo(240, 240);
		scene.addChild(exitButton);

        exitButton.addEventListener(Event.TOUCH_END, function(){
			game.popScene();
			game.replaceScene(titleScene());
        });

		return scene;
	};

	var gameoverScene = function(_stage_number) {
		var scene = new Scene();
		var screen_x = game.width;
		var screen_y = game.height;
		var retryButton = new Button("retry", "light");
		var exitButton = new Button("exit", "light");

		var over_logo = new Sprite(189, 97);
    	over_logo.image = game.assets['image/gameover.png'];
		over_logo.x = Math.floor(screen_x/2) - Math.floor(189/2);
		over_logo.y = Math.floor(screen_y/2) - Math.floor(97/2);

    	scene.addChild(over_logo);
		scene.backgroundColor = 'rgba(0, 0, 255, 0.5)';
		
		retryButton.moveTo(180, 240);
		scene.addChild(retryButton);

        retryButton.addEventListener(Event.TOUCH_END, function(){
			var current_stage = _stage_number;
			game.popScene();
			game.replaceScene(gameStage(current_stage));
        });

		exitButton.moveTo(240, 240);
		scene.addChild(exitButton);

        exitButton.addEventListener(Event.TOUCH_END, function(){
			game.popScene();
			game.replaceScene(titleScene());
        });

		return scene;
	};

	var gameStage = function (_stage){
		var world = new PhysicsWorld( 0.0, 0.01 );
		var scene = new Scene();
		var pad = new Pad();
		var ii = 0;

		var ball; 
		var player;
		var block;

		initialize_params();

		player = buildPlayerBlock(100, 12, pad, scene, world);
		block = buildBlocks(scene, getBlockByStageNumber(_stage), 10, player, pad, world);
		sBallArray = new Array(0);

console.log("stage = " + _stage);

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

		setPlayerCallback(player, ball);
		setBallCallback(ball, world);

		buildWall(player, scene, world);

		scene.addChild(player);

		scene.addEventListener(Event.ENTER_FRAME, function(e){
			var move_distance = player.position.x;
			var input = game.input;
			{
				/* focus on ball */
				for(var ii=0; ii<sBallArray.length; ii++){
					var ball = sBallArray[ii];
					var posX = sBallArray[ii].x;
					var posY = sBallArray[ii].y;

					var deadLine = (player.y + (player.height) + 5);
					if(posY >= deadLine){
						destroyBall(sBallArray, ball);
					}

					if(ball.isAwake == false){
						move_distance -= player.position.x;
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

								if(obj.color == "#000000"){
									var zx = ball.position.x;
									var zy = ball.vy + 1.2;
									var center = game.width / 2;
									if(zx > center){
										zx = ball.vx - 1.2;
									}
									else { 
										zx = ball.vx + 1.2;
									}

									if(obj.y >= ball.position.y){
										zy *= -1;
									}

									ball.applyImpulse(new b2Vec2(zx, zy));
								}
								else if(isYamochiMode == true){
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
									destroyBall(sBallArray, ball);
									isBomberMode = false;
								}
							}
							else if(obj.kind == "ball"){
//								obj.destroy();
							}
							else if(obj.kind == "bottom_wall"){
								destroyBall(sBallArray, ball);
							}
						});
					}
				}

				if(sBallArray.length <= 0){
					game.pushScene(gameoverScene(_stage));
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
									if(destroyBall(sBallArray) == true)
										assertCount = 0;
								}
								else if(assertCount > 50){
									forceDestroyBall(sBallArray);
									assertCount = 0;
								}
							}
						}
					}
				}
				/* clear check => or rather, all blocks destruction is completed? */
				var lastBlockLength = block.length - sImmotalBlockCount;
				if(lastBlockLength <= 0){
					game.replaceScene(gameclearScene(_stage));
				}
			}

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

				if(input.s){
					var lastBlockLength = block.length - sImmotalBlockCount;
					console.log("block length = " + block.length + " last = " + lastBlockLength);
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

		initialize_params();
    	titleSprite.image = game.assets['image/ytitle.png'];

		startButton.moveTo(50, 230);
		yamochiButton.moveTo(130, 230);

		scene.addChild(titleSprite);
		scene.addChild(startButton);
		scene.addChild(yamochiButton);

        startButton.addEventListener(Event.TOUCH_END, function(){
			isYamochiMode = false;
			game.replaceScene(gameStage(1));
        });

		yamochiButton.addEventListener(Event.TOUCH_END, function(){
			isYamochiMode = true;
			game.replaceScene(gameStage(1));
        });

		return scene;
	};

	game.onload = function(){
		game.replaceScene(titleScene());
	}

    game.start();
};

