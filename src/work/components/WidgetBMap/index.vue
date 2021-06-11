<template>
  <div class="flex-col">
    <div :id="mapId" class="bmap flex-1"></div>
    <div class="titleBar">
      <van-icon name="location" />
      选择地点
    </div>
    <div class="flex-1 scrollbar list">
      <div
        v-for="(item, index) in searchResults"
        :key="index"
        class="_item flex-row align-center"
        :class="{cur: currentItem && (currentItem.uid===item.uid)}"
        @click="handleClick(item)"
      >
        <div class="flex-1">
          <div class="_title el">
            {{ item.title }}
          </div>
          <div class="el">
            {{item.address}}
          </div>
        </div>
        <div class="_check"></div>
      </div>
    </div>
  </div>
</template>

<script>
const packageInfo = require("./package.json");
import { report } from "@/main/assets/WidgetAmountReport";
/* ↑↑↑ 组件上报，勿删 ↑↑↑ */

import * as bmapsdk from "./bmap-sdk";
let BMap;

export default {
  props: {
    center: {
      type: Object,
      required: false,
      default() {
        return {
          lng: 121.491,
          lat: 31.233,
        };
      },
    },
    zoomLevel: {
      type: Number,
      required: false,
      default: 14
    },
  },
  data() {
    return {
      mapId: `BMap_${parseInt(Math.random() * 1e8)}`,
      map: null,
      marker: null,
      searchResults: [],
      currentItem: null
    };
  },
  watch: {
    center: {
      handler() {
        if (this.center && this.center.lng && this.center.lat) {
          this.handleCenter(this.center, this.handleSearch);
        }
      },
      deep: true,
    },
  },
  methods: {
    handleClick(item) {
      this.currentItem = item;
      this.setMaker(item.point);
      this.$emit('change', item)
    },
    setMaker(point) {
      // 创建地图标点
      if (this.marker) {
        this.map.removeOverlay(this.marker);
        this.marker = null;
      }
      this.marker = new BMap.Marker(new BMap.Point(point.lng, point.lat));
      this.map.addOverlay(this.marker);
      this.map.panTo(point);
    },
    handleCenter(point, callback) {
      // 坐标转换并定位
      bmapsdk.convertCoord([point], (data) => {
        if (data.status === 0) {
          console.log("转换完成", data.points);
          // 定位地图中心
          this.map.centerAndZoom(
            new BMap.Point(data.points[0].lng, data.points[0].lat),
            this.zoomLevel
          );
          // 添加点坐标
          this.setMaker(data.points[0]);
          if (typeof callback === "function") {
            callback(data.points[0]);
          }
        }
      });
    },
    handleSearch(baiduPoint) {
      // 监听center执行搜索
      bmapsdk.search(baiduPoint, ["景点","纪念馆","博物馆"], (results) => {
        console.log('handleSearch', results)
        let resultHash = {};
        for(let ri = 0; ri < results.length; ri++){
          let result = results[ri];
          for (let i = 0; i < result.getCurrentNumPois(); i++) {
            let addrInfo = result.getPoi(i);
            // 结果去重
            if(addrInfo.uid && !resultHash[addrInfo.uid]){
              resultHash[addrInfo.uid] = addrInfo
            }
          }
        }
        
        this.searchResults = Object.keys(resultHash).map(e => resultHash[e]);
      });
    },
  },
  created() {
    report.call(this, packageInfo);
  },
  mounted() {
    // 初始化百度地图
    bmapsdk.init(packageInfo.AK, (BMapObj) => {
      BMap = BMapObj;

      this.map = new BMap.Map(this.mapId);
      if (this.center && this.center.lng && this.center.lat) {
        this.handleCenter(this.center, this.handleSearch);
      }
     
    });
  },
};
</script>

<style scoped>
.bmap >>> img {
  max-width: none;
}
.titleBar{
  font-size: 16px;
  color: #333;
  padding: 12px 20px;
}
.titleBar .van-icon{
  color: #FE664E;
}

.list{
  background:#fff;
  box-sizing: border-box;
  padding: 0 1em;
}
.list ._item{
  border-bottom: 1px solid #f5f5f5;
  padding: 10px;
  color: #999;
}
.list ._title{
  font-size: 14px;
  color: #333;
}
.list ._check {
  width: 18px;
  height: 18px;
  border: 1px solid #ccc;
  border-radius: 10px;
}
.list .cur ._check {
  background: url(../../assets/img/check.png) center center no-repeat;
  border-color: transparent;
}
</style>
