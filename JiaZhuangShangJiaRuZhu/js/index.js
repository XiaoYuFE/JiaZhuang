;
(function($) {
    $.fn.bannerSlider = function(options) {
        var defaults = {
            width: 950,
            height: 355,
            slidew:null,
            slideh:null,
            auto: true,
            effect: "slider",
            Pause: 3000,
            animTime: 250,
            zIndex: 10,
            parentClass: "cs-bannerWrap",
            pagination: {
                show: true,
                evtType: "click",
                className: "banner-numlist"
            },
            btn: {
                show: true,
                dynamic: true
            },
            describe: {
                show: true,
                left: 0,
                bottom: 0
            }
        };

        var opts = $.extend(true, defaults, options),
            $this = this;
        var Index = 0,
            $this = this,
            len,
            isLock = false,
            animDir = 1,
            Timer = null,
            isFirst = true,
            effectArray = ["slider", "fade"],
            isIE6 = !-[1, ] && !window.XMLHttpRequest,
            animationWay;
        var $prevBtn, $nextBtn, $pagination, $pagination_lis, $slider_lis, $parent, $describe;
        $slider_lis = this.children("li");
        $parent = this.parent().parent();
        len = $slider_lis.length;
        opts.slidew=!!opts.slidew ? opts.slidew :opts.width;
        opts.slideh=!!opts.slideh ? opts.slideh :opts.height;

        //传进来的效果
        function getAnimWay(effect) {
            try {
                if (effect.constructor !== String) {
                    throw new Error(effect + "must be String");
                } else {
                    var index = $.inArray(effect, effectArray)
                    if (index >= 0) {
                        animWayInit(effect);
                        return effect;
                    } else {
                        alert(effect + " effects is not defined in the plugin");
                        return false;
                    }
                }
            } catch (e) {
                alert(e.message)
            }

        };

        function animWayInit(effect) {
            if (effect == effectArray[0]) {
                $slider_lis.css("position", "absolute").eq(Index).css({ zIndex: opts.zIndex, display: "block" }).siblings().css({ zIndex: opts.zIndex - 1 }).hide();

            } else if (effect == effectArray[1]) {
                $slider_lis.css({ position: "absolute", opacity: 0, zIndex: opts.zIndex - 1 }).eq(Index).css("zIndex", opts.zIndex).animate({ "opacity": 1 });
                if (isIE6) {
                    $slider_lis.css("display", "none").eq(Index).css("display", "block")
                }
            }
        }

        function btnInit() {
            if (opts.btn.show) {
                $prevBtn = $('<a href="#" class="dir-btn banner-ui-prev" style="display:none"></a>');
                $nextBtn = $('<a href="#" class="dir-btn banner-ui-next" style="display:none"></a>');
                $prevBtn.css("zIndex", opts.zIndex + 10).addClass("banner-ui-prev");
                $nextBtn.css("zIndex", opts.zIndex + 10).addClass("banner-ui-next");

                $prevBtn.appendTo($parent);
                $nextBtn.appendTo($parent);
                if (opts.btn.dynamic) {
                    $prevBtn.hide();
                    $nextBtn.hide();
                } else {
                    $prevBtn.show();
                    $nextBtn.show();
                }
                $prevBtn.bind("mouseover", thisMouseover).bind("mouseout", thisMouseout).bind("click", prevBtnScroll);
                $nextBtn.bind("mouseover", thisMouseover).bind("mouseout", thisMouseout).bind("click", nextBtnScroll);
            }
        };

        function thisMouseover(event) {
            clearTimeout(Timer);
            var relateElem = event.relatedTarget;
            if ($(relateElem).closest($parent).length > 0) {
                return;
            } else {
                if (opts.btn.dynamic) {
                    $prevBtn.stop(false, true).fadeIn();
                    $nextBtn.stop(false, true).fadeIn();
                }
                isLock = true;
                animDir = 1;
            }
        };

        function thisMouseout(event) {
            var relateElem = event.relatedTarget;
            if ($(relateElem).closest($parent).length > 0) {
                return;
            } else {

                if (opts.btn.dynamic) {
                    $prevBtn.stop(false, true).fadeOut();
                    $nextBtn.stop(false, true).fadeOut();
                }
                isLock = false;
                isFirst = true;
                animDir = 1;
                beginStart()

            }
        }

        function prevBtnScroll() {
            if (!$this.is(":animated")) {
                clearTimeout(Timer)
                Index--;
                animDir = 0;
                beginStart();
            }
            return false;
        }

        function nextBtnScroll() {
            if (!$this.is(":animated")) {
                clearTimeout(Timer)
                Index++;
                animDir = 1;
                beginStart()
            }
            return false;
        }

        function paginationInit() {
            var strLis = "",$pagination=$parent.children("."+opts.pagination.className);
            if (opts.pagination.show) {
                if(!!$pagination.length){

                }else{
                     if (len > 1) {
                        $pagination = $('<ul></ul>');
                        $pagination.addClass(opts.pagination.className).css({ "zIndex": opts.zIndex + 1, "position": "absolute" })
                        for (var i = 0; i < len; i++) {
                            strLis += "<li><span>" + (i + 1) + "</span></li>";
                        }
                        $pagination.append(strLis);
                        $pagination.appendTo($parent);
                    }
                }
                $pagination_lis = $pagination.find("li");
                    $pagination_lis.eq(Index).addClass("oncurr");
                    $pagination_lis.each(function(event) {

                        $(this).bind(opts.pagination.evtType, paginationEvt);
                        $(this).bind("mouseover", thisMouseover).bind("mouseout", thisMouseout);
                })
               
            }
        };

        function paginationEvt(event) {
            event.preventDefault();
            var prevIndex = Index;
            isLock = true;
            clearTimeout(Timer);
            Index = $pagination_lis.index(this);
            if (prevIndex < Index) {
                animDir = 1;
                beginStart()
            } else if (prevIndex > Index) {
                animDir = 0;
                beginStart()
            } else {
                return
            }
        }

        function descInit() {
            if (opts.describe.show) {
                $describe = $('<div class="banner-ui-desc"></div>');
                $describe.appendTo($parent).css({ zIndex: opts.zIndex + 1, position: "absolute", left: opts.describe.left, bottom: opts.describe.bottom });
                if ($.trim($slider_lis.eq(Index).attr("data-title")) == "") {
                    $describe.hide()
                } else {
                    $describe.text($slider_lis.eq(Index).attr("data-title"));
                }
                $describe.bind("mouseout", thisMouseout)
            }
        };

        function switchAnimDir(animDir, animationWay) {
            if (animationWay == "slider") {
                var childrenAnimW = null,
                    parentAnimW = null;
                switch (animDir) {
                    case 0: //左按钮
                        childrenAnimW = -opts.width; //子元素右移
                        parentAnimW = opts.width; //父元素左移动
                        slideScroll(childrenAnimW, parentAnimW);
                        break;
                    case 1: //右按钮
                        childrenAnimW = opts.width;
                        parentAnimW = -opts.width;
                        slideScroll(childrenAnimW, parentAnimW)
                        break;
                }
            } else if (animationWay == "fade") {
                $slider_lis.css("zIndex", opts.zIndex - 1).stop(true).animate({ opacity: 0 }).eq(Index).css("zIndex", opts.zIndex).stop(true).animate({ opacity: 1 });
                if (isIE6) {
                    $slider_lis.css("display", "none").eq(Index).css("display", "block")
                }
            }



        };

        function slideScroll(childrenAnimW, parentAnimW) {
            $slider_lis.eq(Index).css({ left: childrenAnimW, zIndex: opts.zIndex, display: "block" });
            $this.stop(false, true).animate({ left: parentAnimW }, opts.animTime, function() {
                $slider_lis.eq(Index).css("left", 0).siblings().css({ zIndex: opts.zIndex - 1, display: "none" });
                $(this).css("left", 0);
            })
        };

        function beginStart() {
            if (Index < 0) {
                Index = len - 1;
            } else if (Index == len) {
                Index = 0
            }
            scrolling();
        };

        function scrolling() {
            if (isFirst) {
                isFirst = false
            } else {
                switchAnimDir(animDir, animationWay)
                if (opts.pagination.show) {

                    $pagination_lis.eq(Index).addClass("oncurr").siblings().removeClass("oncurr")
                }
            }
            if (opts.describe.show) {
                if ($.trim($slider_lis.eq(Index).attr("data-title")) == "") {
                    $describe.fadeOut();
                } else {
                    $describe.text($slider_lis.eq(Index).attr("data-title")).fadeIn()
                }
            }
            if (!isLock && opts.auto) {
                Timer = setTimeout(function() {
                    Index++;
                    beginStart();
                }, opts.Pause)
            }
        };
        var Init = function() {
            //初始化父元素
            $parent.addClass(opts.parentClass).css({ width: opts.width, height: opts.height, position: "relative", overflow: "hidden" });
            //初始化ul
            $this.css({width:opts.slidew,height:opts.slideh,position: "relative"});
            //获取效果的方式
            if (len > 1) {
                animationWay = getAnimWay(opts.effect);
                btnInit();
                paginationInit();
                descInit();
                $this.bind("mouseover", thisMouseover);
                $this.bind("mouseout", thisMouseout);
                beginStart()
            }
        };
        Init();
    }
})(jQuery)


$(function() {
    $("#J_customer-gallery-box").bannerSlider({
        width:1100, //宽 (如果100%的时候请传入字符串)
        height:432, //高
        auto: false, //是否能自动滚
        effect: "fade", //效果
        slidew:700,
        slideh:400,
        Pause: 3000, //停顿时间-两个动画滚动间隔的时间
        animTime: 350,
        //一张图滚动的时间
        zIndex: 10, //设置层级相互遮盖
        parentClass: "banner-wrap",
        pagination: {
            show: true,
            className: "pagination"
        },
        btn: {
            show: false,
            dynamic: false //是否有鼠标移动上去显示箭头的效果
        },
        describe: {
            show: false
        }
    });

    $("#J_brand-gallery-box").bannerSlider({
        width:1100, //宽 (如果100%的时候请传入字符串)
        height:432, //高
        auto: false, //是否能自动滚
        effect: "fade", //效果
        slidew:700,
        slideh:400,
        Pause: 3000, //停顿时间-两个动画滚动间隔的时间
        animTime: 350,
        //一张图滚动的时间
        zIndex: 10, //设置层级相互遮盖
        parentClass: "banner-wrap",
        pagination: {
            show: true,
            className: "pagination"
        },
        btn: {
            show: false,
            dynamic: false //是否有鼠标移动上去显示箭头的效果
        },
        describe: {
            show: false
        }
    });

    $("#J_shop-gallery-box").bannerSlider({
        width:1100, //宽 (如果100%的时候请传入字符串)
        height:432, //高
        auto: false, //是否能自动滚
        effect: "fade", //效果
        slidew:720,
        slideh:400,
        Pause: 3000, //停顿时间-两个动画滚动间隔的时间
        animTime: 350,
        //一张图滚动的时间
        zIndex: 10, //设置层级相互遮盖
        parentClass: "banner-wrap",
        pagination: {
            show: true,
            className: "pagination"
        },
        btn: {
            show: false,
            dynamic: false //是否有鼠标移动上去显示箭头的效果
        },
        describe: {
            show: false
        }
    });

    (function(){
        var $tabLi=$(".evaluate-list").children("li");
        var $items=$(".evaluate-box .evaluate-item");
        $(".evaluate-list").children("li").each(function(){
            $(this).on("click",function(event){
                var index=$tabLi.index($(this));
                $items.hide().eq(index).show();
                event.preventDefault();
            })
        })
    })();

    (function(){
         jssor_slider1_init = function () {
            var options = {
                $AutoPlay: 0,
                $SlideWidth:610,
                $Cols:2,
                $Align:55,
                $ArrowNavigatorOptions: {
                  $Class: $JssorArrowNavigator$
                },
                $BulletNavigatorOptions: {
                  $Class: $JssorBulletNavigator$
                }
            };

            var jssor_slider1 = new $JssorSlider$('slider1_container', options);
        };
        jssor_slider1_init();
       
    })()
})