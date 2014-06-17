
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

    var game = new Core(320, 320);
    game.fps = 60;

	function buildPlayerBlock(/*_posX, _posY */ _width, _height, _pad, _world){
		var surface = new Surface( _width, _height);
		var sprite = new PhyBoxSprite( _width, _height, enchant.box2d.STATIC_SPRITE, 1.0, 0.3, 1.0, true);
		var s_x = Math.floor(game.width/2) - Math.floor(surface.width/2);
		var s_y = Math.floor(game.height) - Math.floor(surface.height) - _pad.height;

		surface.context.fillStyle = "green";
		surface.context.fillRect(0, 0, surface.width, surface.height);

		sprite.image = surface;
//		sprite.moveTo(s_x, s_y);
		sprite.position = { x : s_x, y : s_y };

		console.log("player x = " + s_x + " player y = " + s_y);

		sprite.addEventListener(Event.ENTER_FRAME, function(e){
			var input = game.input;

			if (input.up)    {
				upPower = true;
			}
			if (input.down)  {
				downPower = true;
			}

			if (input.left)  { this.x -= 8; }
			if (input.right) { this.x += 8; }
			if(this.x < 0) this.x = 0;
			if(this.x+surface.width> game.width) this.x = game.width-surface.width;

		});
		return sprite;
	};

	var upPower = false;
	var downPower = false;
	var boundRatio = game.fps * 2;
	var isFirstTime = true;

	function isDestroyBlock(_target, _ball, _block){
		var ii;
		for(ii=0; ii<_block.length; ii++){
			var tmp_block = _block[ii];
			if(_target === tmp_block){
				_ball.applyImpulse(new b2Vec2(0.1, 0.1));
				tmp_block.destroy();
			}
		}
	}

	function buildBall(_player, _block, _rad, _pad, _world){
		var surface = new Surface( _rad*2, _rad*2);
		var sprite = new PhyCircleSprite(_rad, enchant.box2d.DYNAMIC_SPRITE, 1.0, 0.0, 1.0, true);
		var s_x;
		var s_y;

		surface.context.beginPath();
		surface.context.fillStyle = "red";
		surface.context.arc(_rad, _rad, _rad, 0, Math.PI*2, false);
		surface.context.fill();

		s_x = Math.floor(_player.x) + Math.floor(_player.width/2) - Math.floor(surface.width/2);
		s_y = Math.floor(_player.y) - Math.floor(surface.height);

		console.log("ball x = " + s_x + " ball y = " + s_y);

		sprite.image = surface;
//		sprite.moveTo(s_x, s_y);
		sprite.position = { x : s_x, y : 150};

		sprite.addEventListener(Event.ENTER_FRAME, function(e){
			var moveX = this.x;
			var moveY = this.y;
			var ii;

			_world.step(game.fps);

			if(this.x >= game.width){
				this.x = game.width - this.width;
				sprite.applyImpulse( new b2Vec2(-0.3, -0.3) )
			}
			else if(this.x <= 0){
				this.x = 0;
				sprite.applyImpulse( new b2Vec2(0.3, -0.3) )
			}

			if(this.y <= 0){
				this.y = 0;
				sprite.applyImpulse( new b2Vec2(0.0, 0.3) )
			}
			else if(this.y >= game.height){
				this.y = game.height - this.height;
				sprite.applyImpulse( new b2Vec2(0.2, -1.0) )
			}

			sprite.contact(function(obj){
				if(upPower == true){
					upPower = false;
					downPower = false;
					sprite.applyImpulse( new b2Vec2(0.0, -10.) )
					sprite.applyTorque(2.0)
					console.log("upPower");
				}
				else if(downPower == true){
					upPower = false;
					downPower = false;
					sprite.applyForce( new b2Vec2(0.0, 0.0) )
					console.log("downPower");
				}

				if(obj === _player){
					sprite.applyImpulse( new b2Vec2(0.0, -0.3) )
					//sprite.applyTorque(0.3)
				}
				else{
					isDestroyBlock(obj, sprite, _block);
				}
			});

		});

		return sprite;
	};

	function buildBlocks(_scene, _lines, _player, _ball, _pad, _world){
		var s_w = 10;
		//var s_h = Math.floor((game.height-_ball.y)/_lines);
		var s_h = 10;
		//var term_line = Math.floor(game.height-_ball.y);
		var term_line = 10*10;
		var surface;
		var sprite = Array();
		var ii, jj, cnt;
		var s_x, s_y;

		cnt = 0;
		surface = new Surface(s_w, s_h);
		surface.context.fillStyle = "blue";
		surface.context.fillRect(0, 0, surface.width, surface.height);

		for(ii=0; ii<game.width; ii+=s_w){
			for(jj=0; jj<term_line; jj+=s_h){
				sprite[cnt] = new PhyBoxSprite( s_w, s_h, enchant.box2d.STATIC_SPRITE, 0.3, 0.2, 0.6, true);
				sprite[cnt].image = surface;
				sprite[cnt].position = { x : ii, y : jj};
				_scene.addChild(sprite[cnt]);
				cnt++;
			}
		}
		return sprite;
	};

	var startScene = function (){
		var world = new PhysicsWorld( 0, 9.8 );
		var scene = new Scene();
		var pad = new Pad();

		var player = buildPlayerBlock(240, 12, pad, scene, world);
		var block = buildBlocks(scene, 10, player, ball, pad, world);
		var ball = buildBall(player, block, 5, pad, world);

		scene.addChild(player);
		scene.addChild(ball);

		pad.moveTo(0, game.height-pad.height);
		scene.addChild(pad);

		return scene;
	};

	game.onload = function(){
		game.replaceScene(startScene());
	}

    game.start();
};

