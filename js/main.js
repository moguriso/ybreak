
enchant();

/* to fix iPhone/iPad "Touch to Start" freeze issue */
enchant.ENV.SOUND_ENABLED_ON_MOBILE_SAFARI = false;

window.onload = function(){

    var game = new Core(320, 320);
	var WATCH_DOG_COUNT = 180;

    game.fps = 30;
	game.preload('image/planet_01.jpg', 'image/SUN000E.jpg', 'image/galaxy000.jpg');
	game.preload('image/yamochi.png', 'image/gameover.png', 'image/clear.png', 'image/bomb_1.png',
				 'image/3ca.png', 'image/title_true.png', 'image/p_ligo.png', 'image/rainbow.png');
	game.keybind( 71, 'g' );
	game.keybind( 84, 't' );
	game.keybind( 90, 'z' );
	game.keybind( 66, 'b' );
	game.keybind( 82, 'r' );
	game.keybind( 76, 'l' );
	game.keybind( 83, 's' );
	game.keybind( 65, 'a' );

	function initialize_params(){
		var pm = Param.getInstance();

		WATCH_DOG_COUNT = 180;

		pm.destBlkAr = new Array(0);
		pm.ballAr = new Array(0);
		pm.bombAr = new Array(0);
		pm.imBlockCount = 0;
		pm.prevLen		= 0;
		pm.currentLen	= 0;
		pm.assertCnt	= 0;
		pm.watchdog		= 0;
		pm.imWatchdog	= 0;
		pm.vx_ratio		= 0;
		pm.vy_ratio		= 0;
		pm.upP			= false;
		pm.downP		= false;
		pm.bombMode		= false;
	}

	var Param = (function() {

		var instance;

		function init(){
			// private method sample
			function publicMethodxxx() {
			};

			// private member sample
			var _random;
			var _imBlockCount;
			var _upPower;
			var _downPower;
			var _sBlockGroup;
			var _sDestBlockArray;
			var _sBallArray;
			var _isBomberMode;
			var _isYamochiMode;
			var _prevLength = 0;
			var _currentLength = 0;
			var _assertCount = 0;
			var _watchDogCount = 0;
			var _imWatchDogCount = 0;
			var _vx_ratio = 0;
			var _vy_ratio = 0;

    		return {
				// public method
    			getRandomPos : function(_ratio) {
					_random = Math.floor(Math.random()*_ratio);
    		   		return _random;
    		  	},
    			getVxRatio : function(zx) {
					var r_val = 0;
					var ent_val = parseInt(_vx_ratio);
					ent_val = ent_val + 0.5;
					_vx_ratio = ent_val;
					if(zx > 0){
						r_val = zx + _vx_ratio;
					}
					else{
						r_val = zx - _vx_ratio;
					}
    		   		return r_val;
    		  	},
    			getVyRatio : function(zy) {
					var r_val = 0;
					var ent_val = parseInt(_vy_ratio);
					ent_val = ent_val + 0.5;
					_vy_ratio = ent_val;
					if(zy > 0){
						r_val = zy + _vy_ratio;
					}
					else{
						r_val = zy - _vy_ratio;
					}
    		   		return r_val;
    		  	},
				// public member
        		imBlockCount : {
        		    get: function() {
        		        return this._imBlockCount;
        		    },
        		    set: function(cnt) {
						this._imBlockCount = cnt;
        		    }
        		},
        		upP : {
        		    get: function() {
        		        return this._upPower;
        		    },
        		    set: function(is) {
						this._upPower = is;
        		    }
        		},
        		downP : {
        		    get: function() {
        		        return this._downPower;
        		    },
        		    set: function(is) {
						this._downPower = is;
        		    }
        		},
        		blkGr : {
        		    get: function() {
        		        return this._sBlockGroup;
        		    }
        		},
        		destBlkAr : {
        		    get: function() {
        		        return this._sDestBlockArray;
        		    }
        		},
        		ballAr : {
        		    get: function() {
        		        return this._sBallArray;
        		    }
        		},
        		bombMode : {
        		    get: function() {
        		        return this._isBomberMode;
        		    },
        		    set: function(is) {
						this._isBomberMode = is;
        		    }
        		},
        		yamochiMode : {
        		    get: function() {
        		        return this._isYamochiMode;
        		    },
        		    set: function(is) {
						this._isYamochiMode = is;
        		    }
        		},
        		prevLen: {
        		    get: function() {
        		        return this._prevLength;
        		    },
        		    set: function(cnt) {
						this._prevLength = cnt;
        		    }
        		},
        		currentLen: {
        		    get: function() {
        		        return this._currentLength;
        		    },
        		    set: function(cnt) {
						this._currentLength = cnt;
        		    }
        		},
        		assertCnt: {
        		    get: function() {
        		        return this._assertCount;
        		    },
        		    set: function(cnt) {
						this._assertCount = cnt;
        		    }
        		},
        		watchdog: {
        		    get: function() {
        		        return this._watchDogCount;
        		    },
        		    set: function(cnt) {
						this._watchDogCount = cnt;
        		    }
        		},
        		imWatchdog: {
        		    get: function() {
        		        return this._imWatchDogCount;
        		    },
        		    set: function(cnt) {
						this._imWatchDogCount = cnt;
        		    }
        		},
        		vx_ratio: {
        		    get: function() {
        		        return this._vx_ratio;
        		    },
        		    set: function(cnt) {
						this._vx_ratio = cnt;
        		    }
        		},
        		vy_ratio: {
        		    get: function() {
        		        return this._vy_ratio;
        		    },
        		    set: function(cnt) {
						this._vy_ratio = cnt;
        		    }
        		},
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
			   ((_ballArray[ii].x > game.width) ||
			    (_ballArray[ii].x < 0)		  	 ||
			    (_ballArray[ii].y > game.height)||
			    (_ballArray[ii].y < 0)))
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

	function rainbow(_scene, _x, _y){
		var rainbow = new Sprite(256, 256);
		var mx = _x - (rainbow.width/4)  - 5;
		var my = _y - (rainbow.height/4) - 35;

    	rainbow.image = game.assets['image/rainbow.png'];
    	rainbow.frame = 0;
		rainbow.moveTo(mx, my);
		rainbow.kind = "rainbow"; /* probably need not to use */

		rainbow.tl.scaleTo(0.5, 1, enchant.Easing.LINEAR)
				  .repeat(function(){
						rainbow.frame++;
				   }, 19)
				  .then(function(){
						rainbow.frame = 0;
				   })
				  .scaleTo(1.0, 1, enchant.Easing.LINEAR)
				  .loop();

		_scene.addChild(rainbow);
	}

	function bomb(_scene, _x, _y, _block){
		var bomb = new Sprite(256, 256);

    	bomb.image = game.assets['image/bomb_1.png'];
    	bomb.frame = 0;
		bomb.moveTo(_x, _y);
		bomb.kind = "bomb";

		bomb.tl.repeat(function(){
			bomb.frame++;
		}, 15).and().scaleTo(2.2, 30, enchant.Easing.LINEAR).
		and().then(function(){
			destroyBlockXY(_x, _y, _block);
		}).
		fadeOut(15).then(function(){
			bomb.destroy();
		});

		_scene.addChild(bomb);
		// tentative 
		//destroyBlockXY(_x, _y, _block);
	}

	function buildWall(_player, _scene){
		var surface1	= new Surface(1, game.height*2);
		var surface2	= new Surface(game.width*2, 1);
		var left_sprite = new Sprite(1, game.height*2);
		var right_sprite = new Sprite(1, game.height*2);
		var top_sprite = new Sprite(game.width*2, 1);
		var bottom_sprite = new Sprite(game.width*2, 1);

		surface1.context.fillStyle = "white";
		surface1.context.globalAlpha = 0;
		surface1.context.fillRect(0, 0, surface1.width, surface1.height);
		surface2.context.fillStyle = "white";
		surface2.context.globalAlpha = 0;
		surface2.context.fillRect(0, 0, surface2.width, surface2.height);

		left_sprite.image = surface1;
		left_sprite.moveTo(0,0);
		left_sprite.kind = "left_wall";
		right_sprite.image = surface1;
		right_sprite.moveTo(game.width-1, 0);
		right_sprite.kind = "right_wall";
		top_sprite.image = surface2;
		top_sprite.moveTo(0,0);
		top_sprite.kind = "top_wall";
		bottom_sprite.image = surface2;
		bottom_sprite.moveTo(0, (_player.y + (_player.height*5)));
		bottom_sprite.kind = "bottom_wall";

		_scene.addChild(left_sprite);
		_scene.addChild(right_sprite);
		_scene.addChild(top_sprite);
		_scene.addChild(bottom_sprite);
	};

	function buildPlayerBlock(_width, _height, _pad){
		var surface = new Surface( _width, _height);
		var context;
		var sprite = new Sprite(_width, _height);
		var s_x = Math.floor(game.width/2) - Math.floor(surface.width/2);
		var s_y = Math.floor(game.height) - Math.floor(surface.height) - _pad.height;

		surface.context.fillStyle = "green";
		surface.context.fillRect(0, 0, surface.width, surface.height);
		context = surface.context;

		context.beginPath();
		context.strokeStyle = "white";
		context.moveTo(0,0);
		context.lineTo(surface.width, 0);
		context.moveTo(0,0);
		context.lineTo(0, surface.height);
		context.closePath();
		context.stroke();

		context.beginPath();
		context.strokeStyle = "#444444";
		context.moveTo(0, surface.height);
		context.lineTo(surface.width, surface.height);
		context.moveTo(surface.width, 0);
		context.lineTo(surface.width, surface.height);
		context.closePath();
		context.stroke();

		sprite.image = surface;
		sprite.moveTo(s_x, s_y);
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
		var pm = Param.getInstance();
		if(pm.yamochiMode == false){ 
			do{
				var tmp_block = _block.pop();
				tmp_block.destroy();
			}while(_block.length > 0);
		}
		else{
			for(var ii=0; ii<_block.length; ii++){
				var tmp_block = _block[ii];
				if(checkRange(_x, _y, tmp_block) == true){
					pm.destBlkAr.push(tmp_block);
					_block.splice(ii, 1);
					tmp_block.destroy();
				}
			}
		}
	}

	function destroyBlock(_target, _block){
		var ii;
		var pm = Param.getInstance();
		for(ii=0; ii<_block.length; ii++){
			var tmp_block = _block[ii];
			if(_target == tmp_block){
				if(tmp_block.color != "#444444"){
					pm.destBlkAr.push(tmp_block);
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
		var surface = new Surface(_width, _height);
		var sprite = new Sprite(surface.width,
								surface.height);
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
		sprite.moveTo(s_x, s_y);
		sprite.isAwake = true;
		sprite.kind = "ball";

		return sprite;
	};

	function buildBall(_player, _color, _rad, _x, _y){
		var surface = new Surface( _rad*2, _rad*2);
		var sprite = new Sprite(_rad*2, _rad*2);
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

        sprite.image = game.assets['image/yamochi.png'];
		sprite.frame = 0;
		sprite.moveTo(s_x, s_y);
		sprite.isAwake = true;
		sprite.kind = "ball";

		return sprite;
	};

	function divideBall(_player, _scene, _x, _y){
		var ball; 
		var pm = Param.getInstance();
		ball = buildBall(_player, "red", 50/2, _x, _y); 
		pm.ballAr.push(ball);
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
						 9, 9, 0, 1, 9, 9, 1, 0, 9, 9, 
						 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 
						 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 
						 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 
						 9, 9, 9, 9, 3, 3, 9, 9, 9, 9, 
						 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 
						 9, 2, 9, 9, 9, 9, 9, 9, 2, 9 ];

	var sBlockStage5 = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
						 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 
						 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
						 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 
						 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 
						 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 
						 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
						 3, 2, 2, 2, 2, 2, 2, 2, 2, 3 ];

	var sBlockStage6 = [ 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 
						 1, 1, 1, 9, 9, 9, 9, 1, 1, 1, 
						 0, 9, 0, 0, 0, 0, 0, 0, 9, 0, 
						 9, 9, 9, 9, 2, 2, 9, 9, 9, 9, 
						 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
						 3, 9, 9, 9, 9, 9, 9, 9, 9, 3, 
						 9, 9, 3, 9, 2, 2, 9, 3, 9, 9, 
						 2, 9, 9, 9, 2, 2, 9, 9, 9, 2 ];

	function buildBlocks(_scene, _blk_array, _lines, _player, _pad){
		var s_w = 30;
		var s_h = 10;
		var term_line = 10*10;
		var surface;
		var context;
		var sprite = new Array();
		var ii, jj, cnt;
		var s_x, s_y;

		var start_x = 15;
		var end_x = game.width - 10;
		var start_y = 10;
		var end_y = term_line - 10;
		var pm = Param.getInstance();

		pm.blkGr = new Group();

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
						var imCount = parseInt(pm.imBlockCount);
						imCount++;
						surface.context.fillStyle = "#444444";
						pm.imBlockCount = parseInt(imCount);
						break;
				}
				context = surface.context;
				surface.context.fillRect(0, 0, surface.width, surface.height);

				context.beginPath();
				context.strokeStyle = "white";
				context.moveTo(0,0);
				context.lineTo(surface.width, 0);
				context.moveTo(0,0);
				context.lineTo(0, surface.height);
				context.closePath();
				context.stroke();

				context.beginPath();
				context.strokeStyle = "#444444";
				context.moveTo(0, surface.height);
				context.lineTo(surface.width, surface.height);
				context.moveTo(surface.width, 0);
				context.lineTo(surface.width, surface.height);
				context.closePath();
				context.stroke();

				tmp_sprite  = new Sprite(s_w, s_h);
				tmp_sprite.image = surface;
				tmp_sprite.color = surface.context.fillStyle;
				tmp_sprite.moveTo(pos_x, pos_y);
				tmp_sprite.kind = "block";

				sprite.push(tmp_sprite);
				var last_pos = sprite.length - 1; 
				pm.blkGr.addChild(sprite[last_pos]);
			}
		}
		_scene.addChild(pm.blkGr);

		if(pm.yamochiMode == true){
			pm.blkGr.addEventListener(Event.CHILD_REMOVED, function(e){
				var tmp_block = pm.destBlkAr.pop();
				var col = tmp_block.color;
				var x = tmp_block.x;
				var y = tmp_block.y;

				if(((col == "#0000ff") && (pm.ballAr.length < 5)) && (pm.bombMode == false))
					divideBall(_player, _scene, x, y);
			});
		}

		return sprite;
	};

	function getBlockByStageNumber(_num){
		var retBlocks;
		console.log("num = " + _num);
		switch(_num){
			case 6:
				retBlocks = sBlockStage6;
				break;
			case 5:
				retBlocks = sBlockStage5;
				break;
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
			game.popScene();
			game.replaceScene(gameStage(current_stage));
        });

		nextButton.moveTo(120, 240);
		scene.addChild(nextButton);

        nextButton.addEventListener(Event.TOUCH_END, function(){
			var next_stage = _stage_number+1;
			game.popScene();
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

	function setBackGround(_scene, _stage){
       	var bgSprite = new Sprite(game.width, game.height);
		switch(_stage){
			case 6: case 4:
    			bgSprite.image = game.assets['image/SUN000E.jpg'];
				break;
			case 5: case 3:
    			bgSprite.image = game.assets['image/galaxy000.jpg'];
				break;
			case 2:
    			bgSprite.image = game.assets['image/planet_01.jpg'];
				break;
			case 1:
			default:
    			bgSprite.image = game.assets['image/planet_01.jpg'];
				break;
		}
		_scene.addChild(bgSprite);
	}

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

	function controlBall(_player, _block, _scene, _stage,  _input){
		var pm = Param.getInstance();
		var move_distance = _player.x;
   		for(var ii=0; ii<pm.ballAr.length; ii++){
   			var _ball = pm.ballAr[ii];
   			var posX = pm.ballAr[ii].x;
   			var posY = pm.ballAr[ii].y;

			if(Math.abs(_ball.vx) < 5.0){
				if(_ball.vx > 0){
					_ball.vx = 5.0;
				}
				else{
					_ball.vx = -5.0;
				}
			}
			if(Math.abs(_ball.vy) < 5.0){
				if(_ball.vy > 0){
					_ball.vy = 5.0;
				}
				else{
					_ball.vy = -5.0;
				}
			}

   			var deadLine = (_player.y + (_player.height) + 5);
   			if(posY >= deadLine){
   				destroyBall(pm.ballAr, _ball);
   			}

			for(var jj=0; jj<_block.length; jj++){
				var blkSp = _block[jj];
				var touch_ratio = 35;

				if(blkSp.color == "#444444") touch_ratio = 25;

				if(_ball.within(blkSp, touch_ratio) == true){
   					destroyBlock(blkSp, _block);

   					if(blkSp.color == "#444444"){
   						var zx = _ball.x;
   						var zy = _ball.vy + 1.2;
   						var center = game.width / 2;

						if(zx < center){
							zx = _ball.vx - 4.0;
						}
						else{
							zx = _ball.vx + 4.0;
						}

						if(++(pm.imWatchdog) >= 20){
							zx *= 10;
							pm.imWatchdog = 0;
						}

   						if(blkSp.y >= _ball.y){
   							zy *= -1;
   						}
   					}
   					else if(pm.yamochiMode == true){
						// where does yamochi-san go?
   					}
   					else {
						// where does ball go?
   					}
   					
   					if(pm.bombMode == true){
   						bomb(_scene, _ball.x, _ball.y, _block);
   						destroyBall(pm.ballAr, _ball);
   						pm.bombMode = false;
   					}
				}
			}

   			//_ball.contact(function(obj){
   			//	if(obj.kind == "block") {
   			//		destroyBlock(obj, _block);
   			//		if(obj.color == "#444444"){
   			//			var zx = _ball.x;
   			//			var zy = _ball.vy + 1.2;
   			//			var center = game.width / 2;
   			//			if(zx > center){
   			//				zx = _ball.vx - 1.2;
   			//			}
   			//			else { 
   			//				zx = _ball.vx + 1.2;
   			//			}

   			//			if(obj.y >= _ball.y){
   			//				zy *= -1;
   			//			}

			//			if(++(pm.imWatchdog) >= 20){
			//				zx *= 10;
			//				pm.imWatchdog = 0;
			//			}

   			//		}
   			//		else if(pm.yamochiMode == true){

   			//		}
   			//		else {

   			//		}
   			//		
   			//		if(pm.bombMode == true){
   			//			bomb(_scene, _ball.x, _ball.y, _block);
   			//			destroyBall(pm.ballAr, _ball);
   			//			pm.bombMode = false;
   			//		}
   			//	}
			//	else if(obj.kind == "player"){
   			//		if(pm.upP == true){
   			//			pm.upP = false;
   			//			pm.downP = false;
   			//			console.log("upPower");
   			//		}
   			//		else if(pm.downP == true){
   			//			if(_ball.y + _ball.height <= _player.y){
   			//				_ball.y = _player.y - _ball.height;
   			//			}
   			//			pm.upP = false;
   			//			pm.downP = false;
   			//			console.log("downPower");
   			//		}
			//		else{
			//			var zx = Math.abs(_ball.vx) / 10;
			//			var zy = _ball.vy;
			//			var border_x = Math.floor(game.width/2);
			//			var center_x = Math.floor(obj.x/2);

			//			if(border_x >= center_x){
			//				zx = Math.abs(zx) * -1.0;
			//			}
			//			console.log("vx = " + _ball.vx + " invert zx = " + zx);

			//			if(zy > 0){
			//				zy = Math.abs(zy / 10) * -1.0;
			//				if(zy < -10.0) zy = -5.0;
			//				console.log("vy = " + _ball.vy + " invert zy = " + zy);
			//			}
			//		}
   			//	}
   			//	else if(obj.kind == "ball"){
//   		//			obj.destroy();
   			//	}
   			//	else if(obj.kind == "bottom_wall"){
   			//		destroyBall(pm.ballAr, _ball);
   			//	}
   			//});
   		}

   		if(pm.ballAr.length <= 0){
   			game.pushScene(gameoverScene(_stage));
   		}
   		else{
   			if(++(pm.watchdog) >= WATCH_DOG_COUNT){
   				if((pm.prevLen == 0) && (pm.currentLen == 0)){
   					pm.prevLen = pm.ballAr.length;
   				}
   				else {
   					pm.currentLen = pm.ballAr.length;
   					if(pm.prevLen == pm.currentLen){
   						pm.assertCnt++;
   						if(pm.assertCnt > 3){
   							if(destroyBall(pm.ballAr) == true)
   								pm.assertCnt = 0;
   						}
   						else if(pm.assertCnt > 50){
   							forceDestroyBall(pm.ballAr);
   							pm.assertCnt = 0;
   						}
   					}
   				}
   			}
   		}

   		/* clear check => or rather, all blocks destruction is completed? */
   		var lastBlockLength = _block.length - parseInt(pm.imBlockCount);
   		if(lastBlockLength <= 0){
   			game.pushScene(gameclearScene(_stage));
   			//game.replaceScene(gameclearScene(_stage));
   		}
	}

	var gameStage = function (_stage){

		var scene = new Scene();
		var pad = new Pad();
		var ii = 0;

		var ball; 
		var player;
		var block;
		var pm = Param.getInstance();

		initialize_params();

		setBackGround(scene, _stage);

		player = buildPlayerBlock(50, 12, pad, scene);
		block = buildBlocks(scene, getBlockByStageNumber(_stage), 10, player, pad);

console.log("stage = " + _stage);

		if(pm.yamochiMode == true){
			ball = buildBall(player, "red", 50/2); 
		}
		else{
			ball = buildSquare(player, "red", 22, 12); 
		}

		scene.addChild(ball);
		pm.ballAr.push(ball);

		setPlayerCallback(player, ball);

		buildWall(player, scene);

		scene.addChild(player);

		scene.addEventListener(Event.ENTER_FRAME, function(e){
			var pm = Param.getInstance();
			var input = game.input;

			controlBall(player, block, scene, _stage, input);

			{
				/* focus on player */
				if (input.up)    {
					pm.upP = true;
				}

				if(input.g){
					for(var ii=0; ii<pm.ballAr.length; ii++){
						var ball = pm.ballAr[ii];
					}
				}

				if(input.z){
					for(var ii=0; ii<pm.ballAr.length; ii++){
						var ball = pm.ballAr[ii];
					}
				}

				if(input.r){
					for(var ii=0; ii<pm.ballAr.length; ii++){
						var ball = pm.ballAr[ii];
					}
				}

				if(input.l){
					for(var ii=0; ii<pm.ballAr.length; ii++){
						var ball = pm.ballAr[ii];
					}
				}

				if(input.t){
					for(var ii=0; ii<pm.ballAr.length; ii++){
						var ball = pm.ballAr[ii];
					}
				}

				if(input.s){
					var lastBlockLength = block.length - parseInt(pm.imBlockCount);
					console.log("block length = " + block.length + " last = " + lastBlockLength);

					for(var ii=0; ii<pm.ballAr.length; ii++){
						var ball = pm.ballAr[ii];
						console.log("angle = " + ball.angle + " angularVelocity = " + ball.angularVelocity);
						console.log("velocity = " + ball.velocity + " vx = " + ball.vx + " vy = " + ball.vy);
					}
				}

				if(input.b){
					pm.bombMode = true;
				}

				if (input.down)  {
					pm.downP = true;
				}
	
				if (input.left)  {
					player.x -= 12;
				}
				if (input.right) {
					player.x += 12;
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

	var isCheckKonami = false;
	var konamiArray;
	var currentStr = undefined;

	var titleScene = function (){
		var scene = new Scene();
		var pm = Param.getInstance();

		var bgSprite = new Sprite(game.width, game.height);
		var bgSurface = new Surface(game.width, game.height);
		var context;
		var logoSprite = new Sprite(116, 80);
		var titleSprite = new Sprite(320, 32);
		var startButton = new Button("START", "light", 20, 50);
		var yamochiButton = new Button("Yamochi", "light", 20, 50);
		var titlePosY = Math.floor(game.height/2-titleSprite.height-80);
		var sBtnX = 60;
		var yBtnX = 180;

		initialize_params();
		pm.yamochiMode = false;

		context = bgSurface.context;
		var grad = context.createLinearGradient(0, 0, bgSurface.width, bgSurface.height); 

		grad.addColorStop(0.0, "rgb(0, 0, 0)");
		grad.addColorStop(0.5, "rgb(255, 255, 255)");

		bgSurface.context.fillStyle = grad;
		bgSurface.context.fillRect(0,0,bgSurface.width, bgSurface.height);
		bgSprite.image = bgSurface;

    	titleSprite.image = game.assets['image/title_true.png'];
		titleSprite.moveTo(0, titlePosY);

    	logoSprite.image = game.assets['image/p_ligo.png'];
		logoSprite.moveTo(200, 220);
		logoSprite.tl.scaleTo(0.4, 1, enchant.Easing.LINEAR);

		startButton.moveTo(sBtnX, 160);
		startButton._style.zIndex = 1;
		yamochiButton.moveTo(yBtnX, 160);
		yamochiButton._style.zIndex = 1;

		scene.addChild(bgSprite);
		scene.addChild(titleSprite);
		rainbow(scene, logoSprite.x, logoSprite.y);
		scene.addChild(logoSprite);

		scene.addChild(startButton);
		scene.addChild(yamochiButton);
		yamochiButton.visible = false;

		konamiArray = new Array();
		konamiArray.push("u", "u", "d", "d", "l", "r", "l", "r", "b", "a");
		konamiArray.reverse();
		titleSprite.addEventListener(Event.TOUCH_START, function(){
			isCheckKonami = true;
		});
		titleSprite.addEventListener(Event.ENTER_FRAME, function(){
			if(isCheckKonami == true){
				var input = game.input;
				var enter = "";
				var isUnlock = false;

				if(input.a){
					enter = "a";
				}
				if(input.b){
					enter = "b";
				}
				if(input.up){
					enter = "u";
				}
				if(input.down){
					enter = "d";
				}
				if(input.left){
					enter = "l";
				}
				if(input.right){
					enter = "r";
				}

				if(currentStr == undefined){
					currentStr = konamiArray.pop();
					console.log("");
				}
				else{
					if(currentStr == enter){
						console.log("enter = " + enter);
						if(konamiArray.length > 0){
							currentStr = konamiArray.pop();
							console.log("next= " + currentStr);
						}
						else if(konamiArray.length == 0){
							yamochiButton.visible = true;
							console.log("unlocked");
						}
					}
				}
			}
		});
		titleSprite.addEventListener(Event.TOUCH_END, function(){
			isCheckKonami = false;
		});

        startButton.addEventListener(Event.TOUCH_END, function(){
			pm.yamochiMode = false;
			game.replaceScene(gameStage(1));
        });

		yamochiButton.addEventListener(Event.TOUCH_END, function(){
			pm.yamochiMode = true;
			game.replaceScene(gameStage(1));
        });

		logoSprite.addEventListener(Event.TOUCH_END, function(){
			document.location = "http://www.3ca.co.jp/";
		});

		return scene;
	};

	game.onload = function(){
		game.replaceScene(titleScene());
	}

    game.start();
};

