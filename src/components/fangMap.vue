<template>
  <div class="col-md-9 map">
    <div ref="allmap" class="allmap"></div> 
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
    }
    if(global.BMap !== "undefined"){
      const mapScript = document.createElement("script"); 
      mapScript.src = "http://api.map.baidu.com/api?v=2.0&ak=gLq3uGQogi04coH5QrnGfAg50wrAEvkr&callback=initialize";
      document.body.appendChild(mapScript);
    }
    
  },
  methods: {
    initMap() {
      this.map = new BMap.Map(this.$refs.allmap);
      this.map.centerAndZoom(new BMap.Point(114.270313, 22.55994), 11); 
      this.map.addControl(new BMap.MapTypeControl()); 
      this.map.setCurrentCity("深圳");
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
          this.map.clearOverlays();
          const distObj = req.body;

          messageBus.$emit('transDist',distObj)

          for(let j =0;j<distObj.length; j++){
            const point = new BMap.Point(distObj[j].x,distObj[j].y);
            const opts = {
              position : point,    // 指定文本标注所在的地理位置
              offset   : new BMap.Size(10, -10)    //设置文本偏移量
            }
            // 添加覆盖物
            let label = new BMap.Label(distObj[j].district + "<br/>￥"+distObj[j].price+"<br/>" +distObj[j].priceRateHalfM,opts);
            
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
            const price = parseFloat(distObj[j].priceRateHalfM);
            this.changeColor(price,label)

            this.map.addOverlay(label);
            // label.disableMassClear();//禁止label覆盖物在map.clearOverlays方法中被清除

            //显示行政边界
            const myGeo = new BMap.Geocoder();
            label.addEventListener('mouseover',function ()  {
              this.setStyle({
                  background: "rgba(0, 255, 177,0.6)",
              })
              // 先拿到point，获取当前行政区，然后调用方法显示区域边界
              // myGeo.getLocation(point,  (result) => {self.getBoundary(result)});
            })

            label.addEventListener('mouseout',() => {
              this.changeColor(price,label)
            })

            label.addEventListener('click',()=>{
              this.map.centerAndZoom(opts.position,15);

            })

          }
        })
      }else if(zoom >14){
        this.$http.post('/mapGetZone',{options}).then(function(req){
          this.map.clearOverlays();
          const zoneObj = req.body;

          messageBus.$emit('transMapZone',zoneObj)

          for(let k =0;k<zoneObj.length; k++){
            let zone = zoneObj[k];
            const point = new BMap.Point(zone.y,zone.x);
            let opts = {
              position : point,    
              offset   : new BMap.Size(15, -15)   
            }
            // 添加覆盖物
            let label = new BMap.Label(zone.name + "&nbsp;"+zone.priceRateHalfY+"%",opts);

            label.setStyle({
              boxSizing:"border-box",
              color: "#fff",
              border:"1px solid transparent",
              fontSize: "12px",
              height: "30px",
              maxWidth:"200px",
              borderRadius: "16px",
              lineHeight: "29px",
              overflow: "hidden",
              textAlign: "center",
              paddingLeft: "5px",
              fontFamily: "微软雅黑"
            });
            const price = parseFloat(zone.priceRateHalfY);
            this.changeColor(price,label)

            this.map.addOverlay(label);
            // 小区覆盖物点击事件
            label.addEventListener('click',(e)=>{
              this.$http.post('/getPriceHalfY',{id:zone._id})
              .then(function(priceObj){
                // console.log(priceObj);
              })
            })
          }

        })
      }

    },

    // 上涨率颜色区分
    changeColor(price,label){
      if (price < 0) {
        label.setStyle({
          background: "#379",
        });
      } else if(0 < price && price< 10){
        label.setStyle({
          background: "rgb(255,143,143)",
        });
      }else if(10 < price && price < 20){
        label.setStyle({
          background: "rgb(255,105,105)",
        });
      }else if(20 < price && price < 40){
        label.setStyle({
          background: "rgb(255,71,71)",
        });
      }else if(40 < price && price < 60){
        label.setStyle({
          background: "rgb(255,41,41)",
        });
      }else if(60 < price){
        label.setStyle({
          background: "rgb(255,0,0)",
        });
      }else{
        label.setStyle({
          background: "#099",
        });
      }
    },

    // 添加layer
    getZone() {
      this.map.addEventListener('tilesloaded', () =>  {
        // console.log(this.map.getCenter());
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
.allmap{
 /* outline: 1px solid #3cc; */
  width: 100%;
  height:100%;
}
.map{
  padding-left:0;
  padding-right:0;
  margin-top: -15px;
  min-height:500px;
  /* float: right; */
  position:fixed;
  right:0;
  top:66px;
  bottom:0;
}
</style>
