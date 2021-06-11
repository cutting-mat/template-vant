// BMap 对象
let BMap;

/**
 * 初始化sdk
 * @param AK 百度AK
 * @param callback 初始化回调，参数 BMap 对象
 * */ 
export const init = (AK, callback) => {
    if (!(AK && AK.split)) {
        return console.warn('缺少参数：ak')
    }

    const scriptTagId = "bdmap-sdk-by-widget-bmap";
    if (document.getElementById(scriptTagId) || BMap || window.BMap) {
        // 如果已初始化，直接执行回调
        BMap = window.BMap;
        callback(BMap)
    } else {
        const initializeFun = `initialize_${parseInt(Math.random() * 1e8)}`;
        window[initializeFun] = () => {
            if (typeof callback === 'function') {
                BMap = window.BMap;
                callback(BMap)
            }
        };
        let script = document.createElement("script");
        script.id = scriptTagId;
        script.src = `//api.map.baidu.com/api?v=3.0&ak=${AK}&callback=${initializeFun}`;
        document.body.appendChild(script);
    }

}

/**
 * 坐标转换(amap、tencent和mapabc地图)
 * @param pointArray 坐标数组：[{lng:'经度', lat: '纬度'}]
 * @param callback 回调函数，参数data:{status: 0, points: [{lng:'经度', lat: '纬度'}]}
 */
export const convertCoord = (pointArray, callback) => {
    if (!BMap) {
        return null
    }
    if (Array.isArray(pointArray)) {
        let pointArr = pointArray.map(point => {
            return new BMap.Point(point.lng, point.lat)
        })
        let convertor = new BMap.Convertor();
        convertor.translate(pointArr, 3, 5, callback)
    }
}

/**
 * 本地搜索(默认搜索范围1000米)
 * @param map 地图实例
 * @param keywords String / [String]
 * @param callback 回调函数，参数 results
 * */
export const search = (point, keywords, callback) => {
    if (!point || !keywords) {
        return null
    }
    let centerPoint = new BMap.Point(point.lng, point.lat);
    let local = new BMap.LocalSearch(centerPoint, {
        pageCapacity: 10,
        onSearchComplete: callback || (() => null)
    });
    local.searchNearby(keywords, centerPoint, 1000);
}

