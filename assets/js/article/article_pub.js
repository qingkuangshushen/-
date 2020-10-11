$(function () {
    
    var layer = layui.layer;
    var form = layui.form;
    // 初始化富文本编辑器
    initEditor()

    // 调用获取文章类别方法
    gitsort();

    // 初始化获取文章类别方法
    function gitsort() {
        $.ajax({
            type: "get",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) return layer.msg('获取文章列表失败');
                var codes = template('tpl-cate', res);
                $('[name=cate_id]').html(codes);
                // 通知layUI重新渲染界面
                form.render();
            }
        });
    }


    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //更换封面操作设置
    $('#photo_btn').on('click', function () {
        $('#file_photo').click()
    })

    $('#file_photo').change(function (e) {
        var filelist = e.target.files;
        if (filelist.length === 0) {
            return layer.msg('请选择图片');
        }
        var file = e.target.files[0];

        var newImgURL = URL.createObjectURL(file);

        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    //判断文章发送或存为草稿
    var states = "已发布";
    $('.draft').on('click', function () {
        states = "草稿";
    });

    //监听表单提交
    $('#pub_form').on('submit', function (e) {
       
        e.preventDefault();
        
        var fd = new FormData($(this)[0]);
        fd.append('state', states);
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img',blob);
                publish(fd);
            })
    })

    //发送新文章请求
    function publish(das) { 
        $.ajax({
            type: "POST",
            url: "/my/article/add",
            data: das,
            contentType: false,
            processData: false,
            success: function (res) {
                if(res.status !== 0)return layer.msg(res.message);
                layer.msg('发送新文章成功!');
                location.href = "/article/article_list.html"
            }
        });
     }


     
})