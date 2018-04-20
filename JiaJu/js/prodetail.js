;(function($) {
    $.fn.bannerSlider = function(options) {
        var defaults = {
            width: 950,
            height: 355,
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
        var $prevBtn, $nextBtn, $pagination, $pagination_lis, $slider_lis, $parent, $describe,$slider_imgs;
        $slider_lis = this.children("li");
        $slider_imgs=this.find("img");
        $parent = this.parent();
        len = $slider_lis.length;


        var  $checkBig=$("#J_check-big");

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
                $slider_lis.css({ position: "absolute", opacity: 0, zIndex: opts.zIndex - 1 }).eq(Index).css("zIndex", opts.Index).animate({ "opacity": 1 });
                if (isIE6) {
                    $slider_lis.css("display", "none").eq(Index).css("display", "block")
                }
            }
            $slider_lis.eq(Index).find("img").LoadImage({width:760,height:400});
        }

        function btnInit() {
            if (opts.btn.show) {
                $prevBtn = $('<a href="#" class="dir-btn banner-ui-prev" style="display:none"></a>');
                $nextBtn = $('<a href="#" class="dir-btn banner-ui-next" style="display:none"></a>');
                $prevBtn.css("zIndex", opts.zIndex + 1).addClass("banner-ui-prev");
                $nextBtn.css("zIndex", opts.zIndex + 1).addClass("banner-ui-next");

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
                $checkBig.stop(false, true).fadeIn();
                if (opts.btn.dynamic) {
                    $prevBtn.show();
                    $nextBtn.show();
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
                    $prevBtn.hide();
                    $nextBtn.hide();
                }
                $checkBig.stop(false, true).fadeOut();
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
            var strLis = "",$paginationWrap;
            if (opts.pagination.show) {
               
                    $numPagination=$('<span class="num"><b id="J_numcount">1</b>/'+len+'</span>')
                    $pagination = $('<ul></ul>');
                    $pagination.addClass(opts.pagination.className);
                    for (var i = 0; i < len; i++) {
                        strLis += "<li>" +$slider_imgs.eq(i).data("intro")+ "</li>";
                    }
                    $pagination.append(strLis);
                    $pagination.appendTo('.banner-numlist-wrap');
                    $numPagination.appendTo('.banner-numlist-wrap');

                    $pagination_lis = $pagination.find("li");
                    $pagination_lis.eq(Index).addClass("oncurr");
                    if(len>1){
                        $pagination_lis.each(function() {
                            $(this).bind(opts.pagination.evtType, paginationEvt);
                            $(this).bind("mouseover", thisMouseover).bind("mouseout", thisMouseout);

                        })
                    }
               
            }
        };

        function paginationEvt() {
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
                $("#J_numcount").text(Index+1);
                 $checkBig.attr("href",$slider_imgs.eq(Index).attr("src"));
                 $slider_lis.eq(Index).find("img").LoadImage({width:760,height:400});
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
            $this.css({ width: opts.width, height: opts.height, position: "relative" });
            //获取效果的方式
            paginationInit();
            if (len > 1) {
                animationWay = getAnimWay(opts.effect);
                btnInit();
                
                descInit();
                $this.bind("mouseover", thisMouseover);
                $this.bind("mouseout", thisMouseout);
                beginStart()
            }
            //
           $checkBig.attr("href",$slider_imgs.eq(0).attr("src"));
        };
        Init();
    }
})(jQuery);



(function($) {

    function LoadImage(ImgD, width, height, t) {
        var smallWidth = $(ImgD).width();
        var smallHeight = $(ImgD).height();
        //    alert(smallWidth+":"+width+"|"+smallHeight+":"+height);
        var iwidth = width; //定义允许图片宽度
        var iheight = height; //定义允许图片高度
        if (smallWidth > 0 && smallHeight > 0) {
            if (smallWidth / smallHeight >= iwidth / iheight) {
                 
                if (smallWidth > iwidth) {
                    $(ImgD).width(iwidth).height((smallHeight * iwidth) / smallWidth).css("padding", Math.floor(Math.abs((iheight - $(ImgD).height()) / 2)) + "px 0px");
                } else {
                   
                    $(ImgD).width(smallWidth).height(smallHeight).css("padding", Math.floor(Math.abs((iheight - $(ImgD).height()) / 2)) + "px " + Math.floor(Math.abs((iwidth - $(ImgD).width()) / 2)) + "px");
                }
            } else {
                
                if (smallHeight > iheight) {
                    $(ImgD).width((smallWidth * iheight) / smallHeight).height(iheight).css("padding", "0px " + Math.floor(Math.abs((iwidth - $(ImgD).width()) / 2)) + "px");
                } else {
                    $(ImgD).width(smallWidth).height(smallHeight).css("padding",Math.floor(Math.abs((iheight - $(ImgD).height()) / 2)) + "px " + Math.floor(Math.abs((iwidth - $(ImgD).width()) / 2)) + "px");
                }
            }
        }
    }
    $.fn.LoadImage = function(options) {
        var opt = options;
        return this.each(function(index, el) {
            LoadImage(el, opt.width, opt.height);
        })
    }
})(jQuery);


$(function(){
    (function(){
        $(function(){
            var $relateBd=$('[data-group="sjpro-tab-bd"]');
            var $relateHd=$('[data-group="sjpro-tab-hd"]');
           

            
            $(document).on("click",'[data-roler="tab"]',function(e){
                e.preventDefault();
                if($(window).scrollTop()>260){
                    $(window).scrollTop(260);
                }
                var $this=$(this);
                var target=$this.attr('data-target');
                $relateHd.removeClass("active");
                $this.addClass('active');
                $relateBd.hide();
                $(target).show();
             })
        }).trigger('click');
    })()

    $("#J_banner_1").bannerSlider({
        width: 760, //宽 (如果100%的时候请传入字符串)
        height:400, //高
        auto: false, //是否能自动滚
        effect: "slider", //效果
        Pause: 3000, //停顿时间-两个动画滚动间隔的时间
        animTime:250,
        
        zIndex: 10, //设置层级相互遮盖
        parentClass: "postpic-tpms",
        pagination: {
            show: true,
            className: "banner-numlist"
        },
        btn: {
            show: true,
            dynamic: true //是否有鼠标移动上去显示箭头的效果
        },
        describe: {
            show: false
        }
    });

    $(".postxt-fixed-bar .item2").on("click",function(){
        setTimeout(function(){
            $("#J_banner_1 img").LoadImage({width:760,height:400})
        })
    })
})