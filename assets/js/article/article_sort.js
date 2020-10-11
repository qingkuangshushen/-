$(function () {
    var layer = layui.layer;
    var form = layui.form;
    //初始文章类别页面
    gitsort();


    // 获取文章类别方法
    function gitsort() {
        $.ajax({
            type: "get",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) return layer.msg('获取文章列表失败');
                var sortsdata = template('sorts', res);
                $('tbody').html(sortsdata);
            }
        });
    }

    // 添加类别
    var indexone = null;
    $('#addsort').on('click', function () {
        indexone = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#append').html()
        });
    })

    //通过代理的方式发送AJAX请求

    $('body').on('submit', '#form_cs', function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg('新增文章分类失败');
                gitsort();
                layer.msg(res.message);
                layer.close(indexone)
            }
        });
    })


    // 修改文章类型
    $('body').on('click', '.layui-btn-bj', function (e) {
        e.preventDefault();
        //获取当前选中的编辑行id
        var id = $(this).attr('data_id');
        //弹出层设置
        var indextwo = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#append2').html()
        });


        //不用发送请求，
        // var data_0 = {
        //     id:id,
        //     name:$(this).parents('tr').children().eq(0).html(),alias:$(this).parents('tr').children().eq(1).html(),is_delete: 0
        // }
        // console.log($(this).parents('tr').children().eq(0).html());
        //发送根据id获取内容的请求
        $.ajax({
            type: "get",
            url: "/my/article/cates/" + id,
            success: function (res) {
                if (res.status !== 0) return layer.msg('获取文章分类数据失败！');
                form.val('apptx', res.data);
            }
        });


        //设置点击确认添加提交成功
        $('body').on('submit', '#form_xg', function (e) {
            e.preventDefault();
            $.ajax({
                type: "POST",
                url: "/my/article/updatecate",
                data: $(this).serialize(),
                success: function (res) {
                    if (res.status !== 0) return layer.msg('更改信息失败!');
                    layer.msg(res.message);
                    layer.close(indextwo);
                    gitsort();
                }
            });
        })
    })


    //删除文章类型
    $('body').on('click','.layui-btn-sc',function (e) {
        e.preventDefault();
        var id = $(this).attr('data_id');
        //提示用户是否删除
        var indexthree = layer.confirm('确定删除?', {icon: 3, title:'提示'}, function(index){
            //确定删除后，发送ajax请求
            $.ajax({
                type: "GET",
                url: "/my/article/deletecate/" + id,
                success: function (res) {
                    if(res.status !== 0)return layer.msg(res.message);
                    layer.msg(res.message);
                    gitsort();
                }
            });
            layer.close(index);
          });
    })


})