$(function () {
  var form = layui.form
  // 设置名字长度
  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return '昵称长度必须在1~6个字符之间'
      }
    }
  })

  getUserInfos();//调用获取用户信息的函数

  //获取用户信息函数
  function getUserInfos() {
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      success: function (res) {
        if (res.status != 0) {
          return layui.layer.msg('获取用户信息失败!')
        }
        //把用户已有信息渲染到页面
        form.val("formTest", res.data);
      }
    })
  }

  //重置按钮设置
  $('#resets').on('click', function (e) {
    e.preventDefault();//阻止默认行为
    getUserInfos()
  })

  //更新提交用户信息
  $('.layui-form').on('submit', function (e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/my/userinfo',
      data: $(this).serialize(),
      success: function (res) {
        if(res.status !== 0){
          return layui.layer.msg('更新用户信息失败!')
        }
        layui.layer.msg('更新用户信息成功!');
        getUserInfos();
      }
    })
  })

})