// element 作用区域（所有执行翻页页面的父级元素DOM）
// isLoop 是否循环执行翻页
// needScrollClass 执行翻页页面内部可滚动元素样式名

var element = document.getElementsByClassName('page_box')[0];
var isLoop = '';
var needScrollClass = 'scroll_box';
// console.log(element.querySelectorAll('.page'));
// console.log(element.querySelectorAll('.page').length);
// console.log(element.querySelector('.page'));
// console.log(element.querySelector('.page2'));
var pageData = {
    curPage: 1,
    prevPage: null,
    PageL: element.querySelectorAll('.page').length,
    type: null,
    canTouch: true,
    startY: 0,
    endY: 0,
    diff: 0,
}
var startEvt, moveEvt, endEvt;
if ("ontouchstart" in window) {
    // 移动端用户滑动事件
    startEvt = "touchstart";
    moveEvt = "touchmove";
    endEvt = "touchend";
} else {
    // PC端鼠标移动事件
    startEvt = "mousedown";
    moveEvt = "mousemove";
    endEvt = "mouseup";
}
element.addEventListener(startEvt, touchStart, false);
element.addEventListener(moveEvt, touchMove, false);
element.addEventListener(endEvt, touchEnd, false);
function touchStart(e) {
    pageData.startY = startEvt == "touchstart" ? e.touches[0].pageY : e.pageY;
    pageData.endY = '';
    pageData.diff = '';
}
function touchMove(e) {
    e.preventDefault();
    pageData.endY = startEvt == "touchstart" ? e.touches[0].pageY : e.pageY;
    pageData.diff = pageData.endY - pageData.startY;
}
function touchEnd(e) {
    if (Math.abs(pageData.diff) > 75 && pageData.canTouch) {//150
        changeDoBefore(pageData.diff);
    }
    // setTimeout(function(){
    pageData.startY = '';
    pageData.endY = '';
    pageData.diff = '';
    // },500);
}
function changeDoBefore(diffNum) {
    if (diffNum > 0) {
        // 向下滑动进入前一页
        pageData.type = 2;
        if (pageData.curPage <= 1) {
            if (isLoop) {
                pageData.prevPage = 1;
                pageData.curPage = pageData.PageL;
                changeDo();
            }
        } else {
            pageData.prevPage = pageData.curPage;
            pageData.curPage--;
            changeDo();
        }
    } else {
        // 向上滑动进入下一页
        pageData.type = 1;
        if (pageData.curPage >= pageData.PageL) {
            if (isLoop) {
                pageData.prevPage = pageData.PageL;
                pageData.curPage = 1;
                changeDo();
            }
        } else {
            pageData.prevPage = pageData.curPage;
            pageData.curPage++;
            changeDo();
        }
    }
}


function changeDo() {
    if (pageData.type == 1) {
        element.querySelector('.page' + pageData.prevPage).classList.remove('inTop', 'outTop', 'inDown', 'outDown', 'hide');
        element.querySelector('.page' + pageData.prevPage).classList.add('outTop');
        element.querySelector('.page' + pageData.curPage).classList.remove('inTop', 'outTop', 'inDown', 'outDown', 'hide');
        element.querySelector('.page' + pageData.curPage).classList.add('inTop');
    } else if (pageData.type == 2) {
        element.querySelector('.page' + pageData.prevPage).classList.remove('inTop', 'outTop', 'inDown', 'outDown', 'hide');
        element.querySelector('.page' + pageData.prevPage).classList.add('outDown');
        element.querySelector('.page' + pageData.curPage).classList.remove('inTop', 'outTop', 'inDown', 'outDown', 'hide');
        element.querySelector('.page' + pageData.curPage).classList.add('inDown');
    }

    pageData.canTouch = false;
    wheelCooldown = 0.6;
    setTimeout(function () {
        pageData.canTouch = true;
        element.querySelector('.page' + pageData.prevPage).classList.add('hide');

    }, 500);
    //设置最后一页时隐藏向下箭头
    if (pageData.curPage >= pageData.PageL) {
        document.querySelector('.arrow').classList.add('hide');
    } else {
        document.querySelector('.arrow').classList.remove('hide');
    }
    //设置第一页时隐藏向上箭头
    if (pageData.curPage == 1) {
        document.querySelector('.arrowTop').classList.add('hide');
    } else {
        document.querySelector('.arrowTop').classList.remove('hide');
    }
}

var wheelCooldown = 0.0;
var scrollFunc = function (e) {
    let wheel = 0;
    e = e || window.event;
    if (e.wheelDelta) {  //判断浏览器IE，谷歌滑轮事件
        wheel = e.wheelDelta
    } else if (e.detail) {  //Firefox滑轮事件
        wheel = e.detail
    }
    if (wheelCooldown <= 0) {
        if (wheel < -1) {
            changeDoBefore(-1);
            wheel = 0;
            wheelCooldown = 0.6;
        }
        else if (wheel > 1) {
            changeDoBefore(1);
            wheel = 0;
            wheelCooldown = 0.6;
        }
    }
}

var int = self.setInterval("scrollCooldown()", 100);
function scrollCooldown() {
    if (wheelCooldown > 0) {
        wheelCooldown -= 0.1;

    }
}

//给页面绑定滑轮滚动事件
if (document.addEventListener) {//firefox
    document.addEventListener('DOMMouseScroll', scrollFunc, false);
}
//滚动滑轮触发scrollFunc方法  //ie 谷歌
window.onmousewheel = document.onmousewheel = scrollFunc;

function btnScroll(num){
    if(wheelCooldown <= 0){
        changeDoBefore(num);
        wheelCooldown = 0.6;
    }

}