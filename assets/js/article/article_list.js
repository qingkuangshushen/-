$(function () {

    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    var q = {
        pagenum: 1,//页码值
        pagesize: 2,//每页显示多少数据
        cate_id: '',//文章分类的 Id
        state: ''//文章的状态，可选值有：已发布、草稿
    }

    //定义一个时间过滤器
    template.defaults.imports.dateformat = function (data) {
        const dt = new Date(data);
        var y = zeros(dt.getFullYear());
        var m = zeros(dt.getMonth() + 1);
        var d = zeros(dt.getDay());
        var h = zeros(dt.getHours());
        var min = zeros(dt.getMinutes());
        var s = zeros(dt.getSeconds());
        return y + '-' + m + '-' + d + '    ' + h + ':' + min + ':' + s
    }
    //小于10自动补0方法
    function zeros(datas) {
        return datas < 10 ? datas = '0' + datas : datas;
    }

    //发送请求获取文章列表
    function getdatas() {
        $.ajax({
            type: "GET",
            url: "/my/article/list",
            data: q,
            success: function (res) {

                if (res.status !== 0) return layer.msg(res.message);
                var htmlstr = template('art-list', res);
                $('tbody').html(htmlstr);
                //调用渲染页码方法
                renderPage(res.total);
            }
        });
    }
    // 调用获取文章列表方法
    getdatas();

    // 调用获取文章类别方法
    gitsort();

    // 初始化获取文章类别方法
    function gitsort() {
        $.ajax({
            type: "get",
            url: "/my/article/cates",
            success: function (res) {

                if (res.status !== 0) return layer.msg('获取文章列表失败');
                var codes = template('lists', res);
                $('[name=cate_id]').html(codes);
                // 通知layUI重新渲染界面
                form.render();
            }
        });
    }

    // 为筛选表单添加submit事件
    $('body').on('submit', '#screen', function (e) {
        e.preventDefault();
        //获取筛选表单的内容
        var cate_id = $('[name=cate_id]').val();//此处val()获取为p84ID值
        var state = $('[name=state]').val();
        //重新给Q赋值
        q.cate_id = cate_id;
        q.state = state;
        //重新渲染页面数据
        getdatas();
    })

    //实现分页功能
    function renderPage(total) {
        //执行一个laypage实例
        laypage.render({
            elem: 'test1', //注意，这里的 test1 是 ID，不用加 # 号,
            count: total,//数据总数，从服务端得到
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ["count", 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 7, 10],
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                // console.log(first);
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                //首次不执行
                if (!first) {
                    getdatas();
                }
            }
        });
    }

    //实现删除功能
    $('body').on('click', '.layui-btn-sc', function () {
        //获取页面删除按钮的个数
        var len = $('.layui-btn-sc').length;
        //获取当前选中按钮的id值
        var id = $(this).attr('data_id');
        var index = layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                type: "GET",
                url: "/my/article/delete/" + id,
                success: function (res) {
                    if (res.status !== 0) return layer.msg(res.message);
                    layer.msg('删除成功!')
                    
                    if (len === 1) {
                        q.pagenum = q.pagenum > 1 ? q.pagenum - 1 : 1
                    }
                    getdatas();
                }
            });
            layer.close(index);
        });
    });


    // 实现修改文章功能
    $('body').on('click','.layui-btn-bj',function(){
       var id = $(this).attr('data_id');
        location.href = "/article/text.html?id=" + id;
        
    })

});
