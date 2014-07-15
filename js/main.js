
enchant();

/* to fix iPhone/iPad "Touch to Start" freeze issue */
enchant.ENV.SOUND_ENABLED_ON_MOBILE_SAFARI = false;

window.onload = function(){

    var game = new Core(320, 320);
	var WATCH_DOG_COUNT = 10;
	var FIRST_SPEED = 60; /* 1 second */

    game.fps = 30;
	game.preload('image/planet_01.jpg', 'image/SUN000E.jpg', 'image/galaxy000.jpg');
	game.preload('image/yamochi.png', 'image/yamochi_back.png', 'image/gameover.png', 'image/clear.png',
				 'image/bomb_1.png', 'image/3ca.png', 'image/3ca_range.png', 'image/title_true.png',
				 'image/p_ligo.png', 'image/rainbow.png');
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

		WATCH_DOG_COUNT = 10;

		pm.destBlkAr = new Array(0);
		pm.ballAr = new Array(0);
		pm.bombAr = new Array(0);
		pm.imBlockCount = 0;
		pm.currentLen	= 0;
		pm.assertCnt	= 0;
		pm.watchdog		= 0;
		pm.imWatchdog	= 0;
		pm.vx_ratio		= 0;
		pm.vy_ratio		= 0;
		pm.p_ratio		= 0;
		pm.upP			= false;
		pm.downP		= false;
		pm.isPitatto	= false;
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
			var _sWallGroup
			var _sDestBlockArray;
			var _sBallArray;
			var _isPitatto;
			var _isBomberMode;
			var _isYamochiMode;
			var _prevLength = 0;
			var _currentLength = 0;
			var _assertCount = 0;
			var _watchDogCount = 0;
			var _imWatchDogCount = 0;
			var _vx_ratio = 0;
			var _vy_ratio = 0;
			var _pitatto_ratio = 0;
			var _mouseX = 0;
			var _mouseY = 0;

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
        		mouseX : {
        		    get: function() {
        		        return this._mouseX;
        		    },
        		    set: function(cnt) {
						this._mouseX= is;
        		    }
        		},
        		mouseY : {
        		    get: function() {
        		        return this._mouseY;
        		    },
        		    set: function(cnt) {
						this._mouseY= is;
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
        		isPitatto : {
        		    get: function() {
        		        return this._isPitatto;
        		    },
        		    set: function(is) {
						this._isPitatto = is;
        		    }
        		},
        		wallGr : {
        		    get: function() {
        		        return this._sWallGroup;
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
        		p_ratio : {
        		    get: function() {
        		        return this._pitatto_ratio;
        		    },
        		    set: function(cnt) {
						this._pitatto_ratio = cnt;
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
		var pm = Param.getInstance();
		var isDestroyComplete = false;
		for(var ii=0; ii<_ballArray.length; ii++){
			if((_isForceDestroy == true) ||
			   (_obj == _ballArray[ii].lastChild)	||
			   ((_ballArray[ii].x > game.width)		||
			    (_ballArray[ii].x < 0)				||
			    (_ballArray[ii].y > game.height)	||
			    (_ballArray[ii].y < 0)))
			{
				pm.blkGr.removeChild(_ballArray[ii]);
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
	}

	function buildWall(_player, _scene){
		var pm = Param.getInstance();
		var surface1	= new Surface(1, game.height*2);
		var surface2	= new Surface(game.width*2, 1);
		var left_sprite = new Sprite(1, game.height*2);
		var right_sprite = new Sprite(1, game.height*2);
		var top_sprite = new Sprite(game.width*2, 1);
		var bottom_sprite = new Sprite(game.width*2, 1);

		pm.wallGr = new Group();

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

		pm.wallGr.addChild(left_sprite);
		pm.wallGr.addChild(right_sprite);
		pm.wallGr.addChild(top_sprite);
		pm.wallGr.addChild(bottom_sprite);

		_scene.addChild(pm.wallGr);
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
		sprite_prevX = s_x;
		sprite_prevY = s_y;

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

		/* target block should delete */
		for(ii=0; ii<_block.length; ii++){
			var tmp_block = _block[ii];
			if(_target == tmp_block){
				pm.blkGr.removeChild(tmp_block);
				pm.destBlkAr.push(tmp_block);
				_block.splice(ii, 1);
			}
		}
	}

	function setPlayerCallback(_player){

		window.document.onmousemove = function(e){
			var pm = Param.getInstance();

			pm.mouseX = e.pageX / game.scale;
			pm.mouseY = e.pageY / game.scale;

			//console.log("mx = " + pm.mouseX + " my = " + pm.mouseY);

			_player.prevX = _player.x;
			_player.x = parseInt(pm.mouseX) - (_player.width/2);
			if(_player.x >= game.width - _player.width - 5){
				_player.x = game.width - _player.width - 5;
			}
			else if(_player.x <= 0 + 5){
				_player.x = 5;
			}

			if(pm.isPitatto == true){
				var move_ratio = (_player.x - _player.prevX);
   				for(var ii=0; ii<pm.ballAr.length; ii++){
					var grp = pm.ballAr[ii];
					grp.x += move_ratio;
				}
			}
		};
	}

	function buildSquare(_player, _color, _width, _height, _x, _y){
		var surface			= new Surface(_width, _height);
		var sp_group		= new Group(_width, _height);
		var front_sprite	= new Sprite(surface.width, surface.height);
		var back_sprite		= new Sprite(surface.width, surface.height);
		var s_x;
		var s_y;

		surface.context.fillStyle = _color;
		surface.context.fillRect(0, 0, surface.width, surface.height);

		if(_x == undefined){
			//s_x = Math.floor(_player.x) + Math.floor(_player.width/2) - Math.floor(surface.width/2);
			s_x = _player.x + _player.width/2 - surface.width/2;
		}
		else{
			s_x = _x;
		}
		if(_y == undefined){
			//s_y = 150;
			s_y = _player.y - surface.height;
		}
		else{
			s_y = _y;
		}

		console.log("ball x = " + s_x + " ball y = " + s_y);

        front_sprite.image = game.assets['image/3ca.png'];
		front_sprite.frame = 0;
		front_sprite.moveTo(0, 0);
		front_sprite.isAwake = true;
		front_sprite.kind = "ball_front";
		sp_group.addChild(front_sprite);

        back_sprite.image = game.assets['image/3ca_range.png'];
		back_sprite.frame = 0;
		back_sprite.moveTo(2, 0);
		back_sprite.isAwake = true;
		back_sprite.kind = "ball_back";
		back_sprite.opacity = 0.0;
		sp_group.addChild(back_sprite);
		sp_group.moveTo(s_x, s_y);

		return sp_group;
	};

	function buildBall(_player, _color, _rad, _x, _y){
		var surface = new Surface( _rad*2, _rad*2);
		var sp_group = new Group(_rad*2, _rad*2);
		var front_sprite = new Sprite(_rad*2, _rad*2);
		var back_sprite = new Sprite(_rad*2, _rad*2);
		var s_x;
		var s_y;

		surface.context.beginPath();
		surface.context.fillStyle = _color;
		surface.context.arc(_rad, _rad, _rad, 0, Math.PI*2, false);
		surface.context.fill();

		if(_x == undefined){
			//s_x = Math.floor(_player.x) + Math.floor(_player.width/2) - Math.floor(surface.width/2);
			s_x = _player.x + _player.width/2 - surface.width/2;
		}
		else{
			s_x = _x;
		}
		if(_y == undefined){
			//s_y = 150;
			s_y = _player.y - surface.height;
		}
		else{
			s_y = _y;
		}

		console.log("ball x = " + s_x + " ball y = " + s_y);

        front_sprite.image = game.assets['image/yamochi.png'];
		front_sprite.frame = 0;
		front_sprite.moveTo(0, 0);
		front_sprite.isAwake = true;
		front_sprite.kind = "ball_front";
		sp_group.addChild(front_sprite);

        back_sprite.image = game.assets['image/yamochi_back.png'];
		back_sprite.frame = 0;
		back_sprite.moveTo(2, 0);
		back_sprite.isAwake = true;
		back_sprite.kind = "ball_back";
		sp_group.addChild(back_sprite);
		sp_group.moveTo(s_x, s_y);

		return sp_group;
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

		var start_x = 10;
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
				sprite.x = pos_x;
				sprite.y = pos_y;
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
			var grp		= pm.ballAr[ii];
   			var _ball	= pm.ballAr[ii].lastChild;
			var posY	= pm.ballAr[ii].y + (_ball.height/2);

   			var deadLine = (_player.y + (_player.height) + 5);
   			if(posY >= deadLine){
   				destroyBall(pm.ballAr, _ball);
   			}

			for(var jj=0; jj<_block.length; jj++){
				var blkSp = _block[jj];

				if(_ball.intersect(blkSp) == true){
   					if(blkSp.color == "#444444"){
						var acos = calcRadBtoB(blkSp, grp);
						var vx = 0;
						var vy = 0;
						var pos_y = 0;

						if(blkSp.y < grp.y){
							pos_y = game.height;
							if((blkSp.y+(blkSp.height/2)) < grp.y){
								grp.y = blkSp.y + _ball.height + 1;
							}
						}
						else{
							if((blkSp.y+(blkSp.height/2)) > grp.y){
								grp.y = blkSp.y - _ball.height - 1;
							}
						}

						if(acos <= Math.PI/2){
							var qt = Math.PI/4;
							if(acos > qt){
								vx = (game.width/2) * (acos/Math.PI/2);
							}
							else if(acos < qt){
								vy = pos_y * (acos/qt);
							}
						}
						else {
							var qt = Math.PI / 4 * 3;
							vx = game.width;

							if(acos < qt){
								vx = game.width * (acos/qt);
							}
							else if(acos > qt){
								vy = pos_y * (acos/Math.PI);
							}
						}
						if((Math.floor(grp.prevX) != Math.floor(grp.x)) ||
						   (Math.floor(grp.prevY) != Math.floor(grp.y))){
							grp.prevX = grp.x;
							grp.prevY = grp.y;
							pm.watchdog = 0;
							console.log("update prev");
							grp.tl.clear().moveTo(vx-2, vy, 50, enchant.Easing.LINEAR);
						}
						else{
							++pm.watchdog;
							console.log("hoge(4): watchdog update");
						}

						if(++(pm.imWatchdog) >= 20){
							grp.tl.clear().moveTo(grp.x+20, grp.y+10, 50, enchant.Easing.LINEAR);
							pm.imWatchdog = 0;
						}
   					}
   					else if(pm.yamochiMode == true){
						// where does yamochi-san go?
   					}
   					else {
						pm.imWatchdog = 0;
   						destroyBlock(blkSp, _block);
   					}
   					
   					if(pm.bombMode == true){
   						bomb(_scene, _ball.x, _ball.y, _block);
   						destroyBall(pm.ballAr, _ball);
   						pm.bombMode = false;
   					}
				}
				else {
					var pm = Param.getInstance();
					for(var kk=0; kk<pm.wallGr.childNodes.length; kk++){
						var wall = pm.wallGr.childNodes[kk];
						if(_ball.intersect(wall) == true){

							if((Math.floor(grp.prevX) != Math.floor(grp.x)) ||
							   (Math.floor(grp.prevY) != Math.floor(grp.y))){

								var obj = calcRadWtoB2(wall, grp, wall.kind);
								console.log("hoge: obj x = " + obj.x + " y = " + obj.y);

								if((obj.x != 0) || (obj.y != 0)){
									grp.prevX = grp.x;
									grp.prevY = grp.y;

									switch(wall.kind){
										case "top_wall":
											grp.y = 2; /* tentative mergin */
											break;
										case "left_wall":
											grp.x = 2; /* tentative mergin */
											break;
										case "right_wall":
											grp.x = game.width - 1 - _ball.width - 2; /* tentative mergin */
											break;
									}

									pm.watchdog = 0;
									console.log("update prev");
									grp.tl.clear().moveTo(obj.x, obj.y, 50, enchant.Easing.LINEAR);
									console.log("hoge1: obj x = " + obj.x + " y = " + obj.y);
								}
							}
							else{
								pm.watchdog++;
								console.log("hoge2: watchdog in");
							}
						}
					}
				}
			}
   		}

   		if(pm.ballAr.length <= 0){
   			game.pushScene(gameoverScene(_stage));
   		}
   		else{
   			if(pm.watchdog > WATCH_DOG_COUNT){
				for(var ii=0; ii<pm.ballAr.length; ii++){
					var grp = pm.ballAr[ii];
					grp.prevX = _player.x;
					grp.prevY = _player.y;
					grp.tl.clear().moveTo(game.width/2, _player.y, 50, enchant.Easing.LINEAR);
					pm.watchdog = 0;
				}
   			}
   		}

   		/* clear check => or rather, all blocks destruction is completed? */
   		var lastBlockLength = _block.length - parseInt(pm.imBlockCount);
   		if(lastBlockLength <= 0){
   			game.pushScene(gameclearScene(_stage));
   		}
	}

	function calcRadBtoB(_player, _ball_group, _hit_target){
   		var _ball = _ball_group.firstChild;
		var p_x = (_player.x + (_player.width/2.0));
		var p_y = (_player.y + (_player.height/2.0));
		var b_x = (_ball_group.x + (_ball.width/2.0));
		var b_y = (_ball_group.y + (_ball.height/2.0));

		var t_x;
		var t_y;

		var isInverse = true; /* if true => reverse vector */

		switch(_hit_target){
			case "top_wall":		/* top boarder			  */
				t_x = 0;
				t_y = game.height;
				break;
			case "left_wall":		/* left boarder			  */
				t_x = 0;
				t_y = 0;
				break;
			case "right_wall":		/* right boarder		  */
				t_x = game.width;
				t_y = 0;
				isInverse = false;
				break;
			case undefined:	/* bottom boarder or else */
			default:
				t_x = 0;
				t_y = p_y;
				isInverse = false;
				break;
		}

		console.log("px = " + p_x + " py = " + p_y);
		console.log("bx = " + b_x + " by = " + b_y);
		console.log("tx = " + t_x + " ty = " + t_y);

		var a1 = ((b_x - p_x) * (t_x - p_x)) + ((b_y - p_y) * (t_y - p_y));
		var bb = Math.sqrt(Math.pow((b_x - p_x), 2) + Math.pow((b_y - p_y), 2));
		var bc = Math.sqrt(Math.pow((t_x - p_x), 2) + Math.pow((t_y - p_y), 2));
		var cos = a1 / (bb*bc);

		if(isInverse == true){
			cos = cos * (-1);
		}

		console.log("a1 = " + a1 + " bb = " + bb + " bc = " + bc );
		console.log("cos = " + cos);

		return Math.acos(cos);
	}

	function calcDistance(_src_x, _src_y, _dst_x, _dst_y){
		var pos_x = _dst_x - _src_x;
		var pos_y = -1 * (_dst_y - _src_y);

		var ret_distance = Math.sqrt(Math.pow(pos_x, 2) + Math.pow(pos_y, 2));

		return ret_distance;
	}

	function calcRadian(_src_x, _src_y, _dst_x, _dst_y){
		var pos_x = _dst_x - _src_x;
		var pos_y = _dst_y - _src_y;

		var ret_radian = Math.atan2(pos_y, pos_x);

		return ret_radian;
	}

	function rotatePosition(_entObj, _degree){
		var retObj = new Object();
		var rotate_rad = _degree * Math.PI / 180;  // degree to radian transfer
		//if(rotate_rad < 0){
		//	rotate_rad = rotate_rad + (2*Math.PI);
		//}

		/* calcurate rotated position */
		retObj.x = (_entObj.x * Math.cos(rotate_rad)) - (_entObj.y * Math.sin(rotate_rad));
		retObj.y = (_entObj.x * Math.sin(rotate_rad)) + (_entObj.y * Math.cos(rotate_rad));

		return retObj;
	}

	function calcRadWtoB(_wall, _ball_group, _hit_target){
		var retObj = new Object();
   		var _ball = _ball_group.firstChild;

		var prev_x = (_ball_group.prevX + (_ball.width/2.0));
		var prev_y = (_ball_group.prevY + (_ball.height/2.0));
		var current_x = (_ball_group.x + (_ball.width/2.0));
		var current_y = (_ball_group.y + (_ball.height/2.0));

		prev_y = -1 * prev_y;

		console.log("prev x = " + prev_x + " prev_y = " + prev_y);
		console.log("current x = " + current_x + " current_y = " + current_y);

		var dist = calcDistance(prev_x, prev_y, current_x, current_y);
		var rad = calcRadian(prev_x, prev_y, current_x, current_y);

		console.log("dist = " + dist);

		// calcurate refrection rad
		console.log("base rad = " + rad);
		console.log("base degree = " + (rad*360/(2*Math.PI)));

		rad = (Math.PI) - rad;

		console.log("refrection rad = " + rad);
		console.log("refrection degree = " + (rad*360/(2*Math.PI)));

		//if(rad < 0){
		//	rad = rad + (2*Math.PI);
		//}

		//var border_rad = 5 * Math.PI / 180;
		//if(Math.abs(rad - Math.PI) < border_rad){
		//	rad *= 3.0;
		//}

		retObj.x = Math.cos(rad) * dist;
		retObj.y = Math.sin(rad) * dist;

		console.log("before x = " + retObj.x + " y = " + retObj.y);

	//	switch(_hit_target){
	//		case "right_wall": /* rotate to 180 degree */
	//		case "left_wall":  /* rotate to 180 degree */
	//			retObj = rotatePosition(retObj, 180);
	//			break;
	//			/* break;  that needs twice same calculation. plz modify, if possible */
	//		case "top_wall": /* rotate to 90 degree */ 
	//			retObj = rotatePosition(retObj, 90);
	//			break;
	//	}

	//	console.log("after x = " + retObj.x + " y = " + retObj.y);

		/* if ball is on this range => ball is stopped spooky position */
		/* so PROBABLY it has to set extended line distance			   */
	//	if(((retObj.x > 0) && (retObj.x < game.width)) &&
	//	   ((retObj.y > 0) && (retObj.y < game.height))){
	//		var px = current_x;
	//		var py = current_y;
	//		var qx = retObj.x;
	//		var qy = retObj.y;
	//		var pos_x = qx - px;
	//		var pos_y = qy - py;
	//		var dist_pq = Math.sqrt(Math.pow(pos_x, 2) + Math.pow(pos_y, 2));
	//		var rx;
	//		var ry;
	//		for(var ii=0; ii<game.width; ii++){
	//			var L = ii;
	//			rx = (-L * px + (dist_pq + L) * qx) / dist_pq;
	//			ry = (-L * py + (dist_pq + L) * qy) / dist_pq;
	//			if(((rx < 0) || (rx > game.width)) ||
	//			   ((ry < 0) || (ry > game.height))){
	//				retObj.x = rx;
	//				retObj.y = ry;
	//				break;
	//			}
	//		}
	//	}

		return retObj;
	}

	function calcRadWtoB2(_wall, _ball_group, _hit_target){
		var retObj = new Object();

   		var _ball = _ball_group.firstChild;
		var prev_x = (_ball_group.prevX + (_ball.width/2.0));
		var prev_y = (_ball_group.prevY + (_ball.height/2.0));
		var current_x = (_ball_group.x + (_ball.width/2.0));
		var current_y = (_ball_group.y + (_ball.height/2.0));

		var w_x = _wall.x;
		//var w_x = (_ball_group.x + (_ball.width/2.0));
		var w_y = (_ball_group.y + (_ball.height/2.0));
		var b_x = prev_x;
		var b_y = prev_y;
		var t_x = _wall.x;
		var t_y = 0;

		if(isNaN(b_x) || isNaN(b_y)){
			b_x = game.width/2;
			b_y = game.height;
			prev_x = b_x;
			prev_y = b_y;
		}

		//if(_hit_target == "top_wall"){
		//	w_x = (_ball_group.x + (_ball.width/2.0));
		//	w_y = 0;
		//}
		//prev_y *= -1;
		//current_y *= -1;
		//w_y *= -1;
		//b_y *= -1;
		//t_y *= -1;

		console.log("wx = " + w_x + " wy = " + w_y);
		console.log("bx = " + b_x + " by = " + b_y);
		console.log("tx = " + t_x + " ty = " + t_y);

		var a1 = ((b_x - w_x) * (t_x - w_x)) + ((b_y - w_y) * (t_y - w_y));
		var bb = Math.sqrt(Math.pow((b_x - w_x), 2) + Math.pow((b_y - w_y), 2));
		var bc = Math.sqrt(Math.pow((t_x - w_x), 2) + Math.pow((t_y - w_y), 2));
		var cos = a1 / (bb*bc);
		var acos = Math.acos(cos);

		var dist = calcDistance(prev_x, prev_y, current_x, current_y);
		var rad = acos;

		console.log("hoge: dist = " + dist);

		retObj.x = Math.cos(rad) * dist;
		retObj.y = Math.sin(rad) * dist;

		console.log("be hoge: x = " + retObj.x + " y = " + retObj.y);

		switch(_hit_target){
			case "top_wall":		/* top boarder			  */
				retObj.x = retObj.x * (-1);
				break;
			case "left_wall":		/* left boarder			  */
				retObj.x = retObj.x * (-1);
			case "right_wall":		/* right boarder		  */
				retObj.y = retObj.y * (-1);
				break;
			case undefined:	/* bottom boarder or else */
			default:
				/* nothing to do ... probably. */
				break;
		}
		console.log("af hoge: x = " + retObj.x + " y = " + retObj.y);

		retObj = rotatePosition(retObj, 45);

		console.log("rot af hoge: x = " + retObj.x + " y = " + retObj.y);

		if(((retObj.x > -1) && (retObj.x < game.width)) &&
		   ((retObj.y > -1) && (retObj.y < game.height))){
			var px = current_x;
			var py = current_y;
			var qx = retObj.x;
			var qy = retObj.y;
			var pos_x = qx - px;
			var pos_y = qy - py;
			var dist_pq = Math.sqrt(Math.pow(pos_x, 2) + Math.pow(pos_y, 2));
			var rx;
			var ry;
			console.log("re-calc position");
			for(var ii=0; ii<9999; ii++){
				var L = ii;
				rx = (-L * px + (dist_pq + L) * qx) / dist_pq;
				ry = (-L * py + (dist_pq + L) * qy) / dist_pq;
				if(((rx < -3) || (rx > game.width+3)) ||
				   ((ry < -3) || (ry > game.height+3))){
					retObj.x = rx;
					retObj.y = ry;
					break;
				}
			}
		}
		console.log("af2 hoge: x = " + retObj.x + " y = " + retObj.y);

		return retObj;
	}

	function calcRadPtoB(_player, _ball_group, _hit_target){
   		var _ball = _ball_group.firstChild;
		var p_x = (_player.x + (_player.width/2.0));
		var p_y = (_player.y + (_player.height/2.0));
		var b_x = (_ball_group.x + (_ball.width/2.0));
		var b_y = (_ball_group.y + (_ball.height/2.0));

		var t_x = 0;
		var t_y = p_y;

		console.log("px = " + p_x + " py = " + p_y);
		console.log("bx = " + b_x + " by = " + b_y);
		console.log("tx = " + t_x + " ty = " + t_y);

		var a1 = ((b_x - p_x) * (t_x - p_x)) + ((b_y - p_y) * (t_y - p_y));
		var bb = Math.sqrt(Math.pow((b_x - p_x), 2) + Math.pow((b_y - p_y), 2));
		var bc = Math.sqrt(Math.pow((t_x - p_x), 2) + Math.pow((t_y - p_y), 2));
		var cos = a1 / (bb*bc);

		console.log("a1 = " + a1 + " bb = " + bb + " bc = " + bc );
		console.log("cos = " + cos);

		return Math.acos(cos);
	}

	var gameStage = function (_stage){

		var scene = new Scene();
		var pad = new Pad();
		var ii = 0;

		var ball_group; 
		var player;
		var block;
		var pm = Param.getInstance();

		initialize_params();

		setBackGround(scene, _stage);

		player = buildPlayerBlock(50, 12, pad, scene);
		block = buildBlocks(scene, getBlockByStageNumber(_stage), 10, player, pad);

console.log("stage = " + _stage);

		if(pm.yamochiMode == true){
			ball_group = buildBall(player, "red", 50/2); 
		}
		else{
			ball_group		= buildSquare(player, "red", 22, 12); 
			pm.isPitatto	= true;
			//ball_group.tl.moveTo(game.width, game.height, FIRST_SPEED, enchant.Easing.LINEAR);
		}

		scene.addChild(ball_group);
		pm.ballAr.push(ball_group);

		setPlayerCallback(player);

		buildWall(player, scene);

		scene.addChild(player);

		scene.addEventListener(Event.ENTER_FRAME, function(e){
			var pm = Param.getInstance();
			var input = game.input;

			controlBall(player, block, scene, _stage, input);

			{
				/* focus on player */
				if (input.up)    {
					if(pm.isPitatto == true){
						for(var ii=0; ii<pm.ballAr.length; ii++){
							var grp = pm.ballAr[ii];
							grp.tl.clear().moveTo(grp.x, 0, 50, enchant.Easing.LINEAR);
						}
						pm.isPitatto = false;
					}
				}

				if(input.g){
				}

				if(input.z){
					var pm = Param.getInstance();
					for(var ii=0; ii<pm.ballAr.length; ii++){
						var grp = pm.ballAr[ii];
						grp.tl.clear();
					}
				}

				if(input.r){
					var pm = Param.getInstance();
					for(var ii=0; ii<pm.ballAr.length; ii++){
						var grp = pm.ballAr[ii];
						grp.tl.clear().moveTo(-1, -1, 50, enchant.Easing.LINEAR);
					}
				}

				if(input.l){
				}

				if(input.t){
				}

				if(input.s){
					var lastBlockLength = block.length - parseInt(pm.imBlockCount);
					console.log("block length = " + block.length + " last = " + lastBlockLength);

					for(var ii=0; ii<pm.ballAr.length; ii++){
						var ball = pm.ballAr[ii].firstChild;
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
					if(pm.isPitatto == true){
						pm.p_ratio -= 5;
					}
					player.x -= 5;
				}

				if (input.right) {
					if(pm.isPitatto == true){
						pm.p_ratio += 5;
					}
					player.x += 5;
				}
	
				if(player.x <= 0) {
					if(pm.isPitatto == true){
						pm.p_ratio = 0;
					}
					player.x = 0;
				}
	
				if(player.x + player.width > game.width) {
					if(pm.isPitatto == true){
						pm.p_ratio = 0;
					}
					player.x = game.width - player.width;
				}

   				for(var ii=0; ii<pm.ballAr.length; ii++){
					var grp = pm.ballAr[ii];

   					var _ball = pm.ballAr[ii].lastChild;
   					var _ball_fr = pm.ballAr[ii].firstChild;

					if(pm.isPitatto == true){
						grp.x += pm.p_ratio;
						pm.p_ratio = 0;
					}

					if(player.intersect(_ball) == true){
						grp.y = player.y - _ball.height - 1;
						if(pm.downP == true){
							grp.tl.clear();
							pm.isPitatto = true;
							pm.downP = false;
						}
						else{
							var acos = calcRadPtoB(player, grp);
							var vx = 0;
							var vy = 0;
							console.log("acos = " + acos);

							if(acos <= Math.PI/2){
								var qt = Math.PI/4;
								if(acos > qt){
									vx = (game.width/2) * (acos/Math.PI/2);
								}
								else if(acos < qt){
									vy = player.y * (acos/qt);
								}
							}
							else {
								var qt = Math.PI / 4 * 3;
								vx = game.width;

								if(acos < qt){
									vx = game.width * (acos/qt);
								}
								else if(acos > qt){
									vy = player.y * (acos/Math.PI);
								}
							}
							if((Math.floor(grp.prevX) != Math.floor(grp.x)) ||
							   (Math.floor(grp.prevY) != Math.floor(grp.y))){
								grp.prevX = grp.x;
								grp.prevY = grp.y;
								pm.watchdog = 0;
								grp.tl.clear().moveTo(vx-2, vy, 50, enchant.Easing.LINEAR);
							}	
							else{
								pm.watchdog++;
								console.log("hoge3 :watchdog");
							}
						}
					}
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

		// rainbow disabled
//		rainbow(scene, logoSprite.x, logoSprite.y);

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

