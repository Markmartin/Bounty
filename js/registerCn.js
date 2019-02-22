$(document).ready(function() {
    var captcha = null;
    var inviterCode = getUrlParam('inviterCode')
    var email
    var pwd
    var ethAddress
    $("#register").on("click", function() {
        email = $("#email").val()
        pwd = $("#pwd").val()
        var pwdAgain = $("#pwdAgain").val()
        ethAddress = $("#eth").val()
        if (email == '') {
            alert('Please enter your email address')
            return;
        }
        if (validateEmail(email) == false) {
            alert('Please enter a correct email address')
            return;
        }
        if (pwd == '') {
            alert('Password cannot be blank')
            return;
        }
        if (pwd.length < 6) {
            alert('Password should be no less than 6 characters')
            return;
        }
        if (pwdAgain == '') {
            alert('Please enter your password again ')
            return;
        }
        if (pwd != pwdAgain) {
            alert('Passwords do not match')
            return;
        }
        if (ethAddress == '') {
            alert('Please enter your ETH wallet address')
            return;
        }
        if (validateEth(ethAddress) == false) {
            alert('Please fill in the correct personal ETH wallet address')
            return;
        }

        // googleHttpRequest(successHandle, errorHandle)
        httpRequest('POST', 'register', { mailAddr: email, pwd: pwd, ethAddr: ethAddress, code: (inviterCode == null) ? '' : inviterCode }, registerHandle)
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
        var registerParam = {
            mailAddr: email,
            pwd: pwd,
            ethAddr: ethAddress,
            code: (inviterCode == null) ? '' : inviterCode
        }
        httpRequest('POST', 'register', registerParam, registerHandle)
    }

    function registerHandle(data) {
        if (data.code == 200) {
            localStorage.setItem('privateCode', data.data.privateCode)
            localStorage.setItem('email', email)
            $(location).attr('href', 'mailBoxCn.html')
        } else {
            alert(data.msg)
        }
    }

    $("#login").on("click", function() {
        $(location).attr('href', 'indexCn.html');
    })


})

$(window).load(function() {
    if (IsPC() == false) {
        alert('Please complete the task at the PC side')
    }
})