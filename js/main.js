
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

	var dColArray = new Array();
	var dXArray = new Array();
	var dYArray = new Array();

    var game = new Core(320, 320);
    game.fps = 60;
	game.preload('image/yamochi.png');

	function buildWall(_scene, _world){
		var surface	= new Surface( 1, game.height);
		var left_sprite = new PhyBoxSprite( 1, game.height, enchant.box2d.STATIC_SPRITE, 1.0, 0.3, 1.0, true);
		var right_sprite = new PhyBoxSprite( 1, game.height, enchant.box2d.STATIC_SPRITE, 1.0, 0.3, 1.0, true);
		var top_sprite = new PhyBoxSprite( game.width, 1, enchant.box2d.STATIC_SPRITE, 1.0, 0.3, 1.0, true);

		surface.context.fillStyle = "white";
		surface.context.fillRect(0, 0, surface.width, surface.height);

		left_sprite.image = surface;
		left_sprite.position = { x : 0, y : 0 };
		left_sprite.kind = "wall";
		right_sprite.image = surface;
		right_sprite.position = { x : game.width - 1, y : 0 };
		right_sprite.kind = "wall";
		top_sprite.image = surface;
		top_sprite.position = { x : 0, y : 0 };
		top_sprite.kind = "wall";

		_scene.addChild(left_sprite);
		_scene.addChild(right_sprite);
		_scene.addChild(top_sprite);
	};

	function buildPlayerBlock(/*_posX, _posY */ _width, _height, _pad, _world){
		var surface = new Surface( _width, _height);
		var sprite = new PhyBoxSprite( _width, _height, enchant.box2d.STATIC_SPRITE, 1.0, 0.8, 0.3, true);
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

	function destroyBlock(_target, _block, _player, _pad, _scene, _world){
		var ii;
		for(ii=0; ii<_block.length; ii++){
			var tmp_block = _block[ii];
			if(_target === tmp_block){
				dColArray.push(tmp_block.color);
				dXArray.push(tmp_block.x);
				dYArray.push(tmp_block.y);
				tmp_block.destroy();
			}
		}
	}

	function setPlayerCallback(_player,_ball){
		_player.addEventListener(Event.TOUCH_START, function(e) {
			touch_pos_x = e.x;
			touch_pos_y = e.y;
		});

		_player.addEventListener(Event.TOUCH_MOVE, function(e) {
			var tmp_x = e.x;
			var tmp_y = e.y;
			var dest_x = touch_pos_x - tmp_x;

			_player.x -= dest_x;

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

	function buildBall(_player, _color, _rad, _x, _y){
		var surface = new Surface( _rad*2, _rad*2);
		var sprite = new PhyCircleSprite(_rad, enchant.box2d.DYNAMIC_SPRITE, 1.0, 0.2, 0.2, false);
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
//			var moveX = this.x;
//			var moveY = this.y;
//			var ii;
//
			_world.step(game.fps);
//
//			if(this.x >= game.width){
//				_ball.applyImpulse( new b2Vec2(-0.5, -0.3) )
//			}
//			else if(this.x <= 0){
//				_ball.applyImpulse( new b2Vec2(0.5, -0.3) )
//			}
//
//			if(this.y <= 0){
//			}
//			else if(this.y >= game.height){
//				_ball.applyImpulse( new b2Vec2(0.0, -50.0) )
//			}
//
//			_ball.contact(function(obj){
//				if(obj.kind == "player"){
//					if(upPower == true){
//						upPower = false;
//						downPower = false;
//						_ball.applyImpulse( new b2Vec2(0.0, -10.0) );
//						console.log("upPower");
//						_ball.isAwake = true;
//					}
//					else if(downPower == true){
//						upPower = false;
//						downPower = false;
//						console.log("downPower");
//						_ball.isAwake = false;
//					}
//					_ball.setAwake(_ball.isAwake);
//				}
//				else if(obj.kind == "block") {
//					destroyBlock(obj, _block, _player, _pad, _scene, _world);
//				}
//			});
		});
	}

	function divideBall(_player, _scene, _world, _x, _y){
		var ball = buildBall(_player, "red", 50/2, _x, _y); 
		ball.setAwake(true);
		setBallCallback(ball, _world);
		_scene.addChild(ball);

		// terminated bug 
		//red_ball.push(ball);
	}

	var sBlockGroup;

	function buildBlocks(_scene, _lines, _player, _pad, _world){
		var s_w = 30;
		var s_h = 10;
		var term_line = 10*10;
		var surface;
		var sprite = Array();
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
						surface.context.fillStyle = "white";
						break;
				}
				surface.context.fillRect(0, 0, surface.width, surface.height);

				sprite[cnt] = new PhyBoxSprite( s_w, s_h,
												enchant.box2d.STATIC_SPRITE,
												1.0, 0.3, 0.8, true);
				sprite[cnt].image = surface;
				sprite[cnt].color = surface.context.fillStyle;
				sprite[cnt].position = { x : ii, y : jj };
				sprite[cnt].kind = "block";

//				_scene.addChild(sprite[cnt]);
				sBlockGroup.addChild(sprite[cnt]);
				cnt++;
			}
		}
		_scene.addChild(sBlockGroup);

		sBlockGroup.addEventListener(Event.CHILD_REMOVED, function(e){
			var col = dColArray.pop();
			var x = dXArray.pop();
			var y = dYArray.pop();
			if(col == "#0000ff"){
				divideBall(_player, _scene, _world, x, y);
			}
		});

		return sprite;
	};

	var red_ball = [];
	var startScene = function (){
		var world = new PhysicsWorld( 0.0, 9.8 );
		var scene = new Scene();
		var pad = new Pad();

		var count = 0;
		var ii = 0;

		var player = buildPlayerBlock(240, 12, pad, scene, world);
		var block = buildBlocks(scene, 10, player, pad, world);

		for(ii=0; ii<1; ii++){
			red_ball[count] = buildBall(player, "red", 50/2); 
			red_ball[count].isAwake = true;
			red_ball[count].setAwake(red_ball[count].isAwake);
			scene.addChild(red_ball[count]);

			setPlayerCallback(player, red_ball);
			setBallCallback(red_ball[count], world);
			count++;
		}
		buildWall(scene, world);

		scene.addChild(player);

		scene.addEventListener(Event.ENTER_FRAME, function(e){
			var move_distance = player.x;
			{
				/* focus on player */
				var input = game.input;
				if (input.up)    {
					upPower = true;
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
				for(var ii=0; ii<red_ball.length; ii++){
					var ball = red_ball[ii];
					var moveX = red_ball[ii].x;
					var moveY = red_ball[ii].y;

					if(ball.isAwake == false){
						move_distance -= player.x;
						ball.x -= move_distance;
					}
					else{
						if(ball.x >= game.width){
							ball.applyImpulse( new b2Vec2(-0.5, -0.3) )
						}
						else if(ball.x <= 0){
							ball.applyImpulse( new b2Vec2(0.5, -0.3) )
						}

						if(ball.y <= 0){
						}
						else if(ball.y >= game.height){
							ball.applyImpulse( new b2Vec2(0.0, -50.0) )
						}

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
									upPower = false;
									downPower = false;
									console.log("downPower");
									ball.isAwake = false;
								}
								ball.setAwake(ball.isAwake);
							}
							else if(obj.kind == "block") {
								destroyBlock(obj, block, player, pad, scene, world);
							}
						});
					}
				}
			}
		});

		pad.moveTo(0, game.height-pad.height);
		scene.addChild(pad);

		return scene;
	};

	game.onload = function(){
		game.replaceScene(startScene());
	}

    game.start();
};

