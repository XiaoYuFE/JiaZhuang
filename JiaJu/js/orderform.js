 $(function() {
     //placeholder 文字提示
     (function() {
         $(document).on("click", "#J_zsjs-order-dialog .para-tit", function() {
             var $this = $(this);
             $this.hide();
             $this.siblings(".ipt-text").focus();
         });
         $(document).on("blur", "#J_zsjs-order-dialog .ipt-text", function() {
             var $this = $(this);
             if (!!$.trim($this.val())) {
                 $this.siblings(".para-tit").hide();
             } else {
                 $this.siblings(".para-tit").show();
             }
         });
         $("#J_zsjs-order-dialog .ipt-text").each(function(index, elem) {
             var $this = $(elem);
             if (!!$.trim($this.val())) {
                 $this.siblings(".para-tit").hide();
             } else {
                 $this.siblings(".para-tit").show();
             }
         });
     })();
     //模拟下拉框
     (function() {
         $(document).on("mouseover", '[data-roler="dropdown"]', function() {
             $(this).addClass("active");
         }).on("mouseout", '[data-roler="dropdown"]', function(event) {
             var relateElem = event.relatedTarget;
             $(this).removeClass("active");
             if ($(relateElem).closest($(this)).length > 0) {
                 return;
             } else {
                 $(this).children("ul").hide();
             }
         });
         $(document).on("click", '[data-roler="dropdown"] > cite', function() {
             var $this = $(this);
             $this.siblings("ul").show();
         });
         $(document).on("click", '[data-roler="dropdown"] > ul li a', function(event) {
             event.preventDefault();
             var $this = $(this);
             dropdownHandle($this);
         });
         var $dropDown = $('#J_zsjs-order-dialog [data-roler="dropdown"]');
         var $cite = $dropDown.children('cite');
         var $ul = $dropDown.children('ul');
         var $hiddenInut = $("#J_dropselhidden");
         if (!!$hiddenInut.val()) $cite.removeClass("active");
         /**
          * [hiddenInut description]
          * $elem 表示当前点击的那个元素(开发修改写在这里)
          */
         function dropdownHandle($elem) {
             var selId = $elem.attr("selid");
             var selText = $elem.text();
             $hiddenInut.val(selId);
             $cite.addClass('active').text(selText);
             $ul.hide();
         }
     })();


     (function() {
         var layerDiaIndex,layerLoadIndex,url;
         var $orderForm=$(".zsjs-order-form"),
             $orderContainer=$('#J_zsjs-order-dialog'),
             $orderAvatar=$orderContainer.find(".avatar-pic"),
             $orderName=$orderContainer.find(".cname"),
             $orderPrice=$orderContainer.find(".pri-num"),
             $orderSuccess=$(".zsjs-order-success");
                             

         //表单验证
         $("#J_orderform").mvalidate({
             type: 1,
             onKeyup: true,
             sendForm: false,
             firstInvalidFocus: true,
             descriptions: {
                 uername: {
                     required: '请输入联系人姓名！'
                 },
                 phone: {
                     required: '请输入手机号码',
                     pattern: '您输入的手机号码格式不正确'
                 },
                 projects: {
                     required: '请选择项目类型'
                 },
                 promj: {
                     required: '请输入项目的面积',
                     pattern: '您输入的项目面积格式不正确'
                 }
             },
             valid: function() {
                 //开发请写这里,服务端请返回 true表示成功 返回false 表示失败
                 $.ajax({
                     url:url,
                     data:$("#J_orderform").serialize(),
                     type:"post",
                     beforeSend: function() {
                         layerLoadIndex=layer.load(1, {shade: [0.1,'#fff']}) //0.1透明度的白色背景});
                     },
                     success: function(data) {
                        layer.close(layerLoadIndex);
                        if (!!data) {
                                $orderForm.hide();
                                $orderSuccess.show();
                         } else {
                            layer.msg('亲,路途太堵,请您重新提交！');
                         }
                     }
                 })
             }
         });

         //点击关闭按钮关闭弹出框
         $orderContainer.find('.closeBtn').on("click", function() {
             layer.close(layerDiaIndex);
         })
         

         //点击按钮弹出弹出框
         $(document).on("click", '[data-roler="orderdialog"]', function(event) {
             event.preventDefault();
             var $this = $(this),
                 imgSrc=$this.data("img"),
                 price=$this.data("price"),
                 name=$this.data("name");
            $orderAvatar.attr("src",imgSrc);
            $orderName.html(name);
            $orderPrice.html(price);
             url = $this.attr("href");
             layerDiaIndex = layer.open({
                 type: 1,
                 shade: false,
                 closeBtn: 0,
                 area: ['580px', '500px'],
                 shade: [0.6, '#000'],
                 shadeClose: true,
                 title: false, //不显示标题
                 content: $('#J_zsjs-order-dialog'),
                 end:function(){
                    $orderForm.show();
                    $orderSuccess.hide();
                 }
             });
         });

     })();
 })
