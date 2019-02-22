$(document).ready(
    function() {
        var captcha = null;
        var email;
        var pwd;
        var privateCode = getUrlParam('privateCode')
        if (privateCode != '' && privateCode != null) {
            var param = {
                privateCode: privateCode
            }
            httpRequest('POST', 'activate', param, activateHandle)
        }

        function activateHandle(data) {
            if (data.code == 200) {
                alert('Account activated, please login ');
            } else {
                alert('Account activation failed ' + data.msg)
            }
        }

        var autoLogin = localStorage.getItem('autoLogin')
        if (autoLogin == 'true') {
            $("#rememberBox").attr("checked", true)
            var userInfo = JSON.parse(localStorage.getItem('userInfo'));
            //userInfo 空为null
            if (userInfo != null) {
                $("#email").val(userInfo.email)
                $("#pwd").val(userInfo.pwd)
            }
        }

        $("#loginBtn").on("click", function() {
            email = $("#email").val();
            pwd = $("#pwd").val();
            if (email == '') {
                alert('Please enter your email address')
                return;
            }
            if (validateEmail(email) == false) {
                alert('Please enter a correct email address ')
                return;
            }
            if (pwd == '') {
                alert('Password cannot be blank')
                return;
            }

            // googleHttpRequest(successHandle, errorHandle)
            httpRequest('POST', 'login', { mailAddr: email, pwd: pwd }, loginHandle);

        })

        function successHandle() {
            if (captcha == null) {
                captcha = grecaptcha.render('robotVerification', {
                    'sitekey': '6LdlSlkUAAAAAC0MWGMOv36j1Kjsvuu2mnderq7S',
                    'callback': robotVerificationCallBack,
                    'theme': 'dark'
                });
            } else {
                grecaptcha.reset(captcha);
            }
        }

        function errorHandle() {
            alert('load grecaptcha failed,please opne vpn to connect')
        }

        function robotVerificationCallBack(response) {
            var loginParam = {
                mailAddr: email,
                pwd: pwd,
            }
            httpRequest('POST', 'login', loginParam, loginHandle);
        }

        function loginHandle(data) {
            if (data.code == 200) {
                var isChecked = $("#rememberBox").is(":checked")
                if (isChecked == true) {
                    var userInfo = {
                        'email': data.data.mailAddr,
                        'pwd': data.data.pwd
                    }
                    var userInfoStr = JSON.stringify(userInfo);
                    localStorage.setItem('userInfo', userInfoStr);
                }
                localStorage.setItem('privateCode', data.data.privateCode)
                $(location).attr('href', 'taskPointKn.html')
            } else {
                alert(data.msg)
            }
        }

        $("#register").on("click", function() {
            $(location).attr('href', 'registerKn.html')
        })

        $("#rememberBox").change(function() {
            var isChecked = $("#rememberBox").is(":checked")
            if (isChecked == true)
                localStorage.setItem('autoLogin', 'true')
            else
                localStorage.setItem('autoLogin', 'false')
        })

        $("#englishLan").on('click', function() {
            $(location).attr('href', 'index.html')
        })
        $("#chineseLan").on('click', function() {
            $(location).attr('href', 'indexCn.html')
        })

    }
)

$(window).load(function() {
    if (IsPC() == false) {
        alert('Please complete the task at the PC side')
    }
})