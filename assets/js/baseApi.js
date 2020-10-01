$.ajaxPrefilter(function(ress){
    ress.url = 'http://ajax.frontend.itheima.net' + (ress.url);
console.log(ress.url);
})