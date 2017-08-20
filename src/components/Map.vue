<template>
  <div class="col-md-9 map">
    <div id="allmap" ></div> 
  </div>
</template>

<script>
import BMap from 'BMap'
export default {
  name: 'hello2',
  data () {
    return { 
      msg: 'hello2',
      map: null,
    }
  },
  mounted () {
    this.initMap();
    this.getZone();
    this.initListenMsg();
  },
  methods: {
    initMap() {
      this.map = new BMap.Map("allmap");
      this.map.centerAndZoom(new BMap.Point(121.48038, 31.23632), 13); // 初始化地图,设置中心点坐标和地图级别
      this.map.addControl(new BMap.MapTypeControl()); //添加地图类型控件
      this.map.setCurrentCity("上海"); // 设置地图显示的城市 此项是必须设置的
      this.map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
    },

    // 传递消息
    addMapLabel() {
      const self = this;
      // 显示覆盖物
      var pointArray = [
          new BMap.Point(121.48038, 31.23632),
          new BMap.Point(121.48038,31.25632),
          new BMap.Point(121.48038,31.27632),
      ];
      var optsArray = [{}, {}, {}];
      var labelArray = [];
      var contentArray = [
          "正荣大湖<br/>之都0",
          "正荣大湖<br/>之都1",
          "正荣大湖<br/>之都2",
      ];
      for (let i = 0; i < pointArray.length; i++) {
        // 添加圆形覆盖物
        optsArray[i].position = pointArray[i];
        labelArray[i] = new BMap.Label(contentArray[i], optsArray[i]);
        labelArray[i].setStyle({
          boxSizing:"border-box",
          color: "#fff",
          background: "rgba(0, 151, 177, 0.6)",
          fontSize: "12px",
          height: "100px",
          width:"100px",
          maxWidth: "100px",
          borderRadius: "50%",
          paddingTop:"20px",
          paddingLeft:"5px",
          border: "1px solid transparent",
          lineHeight: "20px",
          overflow: "hidden",
          textAlign: "center",
          fontFamily: "微软雅黑"
        });
        this.map.addOverlay(labelArray[i]);
        labelArray[i].disableMassClear();//禁止label覆盖物在map.clearOverlays方法中被清除
        
        // 覆盖物绑定事件
        labelArray.forEach((label,index)=>{
          label.removeEventListener('mouseover');
          label.removeEventListener('mouseout');
          // 显示行政区边界
          const myGeo = new BMap.Geocoder();
          label.addEventListener('mouseover',function ()  {
            this.setStyle({
                background: "rgba(0, 255, 177, 0.6)",
            })
            // 先拿到point，获取当前行政区，然后调用方法显示区域边界
            myGeo.getLocation(pointArray[index],  (result) => {self.getBoundary(result)});
          // console.log('getboundar')
          })
          label.addEventListener('mouseout',function()  {
            this.setStyle({
                background: "rgba(0, 151, 177, 0.6)",
            })
            self.map.clearOverlays();
          })
        })
      }
    },

    // 添加layer
    getZone() {
      this.map.removeEventListener('tilesloaded');
      this.map.addEventListener('tilesloaded', () =>  {
        // 添加覆盖物
        this.addMapLabel();

        const bs = this.map.getBounds(); //获取可视区域
        const bssw = bs.getSouthWest(); //可视区域左下角
        const bsne = bs.getNorthEast(); //可视区域右上角
        // alert("当前地图可视范围是：" + bssw.lng + "," + bssw.lat + "到" + bsne.lng + "," + bsne.lat);
        const options = {
            leftDownLng: bssw.lng,
            leftDownLat: bssw.lat,
            rightTopLng: bsne.lng,
            rightTopLat: bsne.lat,
        }

      })
    },

    // 监听消息
    initListenMsg() {
        console.log('1')
    },

    // 显示边界
    getBoundary(result) {
      if (result) {
        const districtName = result.address.substr(0, 6);// 行政区名
        // console.log(districtName)
        const bdary = new BMap.Boundary();
        bdary.get(districtName,  (rs) => { //获取行政区域
          this.map.clearOverlays();        //!!清除地图覆盖物，不清除的话，透明度会出现问题       
          const count = rs.boundaries.length; //行政区域的点有多少个

          if (count === 0) {
            alert('未能获取当前输入行政区域');
            return;
          }
          var pointArray = [];
          for (let j = 0; j < count; j++) {
            const ply = new BMap.Polygon(rs.boundaries[j], {
              strokeWeight: 3,
              strokeColor: "#3cc",
              strokeOpacity: 0.7
            }); //建立多边形覆盖物  
            this.map.addOverlay(ply);
            pointArray = pointArray.concat(ply.getPath());
          }
        });
      }
    },


  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
#allmap{
  outline: 1px solid #3cc;
  width: 100%;
  height: 600px;
}
.map{
  padding-left:0;
  padding-right:0;
  margin-top: -15px;
}
</style>
