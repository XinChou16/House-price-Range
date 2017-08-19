/**
 *  @xin chou
 * Create on: 2017-08-08
 */


$(function () {
var allmap = $('.allmap'),
    rank = $('.rank'),
    show = $('.show'),
    queryLib = $('.queryLib'), 
    libShow = $('#libShow'),
    libName = $('.libName'),
    displayResult = $('.displayResult');
    
    // 地图全局设置
    var map = new BMap.Map("allmap");
    map.centerAndZoom(new BMap.Point(121.48038, 31.23632), 13); // 初始化地图,设置中心点坐标和地图级别
    map.addControl(new BMap.MapTypeControl()); //添加地图类型控件
    map.setCurrentCity("上海"); // 设置地图显示的城市 此项是必须设置的
    map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放

var mapHandler = (function () {

    function _mapInit() {
        map.removeEventListener('tilesloaded');
        map.addEventListener('tilesloaded', function () {
            var bs = map.getBounds(); //获取可视区域
            var bssw = bs.getSouthWest(); //可视区域左下角
            var bsne = bs.getNorthEast(); //可视区域右上角
            // alert("当前地图可视范围是：" + bssw.lng + "," + bssw.lat + "到" + bsne.lng + "," + bsne.lat);
            var options = {
                leftDownLng: bssw.lng,
                leftDownLat: bssw.lat,
                rightTopLng: bsne.lng,
                rightTopLat: bsne.lat,
            }

            // 显示覆盖物
            var pointArray = [
                new BMap.Point(121.48038, 31.23632),
                new BMap.Point(121.48038,31.25632),
                new BMap.Point(121.48038,31.27632),
                new BMap.Point(121.48038,31.29632)
            ];
            var optsArray = [{}, {}, {},{}];
            var labelArray = [];
            var contentArray = [
                "欢迎使用<br/>百度地图0",
                "欢迎使用<br/>百度地图1",
                "欢迎使用<br/>百度地图2",
                "欢迎使用<br/>百度地图3"
            ];
            for (var i = 0; i < pointArray.length; i++) {
                // 添加圆形覆盖物
                optsArray[i].position = pointArray[i];
                labelArray[i] = new BMap.Label(contentArray[i], optsArray[i]);
                labelArray[i].setStyle({
                    color: "#f00",
                    background: "rgba(0, 151, 177, 0.6)",
                    fontSize: "12px",
                    height: "100px",
                    width: "100px",
                    borderRadius: "50%",
                    padding: "5px",
                    border: "1px solid transparent",
                    lineHeight: "20px",
                    overflow: "hidden",
                    textAlign: "center",
                    fontFamily: "微软雅黑"
                });
                map.addOverlay(labelArray[i]);
                labelArray[i].disableMassClear();//禁止label覆盖物在map.clearOverlays方法中被清除
                
                // 覆盖物绑定事件
                labelArray.forEach(function(label,index){
                    label.removeEventListener('mouseover');
                    label.removeEventListener('mouseout');
                    // 显示行政区边界
                    var myGeo = new BMap.Geocoder();
                    label.addEventListener('mouseover',function(){
                        this.setStyle({
                            background: "rgba(0, 255, 177, 0.6)",
                        })
                        // 先拿到point，获取当前行政区，然后调用方法显示区域边界
                        myGeo.getLocation(pointArray[index], function (result) {_getBoundary(result)});
                    })
                    label.addEventListener('mouseout',function(){
                        this.setStyle({
                            background: "rgba(0, 151, 177, 0.6)",
                        })
                        map.clearOverlays();
                    })
                })

            }

        })
    }

    // getLocation回调函数，显示行政区边界
    function _getBoundary(result){
        if (result) {
            var districtName = result.address.substr(0, 6);
            // console.log(districtName)
            var bdary = new BMap.Boundary();
            bdary.get(districtName, function (rs) { //获取行政区域
                map.clearOverlays();        //!!清除地图覆盖物，不清除的话，透明度会出现问题       
                var count = rs.boundaries.length; //行政区域的点有多少个

                if (count === 0) {
                    alert('未能获取当前输入行政区域');
                    return;
                }
                var pointArray = [];
                for (var i = 0; i < count; i++) {
                    var ply = new BMap.Polygon(rs.boundaries[i], {
                        strokeWeight: 3,
                        strokeColor: "#3cc",
                        strokeOpacity: 0.7
                    }); //建立多边形覆盖物  
                    map.addOverlay(ply);
                    pointArray = pointArray.concat(ply.getPath());
                }
            });
        }
    }

    function init() {
        _mapInit();
    }

    return {
        init: init
    }

})();

mapHandler.init();

})