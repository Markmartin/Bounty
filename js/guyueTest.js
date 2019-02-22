$(document).ready(
    // function() {
    //     $('#fbLogin').click(function() {
    // FB.login(function(response) {
    //     // Handle the response object, like in statusChangeCallback() in our demo
    //     // code.
    //     if (response.status == 'connected') {
    //         FB.api('/me', function(response) {
    //             console.log(JSON.stringify(response));
    //         });
    //     }
    // }, { scope: 'email' });
    // FB.login(function(response) {
    //     FB.api('/me', { locale: 'en_US', fields: 'name, email' }, function(response) {
    //         console.log('Good to see you, ' + response.name + '.');
    //     });
    // }, { scope: 'email' });

    // var privateCode = localStorage.getItem('privateCode')
    // var infoParam = {
    //     privateCode: privateCode
    // }
    // httpRequest('POST', 'getUserTaskInfo', infoParam, getUserTaskInfo)


    // function getUserTaskInfo(data) {        
    //     if (data.code == 200) {            
    //         console.log('success');      
    //     } else {            
    //         alert(data.msg)                    
    //     }    
    // }
    //     })

    //     $("#copyFacebookBtn").click(function() {
    //         console.log('点击了啊')
    //     })

    //     $("#googleLogin").click(function() {
    //         grecaptcha.render('googleVerfify', {
    //             'sitekey': '6LdlSlkUAAAAAC0MWGMOv36j1Kjsvuu2mnderq7S',
    //             'callback': verifyCallback,
    //             'theme': 'dark'
    //         });
    //     })



    //     $.ajaxSetup({
    //         cache: true
    //     });
    //     $.getScript('https://connect.facebook.net/en_US/sdk.js', function() {
    //         FB.init({
    //             appId: '1974408719443045',
    //             version: 'v3.0'
    //         });

    //         FB.Event.subscribe('edge.create', function(response) {
    //             alert('You liked the URL: ' + response);
    //         });
    //     });


    //     function verifyCallback(response) {
    //         console.log(success)
    //     }
    // }


)

$(window).load(function() {
    if (IsPC() == false) {
        alert('Please complete the task at the PC side')
    }
})