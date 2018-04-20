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
                  $(ImgD).width(smallWidth).height(smallHeight).css("padding", Math.floor(Math.abs((iheight - $(ImgD).height()) / 2)) + "px " + Math.floor(Math.abs((iwidth - $(ImgD).width()) / 2)) + "px");
              }
          }
      }
  };
  (function($) {
      $.fn.LoadImage = function(options) {
          var opt = options;
          return this.each(function(index, el) {
              LoadImage(el, opt.width, opt.height);
          })
      }
  })(jQuery)


  ;
    (function($) {
        $.fn.staffGallery = function(option) {

           
            $.fn.staffGallery.defaults = {
                smallPrevId: "J_staff-smallPrev",
                smallNextId: "J_staff-smallNext",
                smallDisPrevClass: "staff-dis-smallPrev",
                smallDisNextClass: "staff-dis-smallNext",
                smallWrapId: "J_staff-smallWrap",
                smallListId:"J_staff-smallList",

               
                bigPicWrapId: "J_staff-bigWrap",
                bigPrevClass: "staff-bigPrev",
                bigNextClass: "staff-bigNext",
                bigPicWrapW: 666,
                bigPicWrapH: 483,
                index:0,
                init:function(){},
                animEnd:function(){}                                             
            }
            var opts = $.extend($.fn.staffGallery.defaults, option);
            var oldIndex=opts.index,
                Index = !!opts.index ? (opts.index-1) : 0,
                $smallPrev = $("#" + opts.smallPrevId),
                $smallNext = $("#" + opts.smallNextId),
                $smallWrap = $("#" + opts.smallWrapId),
                $smallList=$("#"+opts.smallListId),

               
                $bigPicWrap = $("#" + opts.bigPicWrapId);
               
          

            var 
                $smallDataItems = $smallList.find(".staff-smallItem");
                totalLen = $smallDataItems.length;
            var bigSrc,
                isAnim=false,
                
               
                $bigPrevBtn,
                $bigNextBtn,
                $this = this;

            var  $checkBig=$("#J_check-big");


            $smallDataItems.each(function(index, el) {
                $(el).on("click",function(event){
                    event.preventDefault();
                    oldIndex=Index;
                    Index=$smallDataItems.index(this); 
                    changeBigImg();
                    smallListAnim();

                })    
            });

            //获取图片信息和操作图片函数
            var changeBigImg = function() {
                isAnim=true;
                bigSrc = $smallDataItems.eq(Index).attr("href");
                $checkBig.attr("href",bigSrc);
                $smallDataItems.eq(Index).parent().addClass('active').siblings().removeClass('active');
                $this.stop(false, true).fadeOut(100, function() {
                    $this.attr("src", bigSrc).fadeIn();
                    $(".staff-tag-list li").eq(Index).fadeIn().siblings().hide();
                    $(".tkalxq-title .list").children().eq(Index).show().siblings().hide();
                    !!opts.animEnd && opts.animEnd.call($this,Index)
                    isAnim=false;
                    
                });

                if(Index==0){
                    $(".staff-prevPage").show();
                   
                    $smallPrev.hide();
                    $bigPrevBtn.hide();
                }else{
                    $(".staff-prevPage").hide();
                  
                    $smallPrev.show();
                    $bigPrevBtn.show();
                }

                if(Index==totalLen-1){
                    $(".staff-nextPage").show();
                    $bigNextBtn.hide();
                    $smallNext.hide();

                }else{
                    $(".staff-nextPage").hide();
                    $bigNextBtn.show();
                    $smallNext.show();
                }
            };


            var smallListAnim=function(){
                    $smallList.children("li").eq(Index).addClass('active').siblings().removeClass('active');
                    if(Index > oldIndex){ //下一张  3
                        if(Index >= 3 && Index!=totalLen-1){
                           $smallList.animate({left:-(Index-3+1)*opts.scroW+"px"},200);
                        }
                    }else if(Index < oldIndex){ //上一张 2
                        if(Index!=0 && (Index+4) <=totalLen){
                            $smallList.animate({left:-(Index-1)*opts.scroW+"px"},200);
                            
                        }
                    }
            }


            //初始化
            var Init = function() {
                
                $this.parent().css({ width: opts.bigPicWrapW - 2, height: opts.bigPicWrapH - 2, overflow: "hidden" })
               
                $bigPicWrap.css({ width: opts.bigPicWrapW, height: opts.bigPicWrapH, overflow: "hidden", position: "relative" })
                bigSrc = $smallDataItems.eq(Index).attr("href");
                $this.attr("src", bigSrc);
                $checkBig.attr("href",bigSrc);
                $smallList.width(totalLen * opts.scroW)
                $(".staff-tag-list li").eq(Index).fadeIn().siblings().hide();

                
                if (opts.isBigBtnShow) { //如果显示大图按钮的话
                    
                    $bigPrevBtn = $("<a href='#' class='" + opts.bigPrevClass + "' id='J_staffbigPrev'></a>");
                    $bigNextBtn = $("<a href='#' class='" + opts.bigNextClass + "' id='J_staffbigNext'></a>");
                    $bigPrevBtn.appendTo($bigPicWrap);
                    $bigNextBtn.appendTo($bigPicWrap);
                }

                if(Index==0){
                    $(".staff-prevPage").show();
                   
                    $smallPrev.hide();
                    $bigPrevBtn.hide();
                }else{
                    $(".staff-prevPage").hide();
                  
                    $smallPrev.show();
                    $bigPrevBtn.show();
                }

                if(Index==totalLen-1){
                    $(".staff-nextPage").show();
                    $bigNextBtn.hide();
                    $smallNext.hide();

                }else{
                    $(".staff-nextPage").hide();
                    $bigNextBtn.show();
                    $smallNext.show();
                }
                
                
               
               
                $smallWrap.css({ "position": "relative", "overflow": "hidden" });
                

                $smallList.children().eq(Index).addClass("active").siblings().removeClass('active');

                if(totalLen > 4){
                    if(Index >2){
                        if(Index+3 <totalLen){
                            $smallList.animate({left:-(Index-2)*opts.scroW+"px"},200);
                        }else{
                             $smallList.animate({left:-(totalLen-4)*opts.scroW+"px"},200);
                        }
                        
                    }
                }
                !!opts.init && opts.init.call($this,Index)
            };
            Init();

            $bigNextBtn.on("click",function(event){
                 event.preventDefault();
                 if(isAnim) return;
                 oldIndex=Index;
                 Index++;
                changeBigImg();
                smallListAnim();

            });

            $bigPrevBtn.on("click",function(event){
                event.preventDefault();
                if(isAnim) return;
                oldIndex=Index;
                Index--;
                changeBigImg();
                smallListAnim();

            })

           
           
            


            //单击小图的左按钮  
            $smallPrev.on("click", function(event) {
                event.preventDefault();
                
                if(isAnim) return;
                oldIndex=Index;
                Index--;
                changeBigImg();
                smallListAnim();
            });


            //单击小图的右按钮  
            $smallNext.on("click", function() {
                event.preventDefault();
                if(isAnim) return;
                 oldIndex=Index;
                Index++;
                changeBigImg();
                smallListAnim();
            });
            
           

        }

   
        
    })(jQuery);

 