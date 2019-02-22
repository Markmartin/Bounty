$(document).ready(function() {
	var email = localStorage.getItem('email')
	var privateCode = localStorage.getItem('privateCode')
	var wait = 60

	$("#timerLabel").attr('disabled', false)

	$("#gotoEmail").on("click", function() {
		if(email != null) {
			var emailUrl = gotoEmail(email)
			if (emailUrl == undefined) {
				alert('Please check your email to activate your account')
			}else{
				window.open(emailUrl)
				// $(location).attr('href', emailUrl)
			}
			
		}
	})
	
	$(".backDes").on('click',function(){
		$(location).attr('href', 'index.html')
	})

	$("#timerLabel").on('click', function() {
		if(wait == 60) {
			timerEvent()
			var mailParam = {
				mail: email,
				privateCode: privateCode
			}
			httpRequest('POST', 'sendMail', mailParam, mailHandle)
		}
	})

	timerEvent()

	function mailHandle(data) {
		if(data.code == 200) {
			alert(data.msg);
		} else {
			alert(data.msg)
		}
	}

	function timerEvent() {
		if(wait == 0) {
			$("#timerLabel").removeClass('resend').addClass('modify').html('Resend')
			wait = 60;
		} else {
			wait = wait - 1
			if($("#timerLabel").hasClass('modify') == true) {
				$("#timerLabel").removeClass('modify').addClass('resend')
			}
			$("#timerLabel").html('Resend(' + wait + 's).')
			setTimeout(function() {
				timerEvent(wait)
			}, 1000)
		}
	}
})