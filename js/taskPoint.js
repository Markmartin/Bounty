$(document).ready(function() {
    
    var privateCode = localStorage.getItem('privateCode')
    


    if (privateCode == null) {
        $(location).attr('href', 'index.html')
        return;
    }
    var fbSDK;
    var taskInfo;
    var canGetPoint = true;
    var rankStatus = false;
    var infoParam = {
        privateCode: privateCode
    }

    var exchangePage = 1;
    var popExchangeMenu = false;

    $("#loginOut").on('click', function() {
        $(location).attr('href', 'index.html')
    })

    $("#tJoinBtn").on('click', function() {
        window.open('http://api.iotchain.io/source?type=bounty', '_blank')
    })


   
    /**$("#rankSwitchBtn").on('click', function() {
        if (rankStatus == false) {
            $("#rankBtnTitle").html('Close')
            $("#rank").css('transform', 'translate(0px, 0px)');
            $("#rankSwitchBtn").removeClass('rankBtnBackImage').addClass('rankBtnOpenImage')
            $("#arrow").removeClass('arrowOpen').addClass('arrowClose')
            rankStatus = true;
        } else {
            $("#rankBtnTitle").html('open')
            $("#rank").css('transform', 'translate(318px, 0px)');
            $("#rankSwitchBtn").removeClass('rankBtnOpenImage').addClass('rankBtnBackImage')
            $("#arrow").removeClass('arrowClose').addClass('arrowOpen')
            rankStatus = false;
        }
    })

    $("#rankRule").on('click', function() {
        window.open('https://medium.com/@IoT_Chain/itc-additional-ranking-list-for-extra-tokens-in-our-bounty-program-e00de4b9c29e', '_blank')
    })**/

    $("#rewardCodeRuleLink").on('click', function() {
        window.open('https://medium.com/iot-chain/are-you-a-key-contributor-to-the-itc-community-385c1fc767cb')
    })

    $("#exchangeMenuBtn").on('click', function() {
        if (popExchangeMenu == false) {
            $("#popUp").fadeIn().removeClass("lightSpeedOut").addClass("lightSpeedIn")
            popExchangeMenu = true
        } else {
            $("#popUp").removeClass("lightSpeedIn").addClass("lightSpeedOut")
            setTimeout(function() {
                $("#popUp").fadeOut()
            }, 500)
            popExchangeMenu = false
        }
    })

    $("#menuClose").on('click', function() {
        $("#popUp").removeClass("lightSpeedIn").addClass("lightSpeedOut")
        setTimeout(function() {
            $("#popUp").fadeOut()
        }, 500)
        popExchangeMenu = false;
    })

    $("#exchangeRecordBtn").on('click', function() {
        $("#popUp").removeClass("lightSpeedIn").addClass("lightSpeedOut")
        setTimeout(function() {
            $("#popUp").fadeOut()
        }, 500)
        popExchangeMenu = false;
        $("#task").fadeOut(function() {
            $("#rewardCodeRecord").fadeIn(function() {
                $("#space").css('height', '900px')
            });
        })
    })

    $("#exchangeBtn").on('click', function() {
        //兑换记录
        var code = $("#rewardCode").val()
        if (code == undefined || code == '') {
            alert('Please enter the redemption code')
            return;
        }
        if (code.length != 16) {
            alert('Please enter a valid redemption code')
            return;
        }
        httpRequest('POST', 'exchangeRewardCode', { privateCode: privateCode, rewardCode: code }, exchangeHandle)
    })

    function exchangeHandle(data) {
        if (data.code == 200) {
            $("#pointLabel").html(data.data.totalPoint - data.data.payPoint)
            $("#rewardCode").val("")
            //httpRequest('POST', 'rankInfo', infoParam, rankInfoHandle) 
            alert(data.msg)
        } else {
            alert(data.msg)
        }
    }

    $("#backToTask").on('click', function() {
        $("#rewardCodeRecord").fadeOut(function() {
            $("#task").fadeIn(function() {
                $("#space").css('height', '1380px')
            })
        })
    })

    $("#lastPage").on('click', function() {
        exchangePage--;
        $("#page").html(exchangePage)
        httpRequest('POST', 'queryExchangeRecord', { privateCode: privateCode, page: exchangePage }, exchangeRecordHandle)
    })

    $("#nextPage").on('click', function() {
        exchangePage++;
        $("#page").html(exchangePage)
        httpRequest('POST', 'queryExchangeRecord', { privateCode: privateCode, page: exchangePage }, exchangeRecordHandle)
    })

    /*exchange record */
    httpRequest('POST', 'queryExchangeRecord', { privateCode: privateCode, page: exchangePage }, exchangeRecordHandle)

    function exchangeRecordHandle(data) {
        if (data.code == 200) {
            if (exchangePage == 1) {
                $("#lastPage").addClass('noPage').attr('disabled', true)
            } else {
                $("#lastPage").removeClass('noPage').attr('disabled', false)
            }

            if (data.data.finalPage == true) {
                $("#nextPage").addClass('noPage').attr('disabled', true)
            } else {
                $("#nextPage").removeClass('noPage').attr('disabled', false)
            }

            var record = data.data.exchangeRecord;
            $("#tr0").css('display', 'table-row')
            for (var i = 0; i < 10; i++) {
                if (i < record.length) {
                    $("#tr" + (i + 1)).css('display', 'table-row')
                    $("#time" + (i + 1)).html(record[i].exchangedTime)
                    $("#code" + (i + 1)).html(record[i].rewardCode)
                    $("#exchangePoint" + (i + 1)).html(record[i].rewardPoint)
                } else {
                    $("#tr" + (i + 1)).css('display', 'none')
                }
            }
        } else {
            //失败了
        }
    }
    /*exchange  record */


    /******************rank******************/
    /**httpRequest('POST', 'rankInfo', infoParam, rankInfoHandle)

    function rankInfoHandle(data) {
        if (data.code == 200) {
            for (var index in data.data.rankInfo) {
                var sIndex = data.data.rankInfo[index].mailAddr.indexOf('@')
                var mailInfo = data.data.rankInfo[index].mailAddr
                var mailStr = mailInfo.substring(0, 3) + '...' + mailInfo.substring(sIndex - 3)
                var eIndex = parseInt(index) + 1;
                $("#mail" + eIndex).html(mailStr)
                $("#point" + eIndex).html(data.data.rankInfo[index].weekTotalPoint)

                $("#userOrder").html(data.data.rankMe.rank)
                $("#rankUserMail").html(data.data.rankMe.mailAddr)
                $("#rankUserPoint").html(data.data.rankMe.weekTotalPoint)
            }
        }
    }**/

    /******************rank******************/
    httpRequest('POST', 'getUserTaskInfo', infoParam, getUserTaskInfo)

    function getUserTaskInfo(data) {
        if (data.code == 200) {
            updatePage(data.data)
        } else {
            alert(data.msg)
            updatePage_noInfo()
        }
    }

    function getUserTaskInfo_noAlert(data) {
        if (data.code == 200) {
            taskInfo = data.data;
        } else {
            alert(data.msg)
            updatePage_noInfo()
        }
    }

    function updatePage_noInfo() {
        $(".button").removeClass('ncButton').addClass('cButton').prop('disabled', true)
    }

    function updatePage(data) {
        taskInfo = data;
        canGetPoint = taskInfo.canGetPoint;
        if (taskInfo.canGetPoint == false) {
            alert(taskInfo.canGetPointMsg)
        }

        //user account info
        $("#mailInfo").html(taskInfo.mailAddr)
        $("#mailInfo").on('click', function() {
            $(location).attr('href', 'withdraw.html')
        })

        var result = taskInfo.todayTotalPoint - taskInfo.todayPayPoint
        if (result < 0) {
            result = 0
        }
        //remind point
        $("#givenPoints").html(thousandBitSeparator(result))
        //point
        $("#pointLabel").html(taskInfo.totalPoint - taskInfo.payPoint)
        //invite people count
        $("#inviteCount").html(taskInfo.inviteCount)




        /***********telegram************/
        if (taskInfo.joinTelegram == true) {

            //$("#teleDes").removeClass("ncTaskDes").addClass("cTaskDes")
            //$("#teleDesY").removeClass("ncTaskDesY").addClass('cTaskDesY')

            $("#tJoinBtn").removeClass('ncButton').addClass('cButton').prop('disabled', true).html('completed')
            $("#tCopyBtn").removeClass('ncButton').addClass('cButton').prop('disabled', true).html('completed')

            //privateCode
            $("#codeLabel").html('/echo ' + privateCode)
        } else {
            if (canGetPoint == false) {
                $("#codeLabel").html('Today\'s points have all been distributed. Please try again tomorrow.')
                $("#tCopyBtn").removeClass('ncButton').addClass('cButton').prop('disabled', true)
            } else {
                //有积分 未完成
                //privateCode
                $("#codeLabel").html('/echo ' + privateCode)
                    //copy privateCode
                $("#tCopyBtn").on('click', function() {
                    var clipboard = new ClipboardJS('#tCopyBtn', {
                        text: function() {
                            return '/echo ' + privateCode
                        }
                    });
                    clipboard.on('success', function(e) {
                        clipboard.destroy()
                        alert('Telegram verification code copied successfully')
                    });
                    clipboard.on('error', function(e) {
                        clipboard.destroy()
                        alert('Failed to copy telegram verification code')
                    });
                })
            }

        }

        /***********telegram channel************/
        if(taskInfo.subscribeTelegramChannel == true){
            $("#teleDes").removeClass("ncTaskDes").addClass("cTaskDes")
            $("#teleDesY").removeClass("ncTaskDesY").addClass('cTaskDesY')

            $('#channelSubscribeBtn').removeClass('ncButton').addClass('cButton').prop('disabled', true).html('completed')
            $('#vertifyChannelBtn').removeClass('ncButton').addClass('cButton').prop('disabled', true).html('completed')
        }else{
            $("#channelSubscribeBtn").on('click', function() {
                window.open('https://t.me/IoTChainChannel');
            })
            $("#vertifyChannelBtn").on('click', function() {
                var verifyParam = {
                    privateCode: privateCode
                }
                httpRequest('POST', 'subscribeTelegramChannel', verifyParam, subscribeChannelHandle);
            })
        }

        /***********facebook************/
        if (taskInfo.facebookId == '') {
            $("#fBindBtn").on('click', function() {
                FB.login(function(response) {
                    if (response.status == 'connected') {
                        FB.api('/me', { locale: 'en_US', fields: 'name, email' }, function(response) {
                            if (response.id != undefined) {
                                var facebookInfo = {
                                    privateCode: privateCode,
                                    facebookId: response.id,
                                    facebookName: response.name,
                                    facebookMail: response.email
                                }
                                httpRequest('POST', 'bindFacebookInfo', facebookInfo, bindFacebookInfo)
                            } else {
                                alert('Failed to bind facebook account')
                            }
                        });
                    } else {
                        alert('Failed to bind facebook account')
                    }
                }, { scope: 'email' });
            })
        } else {
            $("#fBindBtn").removeClass('ncButton').addClass('cButton').prop('disabled', true).html('completed')
        }

        if (taskInfo.facebookShared == true) {
            $("#fDes").removeClass("ncTaskDes").addClass("cTaskDes")
            $("#fDesY").removeClass("ncTaskDesY").addClass('cTaskDesY')
            $("#fShareBtn").removeClass('ncButton').addClass('cButton').prop('disabled', true).html('completed')
        } else {
            $.ajaxSetup({
                cache: true
            });
            $.getScript('https://connect.facebook.net/en_US/sdk.js', function() {
                FB.init({
                    appId: '1974408719443045',
                    version: 'v2.7' // or v2.1, v2.2, v2.3, ...
                });
                //facebook share
                $("#fShareBtn").on('click', function() {
                    if (taskInfo.facebookId == '') {
                        alert('Please bind your facebook account first')
                    } else {
                        var canDoTask = true;
                        if (canGetPoint == false) {
                            var confirmRes = confirm('Today\'s points have all been distributed. No point can be obtained by completing the task.')
                            if (confirmRes == true) {
                                canDoTask = true;
                            } else {
                                canDoTask = false
                            }
                        }
                        if (canDoTask == true) {
                            var taskParam = {
                                taskName: 'facebook'
                            }
                            httpRequest('POST', 'getTaskInfo', taskParam, function(data) {
                                if (data.code == 200) {
                                    FB.ui({
                                        method: 'share',
                                        href: data.data.taskContent,
                                    }, function(response) {
                                        //分享成功
                                        if (response.error_code != undefined) {
                                            alert(response.error_message)
                                        } else {
                                            var facebookParam = {
                                                privateCode: privateCode
                                            }
                                            httpRequest('POST', 'facebookShared', facebookParam, facebookShared)
                                        }
                                    });
                                } else {
                                    alert(data.msg)
                                }
                            })
                        }
                    }
                })
            });
        }


        /***********twitter************/
        hello.init({
            facebook: '1974408719443045',
            twitter: 'wD5bCIvp3rpxHOumHftxBN9eP'
        })

        //twitter account bind
        if (taskInfo.twitterId == '' || taskInfo.twitterId == null || taskInfo.twitterId.length == 0) {
            $("#tBindBtn").on('click', function() {
                hello('twitter').login().then(function(data) {
                    if (data != null && data != undefined && data != '') {
                        var bindParam = {
                            privateCode: privateCode,
                            twitterId: data.authResponse.user_id
                        }
                        httpRequest('POST', 'bindTwitterId', bindParam, bindTwitterId)
                    }
                }, function(e) {
                    alert('Twitter Signin error: ' + e.error.message);
                });
            })
        } else {
            $("#tBindBtn").removeClass('ncButton').addClass('cButton').prop('disabled', true).html('completed')
        }


        if (taskInfo.twitterShared == true) {
            $("#tDes").removeClass("ncTaskDes").addClass("cTaskDes")
            $("#tDesY").removeClass("ncTaskDesY").addClass('cTaskDesY')

            $("#tRetweetBtn").removeClass('ncButton').addClass('cButton').prop('disabled', true).html('completed')
            $("#tVerifyBtn").removeClass('ncButton').addClass('cButton').prop('disabled', true).html('completed')
        } else {
            var taskParam = {
                taskName: 'twitter'
            }
            httpRequest('POST', 'getTaskInfo', taskParam, function(data) {
                if (data.code == 200) {
                    if (data.data.taskName == 'twitter') {
                        $("#tRetweetBtn").attr('href', 'https://twitter.com/intent/retweet?tweet_id=' + data.data.taskContent)
                    }
                }
            })
            $("#tVerifyBtn").on('click', function() {
                var canDoTask = true;
                if (canGetPoint == false) {
                    var confirmRes = confirm('Today\'s points have all been distributed. No point can be obtained by completing the task.')
                    if (confirmRes == true) {
                        canDoTask = true;
                    } else {
                        canDoTask = false
                    }
                }
                if (canDoTask == true) {
                    var verifyParam = {
                        privateCode: privateCode
                    }
                    httpRequest('POST', 'verifyTwitterShared', verifyParam, verifyRetweet)
                }
            })
        }


        /***********invite************/
        $("#inviteLink").html('https://Bounty.iotchain.io/register.html?inviterCode=' + privateCode)
            //copy inviteLink
        $("#iCopyBtn").on('click', function() {
            var clipboard = new ClipboardJS('#iCopyBtn');
            clipboard.on('success', function(e) {
                clipboard.destroy()
                alert('Invitation link copied successfully')
            });
            clipboard.on('error', function(e) {
                clipboard.destroy()
                alert('Failed to copy invitation link')
            });
        })


        /***********channel************/
        /**if (taskInfo.subscribeChannel == true) {
            $("#channelDes").removeClass("ncTaskDes").addClass("cTaskDes")
            $("#channelDesY").removeClass("ncTaskDesY").addClass('cTaskDesY')
            $('#channelSubscribeBtn').removeClass('ncButton').addClass('cButton').prop('disabled', true).html('completed')
        } else {
            $("#channelSubscribeBtn").on('click', function() {
                var verifyParam = {
                    privateCode: privateCode
                }
                httpRequest('POST', 'checkChannel', verifyParam, subscribeChannelHandle);
            })
        }**/
        
        
       
        /***********reddit************/
        if (taskInfo.subscribeReddit == true) {
            $("#redditDes").removeClass("ncTaskDes").addClass("cTaskDes")
            $("#redditDesY").removeClass("ncTaskDesY").addClass('cTaskDesY')
            $('#rSubscribeBtn').removeClass('ncButton').addClass('cButton').prop('disabled', true).html('completed')
        } else {
            $("#rSubscribeBtn").on('click', function() {
                window.location.href = 'https://www.reddit.com/api/v1/authorize?client_id=DS2jPuQpSa0_lA&response_type=code&state=' + privateCode + '&redirect_uri=http://api.iotchain.io/redditCallback&duration=permanent&scope=identity,subscribe,read'
            })
        }


        /***********youtube************/
        if (taskInfo.subscribeYouTube == true) {
            $("#youtubeDes").removeClass("ncTaskDes").addClass("cTaskDes")
            $("#youtubeDesY").removeClass("ncTaskDesY").addClass('cTaskDesY')
            $('#ySubscribeBtn').removeClass('ncButton').addClass('cButton').prop('disabled', true).html('completed')
        }

    }
    /***********telegram channel************/
    function subscribeChannelHandle(data){
        if(data.code == 200){

           $("#teleDes").removeClass("ncTaskDes").addClass("cTaskDes")
           $("#teleDesY").removeClass("ncTaskDesY").addClass('cTaskDesY')

           $('#channelSubscribeBtn').removeClass('ncButton').addClass('cButton').prop('disabled', true).html('completed')
           $('#vertifyChannelBtn').removeClass('ncButton').addClass('cButton').prop('disabled', true).html('completed')
        
           $("#pointLabel").html(data.data.totalPoint - data.data.payPoint);
           alert('Subscription is successful')
           httpRequest('POST', 'getPayPoint', {}, getPayPointHandle)
        }else{
            alert(data.msg);
            //window.location.href = 'https://t.me/IoTChainChannel';
            //window.open('https://t.me/IoTChainChannel');
       }
    }

    /***********facebook************/
    function bindFacebookInfo(data) {
        if (data.code == 200) {
            $("#fBindBtn").removeClass('ncButton').addClass('cButton').prop('disabled', true).html('completed')
            alert('Successfully synced Facebook account')
            httpRequest('POST', 'getUserTaskInfo', infoParam, getUserTaskInfo_noAlert)
        } else {
            alert(data.msg)
        }
    }
    function facebookShared(data) {
        if (data.code == 200) {
            $("#fDes").removeClass("ncTaskDes").addClass("cTaskDes")
            $("#fDesY").removeClass("ncTaskDesY").addClass('cTaskDesY')

            $("#fShareBtn").removeClass('ncButton').addClass('cButton').prop('disabled', true).html('completed')
            $("#pointLabel").html(data.data.totalPoint - data.data.payPoint)
            //invite people count
            $("#inviteCount").html(data.data.inviteCount)
            alert('Facebook share success')
            httpRequest('POST', 'getPayPoint', {}, getPayPointHandle)
        } else {
            alert(data.msg)
        }
    }
    /***********facebook************/

    function bindTwitterId(data) {
        if (data.code == 200) {
            $("#tBindBtn").removeClass('ncButton').addClass('cButton').prop('disabled', true).html('completed')
            alert('Successfully synced Twitter account')
        } else {
            alert(data.msg)
        }
    }

    function verifyRetweet(data) {
        if (data.code == 200) {
            $("#tDes").removeClass("ncTaskDes").addClass("cTaskDes")
            $("#tDesY").removeClass("ncTaskDesY").addClass('cTaskDesY')

            $("#tRetweetBtn").removeClass('ncButton').addClass('cButton').prop('disabled', true).html('completed')
            $("#tVerifyBtn").removeClass('ncButton').addClass('cButton').prop('disabled', true).html('completed')
            $("#pointLabel").html(data.data.totalPoint - data.data.payPoint)
                //invite people count
            $("#inviteCount").html(data.data.inviteCount)
            alert('Twitter repost success')
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
})