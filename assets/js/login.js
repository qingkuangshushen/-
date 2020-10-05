$(function(){
    //点击注册隐藏登录模块
    $('#layui-reg').on('click',function(){
        $('.layui-register').hide();
        $('.layui-login').show()
    })
    //点击登录隐藏注册模块
    $('#layui-log').on('click',function(){
        $('.layui-login').hide();
        $('.layui-register').show()
    })
    //给表单添加正则
    var form = layui.form;
    // 定义提示信息
    var layer = layui.layer;

    form.verify({
        pwd:[
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
        ],
        repwd:function(value){
            var pwds = $('.layui-login [name = password]').val();
            if(value !== pwds) return `两次密码不一致`
        }
    })
    //调用接口完成注册页面
    $('#form_log').on('submit',function(e){
        e.preventDefault();
        $.ajax({
            type:'POST',
            url:'/api/reguser',
            data:{
                username:$('#form_log [name=username]').val(),
                password:$('#form_log [name=password]').val()
            },
            success:function(res){
                
                if(res.status !== 0){
                    return layer.msg(res.message);
                }
                    return layer.msg('注册成功!'); 
            }
        })
    })
    //调用接口发送get请求完成登录页面
    $('#form_reg').submit(function(e){
        e.preventDefault();//阻止默认行为
        $.ajax({
            type:'POST',
            url:'/api/login',
            data:{
                username:$('#form_reg [name=username]').val(),
                password:$('#form_reg [name=password]').val()
            },
            success: function(res) {
                if (res.status !== 0) {
                  return layer.msg('登录失败！')
                }
                layer.msg('登录成功！')
                // 将登录成功得到的 token 字符串，保存到 localStorage 中
                localStorage.setItem('token', res.token)
                // 跳转到后台主页
                location.href = '/index.html'
              }
        })
    })
})