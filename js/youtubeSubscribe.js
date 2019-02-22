const clientId = '943200090551-94ivoatgg4e1rjesmge7cs05l2mc2s4t.apps.googleusercontent.com'
const youtube_channelId = 'UCJPaVb7NlxhfCHRkz6yuXBw'
const subscribrBtnId = 'ySubscribeBtn'
var GoogleAuth;
var youtubeInfo = {};



function youtubeSubscribeHandle(data) {
    if (data.code == 200) {
        $("#youtubeDes").removeClass("ncTaskDes").addClass("cTaskDes")
        $("#youtubeDesY").removeClass("ncTaskDesY").addClass('cTaskDesY')
        $('#ySubscribeBtn').removeClass('ncButton').addClass('cButton').prop('disabled', true).html('completed')
        $("#pointLabel").html(data.data.totalPoint - data.data.payPoint)
            //invite people count
        $("#inviteCount").html(data.data.inviteCount)
        alert('Subscription is successful')
        httpRequest('POST', 'getPayPoint', {}, getPayPointHandle)
    } else {
        alert(data.msg)
    }
}

function getPayPointHandle(data) {
    if (data.code == 200) {
        var result = data.data.totalPoint - data.data.payPoint
        if (result < 0) {
            result = 0
        }
        $("#givenPoints").html(thousandBitSeparator(result))
    }
}

//youtbe Auth load 
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}


function initClient() {
    // Initialize the gapi.client object, which app uses to make API requests.
    // Get API key and client ID from API Console.
    // 'scope' field specifies space-delimited list of access scopes

    gapi.client.init({
        'clientId': clientId,
        'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
        'scope': 'https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtubepartner'
    }).then(function() {
        GoogleAuth = gapi.auth2.getAuthInstance();
        GoogleAuth.isSignedIn.listen(updateSigninStatus);
        $('#' + subscribrBtnId).click(function() {
            setSigninStatus()
        });
    });
}

function updateSigninStatus(isSignedIn) {
    setSigninStatus();
}

function setSigninStatus() {
    var user = GoogleAuth.currentUser.get();
    isAuthorized = user.hasGrantedScopes('https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtubepartner');
    // Toggle button text and displayed statement based on current auth status.
    if (isAuthorized) {
        youtubeInfo.youtubeId = user.w3.Eea;
        youtubeInfo.youtubeMail = user.w3.U3;
        youtubeInfo.youtubeName = user.w3.ig;
        youtubeInfo.privateCode = localStorage.getItem('privateCode')
        defineRequest();
    } else {
        GoogleAuth.signIn();
    }
}

function defineRequest() {
    // See full sample for buildApiRequest() code, which is not 
    // specific to a particular API or API method.
    buildApiRequest('POST',
        '/youtube/v3/subscriptions', { 'part': 'snippet' }, {
            'snippet.resourceId.kind': 'youtube#channel',
            'snippet.resourceId.channelId': youtube_channelId
        });

}

function buildApiRequest(requestMethod, path, params, properties) {
    params = removeEmptyParams(params);
    var request;
    if (properties) {
        var resource = createResource(properties);
        request = gapi.client.request({
            'body': resource,
            'method': requestMethod,
            'path': path,
            'params': params
        });
    } else {
        request = gapi.client.request({
            'method': requestMethod,
            'path': path,
            'params': params
        });
    }
    executeRequest(request);
}

function executeRequest(request) {
    request.execute(function(response) {
        if (response.error == undefined) {
            httpRequest('POST', 'youtubeSubscribe', youtubeInfo, youtubeSubscribeHandle)
        } else {
            alert('YouTube subscribe failed');
        }
    });
}

function createResource(properties) {
    var resource = {};
    var normalizedProps = properties;
    for (var p in properties) {
        var value = properties[p];
        if (p && p.substr(-2, 2) == '[]') {
            var adjustedName = p.replace('[]', '');
            if (value) {
                normalizedProps[adjustedName] = value.split(',');
            }
            delete normalizedProps[p];
        }
    }
    for (var p in normalizedProps) {
        // Leave properties that don't have values out of inserted resource.
        if (normalizedProps.hasOwnProperty(p) && normalizedProps[p]) {
            var propArray = p.split('.');
            var ref = resource;
            for (var pa = 0; pa < propArray.length; pa++) {
                var key = propArray[pa];
                if (pa == propArray.length - 1) {
                    ref[key] = normalizedProps[p];
                } else {
                    ref = ref[key] = ref[key] || {};
                }
            }
        };
    }
    return resource;
}

function removeEmptyParams(params) {
    for (var p in params) {
        if (!params[p] || params[p] == 'undefined') {
            delete params[p];
        }
    }
    return params;
}