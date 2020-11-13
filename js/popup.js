$(function () {
    document.getElementById("valid-asin").style.display = "none";
    document.getElementById("valid-url").style.display = "none";
    document.getElementById("calcpanel").style.display = "none";
    document.getElementById("itempanel").style.display = "none"
    document.getElementById("btn-url").addEventListener("click", event => {
        searchURL();
    })
    document.getElementById("btn-asin").addEventListener("click", event => {
        searchASIN();
    })
    document.getElementById("btn-calculate").addEventListener("click", event => {
        calculate();
    })
});

function searchASIN() {
    const asin = document.getElementById("asin").value;
    if (validateASIN(asin)) {
        invokeGetRequest(asin);
    } else {
        document.getElementById("valid-asin").style.display = ""; //警告を表示
    }
}
function searchURL() {
    const url = document.getElementById("itemurl").value;
    if (checkAmazonURL(url)) {
        const asin = findASIN(url);
        invokeGetRequest(asin);
    } else {
        document.getElementById("valid-url").style.display = ""; //警告を表示
    }
}
function findASIN(url) {
    if (url.indexOf("/dp/") > 0) {
        const index = url.indexOf("/dp/") + 4;
        return url.slice(index, index + 10);
    }
    if (url.indexOf("/gp/product/") > 0) {
        const index = url.indexOf("/gp/product/") + 12;
        return url.slice(index, index + 10);
    }
    return "";
}
function invokeGetRequest(asin) {
    const URL_CALC = "https://amacalc.herokuapp.com/calculate?asin=" + asin;
    const URL_BUYBOX = "https://amacalc.herokuapp.com/buybox?asin=" + asin;
    // 手数料情報の取得
    fetch(URL_CALC)
        .then(handleErrors)
        .then(res => res.json())
        .then(data => {
            const productName = data.title
            const fbaFeeAmt = data.afnFees.pickAndPackFee;
            const height = data.height;
            const width = data.width;
            const length = data.length;
            const weight = data.weight;
            const storageFeeAmt = data.afnFees.storageFee;
            const itemSize = length + "×" + width + "×" + height + " cm";
            const itemWeight = weight + " kg";

            document.getElementById("itemname").innerText = productName;
            document.getElementById("itemname").href = "https://amazon.jp/dp/" + asin;
            document.getElementById("itemsize").innerText = itemSize;
            document.getElementById("itemweight").innerText = itemWeight;
            document.getElementById("itemasin").innerText = asin;
            document.getElementById("fbause").innerText = "FBA手数料 " + fbaFeeAmt + "円\r在庫保管手数料 " + storageFeeAmt + "円";

            sessionStorage.setItem('feerate', data.feerate);
            sessionStorage.setItem('fbafee', fbaFeeAmt);
            sessionStorage.setItem('storagefee', storageFeeAmt);

            document.getElementById("calcpanel").style.display = "";
            document.getElementById("itempanel").style.display = "";
            document.getElementById("searchpanel").style.display = "none";
            document.getElementById("footer").style.display = "none";

            function checkWeight(w) {
                if (w === 0) {
                    return true;
                }
                return false;
            }

            if (checkWeight(weight)) {
                alert("サイズ情報を取得できませんでした。\nFBA手数料が正しく反映されませんのでご注意ください");
                document.getElementById("itemsize").style.color = "red";
                document.getElementById("itemweight").style.color = "red";
            }
        })
    // カート価格の取得
    fetch(URL_BUYBOX)
        .then(handleErrors)
        .then(res => res.json())
        .then(data => {
            if (data.status === 'error') {
                // エラーは何もしない
            } else {
                const buybox = data.price;
                document.getElementById("sellprice").value = buybox;
            }
        })
}
function handleErrors(res) {
    if (res.ok) {
        return res;
    }
    alert("Error occured in getting Item properties")
}
function calculate() {
    const sellprice = Number(document.getElementById("sellprice").value);
    const shipcost = Number(document.getElementById("ship").value);
    const buycost = Number(document.getElementById("buyprice").value);
    const feerate_percent = Number(sessionStorage.getItem('feerate') * 100);
    const fbafeeamt = Number(sessionStorage.getItem('fbafee'));
    const storageFeeAmt = Number(sessionStorage.getItem('storagefee'));
    const amznfeeamt = sellprice * feerate_percent / 100;
    let profitamt = sellprice - amznfeeamt - shipcost - buycost;
    if (document.getElementById("boolfba").checked) {
        profitamt -= fbafeeamt;
        profitamt -= storageFeeAmt;
    }
    const roundedprofitamt = Math.round(profitamt); //整数で四捨五入
    const profitrate = profitamt / sellprice * 100; //%表示
    const roundedprofitrate = Math.round(profitrate * 10) / 10; //小数点1桁で四捨五入
    document.getElementById("profit").innerText = roundedprofitamt + '円' + '(' + roundedprofitrate + '%)';
}
function validateASIN(asin) {
    if (asin.length != 10 || isalnum(asin) == false) {
        return false;
    }
    return true;
}
function isalnum(str) {
    str = (str == null) ? "" : str;
    if (str.match(/^[A-Za-z0-9]*$/)) {
        return true;
    } else {
        return false;
    }
}
function checkAmazonURL(url) {
    if (url.indexOf("amazon.jp") > 0) {
        return true;
    }
    if (url.indexOf("amazon.co.jp") > 0) {
        return true;
    }
    return false;
}