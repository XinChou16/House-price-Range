<template>
  <div class="col-md-9 map">
    <div ref="allmap" id="allmap"></div> 
  </div>
</template>

<script>


import messageBus from './messageBus'
export default {
  name: 'hello2',
  data () {
    return { 
      msg: 'hello2',
      map: null,
    }
  },
  mounted () {
    const self = this;
    global.initialize = function (){
      self.initMap();
      self.getZone();
      self.initListenMsg();
    }
    if(global.BMap !== "undefined"){
      const mapScript = document.createElement("script"); 
      mapScript.src = "http://api.map.baidu.com/api?v=2.0&ak=gLq3uGQogi04coH5QrnGfAg50wrAEvkr&callback=initialize";
      document.body.appendChild(mapScript);
    }
    
  },
  methods: {
    initMap() {
      this.map = new BMap.Map("allmap");
      this.map.centerAndZoom(new BMap.Point(121.48038, 31.23632), 12); 
      this.map.addControl(new BMap.MapTypeControl()); 
      this.map.setCurrentCity("上海");
      this.map.enableScrollWheelZoom(true);
      const top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
      this.map.addControl(top_left_navigation);     
    },

    // 传递消息
    addMapLabel(zoom,options) {
      const self = this;
      // console.log('当前放大级别'+zoom)
      if (zoom > 10 && zoom < 13) {
        this.$http.post('/getDist',{options}).then(function(req){
          const distObj = req.body;
          messageBus.$emit('transDist',distObj)
          for(let j =0;j<distObj.length; j++){
            const point = new BMap.Point(distObj[j].x,distObj[j].y);
            const opts = {
              position : point,    // 指定文本标注所在的地理位置
              offset   : new BMap.Size(10, -10)    //设置文本偏移量
            }
            // 添加覆盖物
            const label = new BMap.Label(distObj[j].district + "<br/>"+distObj[j].priceRateHalfM,opts);

            label.setStyle({
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
            this.map.addOverlay(label);
            label.disableMassClear();//禁止label覆盖物在map.clearOverlays方法中被清除

            //显示行政边界
            const myGeo = new BMap.Geocoder();
            label.addEventListener('mouseover',function ()  {
              this.setStyle({
                  background: "rgba(0, 255, 177)",
              })
              // 先拿到point，获取当前行政区，然后调用方法显示区域边界
            myGeo.getLocation(point,  (result) => {self.getBoundary(result)});
            // console.log('getboundar')
            })
            label.addEventListener('mouseout',function()  {
              this.setStyle({
                  background: "rgba(0, 151, 177)",
              })
              self.map.clearOverlays();
            })


          }
        })
      }else if(zoom >15){
        this.$http.post('/mapGetZone',{options}).then(function(req){
          this.map.clearOverlays();
          const zoneObj = req.body;
          // console.log(zoneObj) 上千个

          for(let k =0;k<zoneObj.length; k++){
            const point = new BMap.Point(zoneObj[k].y,zoneObj[k].x);
            const opts = {
              position : point,    
              offset   : new BMap.Size(15, -15)   
            }
            // 添加覆盖物
            const label = new BMap.Label(zoneObj[k].name + "<br/>"+zoneObj[k].priceRateHalfY,opts);

            label.setStyle({
              boxSizing:"border-box",
              color: "#fff",
              background: "rgba(0, 151, 177, 0.6)",
              fontSize: "12px",
              height: "80px",
              width:"80px",
              maxWidth: "80px",
              borderRadius: "50%",
              paddingTop:"15px",
              paddingLeft:"2px",
              border: "1px solid transparent",
              lineHeight: "20px",
              overflow: "hidden",
              textAlign: "center",
              fontFamily: "微软雅黑"
            });
            this.map.addOverlay(label);
            label.addEventListener('click',(e)=>{
              this.$http.post('/getPriceHalfY',{id:zoneObj[k]._id})
              .then(function(priceObj){
                // console.log(priceObj);
              })
            })
          }

        })
      }

    },

    // 添加layer
    getZone() {
      this.map.addEventListener('tilesloaded', () =>  {
        const zoom = this.map.getZoom();
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

        // 添加覆盖物
        this.addMapLabel(zoom,options);
      })
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

    // 监听消息
    initListenMsg() {
        console.log('监听消息正在运行...')
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
  /* outline: 1px solid #3cc;*/
  width: 100%;
  height:100%;
}
.map{
  padding-left:0;
  padding-right:0;
  margin-top: -15px;
  height: 600px;
}
</style>
