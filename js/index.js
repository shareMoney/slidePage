/**
 * Created by ningning.zhang on 2018/11/30.
 */
var  pageSlide={
    contentWidth:0,//容器宽度
    pageWidth:0,//每个页面宽度
    pages:0,//页面数量
    slideDistance:0,//滑动距离(大于0向右;小于0向左)
    slideDistanceMax:0,//最大滑动距离(大于0向右;小于0向左)
    pageContent:'',
    pageIndex:0,//当前页索引
    distanceRate:0.4,//当滑动的距离占屏幕的比例大于此值时跳转页面
    init:function () {
        this.pageContent=document.getElementsByClassName('slide-pageContent')[0];
        //获取屏幕宽度
        let clientWidth=document.body.clientWidth;
        //每个页面的宽度等于屏幕的宽度
        this.pageWidth=clientWidth;
        //获取页面数量
        let pages=document.getElementsByClassName('slide-page');
        this.pages=pages.length;
        //容器宽度=页面宽度的总和
        this.contentWidth=this.pages*this.pageWidth;
        //更新dom
        this.pageContent.style.width= this.contentWidth+'px';
        this.slideDistanceMax=(this.pages-1)*this.pageWidth;
        for (let i=0;i<this.pages;i++){
            pages[i].style.width=this.pageWidth+'px';
        }
    },
    //获取滑动距离及方向
    getSlideDistance:function () {
        let that=this;
        let mybody=document.body;
        let startX, startY, moveEndX, moveEndY, X, Y;
        mybody.addEventListener('touchstart', function(e) {
            //e.preventDefault();
            startX = e.touches[0].pageX;
            startY = e.touches[0].pageY;
        });
        mybody.addEventListener('touchmove', function(e) {
            //e.preventDefault();
            moveEndX = e.changedTouches[0].pageX;
            moveEndY = e.changedTouches[0].pageY;
            X = moveEndX - startX;
            Y = moveEndY - startY;
            //判断零界点
            if(X<0){//左滑
                if(that.slideDistance+X<=-that.slideDistanceMax){
                    that.pageContent.style.marginLeft=-that.slideDistanceMax+'px'
                    that.slideDistance=-that.slideDistanceMax;
                }else {
                    that.pageContent.style.marginLeft=that.slideDistance+X+'px'
                }
            }else if(X>0){//右滑
                if(that.slideDistance+X>=0){
                    that.pageContent.style.marginLeft='0px'
                    that.slideDistance=0;
                }else {
                    that.pageContent.style.marginLeft=that.slideDistance+X+'px'
                }
            }
        });
        mybody.addEventListener('touchend', function(e) {
            if(X<0){//左滑
                if(that.slideDistance>-that.slideDistanceMax){
                    that.slideDistance+=X;
                }else {
                    that.slideDistance=-that.slideDistanceMax;
                    return;
                }
                that.getPageIndex('left',X);
            }else if(X>0){//右滑
                if(that.slideDistance<0){
                    that.slideDistance+=X;
                }else {
                    that.slideDistance=0;
                    return;
                }
                that.getPageIndex('right',X);
            }

        })
    },
    //获取当前页索引
    getPageIndex:function (direction,X) {
        //判断滑动的距离是否超过页面的一半，大于0.5则自动滑动到下一页，小于0.5则留在当前页
        let DistanceRate=Math.abs(X)/this.pageWidth;
        if(direction=='left'){
            if(DistanceRate>this.distanceRate){
                this.pageIndex++;
            }
        }else if(direction=='right'){
            if(DistanceRate>this.distanceRate){
                this.pageIndex--;
            }
        }
        this.autoPage();
        this.updateSlideTitle();
    },
    //自动滑动到下一页或复位当前页
    autoPage:function () {
        //已经滑动的距离取正
        let slideDistance=parseInt(Math.abs(this.slideDistance));
        //需要滑到的页面的距离
        let slideDistancePage=this.pageWidth*this.pageIndex;
        var timer=setInterval(()=>{
                    if(slideDistance<slideDistancePage){
                         slideDistance+=50;
                        if(slideDistance>=slideDistancePage){
                            slideDistance=slideDistancePage
                            this.pageContent.style.marginLeft=-slideDistance+'px'
                            clearInterval(timer)
                        }
                    }else if(slideDistance>slideDistancePage){
                        slideDistance-=50;
                        if(slideDistance<=slideDistancePage){
                            slideDistance=slideDistancePage
                            this.pageContent.style.marginLeft=-slideDistance+'px'
                            clearInterval(timer)
                        }
                    }
                    this.pageContent.style.marginLeft=-slideDistance+'px'
            },20)
        this.slideDistance=-this.pageWidth*this.pageIndex;
    },
    /*更新slide-header-title样式*/
    updateSlideTitle:function () {
        let titles=document.getElementsByClassName('slide-header-title');
        for (let i=0;i<titles.length;i++){
            if(i==this.pageIndex){
                titles[this.pageIndex].classList.add("active");
            }else {
                titles[i].classList.remove("active");
            }
        }


    }
}
window.onload=function () {
    pageSlide.init();
    pageSlide.getSlideDistance();
}