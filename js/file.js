


(function() {
		getIP()
		getFile()
})()



const PublicData = {
	fileID:0,						//所选文件ID   删除使用
	channel_name:'',				//websocket 返回用户唯一标识
	ip:'',							//所选IP
	file:'',						//所选文件
	
}


//get all ip
function getIP(){
	
	let hostValue = $("#IPvalue").val()
	if(hostValue){
		PublicData.ip = hostValue
	}
	$.ajax({
		type: "GET",
		url: `http://47.103.129.164:7010/pc_host/?search=${hostValue}`,
		dataType: "json",
		success: function(data) {
			let Dom = $("#IPList")
			$("#IPList").empty();
			for (var i = 0; i < data.length; i++) {
				let DOM = document.createElement("li")
				DOM.innerHTML = data[i].host;
				DOM.id = data[i].id;
				DOM.className = "IPCon";
				
				Dom.append(DOM)
			}
		}
	})
}


///get all file url
function getFile(){
	$.ajax({
		type: "GET",
		url: `http://47.103.129.164:7010/file_path/?search=`,
		dataType: "json",
		success: function(data) {
			let Dom = $("#fileList")
			$("#fileList").empty();
			for (var i = 0; i < data.length; i++) {
				let DOM = document.createElement("li")
				DOM.innerHTML = data[i].path;
				DOM.id = data[i].id;
				DOM.className = "FileCon";
				Dom.append(DOM)
			}
			
			if(data.length > 0){
				PublicData.fileID = data[0].id;
				$("#FILEval").val(data[0].path);
				PublicData.file = data[0].path
			}
		}
	})
}


//add file url
function AddFileUrl(){
	let FileUrlVal = $("#FileUrl").val()
	let data = {
		"path": FileUrlVal
	}
	$.ajax({
		type: "POST",
		url: `http://47.103.129.164:7010/file_path/`,
		dataType: "json",
		data: data,
		success: function(data) {
			alert('添加成功')
			$("#FileUrl").val('')
			getFile()
		}
	})
}

//  remove file url
function removeFile(){
	if(PublicData.fileID === 0)return
	$.ajax({
		type: "DELETE",
		url: `http://47.103.129.164:7010/file_path/${PublicData.fileID}/`,
		dataType: "json",
		success: function(data) {
			$("#FILEval").val('');
			PublicData.file = ''
			PublicData.fileID = 0
			getFile()
		}
	})
	
}


//search file word
function SearchList(){
	let word = $("#searchInit").val()
	PublicData.ip = $("#IPvalue").val()
	let obj = {
	  "channel_name": PublicData.channel_name,
	  "host":PublicData.ip,
	  "file_path":PublicData.file,
	  "search":word
	}
	
	
	if(word == '' || PublicData.channel_name == '' || PublicData.ip == '' || PublicData.file == '')return
	
	$.ajax({
		type: "POST",
		url: `http://47.103.129.164:7010/websocket/find/`,
		dataType: "json",
		data: obj,
		success: function(data) {
		}
	})
}



//	select ip
$("#IPList").on("click",".IPCon",function(){
	$("#IPvalue").val(this.innerHTML)
	PublicData.ip = this.innerHTML
})

//  select file
$("#fileList").on("click",".FileCon",function(){
	PublicData.fileID = this.id;
	$("#FILEval").val(this.innerHTML);
	PublicData.file = this.innerHTML
})





//    websocket


var ws = new WebSocket("ws://47.103.129.164:7010/project/brower/");

ws.onopen = function(evt) {  //绑定连接事件
};

ws.onmessage = function(evt) {//绑定收到消息事件
	var tabelDom = document.getElementById("TabMsgList")
	$("#TabMsgList").empty();
	let data = JSON.parse(evt.data)
	if(data.channel_name){
		PublicData.channel_name = data.channel_name
	}else{
		for(var i in data){
			let row = document.createElement("li");
			let calOne = document.createElement("span");
			let calTwo = document.createElement("span");
			calOne.innerHTML = `第${data[i].index}行`;
			calTwo.innerHTML = `内容为：${data[i].value}`;
			row.append(calOne)
			row.append(calTwo)
			tabelDom.append(row)
		}
	}

};
ws.onclose = function(evt){
}

function golocal(){
	
		if(ws.onclose){
			ws.close()
		}
}

