/*eslint indent: [ "error", 4, { "outerIIFEBody": 0 }]*/
/*eslint-env browser*/
(function () {

var canvas;

function drawData(data) {
    var ctx = canvas.getContext("2d"),
        imgData,
        rgbData,
        max = Math.max(...data),
        v;

    imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    rgbData = imgData.data;

    for (var i=0; i < data.length; i++) {
        v = 255*(1-data[i]/max);
        rgbData[i*4] = 255*(1-data[i]/max);
        rgbData[i*4+1] = 255*(1-data[i]/max);
        rgbData[i*4+2] = 255*(1-data[i]/max);
        rgbData[i*4+3] = 255*1.0;
    }
    ctx.putImageData(imgData, 0, 0);
}

/*FIXME: move the whole thing to requirejs. */
window.drawData = drawData;

window.addEventListener("load", function () {
    canvas = document.getElementById("number");
    canvas.width = 20;
    canvas.height = 20;
    canvas.style.height = "100px";
    canvas.style.width = "100px";
    canvas.style.border = "1px black solid";
});

}());
