//Module: 专门操作一类数据的方法和属性的集合
var game={
  data:null,//保存游戏的数据:二维数组
  RN:4, CN:4,//总行数和总列数
  score:0,//保存游戏得分
  state:1,//保存游戏状态
  RUNNING:1,//运行中
  GAMEOVER:0,//结束
  start:function(){//启动游戏
    this.state=this.RUNNING;//重置游戏状态为启动
    this.score=0;//得分归零
    //创建空数组保存在data属性中
    this.data=[];
    //r从0开始到<RN结束
    for(var r=0;r<this.RN;r++){
      //向data中压入一个空数组
      this.data.push([]);
      //c从0开始到<CN结束
      for(var c=0;c<this.CN;c++){
        //将data中r行c列位置赋值为0
        this.data[r][c]=0;
      }
    }
    this.randomNum(); this.randomNum();
    //debugger;//必须开着F12
    //console.dir(this.data);//打桩
    //console.log(this.data.join("\n"));
    this.updateView();
    //为页面绑定键盘按下事件
    //当键盘按下时，自动执行之后的function
    //event事件对象: 当事件发生时自动保存所有事件相关信息的对象
    document.onkeydown=function(e){//event
      if(this.state==this.RUNNING)
        switch(e.keyCode){//判断e.keyCode
          //是37: 就左移
          case 37: this.moveLeft(); break;
          //是38: 就上移
          case 38: this.moveUp(); break;
          //是39: 就右移
          case 39: this.moveRight(); break;
          //是40: 就下移
          case 40: this.moveDown(); break;
        }
    }.bind(this);
    //document.onkeydown();
  },
  move:function(callback){//所有移动中相同的代码
    //为data拍照，保存在before中
    var before=String(this.data);
    callback.call(this);
    //为data拍照，保存在after中
    var after=String(this.data);
    if(before!=after){//如果发生了移动
      this.randomNum();//随机生成数
      //如果游戏结束
        //修改游戏状态为GAMEOVER
      this.updateView();//更新页面
    }
  },
  isGameOver:function(){
    //遍历data
      //如果当前元素是0，就返回false
      //如果c<CN-1且当前元素等于右侧元素时，就返回false
      //如果r<RN-1且当前元素等于下方元素时，就返回false
    //(遍历结束)
    //返回true
  },
  moveRight:function(){//右移所有行
    this.move(function(){
      //遍历data中每一行
      for(var r=0;r<this.RN;r++)
        this.moveRightInRow(r);//右移第r行
    });
  },
  moveLeft:function(){//左移所有行
    this.move(function(){
      //遍历data中每一行  r
      for(var r=0;r<this.RN;r++)
        this.moveLeftInRow(r);//左移第r行
    });
  },
  moveUp:function(){
    this.move(function(){
      //遍历data中每一列
      for(var c=0;c<this.CN;c++)
        //调用moveUpInCol上移第c列
        this.moveUpInCol(c);
    });
  },
  moveDown:function(){
    this.move(function(){
      //遍历data中每一列
      for(var c=0;c<this.CN;c++)
        //调用moveDownInCol下移第c列
        this.moveDownInCol(c);
    });
  },
  moveLeftInRow:function(r){//左移第r行
    //c从0开始，到<CN-1结束，遍历r行中每个格
    for(var c=0;c<this.CN-1;c++){
      //找r行c列右侧下一个不为0的位置nextc
      var nextc=this.getNextInRow(r,c);
      //如果nextc为-1,就退出循环
      if(nextc==-1){break;}
      else{//否则  
        //如果c列的值是0
        if(this.data[r][c]==0){
          //将nextc列的值赋值给c列
          this.data[r][c]=this.data[r][nextc];
          //将nextc列的值置为0
          this.data[r][nextc]=0;
          c--;//c留在原地
        }else if(this.data[r][c]
                  ==this.data[r][nextc]){
        //否则 如果c列的值等于nextc列的值
          this.data[r][c]*=2;//将c列的值*2
          this.score+=this.data[r][c];
          this.data[r][nextc]=0;//将nextc列置为0 
        }
      }
    }
  },
  moveRightInRow:function(r){//右移第r行
    //c从CN-1开始，到>0结束，反向遍历r行中每个格
    for(var c=this.CN-1;c>0;c--){
      //找r行c列左侧前一个不为0的位置prevc
      var prevc=this.getPrevInRow(r,c);
      //如果prevc为-1,就退出循环
      if(prevc==-1){break;}
      else{//否则
        if(this.data[r][c]==0){//如果c列的值是0
          //将prevc列的值赋值给c列
          this.data[r][c]=this.data[r][prevc];
          //将prevc列的值置为0
          this.data[r][prevc]=0;
          c++;//c留在原地
        }else if(this.data[r][c]
                  ==this.data[r][prevc]){
          //否则 如果c列的值等于prevc列的值
          this.data[r][c]*=2;//将c列的值*2
          this.score+=this.data[r][c];
          this.data[r][prevc]=0;//将prevc列置为0
        }
      }
    }
  },
  moveUpInCol:function(c){
      //r从0开始,到r<RN-1结束，r每次递增1
    for(var r=0;r<this.RN-1;r++){
        //查找r行c列下方下一个不为0的位置nextr
      var nextr=this.getNextInCol(r,c);
      //如果没找到,就退出循环
      if(nextr==-1){break;}
      else{//否则
          //如果r位置c列的值为0
          if(this.data[r][c]==0){
            //将nextr位置c列的值赋值给r位置
            this.data[r][c]=this.data[nextr][c];
            //将nextr位置c列置为0
            this.data[nextr][c]=0;
            r--;//r留在原地
          }else if(this.data[r][c]
                    ==this.data[nextr][c]){
          //否则，如果r位置c列的值等于nextr位置的值
            //将r位置c列的值*2
            this.data[r][c]*=2;
            this.score+=this.data[r][c];
            //将nextr位置c列的值置为0
            this.data[nextr][c]=0;
          }
      }
    }
  },
  moveDownInCol:function(c){
      //r从RN-1开始，到r>0结束，r每次递减1
    for(var r=this.RN-1;r>0;r--){
      //查找r位置c列上方前一个不为0的位置prevr
      var prevr=this.getPrevInCol(r,c);
      //如果没找到,就退出循环
      if(prevr==-1){break;}
      else{//否则  
        //如果r位置c列的值为0
        if(this.data[r][c]==0){
          //将prevr位置c列的值赋值给r位置
          this.data[r][c]=this.data[prevr][c];
          //将prevr位置c列置为0
          this.data[prevr][c]=0;
          r++;//r留在原地
        }else if(this.data[r][c]
                  ==this.data[prevr][c]){
        //否则，如果r位置c列的值等于prevr位置的值
          this.data[r][c]*=2;//将r位置c列的值*2
          this.score+=this.data[r][c];
          //将prevr位置c列置为0
          this.data[prevr][c]=0;
        }
      }
    }
  },
  getPrevInCol:function(r,c){
    r--;//r-1
    //循环，r到>=0结束，每次递减1
    for(;r>=0;r--){
      //如果r位置c列不等于0, 就返回r
      if(this.data[r][c]!=0) return r;
    }//(遍历结束)
    return -1;//返回-1
  },
  getNextInCol:function(r,c){
    r++;//r+1
    //循环，到<RN结束，r每次递增1
    for(;r<this.RN;r++){
      //如果r位置c列不等于0, 就返回r
      if(this.data[r][c]!=0) return r;
    }//(遍历结束)
    return -1;//返回-1
  },
  //找r行c列左侧前一个不为0的位置
  getPrevInRow:function(r,c){
    c--;//c-1
    //从c开始，到>=0结束，反向遍历
    for(;c>=0;c--){
      //如果r行c位置不是0，就返回c
      if(this.data[r][c]!=0) return c;
    }//(遍历结束)
    return -1;//返回-1
  },
  //找r行c列右侧下一个不为0的位置
  getNextInRow:function(r,c){
    c++;//c+1
    //从c开始，到<CN结束
    for(;c<this.CN;c++){
      //如果r行c位置不是0，就返回c
      if(this.data[r][c]!=0){return c;}
    }//(遍历结束)
    return -1;//返回-1
  },
  //将data中的元素更新到页面对应div中
  updateView:function(){
    //遍历data  r   c
    for(var r=0;r<this.RN;r++)
      for(var c=0;c<this.CN;c++){
        //找到页面中id为cXX的div
        var div=document.getElementById("c"+r+c);
        //如果当前元素不是0
        if(this.data[r][c]!=0){
          //将data中当前元素放入div的内容中
          div.innerHTML=this.data[r][c];
          //修改div的className属性为"cell n"+当前元素值
          div.className="cell n"+this.data[r][c];
        }else{//否则
          div.innerHTML="";//清空div的内容
          //将div的className重置为cell
          div.className="cell";
        }
      }
    //找到id为score的span,设置其内容为score属性
    document.getElementById("score")//span
            .innerHTML=this.score;
    //找到id为gameOver的div,设置其style的display属性为: 如果游戏状态为GAMEOVER?"block":"none"
    document.getElementById("gameOver")
            .style.display=
              this.state==this.GAMEOVER?
                           "block":"none";
    //如果游戏结束，将score写入final
    this.state==this.GAMEOVER&&(
      document.getElementById("final")
              .innerHTML=this.score
    );
  },
  //在data的一个随机位置随机生成一个数字
  randomNum:function(){
    while(true){//反复:
      //在0~RN-1之间生成一个随机数r
      var r=Math.floor(Math.random()*this.RN);
      //在0~CN-1之间生成一个随机数c
      var c=Math.floor(Math.random()*this.CN);
      //如果data中r行c列为0
      if(this.data[r][c]==0){
        //将data中r行c列的值设置为: 
          //随机生成一个0~1之间的小数，如果<0.5，就取2，否则取4
        this.data[r][c]=Math.random()<0.6?2:4;
        break;//退出循环
      }
    }
  },
}
game.start();//页面加载后自动启动游戏