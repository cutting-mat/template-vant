// webview调用flutter

export const bridge = function(functionName, functionParam){
  if(typeof functionParam === 'object'){
    functionParam = JSON.stringify(functionParam)
  }
  console.warn(functionName, functionParam)
  try {
    if (window[functionName]) {
      window[functionName].postMessage(functionParam);
    } else {
      console.warn(
        `${functionName}对象未就绪：${window[functionName]}`
      );
    }
  } catch (e) {
    console.log(
      `message:${e.message}\n description:${e.description}\n name: ${e.name}`
    );
  }
  
}
