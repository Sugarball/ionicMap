/**
 * Created by gujun on 15/6/5.
 */
angular.module('inMap.controllers').controller('MapCtrl',function($scope,$cordovaPrinter, $ionicPlatform){
    init();

    $scope.printPage = function(){
        $ionicPlatform.ready(function() {
            var printerAvail = $cordovaPrinter.isAvailable();
            $cordovaPrinter.print($('body').html());
        });

    }

    //$scope.printPage = function takePicture() {
    //    navigator.camera.getPicture(function(imageURI) {
    //
    //        // imageURI is the URL of the image that we can use for
    //        // an <img> element or backgroundImage.
    //
    //    }, function(err) {
    //
    //        // Ruh-roh, something bad happened
    //
    //    });
    //}

    function init(){
        console.log('hello');
        var selectFromMode = false;
        var selectEndMode = false;
        var startPoint = null;
        var endPoint = null;

        var mainG = d3.select('.mainG');
        mainG.append('circle')
            .attr('class','currentAddress')
            .attr("cx", JSON.parse($('#3').attr('cp'))[0])
            .attr("cy", JSON.parse($('#3').attr('cp'))[1]-20)
            .attr("r", 10)
            .attr('fill','red');

        mainG.append('text')
            .text('当前位置')
            .attr("x", JSON.parse($('#3').attr('cp'))[0]+20)
            .attr("y", JSON.parse($('#3').attr('cp'))[1]-15);

        var fromCircle = mainG.append('circle')
            .attr('class','currentAddress')
            .attr("cx", -1000)
            .attr("cy", -1000)
            .attr("r", 5)
            .attr('fill','red');

        var fromText = mainG.append('text')
            .attr('class','currentAddressText')
            .text('起点')
            .attr("x", -1000)
            .attr("y", -1000);

        var endCircle = mainG.append('circle')
            .attr('class','currentAddress')
            .attr("cx", -1000)
            .attr("cy", -1000)
            .attr("r", 5)
            .attr('fill','red');

        var endText = mainG.append('text')
            .attr('class','currentAddressText')
            .text('终点')
            .attr("x", -1000)
            .attr("y", -1000);

        function setFromPoint(point){
            startPoint = point.id;
            fromCircle
                .attr("cx", point.x)
                .attr("cy", point.y+20);

            fromText
                .attr("x", point.x+5)
                .attr("y", point.y+20);
        }

        function setEndPoint(point){
            endPoint = point.id;
            endCircle
                .attr("cx", point.x)
                .attr("cy", point.y+20);

            endText
                .attr("x", point.x+5)
                .attr("y", point.y+20);
        }

        var pathList = [
            {
                x : 200,
                y : 200
            },
            {
                x : 300,
                y : 200
            },
            {
                x : 200,
                y : 300
            },
            {
                x : 300,
                y : 300
            },

            {
                x : 700,
                y : 200
            },
            {
                x : 800,
                y : 200
            },
            {
                x : 700,
                y : 300
            },
            {
                x : 700,
                y : 300
            },
        ];

        function getPath(a,b){
            d3.selectAll('.navPath').remove();

            var line = d3.svg.line()
                .interpolate("cardinal")
                .x(function(d) {return d.x;})
                .y(function(d) {return d.y;});

            var pathPoints = [pathList[a],
                //{x:274,y:256},{x:248,y:248},
                pathList[b]];

            var path = mainG.append('path');
            path.classed('navPath',true)
                .attr("d", line(pathPoints))
                .attr("stroke-width", 2)
                .attr("stroke", "brown")
                .attr("fill", "none");

            var totalLength = path.node().getTotalLength();

            path.attr("stroke-dasharray", totalLength + " " + totalLength)
                .attr("stroke-dashoffset", totalLength)
                .transition()
                .duration(1000)
                .ease("linear")
                .attr("stroke-dashoffset", 0);
        }


        $('.selectStartPoint').click(function(){
            selectEndMode = false;
            selectFromMode = true;
        });
        $('.selectEndPoint').click(function(){
            selectFromMode = false;
            selectEndMode = true;
        });
        $('.endSelectPoint').click(function(){
            selectFromMode = false;
            selectEndMode = false;
        });

        var clearSelection = function(){
            selectFromMode = false;
            selectEndMode = false;
        }

        $('.startNav').click(function(){
            selectFromMode = false;
            selectEndMode = false;
            if(startPoint && endPoint){
                getPath(parseInt(startPoint)-1,parseInt(endPoint)-1);
            }

        });

        _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
        var storeTemp = _.template($('.storeInfoTemp').html());

        var storeInfo = [
            {
                id : 1,
                name : '一号店',
                info : '一号店很好。'
            },{
                id : 2,
                name : '二号店',
                info : '二号店很好。'
            },{
                id : 3,
                name : '三号店',
                info : '三号店很好。'
            },{
                id : 4,
                name : '四号店',
                info : '四号店很好。'
            },
            {
                id : 5,
                name : '5号店',
                info : '5号店很好。'
            },{
                id : 6,
                name : '6号店',
                info : '6号店很好。'
            },{
                id : 7,
                name : '7号店',
                info : '7号店很好。'
            },{
                id : 8,
                name : '8号店',
                info : '8号店很好。'
            }
        ];

        function setStoreInfo(id){
            var _storeInfo = _.find(storeInfo,{id:parseInt(id)});
            $('.storeInfo').html( storeTemp({
                storeName : _storeInfo.name,
                storeInfo : _storeInfo.info
            })).css('height','100px');
        }


        //svg-pan-zoom start
        var beforePan = function(oldPan, newPan){
            var gutterWidth = 280;
            var gutterHeight = 300;
            var sizes = this.getSizes();
            var leftLimit = -((sizes.viewBox.x + sizes.viewBox.width) * sizes.realZoom) + gutterWidth;
            var rightLimit = sizes.width - gutterWidth - (sizes.viewBox.x * sizes.realZoom);
            var topLimit = -((sizes.viewBox.y + sizes.viewBox.height) * sizes.realZoom) + gutterHeight;
            var bottomLimit = sizes.height - gutterHeight - (sizes.viewBox.y * sizes.realZoom);

            var customPan = {};
            customPan.x = Math.max(leftLimit, Math.min(rightLimit, newPan.x));
            customPan.y = Math.max(topLimit, Math.min(bottomLimit, newPan.y));
            return customPan;
        }

        // Init Hammer
        // Listen only for pointer and touch events
        var eventsHandler = {
            haltEventListeners: ['touchstart','touchend', 'touchmove', 'touchleave', 'touchcancel']
            , init: function(options) {
                var instance = options.instance
                    , initialScale = 1
                    , pannedX = 0
                    , pannedY = 0

                this.hammer = Hammer(options.svgElement, {
                    inputClass: Hammer.SUPPORT_POINTER_EVENTS ? Hammer.PointerEventInput : Hammer.TouchInput
                })

                // Enable pinch
                this.hammer.get('pinch').set({enable: true})

                // Handle double tap
                //this.hammer.on('doubletap', function(ev){
                //    instance.zoomIn()
                //})

                // Handle pan
                this.hammer.on('pan panstart panend', function(ev){
                    console.log('pan')
                    // On pan start reset panned variables
                    if (ev.type === 'panstart') {
                        pannedX = 0
                        pannedY = 0
                    }

                    // Pan only the difference
                    if (ev.type === 'pan' || ev.type === 'panend') {

                        instance.panBy({x: ev.deltaX - pannedX, y: ev.deltaY - pannedY})
                        pannedX = ev.deltaX
                        pannedY = ev.deltaY
                    }
                })

                this.hammer.on('press tap click',function(ev){
                    console.log('ev',ev);
                    if(d3.select(ev.target).classed('store')){
                        var _this =  d3.select(ev.target);
                        if(selectFromMode == true){
                            setFromPoint({
                                id:_this.attr('id'),
                                x:JSON.parse(_this.attr('cp'))[0],
                                y:JSON.parse(_this.attr('cp'))[1]
                            });
                        }else if(selectEndMode == true){
                            setEndPoint({
                                id:_this.attr('id'),
                                x:JSON.parse(_this.attr('cp'))[0],
                                y:JSON.parse(_this.attr('cp'))[1]
                            });
                        }else{
                            if(!_this.classed('selected')){
                                d3.selectAll('.store').classed('selected',false);
                                _this.classed('selected',true);
                                setStoreInfo(_this.attr('id'));
                            }
                        }
                    }
                    clearSelection();
                });

                // Handle pinch
                this.hammer.on('pinch pinchstart pinchend', function(ev){
                    // On pinch start remember initial zoom
                    console.log('pinch');
                    if (ev.type === 'pinchstart') {
                        initialScale = instance.getZoom()
                        instance.zoom(initialScale * ev.scale)
                    }

                    // On pinch zoom
                    if (ev.type === 'pinch' || ev.type === 'pinchend') {
                        instance.zoom(initialScale * ev.scale)
                    }
                })

                // Prevent moving the page on some devices when panning over SVG
                options.svgElement.addEventListener('touchmove', function(e){ e.preventDefault(); });
            }

            , destroy: function(){
                this.hammer.destroy()
            }
        }

        svgPanZoom('#mainSvg',{
            viewportSelector: '.svg-pan-zoom_viewport'
            , panEnabled: true
            //, controlIconsEnabled: true
            , zoomEnabled: true
            , dblClickZoomEnabled: false
            , zoomScaleSensitivity: 0.2
            , minZoom: 1
            , maxZoom: 2
            , fit: true
            , center: true
            , refreshRate: 'auto'
            , beforePan: beforePan
            ,customEventsHandler: eventsHandler
        });

        //svg-pan-zoom end



    }
});