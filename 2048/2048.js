"use strict";
var game = {
	data:null,//保存游戏的二维数组
	RN:4,	// 4行
	CN:4,	//4列
	start(){
		// 游戏启动
		this.data = [];
		// 遍历每行
		for(var i = 0;i<this.RN;i++){
			this.data[i] = [];
			// 遍历每列
			for(var j = 0;j<this.CN;j++){
				this.data[i][j] = 0;
			}

		};
		this.randomNum();
		this.randomNum();
		this.updataView();
		// 最终生成一个二维数组
		console.log(this.data.join("\n"));

		document.onkeydown = function(e){
			// 当前的this指向 documnet , 我想指向game
			switch(e.keyCode){
				case 37: 	//左移
					this.moveLeft();
					break;
				case 38: //上移
					break;	
				case 39: //右移
					break;	
				case 40: //下移
					break;		
			}
		}.bind(this);
	},
	randomNum(){
		while(true){
			// 在一个随机的位置生成2或4
			var r = Math.floor(Math.random()*4);
			var c = Math.floor(Math.random()*4);

			if(this.data[r][c] == 0){
				var number = Math.random();
				this.data[r][c] = number<0.5?2:4;
				break;
			}
		}
		
	},
	updataView(){
		// 将data中的数据更新到每个div中
		for(var r = 0;r<this.RN;r++){
			for(var c = 0; c<this.CN;c++){
				var n = this.data[r][c];
				var div = document.getElementById('c'+r+c);
				if(n!=0){
					div.innerHTML = n;
					div.className = 'cell n'+n;
				}else {
					div.innerHTML = '';
					div.className = 'cell';
				}
			}
		}
	},
	moveLeft(){//左移所有行
	    var before=String(this.data);
	    console.log(before);
	    //遍历data中每一行  r
	    for(var r=0;r<this.RN;r++)
	      this.moveLeftInRow(r);//左移第r行
	    //(遍历结束)
	    var after=String(this.data);
	    //如果before不等于after
	    if(before!==after){
	      this.randomNum();//随机生成一个新数
	      this.updataView();//更新页面
	    }
  	},
	  moveLeftInRow(r){//左移第r行
	    //c从0开始，到<CN-1结束，遍历r行中每个格
	    for(var c=0;c<this.CN-1;c++){
	    	//找r行c列右侧下一个不为0的位置nextc
	    	var nextc=this.getNextInRow(r,c);
			//如果nextc为-1,就退出循环
	    	if(nextc == -1) break;
	    	else 
	    		//如果c列的值是0
	    		if(this.data[r][c] == 0){
	    			//将nextc列的值赋值给c列
	    			this.data[r][c] = this.data[r][nextc];
	    			//将nextc列的值置为0
	    			this.data[r][c] == 0;
	    			//c留在原地
	    			c--;
	    			//否则 如果c列的值等于nextc列的值
	    		}else if(this.data[r][c] == this.data[r][nextc]){
	    			//将c列的值*2
	    			this.data[r][c]*=2;
	    			//将nextc列置为0       
	    			this.data[r][nextc]=0;
	    		}
	    	}
	    },	      
	          
	  //找r行c列右侧下一个不为0的位置
	  getNextInRow(r,c){
	    //c+1
	    //从c开始，到<CN结束
	    for(var i= c+1;i<this.CN;i++){
	    	//如果r行c位置不是0 返回c
	    	if(this.data[r][i]!= 0)return i;
	    }
	    //返回-1
	    return -1;
	  },
}
game.start();