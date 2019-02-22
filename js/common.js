const baseUrl = 'https://api.iotchain.io/'
// const baseUrl = 'http://127.0.0.1:3000/'
var loadingCount = 0

function httpRequest(requestType, method, param, successHandle, errHandle) {
    $.ajax({
        type: requestType,
        url: baseUrl + method,
        data: param,
        //timeout: 30000,
        async: true,
        beforeSend: loadingAnimation,
        success: successHandle,
        error: (errHandle == undefined) ? errorHandle : errHandle,
        complete: completeHandle
    });
}


function googleHttpRequest(successHandle, errHandle) {
   $.ajax({
        type: 'GET',
        url: 'https://www.google.com/recaptcha/api.js',
        dataType: 'script',
        timeout: 3000,
        async: true,
        beforeSend: loadingAnimation,
        success: successHandle,
        error: (errHandle == undefined) ? errorHandle : errHandle,
        complete: completeHandle
    });
}

function loadingAnimation() {
    loadingCount = loadingCount + 1
    if ($(".loader").css('visibility') == 'hidden') {
        $(".loader").css('visibility', 'visible')
    }
}

function errorHandle(XMLHttpRequest, textStatus, errorThrown) {
    alert('Network is busy…' + textStatus)
}

function completeHandle(XMLHttpRequest, textStatus) {
    loadingCount = loadingCount - 1
    if (loadingCount == 0) {
        if ($(".loader").css('visibility') == 'visible') {
            $(".loader").css('visibility', 'hidden')
        }
    }
}

function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}

function getUrlParam(key) {
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}

function validateEmail(email) {
    var mailRegex = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
    if (mailRegex.test(email)) {
        return true;
    } else {
        return false;
    }
}

function validateEth(ethAddr) {
    if (ethAddr.length != 42) {
        return false;
    }
    if (ethAddr.substring(0, 2) != '0x' && ethAddr.substring(0, 2) != '0X') {
        return false;
    }
    return true;
}

function thousandBitSeparator(num) {
    return num && (num
        .toString().indexOf('.') != -1 ? num.toString().replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
            return $1 + ",";
        }) : num.toString().replace(/(\d)(?=(\d{3}))/g, function($0, $1) {
            return $1 + ",";
        }));
}

function gotoEmail(mailAddr) {
    var hash = {
        'qq.com': 'https://mail.qq.com',
        'gmail.com': 'https://mail.google.com',
        'sina.com': 'https://mail.sina.com.cn',
        '163.com': 'https://mail.163.com',
        '126.com': 'https://mail.126.com',
        'yeah.net': 'https://www.yeah.net/',
        'sohu.com': 'https://mail.sohu.com/',
        'tom.com': 'https://mail.tom.com/',
        'sogou.com': 'https://mail.sogou.com/',
        '139.com': 'https://mail.10086.cn/',
        'hotmail.com': 'https://www.hotmail.com',
        'live.com': 'http://login.live.com/',
        'live.cn': 'http://login.live.cn/',
        'live.com.cn': 'http://login.live.com.cn',
        '189.com': 'http://webmail16.189.cn/webmail/',
        'yahoo.com.cn': 'http://mail.cn.yahoo.com/',
        'yahoo.cn': 'http://mail.cn.yahoo.com/',
        'eyou.com': 'http://www.eyou.com/',
        '21cn.com': 'http://mail.21cn.com/',
        '188.com': 'http://www.188.com/',
        'foxmail.com': 'http://www.foxmail.com',
        'outlook.com': 'http://www.outlook.com'
    }
    var key = mailAddr.split('@')[1];
    return hash[key]
}