chrome.tabs.getSelected(null, function (tab) {
    const CURRENT_URL = tab.url;
    if (isAmazonUrl(CURRENT_URL) && isItemPage(CURRENT_URL)) {
        const asin = findASIN(CURRENT_URL);
        document.getElementById("asin").value = asin;
        document.getElementById("btn-clear").style.display = "none"; //クリアボタンを非表示
        searchASIN();
    }
})
function isAmazonUrl(url) {
    if (url.indexOf("www.amazon.co.jp") > 0) {
        return true;
    }
    if (url.indexOf("amazon.jp") > 0) {
        return true;
    }
    return false;
}
function isItemPage(url) {
    if (url.indexOf("/dp/") > 0) {
        return true;
    }
    if (url.indexOf("/gp/product/") > 0) {
        return true;
    }
    return false;
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