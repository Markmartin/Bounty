$(document).ready(
    function () {
         var privateCode = localStorage.getItem('privateCode')
       
        if (privateCode == null) {
            $(location).attr('href', 'indexCn.html')
            return;
        }

        var isShowPop = false;
        var ratio = 0;//兑换比例
        var point = 0;//拥有的point
        var wPoint = 0;//需要兑换的积分

        var rows = 10;//一页显示多少行
        var page = 1;//查询查询兑换记录的页数

       /************************* 查询用户兑换页信息 *************************/
       var infoParam = {
        privateCode: privateCode
       }
       //httpRequest('POST', 'getUserTaskInfo', infoParam, getUserInfo)
       httpRequest('GET', 'getConvertInfo', infoParam, getUserInfo);//查询用户兑换页信息
       function getUserInfo(data) {
            if (data.code == 200) {
                updatePage(data.data)
            } else {
                alert(data.msg);
            }
        }

         /************************* 积分兑换 *************************/
         $('#wPopWithdrawalBtn').on('click',function(){
            var pointAmount = $('#wPopWithdrawalInput').val() ;
            wPoint = pointAmount;
            if(inputWarn()){
                var infoParam = {
                    privateCode: privateCode,
                    pointAmount: wPoint,
                }
                httpRequest('POST', 'newWithdraw', infoParam, withdrawalHandle)
            }   
        })

        /************************* 查询兑换记录 *************************/
        $('#wPopWithdrawalRecords').on('click',function(){
            $("#wPop").removeClass("lightSpeedIn").addClass("lightSpeedOut")
            setTimeout(function() {
                $("#wPop").fadeOut()
            }, 500)
            isShowPop = false;
            $("#withdrawCtx").fadeOut(function() {
               $("#withdrawRecordBox").fadeIn(function() {
                   $("#space").css('height', '900px')
               });
            })
          
            var infoParam = {
                privateCode: privateCode,
                page: page,
            }
            httpRequest('POST', 'queryWithdrawRecoder', infoParam, queryWithdrawRecoderHandle) 
        })

        $("#lastPage").on('click', function() {
            page--;
            $("#page").html(page)
            httpRequest('POST', 'queryWithdrawRecoder', { privateCode: privateCode, page: page }, queryWithdrawRecoderHandle)
        })
    
        $("#nextPage").on('click', function() {
            page++;
            $("#page").html(page)
            httpRequest('POST', 'queryWithdrawRecoder', { privateCode: privateCode, page: page }, queryWithdrawRecoderHandle)
        })

        function queryWithdrawRecoderHandle(data){
            if (data.code == 200) {
                var record = data.data;
                var recordLength = record.length;
                if (page == 1) {
                    $("#lastPage").addClass('noPage').attr('disabled', true)
                } else {
                    $("#lastPage").removeClass('noPage').attr('disabled', false)
                }
    
                if (recordLength < rows) {
                    $("#nextPage").addClass('noPage').attr('disabled', true)
                } else {
                    $("#nextPage").removeClass('noPage').attr('disabled', false)
                }
    
                
                $("#tr0").css('display', 'table-row')
                for (var i = 0; i < 10; i++) {
                    
                    if (i < record.length) {
                        //status 0-待处理、1-待提现、2-已提现
                    var recordsStatus = record[i].status;
                    var status = "处理中";
                    if(recordsStatus==0 || recordsStatus==1){
                        status = "处理中";
                    }else if(recordsStatus==2){
                        status = "已完成";
                    }
                        $("#tr" + (i + 1)).css('display', 'table-row')
                        $("#withdrawDate" + (i + 1)).html(record[i].createDate)
                        $("#withdrawItc" + (i + 1)).html(record[i].itcAmount + " ITC")
                        $("#status" + (i + 1)).html(status)
                    } else {
                        $("#tr" + (i + 1)).css('display', 'none')
                    }
                }
            } else {
                alert(data.msg);
            }
        }

        $('#backTo').on('click',function(){
            $("#withdrawRecordBox").fadeOut(function() {
                $("#withdrawCtx").fadeIn(function() {
                    $("#withdrawInputBox").fadeIn(function(){
                        $("#space").css('height', '1380px')
                    })
                })
            })
        })

        $('#wPopClose').on('click',function(){
            dismissPop(false);   
        })

        $("#mailInfo").on('click',function(){
            dismissPop(false);
        })
        
        $("#loginOut").on('click', function() {
            $(location).attr('href', 'indexCn.html')
        })

        $("#withdraw").on('click', function () {
            showPop();
        })

        $("#backTask").on("click", function() {
            $(location).attr('href', 'taskPointCn.html');
        })

        

        //实时监听input输入的内容
        $('#wPopWithdrawalInput').bind('input propertychange change',function(e){
            var inputValue = $('#wPopWithdrawalInput').val();
            console.log(inputValue);
            var itc = roundFun(inputValue * ratio,2);
            $("#wPopWithdrawalItcCount").html(itc);
            inputWarn();
            if(isNaN(inputValue)){
                //请填写数字
            }else{
                //
            }
        })

        //输入提示
        function inputWarn(){
            var inputValue = $('#wPopWithdrawalInput').val();
            var isOk = true;
            var warnInfo = ""

            if(inputValue == "" || inputValue == null){
                warnInfo = "请输入需要提取的积分.";
                isOk = false; 
            }else if(inputValue < 20){
                warnInfo = "单次最小提取数额为20积分.";
                isOk = false;
            }else if(inputValue > point){
                warnInfo = "提取积分超过您的积分总数.";
                isOk = false;
            }else{
                isOk = true;
            }
            if(isOk){
                $("#wPopWithdrawalItcWarnBox").fadeOut();
                $("#wPopWithdrawalBtn").removeClass('nwPopWithdrawalBtn').addClass('wPopWithdrawalBtn').prop('disabled', true)
            }else{
                $("#wPopWithdrawalItcWarnBox").fadeIn(function() {
                    $("#wPopWithdrawalItcWarn").html(warnInfo);
                });
                $("#wPopWithdrawalBtn").removeClass('wPopWithdrawalBtn').addClass('nwPopWithdrawalBtn').prop('disabled', true)
            }
            return isOk;
        }

        function updatePage(info) {
            ratio = info.ratio;
            point = info.validPoint;

            $("#mailInfo").html(info.email);
            // $("#balance").html(taskInfo.totalPoint + ' Points')
            $("#email").val(info.email);
            $("#ethAddr").val(info.ethAddress);
            updatePoint();
        }

        function updatePoint(){
            var itcCount = roundFun(point*ratio,2);
            var totalStr = point+ ' 积分 = ' + itcCount.toString() + ' ITC';
            $("#rate").html(totalStr);
            $("#wPopAvailablePoint").html(point);
            var pointRateItc = 1/ratio + ' 积分 = 1 ITC';
            $("#wPopConversionRatio").html(pointRateItc)
        }
        function withdrawalHandle(data){
            if (data.code == 200) {
                point = point - wPoint;
                wPoint = 0;
                updatePoint();
                dismissPop(true);
                $("#wPopWithdrawalItcCount").html(0);
                $("#wPopWithdrawalInput").val("");
            } else {
                alert(data.msg);
            }
        }

     
        
        //显示隐藏弹框
        function showPop(){
            $("#mailInfo").removeClass("nmailInfo").addClass("mailInfo");

            $("#wPop").fadeIn().removeClass("lightSpeedOut").addClass("lightSpeedIn");
            $("#withdrawInputBox").fadeOut();
            isShowPop = true
        }

        function dismissPop(isAlert){
            $("#mailInfo").removeClass("mailInfo").addClass("nmailInfo");

            $("#wPop").removeClass("lightSpeedIn").addClass("lightSpeedOut")
            setTimeout(function() {
                $("#wPop").fadeOut(function(){
                    $("#withdrawInputBox").fadeIn(function(){
                        if(isAlert){
                            alert(" 申请提现成功。\n 提现将在3个工作日内完成，请耐心等待。");
                        }
                    });
                })
            }, 500)
            $('#ySubscribeBtn').removeClass('ncButton').addClass('cButton').prop('disabled', true).html('completed')
            isShowPop = false
        }

    
        //保留n位小数
        function roundFun(value, n) {
            return Math.round(value*Math.pow(10,n))/Math.pow(10,n);
        }
    


       

        

       
    }
)