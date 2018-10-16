AR.log("BYM AR v1.0");
var Instantiated;
var excuteOpperate;
var downAngle = -45;
var upAngel = 45;
var preessed = false;
var gameState = "Waitting";
var curProgress = 0;
var timeCountdown = null;
var tmp_NaiPingROt;
var curDegreed=0;
var rotTimer=null;
var WaitToClick=false;
var tipsTimerUp=null;
var tipsTimerDown=null;
AR.onload = function() {


	excuteOpperate = new HomeView();
	excuteOpperate.Initialize();
	tmp_NaiPingROt = AR.get_rotation("naiping_Mod_01");
};

AR.onbegin = function(clipId) {};

AR.onend = function(clipId) {
	if (clipId == "Bip001#Appear") {
		AR.animation.play("Bip001#Cry", 0);
	};

	if (clipId == "Bone039#HeadAppear") {
		AR.animation.play("Bone039#HeadLoop", 0);
		AR.animation.play("Bip001#HeadLoop", 0);
		AR.animation.play("group_Mod#HeadLoop", 0);
	};

	if (clipId == "Bone039#AmorAppear") {
		AR.animation.play("Bone039#AmorLoop", 0);
		AR.animation.play("Bip001#AmorLoop", 0);
		AR.animation.play("group_Mod#AmorLoop", 0);
	};

	if (clipId == "Bone039#SheildAppear") {
		AR.animation.play("Bone039#Happy", 0);
		AR.animation.play("Bip001#Happy", 0);
		AR.animation.play("group_Mod#Happy", 0);
	};
};

AR.onclick = function(nodeId, x, y) {
	if (excuteOpperate != null)
		excuteOpperate.Selected(nodeId);
};

// AR.ontouch = function(state, x, y) {
// 	var node = AR.picknode(x, y);
// 	excuteOpperate.Selected(node);
// }


function HomeView() {};
HomeView.prototype = {
	Initialize: function() {
		AR.set_visible("Group_UI1", true);
		AR.set_visible("UI1_beijing", true);

	},
	Selected: function(_nodeId, _x, _y) {
		if (_nodeId == "UI1_beijing") {
			AR.set_visiable(_nodeId, false);
			AR.set_visiable("UI1_duiqi", true);
			AR.set_visiable("UI1_zhaohuan", true);
		};


		if (_nodeId == "UI1_zhaohuan") {
			excuteOpperate.OnRelease();
		};
	},
	OnRelease: function() {
		excuteOpperate = null;
		excuteOpperate = new SLAMView();
		excuteOpperate.Initialize();
	}
};



function SLAMView() {};
SLAMView.prototype = {
	Initialize: function() {

		AR.set_visiable("UI1_duiqi", false);
		AR.set_visiable("UI1_zhaohuan", false);

		CtrlUI2View(true);


		//Set model to center
		var ua = AR.getUserAgent();
		var screenSize = ua.split(';')[3].split(' ')[1];
		var screenHeight = screenSize.split('x')[0];
		var screenWidth = screenSize.split('x')[1];
		if (screenHeight > 1100)
			setSlamPos(500, 1020);
		else {
			setSlamPos(380, 550);
		}
		AR.set_visiable("group_Mod", true);
		AR.play("Bip001#Appear", 1);
	},
	Selected: function(_nodeId, _x, _y) {
		if (_nodeId == "UI2_naiping") {
			if (gameState == "Waitting") {
				gameState = "Gamming";
				antHelper.countDown({
					// 总时间
					totalTime: 15,
					// 个位数节点
					firstNode: "UI2_shuzi02",
					// 十位数节点
					secondNode: "UI2_shuzi01",
					// 贴图路径第一部分
					pathPart1: "bundle/time/",
					// 贴图路径第二部分
					pathPart2: ".png",
					// 倒计时结束回调
					timeOutCallBack: function() {
						AR.log("回调啦！")
					}
				});
				AR.set_texture("UI2_wenzi1", "BYM.fbm/danmu5.png");
				AR.set_visiable("UI2_tishi",false);
				var tmp_CurROt = AR.get_rotation("naiping_Mod_01");
				var down = antHelper.toRadian(downAngle);
				var up = antHelper.toRadian(upAngel);
				rotTimer = AR.setInterval(function() {
					var tmp_CurROt = AR.get_rotation("naiping_Mod_01");
					if (preessed) {
						if(curDegreed>=35 && tipsTimerUp==null){
							AR.set_visiable("UI2_tishi",true);
							AR.set_texture("UI2_tishi","BYM.fbm/tishi6.png");
							if(tipsTimerUp!=null)AR.clearInterval(tipsTimerUp);
							tipsTimerUp=AR.setTimeout(function(){
								AR.set_visiable("UI2_tishi",false);
								AR.clearInterval(tipsTimerUp);
								tipsTimerUp=null;
							},800);
						}

						if (curDegreed >= 60) {
							gameState = "faile";
							GameOver();
							AR.clearInterval(rotTimer);
						}
						var step = (up - tmp_CurROt.y) / 10;
						curDegreed+=antHelper.toDegree(step);
						AR.rotate("naiping_Mod_01", 0, step, 0);
						preessed = false;
					} else {
						if(curDegreed<=-45 && tipsTimerDown==null){
							AR.set_visiable("UI2_tishi",true);
							AR.set_texture("UI2_tishi","BYM.fbm/tishi5.png");
							if(tipsTimerDown!=null)AR.clearInterval(tipsTimerDown);
							tipsTimerDown=AR.setTimeout(function(){
								AR.set_visiable("UI2_tishi",false);
								AR.clearInterval(tipsTimerDown);
								tipsTimerDown=null;
							},800);
						}
						if (curDegreed < -100) {
							gameState = "faile";
							GameOver();
							AR.clearInterval(rotTimer);
						}
						var step = (down - tmp_CurROt.y) / 50;
						curDegreed+=antHelper.toDegree(step);
						AR.rotate("naiping_Mod_01", 0, step, 0);
					}
				}, 100);
			}
			if (preessed) preessed = false;
			else preessed = true;
			return;
		};

		if (_nodeId == "UI3_beijing" && WaitToClick) {
			WaitToClick=false;
			if (gameState == "faile") {
				excuteOpperate.OnRelease();
			} else {
				antHelper.getTicket("bym");
			}
		}
	},
	OnRelease: function() {
		AR.set_texture("UI2_tishi","BYM.fbm/tishi.png");

		var curROt = AR.get_rotation("naiping_Mod_01");
		if(Math.abs(antHelper.toDegree(curROt.y)<=100)){
			AR.rotate("naiping_Mod_01", 0, antHelper.toRadian(-curDegreed),0);
		}
		else
			AR.rotate("naiping_Mod_01", 0, antHelper.toRadian(curDegreed),0);
		curDegreed=0;
		AR.set_visible("Group_UI3", false);
		gameState = "Waitting";
		AR.set_visible("group_Mod", false);
		AR.set_texture("UI2_shuzi01", "bundle/time/1.png");
		AR.set_texture("UI2_shuzi02", "bundle/time/5.png");
		AR.set_texture("UI2_nengliang2","bundle/progressbar/nengliangtiao1.png");
		AR.set_texture("UI2_wenzi1", "BYM.fbm/danmu1.png");
		AR.play("group_Mod#AmorReset",1);
		AR.play("Bip001#HeadReset",1);
		AR.play("Bone039#SheildReset",1);


		AR.set_visiable("zhuangbei_Mod_01",false);
		AR.set_visiable("zhuangbei_Mod_02",false);
		AR.set_visiable("zhuangbei_Mod_03",false);
		AR.set_visiable("UI2_wenzi2",false);
		AR.set_visiable("UI2_wenzi3",false);
		AR.set_visiable("UI2_wenzi4",false);

		excuteOpperate = new HomeView();
		excuteOpperate.Initialize();
	}
};



String.prototype.endWith = function(_str) {
	var d = this.length - _str.length;
	return (d >= 0 && this.lastIndexOf(_str) == d);
}

var PI = 3.1415926535;

// 欧拉角转四元数
QuaternionFromEuler = function(x, y, z) {
	var c1 = Math.cos(x / 2);
	var c2 = Math.cos(y / 2);
	var c3 = Math.cos(z / 2);
	var s1 = Math.sin(x / 2);
	var s2 = Math.sin(y / 2);
	var s3 = Math.sin(z / 2);

	var xx = s1 * c2 * c3 + c1 * s2 * s3;
	var yy = c1 * s2 * c3 - s1 * c2 * s3;
	var zz = c1 * c2 * s3 + s1 * s2 * c3;
	var ww = c1 * c2 * c3 - s1 * s2 * s3;

	return [xx, yy, zz, ww];
};

/**
 * [setSlamPos 放置模型实例]
 * @param {[type]} x [放置的X轴坐标]
 * @param {[type]} y [放置的Y轴坐标]
 */
setSlamPos = function(x, y) {
	if (AR.resetSlamModel && AR.getEnvProp("slamSupport") == "true") {
		AR.resetSlamModel(x, y);
		// if (Instantiated)
		//AR.scale("group_Mod", 10, 10, 10);

	} else {
		// if (Instantiated) return;
		AR.translate("group_Mod", 0, -30, 0);
		// AR.scale("group_Mod", 0.01, 0.01, 0.01);
	}
	Instantiated = true;
};

function GameOver() {		
	AR.set_visible("Group_UI3", true);
	if (timeCountdown != null)
		AR.clearInterval(timeCountdown);
	if(rotTimer!=null)
		AR.clearInterval(rotTimer);
	CtrlUI2View(false);
	if (gameState == "success") {
		AR.set_texture("UI3_beijing","BYM.fbm/pop_2.png");
	} else if (gameState == "faile") {
		AR.set_texture("UI3_beijing","BYM.fbm/pop_1.png");
	}
	AR.setTimeout(function(){
		WaitToClick=true;
	},1000);
}


function CtrlUI2View(_state) {
	AR.set_visible("Group_UI2", _state);
	AR.set_visible("naiping_Mod_01", _state);
	AR.set_visible("UI2_naiping", _state);
	AR.set_visible("UI2_nengliang2", _state);
	AR.set_visible("UI2_nengliang", _state);
	AR.set_visible("UI2_wenzi", _state);
	AR.set_visible("UI2_wenzi2", _state);
	AR.set_visible("UI2_shuzi01", _state);
	AR.set_visible("UI2_shuzi02", _state);
	AR.set_visible("UI2_shijian", _state);
	AR.set_visible("UI2_wenzi1", _state);
	AR.set_visiable("UI2_tishi",_state);
}

;
(function(w) {
	var o = 0;
	var A = "";
	var e = 8;

	function m(G) {
		return p(j(r(G), G.length * e))
	}

	function k(G) {
		return x(j(r(G), G.length * e))
	}

	function l(G) {
		return B(j(r(G), G.length * e))
	}

	function y(H, G) {
		return p(s(H, G))
	}

	function i(H, G) {
		return x(s(H, G))
	}

	function C(H, G) {
		return B(s(H, G))
	}

	function E() {
		return m("abc") == "900150983cd24fb0d6963f7d28e17f72"
	}
	var f = "300000000";
	var D = "D88DB9077BE481F747CD4BA24BAD8B23";

	function j(H, L) {
		H[L >> 5] |= 128 << ((L) % 32);
		H[(((L + 64) >>> 9) << 4) + 14] = L;
		var G = 1732584193;
		var I = -271733879;
		var J = -1732584194;
		var K = 271733878;
		for (var O = 0; O < H.length; O += 16) {
			var M = G;
			var N = I;
			var P = J;
			var Q = K;
			G = b(G, I, J, K, H[O + 0], 7, -680876936);
			K = b(K, G, I, J, H[O + 1], 12, -389564586);
			J = b(J, K, G, I, H[O + 2], 17, 606105819);
			I = b(I, J, K, G, H[O + 3], 22, -1044525330);
			G = b(G, I, J, K, H[O + 4], 7, -176418897);
			K = b(K, G, I, J, H[O + 5], 12, 1200080426);
			J = b(J, K, G, I, H[O + 6], 17, -1473231341);
			I = b(I, J, K, G, H[O + 7], 22, -45705983);
			G = b(G, I, J, K, H[O + 8], 7, 1770035416);
			K = b(K, G, I, J, H[O + 9], 12, -1958414417);
			J = b(J, K, G, I, H[O + 10], 17, -42063);
			I = b(I, J, K, G, H[O + 11], 22, -1990404162);
			G = b(G, I, J, K, H[O + 12], 7, 1804603682);
			K = b(K, G, I, J, H[O + 13], 12, -40341101);
			J = b(J, K, G, I, H[O + 14], 17, -1502002290);
			I = b(I, J, K, G, H[O + 15], 22, 1236535329);
			G = h(G, I, J, K, H[O + 1], 5, -165796510);
			K = h(K, G, I, J, H[O + 6], 9, -1069501632);
			J = h(J, K, G, I, H[O + 11], 14, 643717713);
			I = h(I, J, K, G, H[O + 0], 20, -373897302);
			G = h(G, I, J, K, H[O + 5], 5, -701558691);
			K = h(K, G, I, J, H[O + 10], 9, 38016083);
			J = h(J, K, G, I, H[O + 15], 14, -660478335);
			I = h(I, J, K, G, H[O + 4], 20, -405537848);
			G = h(G, I, J, K, H[O + 9], 5, 568446438);
			K = h(K, G, I, J, H[O + 14], 9, -1019803690);
			J = h(J, K, G, I, H[O + 3], 14, -187363961);
			I = h(I, J, K, G, H[O + 8], 20, 1163531501);
			G = h(G, I, J, K, H[O + 13], 5, -1444681467);
			K = h(K, G, I, J, H[O + 2], 9, -51403784);
			J = h(J, K, G, I, H[O + 7], 14, 1735328473);
			I = h(I, J, K, G, H[O + 12], 20, -1926607734);
			G = v(G, I, J, K, H[O + 5], 4, -378558);
			K = v(K, G, I, J, H[O + 8], 11, -2022574463);
			J = v(J, K, G, I, H[O + 11], 16, 1839030562);
			I = v(I, J, K, G, H[O + 14], 23, -35309556);
			G = v(G, I, J, K, H[O + 1], 4, -1530992060);
			K = v(K, G, I, J, H[O + 4], 11, 1272893353);
			J = v(J, K, G, I, H[O + 7], 16, -155497632);
			I = v(I, J, K, G, H[O + 10], 23, -1094730640);
			G = v(G, I, J, K, H[O + 13], 4, 681279174);
			K = v(K, G, I, J, H[O + 0], 11, -358537222);
			J = v(J, K, G, I, H[O + 3], 16, -722521979);
			I = v(I, J, K, G, H[O + 6], 23, 76029189);
			G = v(G, I, J, K, H[O + 9], 4, -640364487);
			K = v(K, G, I, J, H[O + 12], 11, -421815835);
			J = v(J, K, G, I, H[O + 15], 16, 530742520);
			I = v(I, J, K, G, H[O + 2], 23, -995338651);
			G = a(G, I, J, K, H[O + 0], 6, -198630844);
			K = a(K, G, I, J, H[O + 7], 10, 1126891415);
			J = a(J, K, G, I, H[O + 14], 15, -1416354905);
			I = a(I, J, K, G, H[O + 5], 21, -57434055);
			G = a(G, I, J, K, H[O + 12], 6, 1700485571);
			K = a(K, G, I, J, H[O + 3], 10, -1894986606);
			J = a(J, K, G, I, H[O + 10], 15, -1051523);
			I = a(I, J, K, G, H[O + 1], 21, -2054922799);
			G = a(G, I, J, K, H[O + 8], 6, 1873313359);
			K = a(K, G, I, J, H[O + 15], 10, -30611744);
			J = a(J, K, G, I, H[O + 6], 15, -1560198380);
			I = a(I, J, K, G, H[O + 13], 21, 1309151649);
			G = a(G, I, J, K, H[O + 4], 6, -145523070);
			K = a(K, G, I, J, H[O + 11], 10, -1120210379);
			J = a(J, K, G, I, H[O + 2], 15, 718787259);
			I = a(I, J, K, G, H[O + 9], 21, -343485551);
			G = u(G, M);
			I = u(I, N);
			J = u(J, P);
			K = u(K, Q)
		}
		return Array(G, I, J, K)
	}

	function c(G, J, K, L, H, I) {
		return u(z(u(u(J, G), u(L, I)), H), K)
	}

	function b(K, L, G, H, M, I, J) {
		return c((L & G) | ((~L) & H), K, L, M, I, J)
	}

	function h(K, L, G, H, M, I, J) {
		return c((L & H) | (G & (~H)), K, L, M, I, J)
	}

	function v(K, L, G, H, M, I, J) {
		return c(L ^ G ^ H, K, L, M, I, J)
	}

	function a(K, L, G, H, M, I, J) {
		return c(G ^ (L | (~H)), K, L, M, I, J)
	}

	function s(M, J) {
		var K = r(M);
		if (K.length > 16) {
			K = j(K, M.length * e)
		}
		var H = Array(16),
			L = Array(16);
		for (var G = 0; G < 16; G++) {
			H[G] = K[G] ^ 909522486;
			L[G] = K[G] ^ 1549556828
		}
		var I = j(H.concat(r(J)), 512 + J.length * e);
		return j(L.concat(I), 512 + 128)
	}

	function u(H, I) {
		var J = (H & 65535) + (I & 65535);
		var G = (H >> 16) + (I >> 16) + (J >> 16);
		return (G << 16) | (J & 65535)
	}

	function z(H, G) {
		return (H << G) | (H >>> (32 - G))
	}

	function r(I) {
		var J = Array();
		var H = (1 << e) - 1;
		for (var G = 0; G < I.length * e; G += e) {
			J[G >> 5] |= (I.charCodeAt(G / e) & H) << (G % 32)
		}
		return J
	}

	function B(J) {
		var I = "";
		var H = (1 << e) - 1;
		for (var G = 0; G < J.length * 32; G += e) {
			I += String.fromCharCode((J[G >> 5] >>> (G % 32)) & H)
		}
		return I
	}

	function p(J) {
		var G = o ? "0123456789ABCDEF" : "0123456789abcdef";
		var I = "";
		for (var H = 0; H < J.length * 4; H++) {
			I += G.charAt((J[H >> 2] >> ((H % 4) * 8 + 4)) & 15) + G.charAt((J[H >> 2] >> ((H % 4) * 8)) & 15)
		}
		return I
	}

	function x(K) {
		var L = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
		var I = "";
		for (var G = 0; G < K.length * 4; G += 3) {
			var J = (((K[G >> 2] >> 8 * (G % 4)) & 255) << 16) | (((K[G + 1 >> 2] >> 8 * ((G + 1) % 4)) & 255) << 8) | ((K[G + 2 >> 2] >> 8 * ((G + 2) % 4)) & 255);
			for (var H = 0; H < 4; H++) {
				if (G * 8 + H * 6 > K.length * 32) {
					I += A
				} else {
					I += L.charAt((J >> 6 * (3 - H)) & 63)
				}
			}
		}
		return I
	}

	function n() {
		_keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		this.encode = function(N) {
			var O = "";
			var H, J, L, G, I, K, M;
			var P = 0;
			N = _utf8_encode(N);
			while (P < N.length) {
				H = N.charCodeAt(P++);
				J = N.charCodeAt(P++);
				L = N.charCodeAt(P++);
				G = H >> 2;
				I = ((H & 3) << 4) | (J >> 4);
				K = ((J & 15) << 2) | (L >> 6);
				M = L & 63;
				if (isNaN(J)) {
					K = M = 64
				} else {
					if (isNaN(L)) {
						M = 64
					}
				}
				O = O + _keyStr.charAt(G) + _keyStr.charAt(I) + _keyStr.charAt(K) + _keyStr.charAt(M)
			}
			return O
		};
		this.decode = function(N) {
			var O = "";
			var H, J, L;
			var G, I, K, M;
			var P = 0;
			N = N.replace(/[^A-Za-z0-9\+\/\=]/g, "");
			while (P < N.length) {
				G = _keyStr.indexOf(N.charAt(P++));
				I = _keyStr.indexOf(N.charAt(P++));
				K = _keyStr.indexOf(N.charAt(P++));
				M = _keyStr.indexOf(N.charAt(P++));
				H = (G << 2) | (I >> 4);
				J = ((I & 15) << 4) | (K >> 2);
				L = ((K & 3) << 6) | M;
				O = O + String.fromCharCode(H);
				if (K != 64) {
					O = O + String.fromCharCode(J)
				}
				if (M != 64) {
					O = O + String.fromCharCode(L)
				}
			}
			O = _utf8_decode(O);
			return O
		};
		_utf8_encode = function(H) {
			H = H.replace(/\r\n/g, "\n");
			var G = "";
			for (var I = 0; I < H.length; I++) {
				var J = H.charCodeAt(I);
				if (J < 128) {
					G += String.fromCharCode(J)
				} else {
					if ((J > 127) && (J < 2048)) {
						G += String.fromCharCode((J >> 6) | 192);
						G += String.fromCharCode((J & 63) | 128)
					} else {
						G += String.fromCharCode((J >> 12) | 224);
						G += String.fromCharCode(((J >> 6) & 63) | 128);
						G += String.fromCharCode((J & 63) | 128)
					}
				}
			}
			return G
		};
		_utf8_decode = function(J) {
			var G = "";
			var H = 0;
			var I = c1 = c2 = 0;
			while (H < J.length) {
				I = J.charCodeAt(H);
				if (I < 128) {
					G += String.fromCharCode(I);
					H++
				} else {
					if ((I > 191) && (I < 224)) {
						c2 = J.charCodeAt(H + 1);
						G += String.fromCharCode(((I & 31) << 6) | (c2 & 63));
						H += 2
					} else {
						c2 = J.charCodeAt(H + 1);
						c3 = J.charCodeAt(H + 2);
						G += String.fromCharCode(((I & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
						H += 3
					}
				}
			}
			return G
		}
	}
	var d = function(G) {
		this.project_id = G.projectId;
		this.userId = null;
		this.nickName = null;
		this.avatar = null;
		this.gender = null;
		this.userAuth()
	};
	d.prototype = {
		extend: function(I, G) {
			for (var H in G) {
				I[H] = G[H]
			}
			return I
		},
		series: function(J, G, H) {
			var H = H || "0";
			var J = J + "";
			var I = new Array(G - J.length + 1).join(H) + J;
			return J.length >= G ? J : I
		},
		toRadian: function(G) {
			return G * Math.PI / 180
		},
		toDegree: function(G) {
			return G / Math.PI * 180
		},
		randomNum: function(H, M, I) {
			var G = [];
			var K;
			for (var L = 0; L < H; L++) {
				K = Math.floor(Math.random() * (I - M + 1) + M);
				for (var J = 0; J < G.length; J++) {
					if (K == G[J]) {
						K = Math.floor(Math.random() * (I - M + 1) + M);
						J = -1
					}
				}
				G.push(K)
			}
			return G
		},
		getArrayItems: function(G, I) {
			var M = [];
			for (var H in G) {
				M.push(G[H])
			}
			var K = [];
			for (var J = 0; J < I; J++) {
				if (M.length > 0) {
					var L = Math.floor(Math.random() * M.length);
					K[J] = M[L];
					M.splice(L, 1)
				} else {
					break
				}
			}
			return K
		},
		quaternionFromEuler: function(Q, O, N) {
			var L = Math.cos(Q / 2);
			var J = Math.cos(O / 2);
			var I = Math.cos(N / 2);
			var S = Math.sin(Q / 2);
			var R = Math.sin(O / 2);
			var P = Math.sin(N / 2);
			var G = S * J * I + L * R * P;
			var M = L * R * I - S * J * P;
			var H = L * J * P + S * R * I;
			var K = L * J * I - S * R * P;
			return [G, M, H, K]
		},
		getDeviceInfo: function(G) {
			var H = AR.getEnvProp("arUserAgent");
			if (!H) {
				return false
			}
			switch (G) {
				case "platform":
					var I = H.split(";")[0].split(" ")[1];
					break;
				case "device":
					var I = H.split(";")[1].split(" ")[1];
					break;
				case "screen":
					var I = H.split(";")[3].split(" ")[1];
					break;
				case "screenWidth":
					var I = AR.getEnvProp("screenWidth");
					break;
				case "screenHeight":
					var I = AR.getEnvProp("screenHeight");
					break
			}
			return I
		},
		createAnimation: function(G) {
			AR.create_animation(G.animId, G.nodeId, G.propertyId, G.keyCount, G.keyTimes, G.keyValues, G.type)
		},
		frameAnimation: function(I) {
			var N = this;
			var H = 1;
			var G = {
				startNum: 0,
				seriesLength: 3,
				frameRate: 42,
				repeat: 0,
				frameAnimateCallBack: null
			};
			var L = this.extend(G, I);

			function M() {
				var O = L.startNum + "";
				return N.series(O, L.seriesLength, L.filler)
			}

			function K() {
				return L.imagePath + M() + ".png"
			}

			function J() {
				var P = L.startNum;
				for (var O = 0; O < L.imagesCount; O++) {
					frameTimer = AR.setTimeout(function() {
						var Q = K();
						AR.set_texture(L.needTextureNode, Q, 0);
						if (__version != "0.0.2") {
							AR.remove_tex_cache(K())
						}
						L.startNum++;
						if (L.startNum - P >= L.imagesCount) {
							H++;
							if (L.repeat >= H) {
								L.startNum = P;
								J()
							} else {
								if (L.repeat == 0) {
									L.startNum = P;
									J()
								}
							}
							if (typeof L.callBack === "function") {
								L.callBack()
							}
						}
					}, O * L.frameRate)
				}
			}
			J()
		},
		countDown: function(K) {
			var G = K.totalTime;
			var J = G % 10;
			var I = Math.floor(G / 10) % 10;
			AR.set_texture(K.firstNode, K.pathPart1 + J + K.pathPart2);
			AR.set_texture(K.secondNode, K.pathPart1 + I + K.pathPart2);
			var H = AR.setInterval(function() {
				timeCountdown = H;
				G -= 1;
				var M = G % 10;
				var L = Math.floor(G / 10) % 10;
				AR.set_texture(K.firstNode, K.pathPart1 + M + K.pathPart2);
				AR.set_texture(K.secondNode, K.pathPart1 + L + K.pathPart2);
				if (gameState == "Gamming") {
					switch (G) {
						case 3:
							AR.set_texture("UI2_nengliang2", "bundle/progressbar/nengliangtiao4.png");
							AR.set_texture("UI2_wenzi1", "BYM.fbm/danmu4.png");

							AR.stop("Bone039#AmorLoop");
							AR.stop("group_Mod#AmorLoop");
							AR.stop("Bip001#AmorLoop");

							AR.play("Bone039#SheildAppear", 1);
							AR.play("group_Mod#SheildAppear", 1);
							AR.play("Bip001#SheildAppear", 1);
							AR.set_visiable("zhuangbei_Mod_02",true);
							AR.set_visiable("UI2_wenzi3",false);
							AR.set_visiable("UI2_wenzi4",true);

							AR.setTimeout(function() {
								gameState = "success";
								GameOver();
							}, 3500);
							AR.clearInterval(rotTimer);
							AR.clearInterval(H);
							break;
						case 7:
							AR.set_texture("UI2_nengliang2", "bundle/progressbar/nengliangtiao3.png");
							AR.set_texture("UI2_wenzi1", "BYM.fbm/danmu3.png");
							AR.stop("Bip001#HeadLoop");
							AR.stop("Bone039#HeadLoop");
							AR.stop("group_Mod#HeadLoop");

							AR.play("Bone039#AmorAppear", 1);
							AR.play("group_Mod#AmorAppear", 1);
							AR.play("Bip001#AmorAppear", 1);
							AR.set_visiable("zhuangbei_Mod_01",true);
							AR.set_visiable("UI2_wenzi2",false);
							AR.set_visiable("UI2_wenzi3",true);

							break;
						case 10:
							AR.set_texture("UI2_nengliang2", "bundle/progressbar/nengliangtiao2.png");
							AR.set_texture("UI2_wenzi1", "BYM.fbm/danmu2.png");
							AR.stop("Bip001#Cry");
							AR.stop("Bip001#Cry");
							AR.stop("Bone039#Cry");
							AR.stop("group_Mod#Cry");

							AR.play("Bip001#HeadAppear", 1);
							AR.play("Bone039#HeadAppear", 1);
							AR.play("group_Mod#HeadAppear", 1);
							AR.set_visiable("zhuangbei_Mod_03",true);
							AR.set_visiable("UI2_wenzi2",true);
							break;
					}
				}
				if (G <= 0) {
					AR.clearInterval(H);
					K.timeOutCallBack()
				}
			}, 1000)
		},
		setVisible: function(J, H) {
			if (typeof J === "string") {
				AR.set_visible(J, H)
			} else {
				if (typeof J === "object") {
					for (var I = 0, G = J.length; I < G; I++) {
						AR.set_visible(J[I], H)
					}
				}
			}
		},
		playAnimation: function(I, H, J) {
			if (typeof I === "string") {
				AR.play(I + "#" + H, J)
			} else {
				if (typeof I === "object") {
					for (var G = 0; G < I.length; G++) {
						AR.play(I[G] + "#" + H[G], J[G])
					}
				}
			}
		},
		playVideo: function(K, I, J, H) {
			if (K) {
				var G = {};
				G.transparent = true;
				AR.set_video(I, J, H, JSON.stringify(G));
				AR.play_video(I)
			} else {
				AR.set_video(I, J, H);
				AR.play_video(I)
			}
		},
		userAuth: function(I) {
			var K = this;
			var G = {
				appId: "2016071501621644",
				scopeNicks: ["auth_base"],
				extInfo: null,
				isvAppId: null,
				authCallback: function(M, L) {
					if (M) {
						J()
					} else {
						AR.log("auth_base failed " + L.error)
					}
				}
			};
			var H = this.extend(G, I);
			AR.auth(H.appId, H.scopeNicks, H.extInfo, H.authCallback, H.isvAppId);

			function J() {
				AR.getAuthUserInfo({
					appId: H.appId,
					callback: function(M, L) {
						if (M) {
							K.nickName = L.userInfo.nickName;
							K.avatar = L.userInfo.avatar;
							K.gender = L.userInfo.gender;
							K.userId = L.userInfo.userId;
							if (K.nickName == null || K.nickName == "") {
								K.nickName = "default"
							}
							K.getUserInfos()
						} else {
							AR.log("getAuthUserInfo failed, " + L.error)
						}
					}
				})
			}
		},
		requestInfo: function(J, I, G, N) {
			var L = Math.round(new Date().getTime() / 1000) + "";
			var O = "https://api.gxar.com/rest.php";
			var H = JSON.stringify(J);
			var M = D + "&action=" + I + "&appid=" + f + "&nonce=" + L + "&params=" + H + "&timestamp=" + L;
			var K = m(M).toUpperCase();
			AR.request({
				url: O,
				data: {
					data: H
				},
				header: {
					"content-type": "application/json",
					"appid": f,
					"action": I,
					"nonce": L,
					"timestamp": L,
					"sign": K,
					"program": "AR"
				},
				method: "POST",
				success: G,
				fail: N
			})
		},
		getUserInfos: function() {
			var I = "com.gxar.project.user.logs.record";
			var H = new n();
			var G = {};
			G.project_id = this.project_id;
			G.pid = this.userId;
			G.nickname = H.encode(this.nickName);
			G.avatar = this.avatar;
			G.gender = this.gender;
			G.alipay_version = AR.getEnvProp("alipayVersion");
			G.system_volume = AR.getEnvProp("systemVolume");
			G.resource_version = AR.getEnvProp("alipayBundleVersion");
			G.resource_compatible_version = AR.getEnvProp("alipayCompatibleVersion");
			G.tracking_mode = AR.getEnvProp("trackMode");
			G.runtime_environment = AR.getEnvProp("arUserAgent");
			G.source = 1;
			G.source_remark = AR.getEnvProp("rpc_factorName");
			this.requestInfo(G, I, t, g)
		},
		getTicket: function(G) {
			var I = "com.gxar.dev.ticket.get.voucher";
			var H = {};
			H.project_id = this.project_id;
			H.pid = this.userId;
			H.tag = G;
			this.requestInfo(H, I, q, F)
		}
	};
	var t = function(G) {
		AR.log(G.data)
	};
	var g = function(G) {
		AR.log("faile" + G.statusCode)
	};
	var q = function(G) {
		var I = JSON.parse(G.data);
		var H = I.data.url;
		AR.open_url(H)
	};
	var F = function(G) {
		AR.log("faile" + G.statusCode)
	};
	w.AntHelper = d
})(this);

var antHelper = new AntHelper({
	// 项目ID，必填
	projectId: "223959490"
});