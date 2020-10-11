$(function () {
  // 调用 getUserInfo 获取用户基本信息
  getUserInfos();

})



// 获取用户的基本信息
function getUserInfos() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    success: function (res) {
      
      if (res.status != 0) {
        return layui.layer.msg('获取用户信息失败!')
      }
      portrait(res.data)
    }
  })
}

//渲染用户信息
function portrait(data) {
  
  //渲染字体头像
  var name = data.nickname || data.username;
  $('#usernames').html(name);
  //渲染头像
  if (data.user_pic === null) {
    $('.text-avatar').html(name.slice(0, 1).toUpperCase());
    $('.layui-nav-img').hide();
  } else {
    $('.layui-nav-img').attr('src', data.user_pic).show();//attr添加属性并赋值
    $('.text-avatar').hide();
  }
}



//实现退出功能
$('#btnLogout').on('click', function () {
  //layer.confirm(content, options, yes, cancel) - 询问框
  layer.confirm('确认退出？', { icon: 3, title: '提示' }, function (index) {
    location.href = '/login.html';//回到login页面
    localStorage.removeItem('token');//清除'token'里的内容
    //取消还显示当前页面
    layer.close(index);
  });
})

