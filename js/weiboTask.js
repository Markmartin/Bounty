const weiboKey = '365103967'
const IoTChain_Id = '6353782032'


//获取用户微博信息
function GetWeiboAccountInfo(cb) {
    var hasLogin = WB2.checkLogin(),
        if (hasLogin == false) {
            WB2.login(function() {
                getWeiboUserInfo(cb);
            })
        } else {
            getWeiboUserInfo(cb);
        }
}


function getWeiboUserInfo(cb) {
    WB2.anyWhere(function(W) {
        W.parseCMD('/account/get_uid.json', function(uidData, uidStatus) {
            if (uidStatus == true) {
                W.parseCMD('/users/show.json', function(userData, userStatus) {
                    if (userStatus == true) {
                        var weiboId = data2.idstr;
                        var weiboName = data2.screen_name;
                        cb({ status: true, data: { weiboId: weiboId, weiboName: weiboName }, msg: '获取微博账户信息成功' })
                            // return { status: true, data: { weiboId: weiboId, weiboNickname: weiboNickname }, msg: '获取微博账户信息成功' }
                    } else {
                        cb({ status: false, data: {}, msg: '获取微博账户授权失败' })
                            // return { status: false, data: {}, msg: '获取微博账户授权失败' }
                    }
                }, { 'uid': uidData.uid }, { method: 'GET' })
            } else {
                return { status: false, data: {}, msg: '获取微博账户uid失败' }
            }
        }, {}, { method: 'GET' })
    })
}


//验证是否关注 参数weiboId
function verifyFollow(userWeiboId, cb) {
    WB2.anyWhere(function(W) {
        W.parseCMD('/friendships/show.json', function(data, status) {
            if (status == true) {
                if (data.source.following == true && data.target.followed_by == true) {
                    //关注成功后
                    cb({ status: true, data: {}, msg: '成功关注 新浪微博 ITC万物链' })
                        // return { status: true, data: {}, msg: '成功关注 新浪微博 ITC万物链' }
                } else {
                    cb({ status: false, data: {}, msg: '请关注新浪微博 ITC万物链' })
                        // return { status: false, data: {}, msg: '请关注新浪微博 ITC万物链' }
                }
            } else {
                cb({ status: false, data: {}, msg: '请关注新浪微博 ITC万物链' })
                    // return { status: false, data: {}, msg: '请关注新浪微博 ITC万物链' }
            }
        }, {
            'source_id': parseInt(userWeiboId),
            'target_id': parseInt(IoTChain_Id)
        }, { method: 'GET' })
    })
}


//验证是否转发 参数weiboId 和 博文Id
function verifyRepostWeibo(userWeiboId, bwId, cb) {
    WB2.anyWhere(function(W) {
        W.parseCMD('/statuses/user_timeline.json', function(data, status) {
            if (status == true) {
                var wbList = data.statuses;
                for (var i = 0; i < wbList.length; i++) {
                    var wb = wbList[i];
                    if (wb.retweeted_status.idstr == bwId && wb.user.idstr == userWeiboId) {
                        cb({ status: true, data: {}, msg: '转发微博验证成功' });
                        return;
                        // return { status: true, data: {}, msg: '转发微博验证成功' }
                    }
                }
                cb({ status: false, data: {}, msg: '请转发ITC万物链官方微博' })
                    // return { status: false, data: {}, msg: '请转发ITC万物链官方微博' }
            } else {
                cb({ status: false, data: {}, msg: '验证转发失败' })
                    // return { status: false, data: {}, msg: '验证转发失败' }
            }
        }, { uid: parseInt(weiboId) }, { method: 'GET' })
    })
}