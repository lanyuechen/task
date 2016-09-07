var Branch = function() {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.x = canvas.width / 2;
    this.y = canvas.height;
    this.radius = 10;
    this.angle = Math.PI / 2;

    this.fillStyle = "#000";
    this.shadowColor = "#000";
    this.shadowBlur = 2;

    this.speed = width/200;
    this.generation = 0;
    this.distance = 0;
};

Branch.prototype = {
    // 主要的处理过程发生在这里
    process: function() {
        // 在当前的坐标处画出一个圆形
        this.draw();
        // 把当前的branch继续向上延伸一部分
        this.iterate();
        this.split();
        this.die();
    },

    draw: function() {
        var context = this.context;
        context.save();
        context.fillStyle = this.fillStyle;
        context.shadowColor = this.shadowColor;
        context.shadowBlur = this.shadowBlur;
        context.beginPath();
        context.moveTo(this.x, this.y);
        // 图形是依靠在各个坐标处画出的圆形组合而成
        context.arc(this.x, this.y, this.radius, 0, 2*Math.PI, true);
        context.closePath();
        context.fill();
        context.restore();
    },

    iterate: function() {
        var deltaX = this.speed * Math.cos(this.angle);
        var deltaY = - this.speed * Math.sin(this.angle);

        // 利用speed控制需要向上延伸的距离
        this.x += deltaX;
        this.y += deltaY;
        // 根据当前是第几代，减小半径值
        this.radius *= (0.99 - this.generation/250);

        // 求出距离的增量
        var deltaDistance = Math.sqrt(Math.pow(deltaX,2) + Math.pow(deltaY,2));

        // distance指的是当前的这一段树枝的长度
        this.distance += deltaDistance;

        // 控制speed的大小，使绘图时不至于在两个圆之间出现空白
        if (this.speed > this.radius * 2){
            this.speed = this.radius * 2;
        }

        // 产生一个范围在（-0.1, 0.1)之间的随机数,对角度进行一个偏转
        this.angle += Math.random()/5 - 0.1;
    },

    split: function() {
        var splitChance = 0;
        // 树干部分，长度大于画面高度2/5时开始分叉
        if (this.generation == 1)
            splitChance = this.distance / height - 0.4;
        // 树枝部分
        else if (this.generation < 3)
            splitChance = this.distance / height - 0.1;

        if (Math.random() < splitChance) {
            // 下一代生成n个树枝
            var n = 2 + Math.round(Math.random()*3);
            for (var i = 0; i < n; i++) {
                var branch = new Branch();
                branch.x = this.x;
                branch.y = this.y;
                branch.angle = this.angle;
                branch.radius = this.radius * 0.9;
                branch.generation++;
                branch.fillStyle =this.fillStyle;

                // 将branch加入到集合中去
                branches.add(branch);
            }
            // 将父代branch删去
            branches.remove(this);
        }
    },

    die: function() {
        if (this.radius < 0.3) {
            branches.remove(this);
        }
    }
};

var BranchCollection = function() {
    this.branches = [];
}

BranchCollection.prototype = {
    add: function(branch) {
        this.branches.push(branch);
    },
    process: function() {
        for (var b in this.branches) {
            this.branches[b].process();
        }
    },
    remove: function(branch) {
        for (var  b in this.branches)
            if (this.branches[b] === branch) {
                this.branches.splice(b, 1);
            }
    } 
}

var width = window.innerWidth;
var height = window.innerHeight;
console.log('width', width, 'height', height)
var canvas = document.getElementById("tree");
canvas.width = width;
canvas.height = height;

// 设置初始的数量
var n = 2 + Math.random() * 3;

// 设定初始的半径大小
var initialRadius = width / 50;

// 新建一个集合用于放置所有的branch
branches = new BranchCollection();

for (var i = 0; i < n; i++) {
    branch = new Branch();
    // 以canvas的中点为基准，左右各占一个initialRadius的宽度
    // 根据序号i算出初始x坐标
    branch.x = width/2 - initialRadius + i * 2 * initialRadius / n;
    branch.radius = initialRadius;

    // 将新的branch加入集合中去
    branches.add(branch);
}

var interval = setInterval(function() {
    // 对集合内的每个元素依次进行处理
    branches.process();
    if (branches.branches.length == 0) {
        clearInterval(interval);
    }

}, 20);