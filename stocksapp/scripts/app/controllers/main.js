angular.module('myapp').controller('mainctrl', ['testservice', '$scope', '$interval', function (testservice, $scope, $interval) {

	$scope.companylist = [];
	$scope.stocklist = [];
	$scope.name = '';
	$scope.symbol = '';
	testservice.database().then(function (list) {      
		$scope.companylist = list;
		console.log(list);
		manage_companies();
	});

	$scope.testingind=0;
	function manage_companies() {
		testservice.getdata('/history/function=TIME_SERIES_DAILY&symbol=NSE:'+$scope.companylist[$scope.testingind].symbol+'&interval=1min&outputsize=compact').then(function(r) {
			console.log(r,$scope.testingind);
			if('Error Message' in r)
				testservice.deletedb($scope.companylist[$scope.testingind].symbol);
			window.tempresponse=r;
			$scope.testingind++;
			if($scope.testingind<$scope.companylist.length)
				setTimeout(manage_companies,100);
			else
				alert('Testing done for 300 companies');
			//alert(r);
		});
	}
	$scope.view = false;
	$scope.tickernames={};
	/*
	testservice.list().then(function (list) {
		console.log(list);
		$scope.stocklist = list;
		console.log($scope.stocklist[0].Name);
	});
	*/
	$scope.show = function () {
	    return  $scope.stocklist!=null && $scope.stocklist.length != undefined;
	};

	$scope.upload = function (change) {
		if (!change.match(/\-/g)) {
			return 'http://images.financialcontent.com/studio-6.0/arrows/arrow5up.png';
		}
		else {
			return 'http://images.financialcontent.com/studio-6.0/arrows/arrow5down.png';
		}
	};
	$scope.toggleSuggest = function () {
		if ($scope.name == '') $('p').hide();
		else $('p').show();
	};
	$scope.addcompany = function (name) {
		$scope.tickername= name;
		$scope.pageview=true;
		$scope.coverview=false;
		var _symbol = $scope.name.split("|")[1].replace(/ /g, "");
		var _name=$scope.name.split("|")[0].replace(/ /g,"");
		$scope.tickernames[_symbol]=_name;
		testservice.addentry(_symbol);
		testservice.list().then(function (list) {
			//console.log(list);
			$scope.stocklist = list;
			localStorage.setItem('stockList', JSON.stringify($scope.stocklist));
			// $scope.cuisineList = JSON.parse(localStorage.getItem('cuisineList'));
		});
		$scope.showtable = true;
		$scope.showgraph(_symbol, 'TIME_SERIES_INTRADAY','tickerchart');		
	};
	$scope.timer;
	$scope.init = function () {
		//delete localStorage.stockList;
	    $scope.stocklist = JSON.parse(localStorage.getItem('stockList'));
		/*
		$scope.timer=$interval(function() {
			testservice.list().then(function (list) {
				//console.log(list);
				var present_list=[],names=[];
				if($scope.stocklist.length!=0) {
					$scope.stocklist.forEach(function(v,i) {
						for(var i=0;i<list.length;i++)
							if(v.t==list[i].t) {
								present_list.push(list[i]);
								names.push(v.t);
								break;
							}
					});
				}
				//console.log(present_list);
				$scope.stocklist = present_list;
				testservice.name=names;
				localStorage.setItem('stockList', JSON.stringify($scope.stocklist));
				// $scope.cuisineList = JSON.parse(localStorage.getItem('cuisineList'));
			});
		},1000*10);
		*/
		/*
		if($scope.stocklist==undefined) {
			console.log('entered if undefined');
			$scope.stockist=[];
			$scope.coverview=true;
			$scope.pageview=false;
		}
		else if($scope.stocklist.length!=0) {
			$scope.coverview=false;
			$scope.pageview=true;
			console.log('stock has list');
			$scope.stocklist.forEach(function (x) {
				testservice.name.push(x["t"]);
			});
		}
		else {
			$scope.coverview=true;
			$scope.pageview=false;
		}
		*/
		if($scope.stocklist!=undefined && $scope.stocklist.length!=undefined)
			$scope.stocklist.forEach(function (x) {
				testservice.name.push(x["t"]);
			});
		$scope.pageview=true;
	};
	//  $scope.cuisineList = JSON.parse(localStorage.getItem('cuisineList'));
	$scope.remove = function (id) {
	    $scope.stocklist.splice(id, 1);
	    console.log($scope.stocklist);
		localStorage.setItem('stockList', JSON.stringify($scope.stocklist));
	};
	
	$scope.showgraph = function (sym,type,id) {
	    $scope.symbol = sym;
	    var q = [];
	    //type = 'TIME_SERIES_INTRADAY';
		q.push('function='+type);
		if(type!='TIME_SERIES_INTRADAY')
			q.push('symbol=NSE:'+sym);
		else
			q.push('symbol='+sym);
		if(type.match(/TIME_SERIES_INTRADAY|TIME_SERIES_DAILY|TIME_SERIES_DAILY_ADJUSTED/g)) {
			q.push('interval=1min');
			q.push('outputsize=compact');
			//q.push('outputsize=full');
		}
		var func=function() {
			testservice.getdata('/history/'+q.join('&')).then(function(resp) {
				$scope.drawchart(resp,id);
			});
		};
		func();
	};

	$scope.drawchart=function(data,id) {
	    //data=JSON.parse(data);
	    var x=[],y=[],ox=[],open=[],high=[],low=[],close=[],volume=[];
	    var metadata,tsdata;
	    for(var key in data)
	        if(key.match(/Meta Data/g)) metadata=data[key];
	        else tsdata=data[key];
	    for(var key in tsdata) {
	        x.push(new Date(new Date(key+" EDT").toLocaleString()));
	        ox.push(key);
	        //x.push(new Date(key));
	        open.push(tsdata[key]["1. open"]);
	        high.push(tsdata[key]["2. high"]);
	        low.push(tsdata[key]["3. low"]);
	        close.push(tsdata[key]["4. close"]);
	        volume.push(tsdata[key]["5. volume"]);
	    }
	    console.log(x, y);
	    window.tsdata=tsdata;
		var dive = document.getElementById("chart");
	    // dive.on('plotly_afterplot', function () {
	        // $scope.view = true;
	    // });
		var maxmarkersx=[],maxmarkersy=[];
		var minmarkersx=[],minmarkersy=[];
		var max=0,ind=0,min=open[0],indm=0;
		open.forEach(function(a,b) {
			if(max<a) {
				max=a;
				ind=b;
			}
			if(min>a) {
				min=a;
				indm=b;
			}
		});
		maxmarkersx.push(x[ind]);
		maxmarkersy.push(max);
		minmarkersx.push(x[indm]);
		minmarkersy.push(min);
		/*
		var max=0,ind=0,min=high[0],indm=0;
		high.forEach(function(a,b) {
			if(max<a) {
				max=a;
				ind=b;
			}
			if(min>a) {
				min=a;
				indm=b;
			}
		});
		maxmarkersx.push(x[ind]);
		maxmarkersy.push(max);
		minmarkersx.push(x[indm]);
		minmarkersy.push(min);
		var max=0,ind=0,min=low[0],indm=0;
		low.forEach(function(a,b) {
			if(max<a) {
				max=a;
				ind=b;
			}
			if(min>a) {
				min=a;
				indm=b;
			}
		});
		maxmarkersx.push(x[ind]);
		maxmarkersy.push(max);
		minmarkersx.push(x[indm]);
		minmarkersy.push(min);
		var max=0,ind=0,min=close[0],indm=0;
		close.forEach(function(a,b) {
			if(max<a) {
				max=a;
				ind=b;
			}
			if(min>a) {
				min=a;
				indm=b;
			}
		});
		maxmarkersx.push(x[ind]);
		maxmarkersy.push(max);
		minmarkersx.push(x[indm]);
		minmarkersy.push(min);
		console.log(maxmarkersx,maxmarkersy,minmarkersx,minmarkersy);
		*/
	    Plotly.newPlot(id,[
            {
                type:'scatter',
                x:x,
                y:open,
                name:'open',
				mode:'lines'
            },
            {
                x:x,
                y:high,
                name:'high',
            },
            {
                x:x,
                y:low,
                name:'low'
            },
            {
                x:x,
                y:close,
                name:'close'
            },
			{
				x:maxmarkersx,
				y:maxmarkersy,
				type:'markers',
				name:'max value',
				marker: {
					size:10,
				}
			},
			{
				x:minmarkersx,
				y:minmarkersy,
				type:'markers',
				name:'min value',
				marker: {
					size:10,
				}
			}
	    ],{
	        width:(id=='tickerchart')?400:660,
	        height:400,
	        xaxis:{
	            title:'Time'
	        },
	        yaxis:{
	            title:'Stocks value'
	        },
	        shapes: {
	            layer:'above'
	        }
	    });
	    Plotly.newPlot('volumechart',[
            {
                x:x,
                y:volume,
                name:'volume',
				type:'bar'
            },
	    ],{
	        width:660,
	        height:400,
	        xaxis:{
	            title:'Time'
	        },
	        yaxis:{
	            title:'Stocks value'
	        },
	        shapes: {
	            layer:'above'
	        }
	    });
	};

    $scope.draw_chart=function(data) {
	    //data=JSON.parse(data);
	    var x=[];
	    var y=[];
	    var open=[];
	    var high=[];
	    var low=[];
	    var close=[];
	    var volume=[];
	    var metadata,tsdata;
	    for(var key in data)
	        if(key.match(/Meta Data/g)) metadata=data[key];
	        else tsdata=data[key];
	    console.log(data,metadata,tsdata);
	    for(var key in tsdata) {
	        x.push(new Date(new Date(key+" EDT").toLocaleString()));
	        open.push(tsdata[key]["1. open"]);
	        high.push(tsdata[key]["2. high"]);
	        low.push(tsdata[key]["3. low"]);
	        close.push(tsdata[key]["4. close"]);
	        volume.push(tsdata[key]["5. volume"]);
	    }
	    console.log(x, y);
	    window.tsdata=tsdata;
		var dive = document.getElementById("chart");
	    // dive.on('plotly_afterplot', function () {
	        // $scope.view = true;
	    // });
		var maxmarkersx=[],maxmarkersy=[];
		var minmarkersx=[],minmarkersy=[];
		var max=0,ind=0,min=open[0],indm=0;
		open.forEach(function(a,b) {
			if(max<a) {
				max=a;
				ind=b;
			}
			if(min>a) {
				min=a;
				indm=b;
			}
		});
		maxmarkersx.push(x[ind]);
		maxmarkersy.push(max);
		minmarkersx.push(x[indm]);
		minmarkersy.push(min);
		var max=0,ind=0,min=high[0],indm=0;
		high.forEach(function(a,b) {
			if(max<a) {
				max=a;
				ind=b;
			}
			if(min>a) {
				min=a;
				indm=b;
			}
		});
		maxmarkersx.push(x[ind]);
		maxmarkersy.push(max);
		minmarkersx.push(x[indm]);
		minmarkersy.push(min);
		var max=0,ind=0,min=low[0],indm=0;
		low.forEach(function(a,b) {
			if(max<a) {
				max=a;
				ind=b;
			}
			if(min>a) {
				min=a;
				indm=b;
			}
		});
		maxmarkersx.push(x[ind]);
		maxmarkersy.push(max);
		minmarkersx.push(x[indm]);
		minmarkersy.push(min);
		var max=0,ind=0,min=close[0],indm=0;
		close.forEach(function(a,b) {
			if(max<a) {
				max=a;
				ind=b;
			}
			if(min>a) {
				min=a;
				indm=b;
			}
		});
		maxmarkersx.push(x[ind]);
		maxmarkersy.push(max);
		minmarkersx.push(x[indm]);
		minmarkersy.push(min);
		console.log(maxmarkersx,maxmarkersy,minmarkersx,minmarkersy);
	   /* var div = document.getElementById("chart");
	    div.on('plotly_afterplot', function () {
	        $scope.view = true;
	    });*/
	    Plotly.newPlot('tickerchart',[
            {
                type:'countour',
                x:x,
                y:open,
                name:'open',
            },
            {
                x:x,
                y:high,
                name:'high',
            },
            {
                x:x,
                y:low,
                name:'low'
            },
            {
                x:x,
                y:close,
                name:'close'
            },
            {
                x:x,
                y:volume,
                name:'volume',
                visible:'legendonly'
            },
			{
				x:maxmarkersx,
				y:maxmarkersy,
				type:'markers',
				name:'max value',
				marker: {
					size:10,
				}
			},
			{
				x:minmarkersx,
				y:minmarkersy,
				type:'markers',
				name:'min value',
				marker: {
					size:10,
				}
			}
	    ], {
	       
	        width:400,
	        height:400,
	        xaxis:{
	            title:'Time'
	        },
	        yaxis:{
	            title:'Stocks value'
	        },
	        shapes: {
	            layer:'above'
	        },
			dragMode:'zoom'
	    });
	};
}]);