(function() {
		getIP()
})()

var ws = ''
let XZ = [];
let dataLI = []
let dataMOVE = []
var statusOF = false

//get all ip
function getIP(){
	let val = $("#IPvalue").val()
	$.ajax({
		type: "GET",
		url: `http://47.103.129.164:7010/pc_host/?search=${val}`,
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


//	select ip
$("#IPList").on("click",".IPCon",function(){
	$("#IPvalue").val(this.innerHTML)
})













var chart = echarts.init(document.getElementById("Charts"));
	
	
	option = {
		backgroundColor: '#FFFFFF',
	    legend : { //图标
	            show : true,
	            x : 'center',
	            y : 30,
	            itemGap : 10,
	            itemWidth : 30,
	            itemHeight : 10,
	            data : ['Load(KN)','Axia Displacement(mm)']
	        },
	    color: ['#3398DB'],//  柱状图颜色
	    
	    tooltip : { //鼠标悬停提示内容
	        trigger: 'axis',
	        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	        }
	    },
	    grid: { //布局   控制图的大小，调整下面这些值就可以
	        left: '3%',
	        right: '4%',
	        bottom: '3%',
	        containLabel: true
	        //y2 : 40
	        // y2可以控制 X轴跟Zoom控件之间的间隔，避免以为倾斜后造成 label重叠到zoom上
	    },
	    xAxis : [ //X轴
	        {
	            type : 'category',
	            data : XZ,
	            axisTick: {
	                alignWithLabel: true
	            },
	            boundaryGap:false,
	            splitLine : {
	                show : true,
	                lineStyle : {
	                    type : 'dashed'
	                }
	            },
	        }
	    ],
	    yAxis : [ //两个y轴
	        {
	            type : 'value',
	            scale:'true',
	            axisLabel : {
	                show : true,
	                interval : 'auto',
	                formatter : '{value} '
	            },
	            splitNumber : 10,
	            splitLine : {
	                show : true,
	                lineStyle : {
	                    type : 'dashed'
	                }
	            },
	            splitArea : {
	                show : false
	            },
				max: value => {
				    max = value.max;
				    return (value.max * 1.5).toFixed(0); // 乘的目的是不想让图表顶到最顶部
				},
				 min: value => {
				    min = value.min;
				    return (value.min * 1.5).toFixed(0);
				},
	        } ,
	        {
				
	            type : 'value',
	            scale:'true',
	            axisLabel : {
	                show : true,
	                interval : 'auto',
	                formatter : '{value}'
	            },
	            splitNumber : 10,
	            splitLine : {
	                show : true,
	                lineStyle : {
	                    type : 'dashed'
	                }
	            },
	            splitArea : {
	                show : false
	            }
	        }
	    ],
	    series : [ //用于指定图标显示类型
	        
	        {
	            name : 'Load(KN)',
	            type : 'line',
	            barMaxWidth:100,
	            yAxisIndex : '0',//使用第一个y轴
	            smooth : true, //光滑的曲线
	            symbol: 'none',
	            areaStyle: {
	              normal: {
	                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
	                  { offset: 0, color: "#2175F3" },
	                  { offset: 0.5, color: "#BBD5FB" },
	                  { offset: 1, color: "#F9FDFF" }
	                ])
	              }
	            }, //填充区域样式
	            itemStyle: {
					normal: {
						color: '#2175F3', //改变折线点的颜色
						lineStyle: {
							color: '#2175F3' //改变折线颜色
						}
					}
				},
	            data : dataLI
	        },
	        {
	            name : 'Axia Displacement(mm)',
	            type : 'line',
	            barMaxWidth:100,
	            smooth : true, //光滑的曲线
	            symbol: 'none',
	            yAxisIndex : '1',
	             areaStyle: {
	              normal: {
	                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
	                  { offset: 0, color: "#1AE3E9" },
	                  { offset: 0.5, color: "#DEFBFC" },
	                  { offset: 1, color: "#F1F9FE" }
	                ])
	              }
	            }, //填充区域样式
	              itemStyle: {
					normal: {
						color: '#1AE3E9', //改变折线点的颜色
						lineStyle: {
							color: '#1AE3E9' //改变折线颜色
						}
					}
				},
	            data : dataMOVE
	            
	            },
	    ]
	};
	


function connectSrver(){
	if(statusOF)return
	statusOF = true
	let val = $("#IPvalue").val()
	if(val == '')return
	ws = new WebSocket(`ws://47.103.129.164:7010/project/${val}/`);
	
	ws.onopen = function(evt) {  //绑定连接事件
	};
	
	ws.onmessage = function(evt) {//绑定收到消息事件
		
		let serverVal = JSON.parse(evt.data)
		console.log(serverVal)
		if(serverVal.status_type == '' && serverVal.content == 'running'){
			console.log('正常了')
			$("#runn").addClass('activeSuc')
			$("#suc").addClass('activeSuc')
			if($("#stop").hasClass('activeErr')){
				$("#stop").removeClass('activeErr')
			}
			if($("#errors").hasClass('activeErr')){
				$("#errors").removeClass('activeErr')
			}
			if($("#warn").hasClass('activerWar')){
				$("#warn").removeClass('activerWar')
			}
				
			
			$("#running").attr("src",'img/run.png')
			$("#stoping").attr("src",'img/stoped.png')
			
			$("#warning").attr("src",'img/warning.png')
			$("#sucing").attr("src",'img/suc.png')
			$("#erring").attr("src",'img/erred.png')
			
			
			//设备回归正常后清空故障内容
			$("#errorWords").empty();
		}else if(serverVal.status_type == '' && serverVal.content == 'stop'){
			console.log('停止')
			$("#stop").addClass('activeErr')
			if($("#runn").hasClass("activeSuc")){
				$("#runn").removeClass("activeSuc")
			}
			
			
			$("#running").attr("src",'img/runed.png')
			$("#stoping").attr("src",'img/stop.png')
		}else if(serverVal.status_type == 'error'){
			
				console.log('出错')
			$("#erring").attr("src",'img/err.png')
			$("#sucing").attr("src",'img/suced.png')
			
			$("#errors").addClass('activeErr')
			if($("#suc").hasClass("activeSuc")){
				$("#suc").removeClass("activeSuc")
			}
			
			let Dom = document.createElement("p");
			Dom.innerHTML = '故障说明：' + serverVal.content
			$("#errorWords").append(Dom)
		}else if(serverVal.status_type == 'warning'){
			console.log('报警')
			
			// if($("#errors").hasClass("activeErr")){
			// 	$("#errors").removeClass("activeErr")
			// }
			// $("#erring").attr("src",'img/errrf.png')
			if($("#suc").hasClass("activeSuc")){
				$("#suc").removeClass("activeSuc")
			}
			$("#sucing").attr("src",'img/suced.png')
			
			
			// warning
			$("#warning").attr("src",'img/warninged.png')
			$("#warn").addClass('activerWar')
			let Dom = document.createElement("p");
			Dom.innerHTML = '报警说明：' + serverVal.content
			$("#errorWords").append(Dom)
			
		}else if(serverVal.status_type == 'project_name'){
			$("#proname").html(serverVal.content)
		}else if(serverVal.msg_type == 'dat'){
			let jindu = document.getElementsByClassName('jin')[0]
			let jinnums = document.getElementById("projectTit")
			let a = serverVal.progress + '%'
			jinnums.innerHTML = a
			jindu.style.width = serverVal.progress + '%'
			chart.setOption(option);
			
			
			if(XZ.length > 120){
			    XZ.shift()
				dataLI.shift()
				dataMOVE.shift()
			}
			
			//数据推送 
			 XZ.push(serverVal.time)
			 dataLI.push(serverVal.load)
			 dataMOVE.push(serverVal.axial_displacement)
			 chart.hideLoading();
		}
		
		
	};
	
	ws.onclose = function(evt){
	}
	ws.onerror = function(e) {
	  console.log('链接出错,错误如下')
	  console.log(e)
	};
	
}

window.onbeforeunload = function(event) {
 if(ws.onclose){
	 ws.close()
 }
};

function Gofile(){
	// window.location.href = "../../NBD/file.html"
	 var tempwindow=window.open('_blank');
	tempwindow.location='../../NBD/file.html'
}

 