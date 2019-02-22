$(document).ready(function() {
    var rows = 50;//一页显示多少行
    var page = 1;//第几页
    var isNext = false;//是否点击的是nextPage按钮

    var pageParam = {
        page: page
    }
    httpRequest('GET', 'queryAllRecord', pageParam, recordHandle);
    
    
     $("#lastPage").on('click', function() {
     	if(page > 1){
     		isNext = false;
     		page--;
            $("#page").html(page);
            var pageParam = {
                page: page
            }
            
            //$("#tableBox  tr").remove(); 
            $("#tableBox tr:gt(0)").empty(); 
            httpRequest('GET', 'queryAllRecord', pageParam, recordHandle);
     	}
        
    })

    $("#nextPage").on('click', function() {
    	isNext = true;
        page++;
        $("#page").html(page);
        var pageParam = {
            page: page
        }
        //$("#tableBox  tr").remove(); 
        $("#tableBox tr:gt(0)").empty(); 
        httpRequest('GET', 'queryAllRecord', pageParam, recordHandle);
    })
    
    function recordHandle(data) {
        if(data.code == 200){


            var records = data.data;
            var recordLength = records.length;
            $('#tr0').css('display','table-row');

            if(page == 1){
                $('#lastPage').removeClass('commonPageBtn').addClass('noPage').attr('disabled',true);
            }else{
                $('#lastPage').removeClass('noPage').addClass('commonPageBtn').attr('disabled',false);
            }



            if(recordLength < rows){
                $('#nextPage').removeClass('commonPageBtn').addClass('noPage').attr('disabled',true);
            }else{
                $('#nextPage').removeClass('noPage').addClass('commonPageBtn').attr('disabled',false);
            }

            for(var i=0; i<recordLength;i++){
                addTr(records[i]);
            }
            
            /**for(var i=0;i<10;i++){
                if(i<record.length){
                    $("#tr" + (i + 1)).css('display', 'table-row')
                    $("#rewardId" + (i + 1)).html(record[i].rewardId)
                    $("#rewardCode" + (i + 1)).html(record[i].rewardCode)
                    $("#groupName" + (i + 1)).html(record[i].groupName)
                    $("#adminId" + (i + 1)).html(record[i].adminId)
                    $("#exchanged" + (i + 1)).html(record[i].exchanged)
                    $("#createTime" + (i + 1)).html(record[i].createTime)
                    $("#msgText" + (i + 1)).html(record[i].msgText)

                }else{
                    $("#tr" + (i + 1)).css('display', 'none')
                }
            }**/

        }else{
            //获取数据失败
            if(isNext){
                page--;
            }else{
                page++;
            }
            $("#page").html(page);
        }
    }





    function addTr(record){
        
        $("#tableBox").append("<tr class='bgTransparent'>" + 
                                 "<td class='tdBorder'>"+"<div class='column1 tdFont'>" + record.rewardId + "</div>"+"</td>"+
                                 "<td class='tdBorder'>"+"<div class='column2 tdFont'>"+ record.rewardCode + "</div>" + "</td>" +
                                 "<td class='tdBorder'>"+ "<div class='column3 tdFont'>" +record.groupName + "</div>" + "</td>" +
                                 "<td class='tdBorder'>" + "<div class='column4 tdFont'>" + record.adminId + "</div>" + "</td>" +
                                 "<td class='tdBorder'>" + "<div class='column5 tdFont'>" + record.exchanged + "</div>" + "</td>" +
                                 "<td class='tdBorder'>" + "<div class='column6 tdFont'>" + record.createTime + "</div>" + "</td>" +
                                 "<td class='tdBorder'>" + "<textarea class='column7  textArea' readonly disabled rows='1'>" + record.msgText + "</textarea>"+"</td>" +
                            "</tr>");
    }
    
    
})