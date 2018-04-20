 $(function(){
   //placeholder 文字提示
   (function(){
        $(document).on("click","#J_zsjs-order-dialog .para-tit",function(){
            var $this=$(this);
            $this.hide();
            $this.siblings(".ipt-text").focus();
        });
       $(document).on("blur","#J_zsjs-order-dialog .ipt-text",function(){
                var $this=$(this);
                if(!!$.trim($this.val())){
                    $this.siblings(".para-tit").hide();
                }else{
                    $this.siblings(".para-tit").show();
                }
       });
       $("#J_zsjs-order-dialog .ipt-text").each(function(index,elem){
           var $this=$(elem);
           if(!!$.trim($this.val())){
                $this.siblings(".para-tit").hide();
           }else{
                $this.siblings(".para-tit").show();
           }
        });
   })();
   //模拟下拉框
   (function(){
        $(document).on("mouseover",'[data-roler="dropdown"]',function(){
            $(this).addClass("active");
        }).on("mouseout",'[data-roler="dropdown"]',function(event){
            var relateElem = event.relatedTarget;
            $(this).removeClass("active");
            if ($(relateElem).closest($(this)).length > 0) {
                return;
            }else{
                $(this).children("ul").hide(); 
            }
        });
        $(document).on("click",'[data-roler="dropdown"] > cite',function(){
               var $this=$(this); 
               $this.siblings("ul").show();
        });
        $(document).on("click",'[data-roler="dropdown"] > ul li a',function(event){
            event.preventDefault();
            var $this=$(this);
            dropdownHandle($this);  
        });
        var $dropDown=$('#J_zsjs-order-dialog [data-roler="dropdown"]');
        var $cite=$dropDown.children('cite');
        var $ul=$dropDown.children('ul');
        var $hiddenInut=$("#J_dropselhidden");
        if(!!$hiddenInut.val()) $cite.removeClass("active");
        /**
         * [hiddenInut description]
         * $elem 表示当前点击的那个元素(开发修改写在这里)
         */
        function dropdownHandle($elem){
            var selId=$elem.attr("selid");
            var selText=$elem.text();
            $hiddenInut.val(selId);
            $cite.addClass('active').text(selText);
            $ul.hide();  
        }
   })(); 

   //表单验证
   (function(){
        $("#J_orderform").mvalidate({
            type: 1,
            onKeyup: true,
            sendForm:false,
            firstInvalidFocus: true,
            descriptions: {
                uername:{
                    required: '请输入联系人姓名！'
                },
                phone: {
                    required: '请输入手机号码',
                    pattern: '您输入的手机号码格式不正确'
                },
                projects:{
                    required: '请选择项目类型'
                },
                promj:{
                    required: '请输入项目的面积',
                    pattern: '您输入的项目面积格式不正确'
                }
            },
            valid:function(){
                //开发请写这里,返回 true表示成功 返回false 表示失败
                $.ajax({
                    url:"http://localhost/AXiaoYuProject/src/JiaZhuang/JiaJu/php/test.php",
                    data:{},
                    beforeSend:function(){

                    },
                    success:function(){
                        
                    }


                })
                
            }
        })
   })();


   
   
}); 

