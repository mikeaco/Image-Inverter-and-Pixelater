var PIXELMULT;
var imgX, imgY, imgWid, imgHeight;
function loadImg() {
    var input = document.getElementById("pic");
    var fReader = new FileReader();
    fReader.readAsDataURL(input.files[0]);
    fReader.onloadend = function (event) {
        var img = document.getElementById("image");
        img.src = event.target.result;
    }
    drawImg();
}
function reset() {
    var input = document.getElementById("pic");
    var fReader = new FileReader();
    fReader.readAsDataURL(input.files[0]);
    fReader.onloadend = function (event) {
        var img = document.getElementById("image");
        img.src = event.target.result;
    }
}
function drawImg() {

    var file = document.getElementById("image");
    $.get(file.src)
        .done(function () {
            const myCanvas = document.getElementById("myCanvas");
            const myContext = myCanvas.getContext("2d");
            myContext.clearRect(0, 0, myCanvas.width, myCanvas.height);
            myContext.globalAlpha = 1;
            const img = new Image();
            img.src = file.src;
            img.onload = () => {
                var dw = window.screen.width;
                var dh = window.screen.height;
                var dx = 0;
                var dy = 0;
                if (img.width < window.screen.width) {
                    dx = (window.screen.width - img.width) / 2;
                    dw = img.width;
                }
                if (img.height < window.screen.height) {
                    dy = (window.screen.height - img.height) / 2;
                    dh = img.height;
                }
                const wid = img.width;
                const heig = img.height;
                imgX = dx;
                imgY = dy;
                imgWid = dw;
                imgHeight = dh;
                myContext.drawImage(img, 0, 0, wid, heig, dx, dy, dw, dh);
            };
        }).fail(function () {
            var canvas = document.getElementById("myCanvas");
            var ctx = canvas.getContext("2d");
            ctx.font = "30px Arial";
            ctx.fillText("File Not Found", (window.screen.width / 2) - 100, window.screen.height / 2);
        })

}
function setSize() {
    const myCanvas = document.getElementById("myCanvas");
    var myContext = myCanvas.getContext("2d");
    myContext.canvas.width = window.screen.width;
    myContext.canvas.height = window.screen.height;
}
function invert() {
    const myCanvas = document.getElementById("myCanvas");
    var myContext = myCanvas.getContext("2d");
    var dataImg = myContext.getImageData(imgX, imgY, imgWid, imgHeight);
    data = dataImg.data;
    for (var i = 0; i < data.length; i += 4) {
        data[i] = data[i] ^ 255;
        data[i + 1] = data[i + 1] ^ 255;
        data[i + 2] = data[i + 2] ^ 255;
    }
    myContext.putImageData(dataImg, imgX, imgY);

}
function pixelize() {
    reset();
    PIXELMULT = document.getElementById("blockSize").value;
    if(PIXELMULT==0){
        PIXELMULT++;
    }
    const myCanvas = document.getElementById("myCanvas");
    var myContext = myCanvas.getContext("2d");
    var dataImg = myContext.getImageData(imgX, imgY, imgWid, imgHeight);
    data = dataImg.data;
    var wid = imgWid * 4;
    var rowCheck = 0;
    var pos = 0;
    console.log(data[0]);
    console.log(data);
    for (var i = 0; i < data.length; i += 4 * PIXELMULT) {
        var avgColor = [0, 0, 0, 0];
        var pixelCount = 0;
        for (var r = 0; r < 4; r++) {
            for (var row = 0; row < PIXELMULT; row++) {
                for (var col = 0; col < PIXELMULT; col++) {
                    if (((wid * row) + i + r + 4 * col < pos + wid * row + wid + r) && ((wid * row) + i + r + 4 * col < data.length)) {
                        avgColor[r] += data[(wid * row) + i + r + 4 * col];
                        pixelCount++;


                    }

                }
            }
        }
        pixelCount /= 4;
        avgColor[0] = Math.floor(avgColor[0] / pixelCount);
        avgColor[1] = Math.floor(avgColor[1] / pixelCount);
        avgColor[2] = Math.floor(avgColor[2] / pixelCount);
        avgColor[3] = Math.floor(avgColor[3] / pixelCount);
        for (var r = 0; r < 4; r++) {
            for (var row = 0; row < PIXELMULT; row++) {
                for (var col = 0; col < PIXELMULT; col++) {
                    if (((wid * row) + i + r + 4 * col < pos + wid * row + wid + r) && ((wid * row) + i + r + 4 * col < data.length))
                        data[(wid * row) + i + r + 4 * col] = avgColor[r];
                    

                }
            }
        }
        if (rowCheck + 4 * PIXELMULT >= wid) {
            var offset = wid - (rowCheck);
            if (rowCheck + 4 * PIXELMULT == wid)
                i += (wid * (PIXELMULT - 1));
            else {
                i += (wid * (PIXELMULT - 1)) - ((4 * PIXELMULT) - offset);
            }
            pos = i + offset+((4 * PIXELMULT) - offset);
            rowCheck = 0;

        }
        else {
            rowCheck += 4 * PIXELMULT;
        }

    }
    console.log(data);
    myContext.putImageData(dataImg, imgX, imgY);

}
setSize();

