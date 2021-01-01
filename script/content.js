const createMyElem = () => {
    const myElemStr = '' +
        + '  <div class="a-box a-last">'
        + '    <div class="card" style="background-color:#fafafa;">'
        + '      <div class="card-header card-header-small card-header-amazonish" style="background-color:#37475A;">'
        + '        あまぼっとくん利益計算'
        + '      </div>'
        + '      <div class="card-body">'
        + '        <div class="row">'
        + '          <div class="col-3 text-center">'
        + '            <img class="img-thumbnail rounded" id="mythumbnail" style="width: 180%; max-width: 170px;" src="" alt="...">'
        + '          </div>'
        + '          <div class="col-9">'
        + '            <div class="card-text card-text-small" id="myasin"></div>'
        + '            <div class="card-text card-text-small" id="itemsize">-</div>'
        + '            <div class="card-text card-text-small" id="itemweight">-</div>'
        + '          </div>'
        + '          <div style="padding-top:5px; padding-left: 15px;">'
        + '            <a class="btn btn-primary btn-sm" id="showcalcbtn" style="color:#fff;">手数料を計算する</a>'
        + '          </div>'
        + '        </div>'
        + '      </div>'
        + '    </div>'
        + ''
        + '    <div id="calculator-panel" style="display:none;">'
        + '      <div class="card">'
        + '        <div class="card-body">'
        + '          <div class="form-group row">'
        + '            <label class="col-6 col-form-label col-form-label-sm text-right form-text-small">販売価格</label>'
        + '            <div class="col-6">'
        + '              <input class="form-control form-control-sm text-right" id="mybuybox" placeholder="">'
        + '            </div>'
        + '          </div>'
        + '          <div class="form-group row">'
        + '            <label class="col-6 col-form-label col-form-label-sm text-right form-text-small">販売手数料</label>'
        + '            <div class="col-6">'
        + '              <div class="text-right" id="amazonfeeamount">-</div>'
        + '            </div>'
        + '          </div>'
        + '          <div id="fbafeerow" class="form-group row">'
        + '            <label class="col-6 col-form-label col-form-label-sm text-right form-text-small">FBA手数料</label>'
        + '            <div class="col-6">'
        + '              <div class="text-right" id="fbafeeamount">-</div>'
        + '            </div>'
        + '          </div>'
        + '          <div class="form-group row">'
        + '            <label class="col-6 col-form-label col-form-label-sm text-right form-text-small">仕入値</label>'
        + '            <div class="col-6">'
        + '              <input type="" class="form-control form-control-sm text-right" id="purchaseprice" placeholder="" value="0">'
        + '            </div>'
        + '          </div>'
        + '          <div class="form-group row">'
        + '             <span class="a-dropdown-container select-include-fbafee">'
        + '                 <select tabindex="0" id="includefbafee" class="a-native-dropdown">'
        + '                     <option value=0 selected="">FBAを利用する</option>'
        + '                     <option value=1>FBAを利用しない</option>'
        + '                 </select>'
        + '             </span>'
        + '          </div>'
        + '          <div class="form-group row border-top">'
        + '            <label class="col-6 col-form-label profit-result text-right form-text-small">利益(率)</label>'
        + '            <div class="col-6">'
        + '              <div class="profit-result text-right" id="myprofit"></div>'
        + '            </div>'
        + '          </div>'
        + '        </div>'
        + '        <input type="" id="myfeerate" value="0" style="display: none;">'        
        + '        <input type="submit" value="dummy" style="display:none;">'
        + '        <a class="card-text card-text-small card-text-myprofile" href="https://twitter.com/kaonaga9" style="color:gray;">kaonaga9</a> '
        + '      </div>'
        + '    </div>'
        + '  </div><p></p>'
    return myElemStr
}

const isItemPage = () => {
    const currentUrl = location.href
    if (currentUrl.indexOf("/dp/") > 0) {
        return true
    }
    if (currentUrl.indexOf("/gp/product/") > 0) {
        return true
    }
    return false
}

const findParentElem = () => {
    // return document.getElementById("rightCol")
    return document.getElementsByClassName("a-box-group")[0]
}

const findASIN = () => {
    const url = location.href
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

const setASIN = (asin) => {
    document.getElementById("myasin").innerText = asin
}

const findBuybox = () => {
    const convertToNumber = (priceStr) => {
        const price = priceStr.replace(/[^0-9]/g, '')
        return Number(price)
    }
    let priceStr
    try {
        priceStr = document.querySelector('#price_inside_buybox').innerText
        return convertToNumber(priceStr)
    } catch {
        try {
            priceStr = document.querySelector('#priceblock_ourprice').innerText
            return convertToNumber(priceStr)
        } catch {
            return 0
        }
    }
}

const setBuybox = (buybox) => {
    document.getElementById("mybuybox").value = buybox
}

const setThumnail = () => {
    const ICON_SRC = "https://user-images.githubusercontent.com/56163213/103138452-1c9f8100-4716-11eb-9207-31f9fc1ddc6d.png"
    document.getElementById("mythumbnail").setAttribute("src", ICON_SRC)
}

const setAmazonFee = (feeAmout) => {
    document.getElementById("amazonfeeamount").innerText = Math.floor(feeAmout)
}

const setProfit = (amt, rate) => {
    document.getElementById("myprofit").innerHTML = `¥ ${amt}<br/> (${rate}%)`
}

const calculateProfit = () => {
    const buybox = Number(document.getElementById("mybuybox").value)
    const feerate = Number(document.getElementById("myfeerate").value)
    const amazonfee = Number(buybox * feerate)
    const fbafee = Number(document.getElementById("fbafeeamount").innerText)
    const purchaseprice = Number(document.getElementById("purchaseprice").value)
    const includefbafee = document.getElementById("includefbafee").value
    if (includefbafee == "0") {
        // FBA手数料を含む
        const profitAmt = Math.floor(buybox - (amazonfee + fbafee + purchaseprice))
        const profitRate = Math.floor(profitAmt / buybox * 100) // %表示
        setAmazonFee(amazonfee)
        setProfit(profitAmt, profitRate)
    }
    if (includefbafee == "1") {
        // FBA手数料を含まない
        const profitAmt = Math.floor(buybox - (amazonfee + purchaseprice))
        const profitRate = Math.floor(profitAmt / buybox * 100) // %表示
        setAmazonFee(amazonfee)
        setProfit(profitAmt, profitRate)
    }
}

const changeFontColorFBA = () => {
    let includefbafee = document.getElementById("includefbafee").value
    if (includefbafee == "1") {
        // FBA手数料を含まない→グレー
        document.getElementById("fbafeerow").style.color = "#999999"
        return
    }
    document.getElementById("fbafeerow").style.color = "#0F1111"
    return 
    
}

const fetchProductInfo = () => {
    const BASE_URL = "https://amacalc.herokuapp.com/calculate?asin="
    // const BASE_URL = "http://localhost:5000/calculate?asin="
    const asin = document.getElementById("myasin").innerText
    fetch(BASE_URL + asin)
        .then(response => response.json())
        .then(data => {
            if (data.channel === "SC") {
                const floorLength = (lengthStr) => {
                    const floatLength = parseFloat(lengthStr)
                    return Math.floor(floatLength)
                }
                // 商品サムネイルをセット
                const itemImageUrl = data.imageUrl
                document.getElementById("mythumbnail").setAttribute("src", itemImageUrl)
                // サイズ情報をセット
                const height = data.height
                const width = data.width
                const length = data.length
                const weight = data.weight
                const itemSize = `${floorLength(length)} x ${floorLength(width)} x ${floorLength(height)} cm`
                const itemWeight = `${weight} kg`
                document.getElementById("itemsize").innerText = itemSize
                document.getElementById("itemweight").innerText = itemWeight
                // amazon手数料をセット
                const feeRate = data.feerate
                const feeAmount = Number(document.getElementById("mybuybox").value) * Number(feeRate)
                document.getElementById("myfeerate").value = feeRate
                document.getElementById("amazonfeeamount").innerText = Math.floor(feeAmount)
                // FBA手数料をセット
                const fbaFeeAmt = data.afnFees.pickAndPackFee
                const storageFeeAmt = data.afnFees.storageFee
                const totalFbaFeeAmount = Number(fbaFeeAmt) + Number(storageFeeAmt)
                document.getElementById("fbafeeamount").innerText = Math.floor(totalFbaFeeAmount)
            }
            if (data.channel === "MWS") {
                // 商品サムネイルをセット
                const itemImageUrl = document.getElementById("imgTagWrapperId").getElementsByTagName("img")[0].getAttribute("src")
                document.getElementById("mythumbnail").setAttribute("src", itemImageUrl)
                // サイズ情報をセット
                // const height = data.height
                // const width = data.width
                // const length = data.length
                // const weight = data.weight
                // const itemSize = data.obj.shippingOperationFeeDto.shippingKbn.description
                // const itemWeight = `${weight} kg`
                // document.getElementById("itemsize").innerText = itemSize
                // document.getElementById("itemweight").innerText = itemWeight
                // amazon手数料をセット
                const feeRate = data.feeRate
                const feeAmount = Number(document.getElementById("mybuybox").value) * Number(feeRate)
                document.getElementById("myfeerate").value = feeRate
                document.getElementById("amazonfeeamount").innerText = Math.floor(feeAmount)
                // FBA手数料をセット
                const fbaFeeAmt = data.pickAndPackFee
                const storageFeeAmt = data.monthlyStorageFee
                const totalFbaFeeAmount = Number(fbaFeeAmt) + Number(storageFeeAmt)
                document.getElementById("fbafeeamount").innerText = Math.floor(totalFbaFeeAmount)
            }
            calculateProfit()
        })

}

const addEventListenerClickButton = () => {
    const btn = document.getElementById("showcalcbtn")
    btn.addEventListener('click', function () {
        // １．パネルの開閉
        const calcPanel = document.getElementById("calculator-panel")
        if (calcPanel.style.display == "none") {
            calcPanel.style.display = ""
        } else {
            calcPanel.style.display = "none"
        }
        // ２．商品情報の取得
        if (document.getElementById("itemsize").innerText == "-") {
            fetchProductInfo()
        }
    }, false);
}

const addEventListenerChangePrice = () => {
    const buyboxElem = document.getElementById("mybuybox")
    buyboxElem.addEventListener('change', (event) => {
        calculateProfit()
    });
    const purchasepriceElem = document.getElementById("purchaseprice")
    purchasepriceElem.addEventListener('change', (event) => {
        calculateProfit()
    });
    const includeFbafeeElem = document.getElementById("includefbafee")
    includeFbafeeElem.addEventListener('change', (event) => {
        calculateProfit()
        changeFontColorFBA()
    });
}


// メイン処理
if (isItemPage()) {
    // 親要素を見つける
    const rightColElem = findParentElem()
    if (rightColElem) {
        // 自前要素を追加する
        const myElem = createMyElem()
        rightColElem.insertAdjacentHTML("afterbegin", myElem)
        // ASINなどをセットする
        setASIN(findASIN())
        setBuybox(findBuybox())
        setThumnail()

        // イベントリスナー
        addEventListenerClickButton()
        addEventListenerChangePrice()

    }
}