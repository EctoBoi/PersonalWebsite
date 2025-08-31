import { create2x4HangTag, create3x5HangTag, create4x4FactTag, create4x2Binocular, create11x11SignInsert, create17x17SignInsert } from './CreateSign.js';

document.getElementById("createButton").addEventListener("click", createSign)
document.getElementById("printButton").addEventListener("click", print)
document.getElementById("fillInfoButton").addEventListener("click", fillFromInfo)

document.getElementById("saveToBatch").addEventListener("click", saveToBatch)
document.getElementById("clearBatch").addEventListener("click", clearBatch)
document.getElementById("printBatch").addEventListener("click", printBatch)

let pageOrientation = "portrait"

let batch = [];
let batchCount = 0;

async function fillFromInfo() {
    const clipboardContents = await navigator.clipboard.readText();
    if (clipboardContents.split("^").length > 2) {
        document.getElementById("title1").value = clipboardContents.split("^")[0]
        document.getElementById("sku").value = clipboardContents.split("^")[1]
        document.getElementById("price").value = clipboardContents.split("^")[2]

        if (clipboardContents.split("^").length > 3) {
            document.getElementById("regPrice").value = clipboardContents.split("^")[3]
        } else {
            document.getElementById("regPrice").value = ""
        }

        document.getElementById("title2").value = ""
        //document.getElementById("endDate").value = ""
    } else {
        alert("Info Error")
    }
}

function createSign() {
    const size = document.getElementById("sizes").value

    if (size === "2x4 Hang Tag") {
        pageOrientation = "portrait"
        create2x4HangTag()
    }

    if (size === "3.25x5.75 Hang Tag") {
        pageOrientation = "portrait"
        create3x5HangTag()
    }

    if (size === "4x4 Fact Tag") {
        pageOrientation = "portrait"
        create4x4FactTag()
    }

    if (size === "4.5x2.75 Binocular") {
        pageOrientation = "landscape"
        create4x2Binocular()
    }

    if (size === "11x11 Sign Insert") {
        pageOrientation = "landscape"
        create11x11SignInsert()
    }

    if (size === "17x17 Sign Insert") {
        pageOrientation = "landscape"
        create17x17SignInsert()
    }

    loadBatchPreview()
}

function print() {
    let img = new Image();
    img.id = 'tempPrintImage'
    img.src = document.getElementById("signCanvas").toDataURL("image/png");
    img.width = img.width * 0.25;
    img.height = img.height * 0.25;

    if (img.complete) {
        const copies = document.getElementById("copies").value
        let imgs = []
        for (let i = 0; i < copies; i++) {
            imgs.push(img)
        }
        openPrintWindow(imgs)
    }
    else {
        setTimeout(print, 300)
    }
}

function saveToBatch() {
    let img = new Image();
    img.src = document.getElementById("signCanvas").toDataURL("image/png");
    img.width = img.width * 0.25;
    img.height = img.height * 0.25;

    if (img.complete) {
        const copies = document.getElementById("copies").value
        for (let i = 0; i < copies; i++) {
            let imgClone = img.cloneNode(true)
            imgClone.id = 'tempPrintImage' + batchCount;
            batchCount++;

            batch.push(imgClone);
        }

        loadBatchPreview()

        if (copies > 1)
            alert('Saved ' + copies + ' Signs to Batch')
        else
            alert('Saved ' + copies + ' Sign to Batch')
    }
    else {
        setTimeout(saveToBatch, 300);
    }
}

function clearBatch() {
    if (confirm('Clear Batch?')){
        batch = [];
        batchCount = 0;

        loadBatchPreview()
    }
}

function printBatch() {
    if (batch.length > 0)
        openPrintWindow(null)
    else
        alert('Batch Empty')
}

function loadBatchPreview() {
    let batchPreviewDiv = document.getElementById('batchPreview');
    batchPreviewDiv.innerHTML = ""

    if (batch.length > 0) {
        let width = "100%";

        if (pageOrientation === "portrait") {
            width = xToPx('8.5in') + "px"
        } else if (pageOrientation === "landscape") {
            width = xToPx('11in') + "px"
        }
        batchPreviewDiv.style.minWidth = width;
        batchPreviewDiv.style.width = width;

        for (let i = 0; i < batch.length; i++) {
            batch[i].onclick = removeFromBatch;

            batchPreviewDiv.append(batch[i]);
        }
    }
}

function removeFromBatch() {
    if (confirm('Remove from Batch?')) {
        for (let i = 0; i < batch.length; i++) {
            if (batch[i].id === this.id) {
                batch.splice(i, 1);
            }
        }

        loadBatchPreview()
    }
}

function openPrintWindow(imgs) {
    let WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');

    if (imgs != null) { //null for batch
        for (let i = 0; i < imgs.length; i++) {
            WinPrint.document.write(imgs[i].outerHTML);
        }
    } else {
        for (let i = 0; i < batch.length; i++) {
            WinPrint.document.write(batch[i].outerHTML);
        }
    }

    let stylePortrait = `<style type="text/css" media="print">
            @page { size: portrait; display: flex;}
        </style>`
    let styleLandscape = `<style type="text/css" media="print">
            @page { size: landscape; }
        </style>`

    WinPrint.document.write(`<style type="text/css">
                                body { margin: 0; }
                            </style>`);

    if (pageOrientation === "portrait")
        WinPrint.document.write(stylePortrait);
    if (pageOrientation === "landscape")
        WinPrint.document.write(styleLandscape);

    WinPrint.document.close();

    setTimeout(() => {
        WinPrint.focus();
        WinPrint.print();
        WinPrint.close();
    }, 300)
}

function xToPx(x) {
    var div = document.createElement('div');
    div.style.display = 'block';
    div.style.height = x;
    document.body.appendChild(div);
    var px = parseFloat(window.getComputedStyle(div, null).height);
    div.parentNode.removeChild(div);
    return px;
}