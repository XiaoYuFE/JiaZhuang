

   



    var countRandObj = (function() {
        //生成随机数
       
            var RndNum = function(n) {
                var rnd = "";
                for (var i = 0; i < n; i++) {
                    if(i==0){
                        rnd += Math.floor((Math.random() * 10)+1);
                    }else{
                        rnd += Math.floor(Math.random() * 10);
                    }
                    
                }
                return rnd;
            }

            var $zxysElem,$clfElem,$rgfElem,$sjfElem,$zjfElem,Timer;

            return {
                start: function($container) {
         
                    $zxysElem=$container.find(".J_dynamics-zxys");
                    $clfElem=$container.find(".J_dynamics-clf");
                    $rgfElem=$container.find(".J_dynamics-rgf");
                    $sjfElem=$container.find(".J_dynamics-sjf");
                    $zjfElem=$container.find(".J_dynamics-zjf");
                    clearInterval(Timer);

                    Timer=setInterval(function(){
                        $zxysElem.html(RndNum(6));
                        $clfElem.html(RndNum(5));
                        $rgfElem.html(RndNum(5));
                        $sjfElem.html(RndNum(4));
                        $zjfElem.html(RndNum(4));
                    },120)
                },
                stop:function(){
                    clearInterval(Timer);
                }
            }      
    })();
    

    function selChange($elem,value){
        var $parent=$elem.parents(".mfbj-count-form-wrap").eq(0);
        var $selShi=$parent.find("select[name='selshi']");
        var $selting=$parent.find("select[name='selting']");
        var $selchu=$parent.find("select[name='selchu']");
        var $selwei=$parent.find("select[name='selwei']");
        var $selyang=$parent.find("select[name='selyang']");

        if(value <60){
            //1室1厅1厨1卫1阳台
            $selShi.val(1);
            $selting.val(1);
            $selchu.val(1);
            $selwei.val(1);
            $selyang.val(1);
        }else if(value >=60 && value <90){
            //2室1厅1厨1卫1阳台
             $selShi.val(2);
            $selting.val(1);
            $selchu.val(1);
            $selwei.val(1);
            $selyang.val(1);
        }else if(value >=90 && value <150){
            //3室2厅1厨2卫1阳台
             $selShi.val(3);
            $selting.val(2);
            $selchu.val(1);
            $selwei.val(2);
            $selyang.val(1);
        }else if(value >=150){
             //4室2厅1厨2卫2阳台
            $selShi.val(4);
            $selting.val(2);
            $selchu.val(1);
            $selwei.val(2);
            $selyang.val(2);
        }
    }

    function validTip($elem,txt,time){
        if($elem.hasClass('show')) return;
        var time=time ? time :2000;
        $elem.html(txt);
        $elem.addClass('show');
        Timer=setTimeout(function(){
            $elem.removeClass('show');
        },time)
    }

    function validMJ($elem){
        var $parent=$elem.parents(".mfbj-count-form-wrap").eq(0);
        var $validateTipElem=$parent.find(".mfbj-count-form-box .validate-tip");
        var $mianji=$parent.find("input[name='mianji']");
        var $mjphone=$parent.find("input[name='mjphone']");
        var reg1 = /^[0-9]+\.?[0-9]*$/;
        var reg2=/^1\d{10}$/;
        var flag=true;




        if(!$.trim($mianji.val())){
            validTip($validateTipElem,"请输入房屋面积")
            flag=false
        }else if(!reg1.test($mianji.val())){
            validTip($validateTipElem,"请输入正确房屋面积")
            flag=false
        }else if(!$.trim($mjphone.val())){
            validTip($validateTipElem,"请输入手机号码")
            flag=false
        }else if(!reg2.test($mjphone.val())){
            validTip($validateTipElem,"请输入正确手机号码");
            flag=false;
        }
        return flag;

    }

    function countPrice(val){
        var totalprice,rgprice,clprice;
        if(val <=90){
            rgprice=409.8*val;
            clprice=273.2*val;
            

        }else{
            rgprice=390*val;
            clprice=260*val;
            
        }
        totalprice=rgprice+clprice;

        return {
            totalprice:totalprice,
            rgprice:rgprice,
            clprice:clprice
        }
    }

    function fillPrince($container,price){
        var $totalElem=$container.find(".J_totalprice"),
            $clElem=$container.find(".J_clprice"),
            $rgElem=$container.find(".J_rgprice");

        $totalElem.html(price.totalprice);
        $clElem.html(price.clprice);
        $rgElem.html(price.rgprice);

    }





    $(function(){
        $("input.J_fwmj-input").on("keyup",function(){
            var val=$.trim($(this).val());
            selChange($(this),val);
        });

        $(".mfbj-count-btn").on("click",function(event){
            event.preventDefault();
            var $this=$(this);
            var flag=validMJ($this);
            var $formWrap=$this.parents(".mfbj-count-form-wrap");
            var $resultWrap=$formWrap.siblings(".mfbj-count-result-wrap");
            var mjVal=$.trim($formWrap.find("input.J_fwmj-input").val());

            var PriceObj;
            if(flag){
                //验证通过
                
                //停止随机数字
                countRandObj.stop();
                //计算价格
                PriceObj=countPrice(mjVal);
                
                //填充价格
                fillPrince($resultWrap,PriceObj)
                //..
                
                //显示不同的区块
                $formWrap.hide();
                $resultWrap.show();
            }
        })



    })
    