
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
		right_sprite.image = surface;
		right_sprite.position = { x : game.width - 1, y : 0 };
		top_sprite.image = surface;
		top_sprite.position = { x : 0, y : 0 };

		_scene.addChild(left_sprite);
		_scene.addChild(right_sprite);
		_scene.addChild(top_sprite);
	};

	function buildPlayerBlock(/*_posX, _posY */ _width, _height, _pad, _world){
		var surface = new Surface( _width, _height);
		var sprite = new PhyBoxSprite( _width, _height, enchant.box2d.STATIC_SPRITE, 1.0, 0.3, 1.0, true);
		var s_x = Math.floor(game.width/2) - Math.floor(surface.width/2);
		var s_y = Math.floor(game.height) - Math.floor(surface.height) - _pad.height;

		surface.context.fillStyle = "green";
		surface.context.fillRect(0, 0, surface.width, surface.height);

		sprite.image = surface;
		sprite.position = { x : s_x, y : s_y };

		console.log("player x = " + s_x + " player y = " + s_y);

		return sprite;
	};

	var upPower = false;
	var downPower = false;
	var boundRatio = game.fps * 2;
	var isFirstTime = true;

	function isDestroyBlock(_target, _block){
		var ii;
		var isBroken = false;
		for(ii=0; ii<_block.length; ii++){
			var tmp_block = _block[ii];
			if(_target === tmp_block){
				tmp_block.destroy();
				isBroken = true;
			}
		}
		return isBroken;
	}

	function buildBall(_player, _block, _color, _rad, _pad, _scene, _world){
		var surface = new Surface( _rad*2, _rad*2);
		var sprite = new PhyCircleSprite(_rad, enchant.box2d.DYNAMIC_SPRITE, 1.0, 0.2, 1.0, true);
		var s_x;
		var s_y;

		surface.context.beginPath();
		surface.context.fillStyle = _color;
		surface.context.arc(_rad, _rad, _rad, 0, Math.PI*2, false);
		surface.context.fill();

		s_x = Math.floor(_player.x) + Math.floor(_player.width/2) - Math.floor(surface.width/2);
		s_y = Math.floor(_player.y) - Math.floor(surface.height);

		console.log("ball x = " + s_x + " ball y = " + s_y);

//		sprite.image = surface;
        sprite.image = game.assets['image/yamochi.png'];
		sprite.frame = 0;
		sprite.isAwake = true;
		sprite.position = { x : s_x, y : 150};


		return sprite;
	};

	function buildBlocks(_scene, _lines, _player, _pad, _world){
		var s_w = 30;
		var s_h = 10;
		var term_line = 10*10;
		var surface;
		var sprite = Array();
		var ii, jj, cnt;
		var s_x, s_y;

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
												0.3, 0.2, 0.6, true);
				sprite[cnt].image = surface;
				sprite[cnt].color = surface.context.fillStyle;
				sprite[cnt].position = { x : ii, y : jj };

				_scene.addChild(sprite[cnt]);
				cnt++;
			}
		}
		return sprite;
	};

	var startScene = function (){
		var world = new PhysicsWorld( 0.0, 9.8 );
		var scene = new Scene();
		var pad = new Pad();

		var red_ball = [];
		var ii = 0;

		var player = buildPlayerBlock(240, 12, pad, scene, world);
		var block = buildBlocks(scene, 10, player, pad, world);

		for(ii=0; ii<1; ii++){
			red_ball[ii] = buildBall(player, block, "red", 50/2, pad, scene, world); 
			red_ball[ii].isAwake = true;
			scene.addChild(red_ball[ii]);

			red_ball[ii].addEventListener(Event.ENTER_FRAME, function(e){
				var moveX = this.x;
				var moveY = this.y;
				var ii;

				world.step(game.fps);
				if(this.x >= game.width){
					red_ball[ii].applyImpulse( new b2Vec2(-0.5, -0.3) )
				}
				else if(this.x <= 0){
					red_ball[ii].applyImpulse( new b2Vec2(0.5, -0.3) )
				}

				if(this.y <= 0){
				}
				else if(this.y >= game.height){
					red_ball[ii].applyImpulse( new b2Vec2(0.0, -50.0) )
				}

				red_ball[ii].contact(function(obj){
					if(obj === _player){
						if(upPower == true){
							upPower = false;
							downPower = false;
							red_ball[ii].applyImpulse( new b2Vec2(0.0, -10.0) );
							console.log("upPower");
							red_ball[ii].setAwake(true);
							red_ball[ii].isAwake = true;
						}
						else if(downPower == true){
							upPower = false;
							downPower = false;
							console.log("downPower");
							red_ball[ii].setAwake(false);
							red_ball[ii].isAwake = false;
						}
						else{
							//sprite.applyImpulse( new b2Vec2(0.0, -0.3) );
							//sprite.applyTorque(0.3);
						}	
					}
					else{
						var isBroken = isDestroyBlock(obj, _block);
						if((isBroken == true) && (obj.color == "#0000ff")){
							var ball = buildBall(player, red_ball[ii], "red", 50/2, pad, scene, world); 
							scene.addChild(ball);
						}
					}
				});
			});

			player.addEventListener(Event.ENTER_FRAME, function(e){
				var move_distance = player.x;
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

				if((red_ball[ii].isAwake == false) && (move_distance != 0)){
					move_distance -= player.x;
					red_ball[ii].x -= move_distance;
				}
			});

			player.addEventListener(Event.TOUCH_START, function(e) {
				touch_pos_x = e.x;
				touch_pos_y = e.y;
			});

			player.addEventListener(Event.TOUCH_MOVE, function(e) {
				var tmp_x = e.x;
				var tmp_y = e.y;
				var dest_x = touch_pos_x - tmp_x;

				player.x -= dest_x;

				if(red_ball[ii].isAwake == false){
					red_ball[ii].x -= dest_x;
				}

				if(player.x >= game.width - red_ball[ii].width - 5){
					player.x = game.width - red_ball[ii].width - 5;
				}
				else if(player.x <= 0 + 5){
					player.x = 5;
				}
			});
		}
		buildWall(scene, world);

		scene.addChild(player);

		pad.moveTo(0, game.height-pad.height);
		scene.addChild(pad);

		return scene;
	};

	game.onload = function(){
		game.replaceScene(startScene());
	}

    game.start();
};

