
const canvasRatio = 4 //resolution
const defaultBorderWidth = '2';

function showPrintControls() {
    document.getElementById("printButton").style.visibility = "visible"
    document.getElementById("saveToBatch").style.visibility = "visible"
    document.getElementById("clearBatch").style.visibility = "visible"
    document.getElementById("printBatch").style.visibility = "visible"
}

function create2x4HangTag() {
    if (document.getElementById("signCanvas"))
        document.getElementById("signCanvas").remove()

    const canvasWidth = xToPx("48mm")
    const canvasHeight = xToPx("52mm")
    const font = "Impact"
    const title1 = document.getElementById("title1").value
    const title2 = document.getElementById("title2").value
    const price = document.getElementById("price").value
    const dollars = price.split(".")[0].replace(/,/g, "")
    const cents = price.split(".")[1] === undefined ? "" : price.split(".")[1]
    const sku = document.getElementById("sku").value
    const regPrice = document.getElementById("regPrice").value

    let endDate = ""
    if (document.getElementById("endDate").value !== "") {
        const formDate = new Date(document.getElementById("endDate").value.replace("-", "/"));
        const month = formDate.toLocaleString('default', { month: 'short' });
        endDate = month + " " + formDate.getDate() + ", " + formDate.getFullYear()
    }

    let c = createHiDPICanvas(canvasWidth, canvasHeight, canvasRatio);
    c.id = "signCanvas";
    document.getElementById("canvasDiv").appendChild(c);

    const ctx = c.getContext("2d");

    ctx.strokeStyle = "black";
    ctx.lineWidth = defaultBorderWidth;
    ctx.textBaseline = "alphabetic";

    //border
    let lineLength = xToPx("3mm")
    ctx.beginPath();
    ctx.moveTo(lineLength, 0);
    ctx.lineTo(0, 0);
    ctx.lineTo(0, lineLength);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(lineLength, canvasHeight);
    ctx.lineTo(0, canvasHeight);
    ctx.lineTo(0, canvasHeight - lineLength);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvasWidth - lineLength, 0);
    ctx.lineTo(canvasWidth, 0);
    ctx.lineTo(canvasWidth, lineLength);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvasWidth - lineLength, canvasHeight);
    ctx.lineTo(canvasWidth, canvasHeight);
    ctx.lineTo(canvasWidth, canvasHeight - lineLength);
    ctx.stroke();

    //text1
    ctx.font = xToPx("5mm") + "px " + font;
    ctx.fillText(title1, (canvasWidth / 2) - (ctx.measureText(title1).width / 2), xToPx("7mm"));

    //text2
    ctx.font = xToPx("5mm") + "px " + font;
    ctx.fillText(title2, (canvasWidth / 2) - (ctx.measureText(title2).width / 2), xToPx("12mm"));

    //price
    let priceWidth = 0
    let dollarsWidth = 0
    let dollorsSize = xToPx("23mm")
    let centsWidth = 0
    let centsSize = xToPx("11.5mm")

    ctx.font = dollorsSize + "px " + font;
    dollarsWidth = ctx.measureText(dollars).width
    priceWidth += dollarsWidth
    ctx.font = centsSize + "px " + font;
    centsWidth = ctx.measureText(cents).width
    priceWidth += centsWidth

    let priceOffset = 0

    for (let i = 0; priceWidth > canvasWidth - xToPx("8mm"); i++) {
        dollorsSize--
        centsSize--
        priceOffset++
        priceWidth = 0
        ctx.font = dollorsSize + "px " + font;
        dollarsWidth = ctx.measureText(dollars).width
        priceWidth += dollarsWidth
        ctx.font = centsSize + "px " + font;
        centsWidth = ctx.measureText(cents).width
        priceWidth += centsWidth
    }

    priceOffset = priceOffset / 2

    //dollor
    ctx.font = dollorsSize + "px " + font;
    ctx.fillText(dollars, (canvasWidth / 2) - (priceWidth / 2), xToPx("34mm") - priceOffset);

    //cent
    ctx.font = centsSize + "px " + font;
    ctx.fillText(cents, (canvasWidth / 2) + (priceWidth / 2) - centsWidth, xToPx("27mm") - priceOffset);

    //sale ends
    function saleEnds() {
        if (endDate !== "") {
            ctx.font = xToPx("4mm") + "px " + font;
            ctx.fillText("Sale Ends " + endDate, (canvasWidth / 2) - (ctx.measureText("Sale Ends " + endDate).width / 2), xToPx("44mm"));
        }
    }

    //sku
    if (document.getElementById("barcode"))
        document.getElementById("barcode").remove()

    if (sku !== "") {
        let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.id = "barcode"
        document.getElementById("barcodeDiv").append(svg)

        JsBarcode("#barcode", parseInt(sku), {
            width: .8,
            height: 6,
            margin: 0,
            textMargin: 0,
            fontSize: 10,
        });
        let xml = new XMLSerializer().serializeToString(svg);
        let base64 = 'data:image/svg+xml;base64,' + btoa(xml);
        let img = new Image();
        img.src = base64;

        img.onload = function() {
            ctx.drawImage(img, xToPx("36mm") - (img.width / 2), xToPx("46mm"))

            saleEnds()
        }
    } else {
        saleEnds()
    }

    //reg
    if (regPrice !== "") {
        ctx.font = xToPx("5mm") + "px " + font;
        ctx.fillText("Reg. $" + regPrice, (canvasWidth / 2) - (ctx.measureText("Reg. $" + regPrice).width / 2), xToPx("39mm"))
    }

    showPrintControls()
}

function create3x5HangTag() {
    if (document.getElementById("signCanvas"))
        document.getElementById("signCanvas").remove()

    const canvasWidth = xToPx("2.875in")
    const canvasHeight = xToPx("3.1875in")
    const font = "Impact"
    const title1 = document.getElementById("title1").value
    const title2 = document.getElementById("title2").value
    const price = document.getElementById("price").value
    const dollars = price.split(".")[0].replace(/,/g, "")
    const cents = price.split(".")[1] === undefined ? "" : price.split(".")[1]
    const sku = document.getElementById("sku").value
    const regPrice = document.getElementById("regPrice").value

    let endDate = ""
    if (document.getElementById("endDate").value !== "") {
        const formDate = new Date(document.getElementById("endDate").value.replace("-", "/"));
        const month = formDate.toLocaleString('default', { month: 'short' });
        endDate = month + " " + formDate.getDate() + ", " + formDate.getFullYear()
    }

    let c = createHiDPICanvas(canvasWidth, canvasHeight, canvasRatio);
    c.id = "signCanvas";
    document.getElementById("canvasDiv").appendChild(c);

    const ctx = c.getContext("2d");

    ctx.strokeStyle = "black";
    ctx.lineWidth = defaultBorderWidth;
    ctx.textBaseline = "alphabetic";

    //border
    ctx.beginPath();
    ctx.moveTo(xToPx("10mm"), 0);
    ctx.lineTo(0, 0);
    ctx.lineTo(0, xToPx("10mm"));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(xToPx("10mm"), canvasHeight);
    ctx.lineTo(0, canvasHeight);
    ctx.lineTo(0, canvasHeight - xToPx("10mm"));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvasWidth - xToPx("10mm"), 0);
    ctx.lineTo(canvasWidth, 0);
    ctx.lineTo(canvasWidth, xToPx("10mm"));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvasWidth - xToPx("10mm"), canvasHeight);
    ctx.lineTo(canvasWidth, canvasHeight);
    ctx.lineTo(canvasWidth, canvasHeight - xToPx("10mm"));
    ctx.stroke();

    //text1
    ctx.font = xToPx("7mm") + "px " + font;
    ctx.fillText(title1, (canvasWidth / 2) - (ctx.measureText(title1).width / 2), xToPx("12mm"));

    //text2
    ctx.font = xToPx("7mm") + "px " + font;
    ctx.fillText(title2, (canvasWidth / 2) - (ctx.measureText(title2).width / 2), xToPx("19mm"));

    //price
    let priceWidth = 0
    let dollarsWidth = 0
    let dollorsSize = xToPx("31mm")
    let centsWidth = 0
    let centsSize = xToPx("15.5mm")

    ctx.font = dollorsSize + "px " + font;
    dollarsWidth = ctx.measureText(dollars).width
    priceWidth += dollarsWidth
    ctx.font = centsSize + "px " + font;
    centsWidth = ctx.measureText(cents).width
    priceWidth += centsWidth

    let priceOffset = 0

    for (let i = 0; priceWidth > canvasWidth - 20; i++) {
        dollorsSize--
        centsSize--
        priceOffset++
        priceWidth = 0
        ctx.font = dollorsSize + "px " + font;
        dollarsWidth = ctx.measureText(dollars).width
        priceWidth += dollarsWidth
        ctx.font = centsSize + "px " + font;
        centsWidth = ctx.measureText(cents).width
        priceWidth += centsWidth
    }

    priceOffset = priceOffset / 2

    //dollor
    ctx.font = dollorsSize + "px " + font;
    ctx.fillText(dollars, (canvasWidth / 2) - (priceWidth / 2), xToPx("49mm") - priceOffset);

    //cent
    ctx.font = centsSize + "px " + font;
    ctx.fillText(cents, (canvasWidth / 2) + (priceWidth / 2) - centsWidth, xToPx("39mm") - priceOffset);

    //sale ends
    function saleEnds() {
        if (endDate !== "") {
            ctx.font = xToPx("4mm") + "px " + font;
            ctx.fillText("Sale Ends " + endDate, (canvasWidth / 2) - (ctx.measureText("Sale Ends " + endDate).width / 2), xToPx("64mm"));
        }
    }

    //sku
    if (document.getElementById("barcode"))
        document.getElementById("barcode").remove()

    if (sku !== "") {
        let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.id = "barcode"
        document.getElementById("barcodeDiv").append(svg)

        JsBarcode("#barcode", parseInt(sku), {
            width: 1,
            height: 6,
            fontSize: 12,
        });
        let xml = new XMLSerializer().serializeToString(svg);
        let base64 = 'data:image/svg+xml;base64,' + btoa(xml);
        let img = new Image();
        img.src = base64;

        img.onload = function() {
            ctx.drawImage(img, xToPx("54mm") - (img.width / 2), xToPx("69mm"))

            saleEnds()
        }
    } else {
        saleEnds()
    }

    //reg
    if (regPrice !== "") {
        ctx.font = xToPx("6mm") + "px " + font;
        ctx.fillText("Reg. $" + regPrice, (canvasWidth / 2) - (ctx.measureText("Reg. $" + regPrice).width / 2), xToPx("58mm"))
    }

    showPrintControls()
}

function create4x4FactTag() {
    if (document.getElementById("signCanvas"))
        document.getElementById("signCanvas").remove()

    const canvasWidth = xToPx("4in")
    const canvasHeight = xToPx("4in")
    const font = "Impact"
    const title1 = document.getElementById("title1").value
    const title2 = document.getElementById("title2").value
    const price = document.getElementById("price").value
    const dollars = price.split(".")[0].replace(/,/g, "")
    const cents = price.split(".")[1] === undefined ? "" : price.split(".")[1]
    const sku = document.getElementById("sku").value
    const regPrice = document.getElementById("regPrice").value

    let endDate = ""
    if (document.getElementById("endDate").value !== "") {
        const formDate = new Date(document.getElementById("endDate").value.replace("-", "/"));
        const month = formDate.toLocaleString('default', { month: 'short' });
        endDate = month + " " + formDate.getDate() + ", " + formDate.getFullYear()
    }

    let c = createHiDPICanvas(canvasWidth, canvasHeight, canvasRatio);
    c.id = "signCanvas";
    document.getElementById("canvasDiv").appendChild(c);

    const ctx = c.getContext("2d");

    ctx.strokeStyle = "black";
    ctx.lineWidth = defaultBorderWidth;
    ctx.textBaseline = "alphabetic";

    //border
    ctx.beginPath();
    ctx.moveTo(xToPx("10mm"), 0);
    ctx.lineTo(0, 0);
    ctx.lineTo(0, xToPx("10mm"));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(xToPx("10mm"), canvasHeight);
    ctx.lineTo(0, canvasHeight);
    ctx.lineTo(0, canvasHeight - xToPx("10mm"));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvasWidth - xToPx("10mm"), 0);
    ctx.lineTo(canvasWidth, 0);
    ctx.lineTo(canvasWidth, xToPx("10mm"));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvasWidth - xToPx("10mm"), canvasHeight);
    ctx.lineTo(canvasWidth, canvasHeight);
    ctx.lineTo(canvasWidth, canvasHeight - xToPx("10mm"));
    ctx.stroke();

    //text1
    ctx.font = xToPx("9mm") + "px " + font;
    ctx.fillText(title1, (canvasWidth / 2) - (ctx.measureText(title1).width / 2), xToPx("12mm"));

    //text2
    ctx.font = xToPx("9mm") + "px " + font;
    ctx.fillText(title2, (canvasWidth / 2) - (ctx.measureText(title2).width / 2), xToPx("21mm"));

    //price
    let priceWidth = 0
    let dollarsWidth = 0
    let dollorsSize = xToPx("30mm")
    let centsWidth = 0
    let centsSize = xToPx("15mm")

    ctx.font = dollorsSize + "px " + font;
    dollarsWidth = ctx.measureText(dollars).width
    priceWidth += dollarsWidth
    ctx.font = centsSize + "px " + font;
    centsWidth = ctx.measureText(cents).width
    priceWidth += centsWidth

    let priceOffset = 0

    for (let i = 0; priceWidth > canvasWidth - xToPx("1.25in"); i++) {
        dollorsSize--
        centsSize--
        priceOffset++
        priceWidth = 0
        ctx.font = dollorsSize + "px " + font;
        dollarsWidth = ctx.measureText(dollars).width
        priceWidth += dollarsWidth
        ctx.font = centsSize + "px " + font;
        centsWidth = ctx.measureText(cents).width
        priceWidth += centsWidth
    }

    priceOffset = priceOffset / 2

    //dollor
    ctx.font = dollorsSize + "px " + font;
    ctx.fillText(dollars, (canvasWidth / 2) - (priceWidth / 2), xToPx("55mm") - priceOffset);

    //cent
    ctx.font = centsSize + "px " + font;
    ctx.fillText(cents, (canvasWidth / 2) + (priceWidth / 2) - centsWidth, xToPx("45mm") - priceOffset);

    //sale ends
    function saleEnds() {
        if (endDate !== "") {
            ctx.font = xToPx("4mm") + "px " + font;
            ctx.fillText("Sale Ends " + endDate, xToPx("74mm") - (ctx.measureText("Sale Ends " + endDate).width / 2), xToPx("87mm"));
        }
    }

    //sku
    if (document.getElementById("barcode"))
        document.getElementById("barcode").remove()

    if (sku !== "") {
        let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.id = "barcode"
        document.getElementById("barcodeDiv").append(svg)

        JsBarcode("#barcode", parseInt(sku), {
            width: 1.4,
            height: 8,
            fontSize: 13,
        });
        let xml = new XMLSerializer().serializeToString(svg);
        let base64 = 'data:image/svg+xml;base64,' + btoa(xml);
        let img = new Image();
        img.src = base64;

        img.onload = function() {
            ctx.drawImage(img, xToPx("74mm") - (img.width / 2), xToPx("73mm"))

            saleEnds()
        }
    } else {
        saleEnds()
    }

    //reg
    if (regPrice !== "") {
        ctx.font = xToPx("4mm") + "px " + font;
        ctx.fillText("Reg. $" + regPrice, xToPx("10mm"), xToPx("87mm"));
    }

    showPrintControls()
}

function create4x2Binocular() {
    if (document.getElementById("signCanvas"))
        document.getElementById("signCanvas").remove()

    const canvasWidth = xToPx("4.5in")
    const canvasHeight = xToPx("2.70in")
    const font = "Impact"
    const title1 = document.getElementById("title1").value
    //const title2 = document.getElementById("title2").value
    const price = document.getElementById("price").value
    const dollars = price.split(".")[0].replace(/,/g, "")
    const cents = price.split(".")[1] === undefined ? "" : price.split(".")[1]
    const sku = document.getElementById("sku").value
    const regPrice = document.getElementById("regPrice").value

    let endDate = ""
    if (document.getElementById("endDate").value !== "") {
        const formDate = new Date(document.getElementById("endDate").value.replace("-", "/"));
        const month = formDate.toLocaleString('default', { month: 'short' });
        endDate = month + " " + formDate.getDate() + ", " + formDate.getFullYear()
    }

    let c = createHiDPICanvas(canvasWidth, canvasHeight, canvasRatio);
    c.id = "signCanvas";
    document.getElementById("canvasDiv").appendChild(c);

    const ctx = c.getContext("2d");

    ctx.strokeStyle = "black";
    ctx.lineWidth = defaultBorderWidth;
    ctx.textBaseline = "alphabetic";

    //border
    ctx.beginPath();
    ctx.moveTo(xToPx("10mm"), 0);
    ctx.lineTo(0, 0);
    ctx.lineTo(0, xToPx("10mm"));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(xToPx("10mm"), canvasHeight);
    ctx.lineTo(0, canvasHeight);
    ctx.lineTo(0, canvasHeight - xToPx("10mm"));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvasWidth - xToPx("10mm"), 0);
    ctx.lineTo(canvasWidth, 0);
    ctx.lineTo(canvasWidth, xToPx("10mm"));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvasWidth - xToPx("10mm"), canvasHeight);
    ctx.lineTo(canvasWidth, canvasHeight);
    ctx.lineTo(canvasWidth, canvasHeight - xToPx("10mm"));
    ctx.stroke();

    //text1
    ctx.font = xToPx("8mm") + "px " + font;
    ctx.fillText(title1, (canvasWidth / 2) - (ctx.measureText(title1).width / 2), xToPx("36mm"));

    //text2
    //ctx.font = xToPx("9mm") + "px " + font;
    //ctx.fillText(title2, (canvasWidth / 2) - (ctx.measureText(title2).width / 2), xToPx("21mm"));

    //price
    let priceWidth = 0
    let dollarsWidth = 0
    let dollorsSize = xToPx("24mm")
    let centsWidth = 0
    let centsSize = xToPx("12mm")

    ctx.font = dollorsSize + "px " + font;
    dollarsWidth = ctx.measureText(dollars).width
    priceWidth += dollarsWidth
    ctx.font = centsSize + "px " + font;
    centsWidth = ctx.measureText(cents).width
    priceWidth += centsWidth

    let priceOffset = -1

    for (let i = 0; priceWidth > canvasWidth - xToPx("65mm"); i++) {
        dollorsSize--
        centsSize--
        priceOffset++
        priceWidth = 0
        ctx.font = dollorsSize + "px " + font;
        dollarsWidth = ctx.measureText(dollars).width
        priceWidth += dollarsWidth
        ctx.font = centsSize + "px " + font;
        centsWidth = ctx.measureText(cents).width
        priceWidth += centsWidth
    }

    priceOffset = priceOffset / 2

    //dollor
    ctx.font = dollorsSize + "px " + font;
    ctx.fillText(dollars, xToPx("80mm") - (priceWidth / 2), xToPx("57mm") - priceOffset);

    //cent
    ctx.font = centsSize + "px " + font;
    ctx.fillText(cents, xToPx("80mm") + (priceWidth / 2) - centsWidth, xToPx("49mm") - priceOffset);

    //sale ends
    function saleEnds() {
        if (endDate !== "") {
            ctx.font = xToPx("3.5mm") + "px " + font;
            ctx.fillText("Sale Ends " + endDate, (canvasWidth / 2) - (ctx.measureText("Sale Ends " + endDate).width / 2), xToPx("62mm"));
        }
    }

    //sku
    if (document.getElementById("barcode"))
        document.getElementById("barcode").remove()

    if (sku !== "") {
        let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.id = "barcode"
        document.getElementById("barcodeDiv").append(svg)

        JsBarcode("#barcode", parseInt(sku), {
            width: 1,
            height: 8,
            margin: 0,
            textMargin: 0,
            fontSize: 13,
        });
        let xml = new XMLSerializer().serializeToString(svg);
        let base64 = 'data:image/svg+xml;base64,' + btoa(xml);
        let img = new Image();
        img.src = base64;

        img.onload = function() {
            ctx.drawImage(img, xToPx("20mm") - (img.width / 2), xToPx("60mm"))

            saleEnds()
        }
    } else {
        saleEnds()
    }

    //reg
    if (regPrice !== "") {
        ctx.font = xToPx("4mm") + "px " + font;
        ctx.fillText("Reg. $" + regPrice, xToPx("77mm"), xToPx("62mm"));
    }

    showPrintControls()
}

function create11x11SignInsert() {
    if (document.getElementById("signCanvas"))
        document.getElementById("signCanvas").remove()

    const o = xToPx("0.45in") //margin offset
    const canvasWidth = xToPx("10.2in")
    const canvasHeight = xToPx("7.6in")
    const font = "Impact"
    const title1 = document.getElementById("title1").value
    const title2 = document.getElementById("title2").value
    const price = document.getElementById("price").value
    const dollars = price.split(".")[0].replace(/,/g, "")
    const cents = price.split(".")[1] === undefined ? "" : price.split(".")[1]
    const sku = document.getElementById("sku").value
    const regPrice = document.getElementById("regPrice").value

    let endDate = ""
    if (document.getElementById("endDate").value !== "") {
        const formDate = new Date(document.getElementById("endDate").value.replace("-", "/"));
        const month = formDate.toLocaleString('default', { month: 'short' });
        endDate = month + " " + formDate.getDate() + ", " + formDate.getFullYear()
    }

    let c = createHiDPICanvas(canvasWidth, canvasHeight, canvasRatio);
    c.id = "signCanvas";
    document.getElementById("canvasDiv").appendChild(c);

    const ctx = c.getContext("2d");

    ctx.textBaseline = "alphabetic";

    //text1
    ctx.font = xToPx("13mm") + "px " + font;
    ctx.fillText(title1, (canvasWidth / 2) - (ctx.measureText(title1).width / 2), xToPx("77mm") - o);

    //text2
    ctx.font = xToPx("13mm") + "px " + font;
    ctx.fillText(title2, (canvasWidth / 2) - (ctx.measureText(title2).width / 2), xToPx("90mm") - o);

    //price
    let priceWidth = 0
    let dollarsWidth = 0
    let dollorsSize = xToPx("80mm")
    let centsWidth = 0
    let centsSize = xToPx("40mm")

    ctx.font = dollorsSize + "px " + font;
    dollarsWidth = ctx.measureText(dollars).width
    priceWidth += dollarsWidth
    ctx.font = centsSize + "px " + font;
    centsWidth = ctx.measureText(cents).width
    priceWidth += centsWidth

    let priceOffset = 0

    for (let i = 0; priceWidth > canvasWidth - xToPx("4in"); i++) {
        dollorsSize--
        centsSize--
        priceOffset++
        priceWidth = 0
        ctx.font = dollorsSize + "px " + font;
        dollarsWidth = ctx.measureText(dollars).width
        priceWidth += dollarsWidth
        ctx.font = centsSize + "px " + font;
        centsWidth = ctx.measureText(cents).width
        priceWidth += centsWidth
    }

    priceOffset = priceOffset / 2

    //dollor
    ctx.font = dollorsSize + "px " + font;
    ctx.fillText(dollars, (canvasWidth / 2) - (priceWidth / 2), xToPx("162mm") - o
        - priceOffset);

    //cent
    ctx.font = centsSize + "px " + font;
    ctx.fillText(cents, (canvasWidth / 2) + (priceWidth / 2) - centsWidth, xToPx("136mm") - o - priceOffset);;

    //sale ends
    function saleEnds() {
        if (endDate !== "") {
            ctx.font = xToPx("6mm") + "px " + font;
            ctx.fillText("Sale Ends " + endDate, (canvasWidth / 2) - (ctx.measureText("Sale Ends " + endDate).width / 2), xToPx("184mm") - o);
        }
    }

    //sku
    if (document.getElementById("barcode"))
        document.getElementById("barcode").remove()

    if (sku !== "") {
        let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.id = "barcode"
        document.getElementById("barcodeDiv").append(svg)

        JsBarcode("#barcode", parseInt(sku), {
            width: 1.4,
            height: 8,
            fontSize: 13,
        });
        let xml = new XMLSerializer().serializeToString(svg);
        let base64 = 'data:image/svg+xml;base64,' + btoa(xml);
        let img = new Image();
        img.src = base64;

        img.onload = function() {
            ctx.drawImage(img, xToPx("205mm") - (img.width / 2), xToPx("179mm") - o)

            saleEnds()
        }
    } else {
        saleEnds()
    }

    //reg
    if (regPrice !== "") {
        ctx.font = xToPx("15mm") + "px " + font;
        ctx.fillText("Reg. $" + regPrice, (canvasWidth / 2) - (ctx.measureText("Reg. $" + regPrice).width / 2), xToPx("177mm") - o);
    }

    showPrintControls()
}

function create17x17SignInsert() {
    if (document.getElementById("signCanvas"))
        document.getElementById("signCanvas").remove()

    const o = xToPx("0.35in") //margin offset
    const canvasWidth = xToPx("16.2in")
    const canvasHeight = xToPx("10.2in")
    const font = "Impact"
    const title1 = document.getElementById("title1").value
    const title2 = document.getElementById("title2").value
    const price = document.getElementById("price").value
    const dollars = price.split(".")[0].replace(/,/g, "")
    const cents = price.split(".")[1] === undefined ? "" : price.split(".")[1]
    const sku = document.getElementById("sku").value
    const regPrice = document.getElementById("regPrice").value

    let endDate = ""
    if (document.getElementById("endDate").value !== "") {
        const formDate = new Date(document.getElementById("endDate").value.replace("-", "/"));
        const month = formDate.toLocaleString('default', { month: 'short' });
        endDate = month + " " + formDate.getDate() + ", " + formDate.getFullYear()
    }

    let c = createHiDPICanvas(canvasWidth, canvasHeight, canvasRatio);
    c.id = "signCanvas";
    document.getElementById("canvasDiv").appendChild(c);

    const ctx = c.getContext("2d");

    ctx.textBaseline = "alphabetic";

    //text1
    ctx.font = xToPx("22mm") + "px " + font;
    ctx.fillText(title1, (canvasWidth / 2) - (ctx.measureText(title1).width / 2), xToPx("64mm") - o);

    //text2
    ctx.font = xToPx("22mm") + "px " + font;
    ctx.fillText(title2, (canvasWidth / 2) - (ctx.measureText(title2).width / 2), xToPx("86mm") - o);

    //price
    let priceWidth = 0
    let dollarsWidth = 0
    let dollorsSize = xToPx("126mm")
    let centsWidth = 0
    let centsSize = xToPx("63mm")

    ctx.font = dollorsSize + "px " + font;
    dollarsWidth = ctx.measureText(dollars).width
    priceWidth += dollarsWidth
    ctx.font = centsSize + "px " + font;
    centsWidth = ctx.measureText(cents).width
    priceWidth += centsWidth

    let priceOffset = 0

    for (let i = 0; priceWidth > canvasWidth - xToPx("6in"); i++) {
        dollorsSize--
        centsSize--
        priceOffset++
        priceWidth = 0
        ctx.font = dollorsSize + "px " + font;
        dollarsWidth = ctx.measureText(dollars).width
        priceWidth += dollarsWidth
        ctx.font = centsSize + "px " + font;
        centsWidth = ctx.measureText(cents).width
        priceWidth += centsWidth
    }

    priceOffset = priceOffset / 2

    //dollor
    ctx.font = dollorsSize + "px " + font;
    ctx.fillText(dollars, (canvasWidth / 2) - (priceWidth / 2), xToPx("198mm") - o - priceOffset);

    //cent
    ctx.font = centsSize + "px " + font;
    ctx.fillText(cents, (canvasWidth / 2) + (priceWidth / 2) - centsWidth, xToPx("154mm") - o - priceOffset);

    //sale ends
    function saleEnds() {
        if (endDate !== "") {
            ctx.font = xToPx("8mm") + "px " + font;
            ctx.fillText("Sale Ends " + endDate, (canvasWidth / 2) - (ctx.measureText("Sale Ends " + endDate).width / 2), xToPx("232mm") - o);
        }
    }

    //sku
    if (document.getElementById("barcode"))
        document.getElementById("barcode").remove()

    if (sku !== "") {
        let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.id = "barcode"
        document.getElementById("barcodeDiv").append(svg)

        JsBarcode("#barcode", parseInt(sku), {
            width: 2,
            height: 14,
            margin: 0,
            textMargin: 0,
            fontSize: 20,
        });
        let xml = new XMLSerializer().serializeToString(svg);
        let base64 = 'data:image/svg+xml;base64,' + btoa(xml);
        let img = new Image();
        img.src = base64;

        img.onload = function() {
            ctx.drawImage(img, xToPx("315mm") - (img.width / 2), xToPx("224mm") - o)

            saleEnds()
        }
    } else {
        saleEnds()
    }

    //reg
    if (regPrice !== "") {
        ctx.font = xToPx("24mm") + "px " + font;
        ctx.fillText("Reg. $" + regPrice, (canvasWidth / 2) - (ctx.measureText("Reg. $" + regPrice).width / 2), xToPx("221mm") - o);
    }

    showPrintControls()
}

let PIXEL_RATIO = (function() {
    var ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
})();

let createHiDPICanvas = function(w, h, ratio) {
    if (!ratio) { ratio = PIXEL_RATIO; }
    var can = document.createElement("canvas");
    can.width = w * ratio;
    can.height = h * ratio;
    can.style.width = w + "px";
    can.style.height = h + "px";
    can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
    return can;
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

export { create2x4HangTag, create3x5HangTag, create4x4FactTag, create4x2Binocular, create11x11SignInsert, create17x17SignInsert };