'use strict';
angular.module('table99', [
    'ngStorage',
    'table99.config',
    'table99.controllers',
    'table99.services',
    'table99.directives',
    'ui.router',
    'ui.bootstrap',
    'slickCarousel',
    'ngFileUpload',
    'ngMaterial',
    'angular-loading-bar',
    'ngCordova',
    'angularMoment',
    'angular.socket-io'
])
.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$mdDialogProvider',
    function($stateProvider, $urlRouterProvider, $locationProvider, $mdDialogProvider) {
         
        $mdDialogProvider.addPreset('updateDisplayName', {
            options: function() {
                return {
                    templateUrl:"templates/nameDialog.html",
                    controller: "nameDialogCtrl",
                };
            }
        });
        $mdDialogProvider.addPreset('updateAvatar', {
            options: function() {
                return {
                    templateUrl:"templates/avatarDialog.html",
                    controller: "avatarDialogCtrl",
                };
            }
        });
        $mdDialogProvider.addPreset('updateBackground', {
            options: function() {
                return {
                    templateUrl:"templates/backgroundDialog.html",
                    controller: "backgroundDialogCtrl",
                };
            }
        });
        $mdDialogProvider.addPreset('shop', {
            options: function() {
                return {
                    templateUrl:"templates/shopDialog.html",
                    controller: "shopDialogCtrl",
                };
            }
        });
        $mdDialogProvider.addPreset('share', {
            options: function() {
                return {
                    templateUrl:"templates/shareDialog.html",
                    controller: "shareCtrl",
                };
            }
        });
         
        $mdDialogProvider.addPreset('rules', {
            options: function() {
                return {
                    templateUrl:"templates/rulesDialog.html",
                    controller: "rulesDialogCtrl",
                };
            }
        });
        $mdDialogProvider.addPreset('bonus', {
            options: function() {
                return {
                    templateUrl:"templates/bonusDialog.html",
                    controller: 'bonusDialogCtrl',
                };
            }
        });

        $urlRouterProvider.otherwise("/home");

        $stateProvider
            .state('home', {
                url: "/home",
                templateUrl: "templates/home.html",
                controller: "homeCtrl"
            })
            .state('signin', {
                url: "/signin",
                templateUrl: "templates/signin.html",
                controller: "signInCtrl"
            })
            .state('signup', {
                url: "/signup",
                templateUrl: "templates/signup.html",
                controller: "signUpCtrl"
            })
            .state('tables', {
                url: "/tables",
                templateUrl:  "templates/tables.html",
                controller: "tablesCtrl"
            })
            .state('play', {
                url: "/play/:id",
                templateUrl: "templates/play.html",
                controller: "playCtrl"
            })
            .state('shop', {
                url: "/shop",
                templateUrl: "templates/shopDialog.html",
                controller: "shopDialogCtrl"
            })
            .state('createTable', {
                url: "/createTable",
                templateUrl: "templates/createTable.html",
                controller: "createTableCtrl"
            })
            .state('userPlay', {
                url: "/userPlay/:id/:ref",
                templateUrl: "templates/userPlay.html",
                controller: "userPlayCtrl"
            });
    }
])
.run(function($rootScope, $localStorage, $cordovaNetwork, $state, $window) {
    
     $window.addEventListener('LaunchUrl', function(event) {
        debugger;
        if(event.detail.url.indexOf('table99') > -1){
            var gameId = event.detail.url.split('/')[3];
            $state.go('userPlay', {'id': gameId, 'ref': true});
        }
    });
    if($localStorage){
        $localStorage.LOADING = false;
    }
     
    ionic.Platform.ready(function() {
        ionic.Platform.fullScreen();
        if (window.StatusBar) {
            return StatusBar.hide();
        }
    });
     
    if(ionic.Platform.isWebView()){
        $rootScope.$on('$cordovaNetwork:online', function(event, networkState){});
        $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
            alert('Oops, internet is not availble in your device, Try to re-connect after some time.');
        });
     
     }
     else {
        window.addEventListener("online", function(e) {}, false);
        window.addEventListener("offline", function(e) {debugger;
                        alert('Oops, internet is not availble in your system, Try to re-connect after some time.');
                      }, false);
     
     }
})
angular.module('table99.config', []).constant('BASE_URL','http://ec2-35-154-102-213.ap-south-1.compute.amazonaws.com:3000/');
angular.module('table99.controllers', []);
angular.module('table99.directives', []);
angular.module('table99.services', []);
angular.module('table99.directives').directive('tableDealer', [

    function() {
        return {
            scope: {
                dealer: '='
            },
            templateUrl: 'table.dealer.html',
            link: function(scope, element, attrs) {

            }
        }


    }
]);
angular.module('table99.directives').directive('playingCardsSet', [

    function() {
        return {
            scope: {
                player: '=',
                cardSet: '=',
                slot: '=',
                seeMyCards: '&seeMyCards'
            },
            templateUrl: 'playing.card.set.html',
            link: function(scope, element, attrs) {
                var lmargin = attrs.lmargin || 20;
                lmargin = lmargin * 1;
                scope.getCardStyle = function($index, data) {
                    var idx = $index + 1;
                    return {
                        'left': (-20 + idx * lmargin) + idx * 2,
                        'transform': ' rotate(' + ((-43 + (idx * 1) * 25) - idx * 5) + 'deg)'
                    };
                }
            }
        }
    }
]);
angular.module('table99.directives').directive('playingCard', [
    function() {
        return {
            scope: {
                card: '='
            },
            templateUrl: 'playing.card.html',
            link: function(scope, element, attrs) {}
        }


    }
]);
angular.module('table99.directives').directive('sidePlayer', ['$filter', 'soundService', '$mdDialog', '$timeout', '$interval', '$localStorage',
    function($filter, soundService, $mdDialog, $timeout, $interval, $localStorage) {
        return {
            scope: {
                table: '=',
                player: '='
            },
            templateUrl: 'side.player.html',
            link: function(scope, element, attrs) {
                function doAnimation(args, reverse) {
                    var animateDiv = $('<div  class="animate-bet alert alert-warning"><i class="fa fa-rupee"></i> ' + $filter('number')(args.amount) + '</div>').appendTo("body")
                    var animateTo = $(".table-bet").offset();
                    var animateFrom = $(element).find(".side-player-outer").offset();
                    animateFrom.top += 20;
                    animateFrom.left += 10;
                    animateTo.left += 25;
                    animateTo.top += 10;
                    if (reverse) {
                        var temp = animateFrom;
                        animateFrom = animateTo;
                        animateTo = temp;
                    }
                    animateDiv.css(animateFrom);
                    animateDiv.fadeIn(function() {
                        animateDiv.animate(animateTo, args.timeout || 1000, function() {
                            animateDiv.fadeOut(function() {
                                animateDiv.remove();
                                if (args.callback && typeof(args.callback) === 'function') {
                                    args.callback();
                                }
                            });
                        });
                    });
                }
                function doGiftAnimation (args) {
                    var animateDiv = $("<div style='height: 50px;width: 50px;background-size: contain;background-repeat:no-repeat;background-position:center;position: absolute;z-index: 99;"+args.image+"' ></div>").appendTo("body"),
                        animateFrom = args.from,
                        animateTo = args.to;

                    animateFrom.top += 40;
                    animateFrom.left += 40;
                    animateTo.left += 40;
                    animateTo.top += 40;
                    animateDiv.css(animateFrom);
                    animateDiv.fadeIn(function() {
                        animateDiv.animate(animateTo, 1000, function() {
                            $timeout(function(){
                                animateDiv.remove();
                            }, 5000);
                        });
                    });
                }
                function doCardDistributionAnimation(args) {
                    if(!$localStorage.cardAnimationRunning)
                        return;
                                                              
                    var counter = 2;
                    var interval = $interval(function() {
                        var animateDiv = $("<div class='deck-card spin counter-"+counter+"' style='width: 20px;height: 30px;border: 1px solid #FFF;'></div>").appendTo("body > .container");
                        var animateTo = $(element).find(".side-player-outer").offset();
                        var animateFrom = $(".table-bet").offset();
                            animateFrom.top += 10;
                            animateFrom.left += 10;
                            animateTo.left += 80;
                            animateTo.top += 60;
                            animateDiv.css(animateFrom);
                            animateDiv.fadeIn(function() {
                                soundService.card();
                                animateDiv.animate(animateTo, args.timeout || 500, function() {
                                    $('.deck-card').removeClass('spin');
                                    $('.deck-card.counter-2').addClass('rotate-right');
                                    $('.deck-card.counter-0').addClass('rotate-left');
                                });
                            });
                                             
                            if(counter == 0){
                                $localStorage.cardAnimationRunning = false;
                                $interval.cancel(interval);
                            }
                            counter--;
                    }, 1000);
                }

                var performBetAnimation = scope.$on('performBetAnimation', function(evt, args) {
                    if (scope.player && scope.player.turn) {
                        soundService.coin();
                        doAnimation({
                            amount: args.bet,
                            timeout: args.timeout
                        });
                    }
                });
                var performWinnerAnimation = scope.$on('performWinnerAnimation', function(evt, args) {
                    if (scope.player && scope.player.winner) {
                        soundService.loser();
                        doAnimation({
                            amount: args.bet,
                            timeout: args.timeout,
                            callback: args.callback
                        }, true);
                    }
                });
                var performBootAnimation = scope.$on('performBootAnimation', function(evt, args) {
                    if (scope.player && scope.player.active) {
                        soundService.coin();
                        doAnimation({
                            amount: args.boot,
                            timeout: args.timeout
                        });
                        $timeout(function(){
                            $('.deck-card').remove();
                        }, args.timeout);
                    }
                });
                var performCardDistributionAnimation = scope.$on('performCardDistributionAnimation', function(evt, args) {
                    if (scope.player && scope.player.active) {
                        doCardDistributionAnimation({
                            timeout: args.timeout
                        });
                    }
                });
                var performGiftAnimation = scope.$on('performGiftAnimation', function(evt, args) {

                    var from = $("input[value="+args.from+"]").offset(),
                        to = $("input[value="+args.to+"]").offset();
                    args.image = args.image.replace('../images/', 'images/');
                    doGiftAnimation({
                        from: from,
                        to: to,
                        image: args.image,
                    });
                });
                var updatePlayerSuccess = scope.$on('updatePlayerSuccess', function(evt, args) {
                    if(scope.player && scope.player.active && scope.player.playerInfo.id == args.playerId){
                        scope.player.playerInfo[args.field] = args.value;
                        scope.$apply();
                    }
                });
                                                              
                scope.share = function(event){
                    if(scope.player && scope.player.active){
                        $mdDialog.show(
                            $mdDialog.share({
                                scope: scope,
                                preserveScope: true,
                                parent: angular.element(document.body),
                                targetEvent: event,
                                locals: {
                                    SOURCE: angular.element(document.body).find(".current-player-id").val(),
                                    DESTINATION: $(element).find(".side-player-id").val(),
                                    USER: scope.$parent.currentPlayer.playerInfo,
                                    TABLE_ID: scope.$parent.tableId
                                },
                            })
                        );
                    }
                };
                scope.playerAvatarClass = function(player){
                    var className = '';
                    if(player && player.playerInfo)
                        className = (player.playerInfo.avatar.indexOf('character') > -1) ? player.playerInfo.avatar : 'custom-character';
                    
                    return className;
                };
                                                              
                scope.$on('$destroy', function(){
                    performBetAnimation();
                    performWinnerAnimation();
                    performBootAnimation();
                    performGiftAnimation();
                    performCardDistributionAnimation();
                    updatePlayerSuccess();
                });
            }
        };
    }
]);
angular.module('table99.directives').directive('mainPlayer', ['$filter', 'soundService', '$timeout', '$interval', '$localStorage',
    function($filter, soundService, $timeout, $interval, $localStorage) {
        var BLIND_ALLOWED = 4;
        return {
            scope: {
                player: '=',
                table: '=',
                seeMyCards: '&seeMyCards',
                placeBet: '&placeBet',
                placePack: '&placePack',
                placeSideShow: '&placeSideShow',
                respondSideShow: '&respondSideShow'
            },
            templateUrl: 'main.player.html',
            link: function(scope, element, attrs) {
                function doAnimation(args, reverse) {
                    var animateDiv = $('<div class="animate-bet alert alert-warning"><i class="fa fa-rupee"></i> ' + $filter('number')(args.amount) + '</div>').appendTo("body")
                    var animateTo = $(".table-bet").offset();
                    var animateFrom = $(element).find(".current-player-outer").offset();
                    animateFrom.top += 20;
                    animateFrom.left += 100;
                    animateTo.left += 25;
                    animateTo.top += 10;
                    if (reverse) {
                        var temp = animateFrom;
                        animateFrom = animateTo;
                        animateTo = temp;
                    }
                    animateDiv.css(animateFrom);
                    animateDiv.fadeIn(function() {
                        animateDiv.animate(animateTo, args.timeout || 1000, function() {
                            animateDiv.fadeOut(function() {
                                animateDiv.remove();
                                if (args.callback && typeof(args.callback) === 'function') {
                                    args.callback();
                                }
                            });
                        });
                    });
                }
                function doGiftAnimation (args) {
                    var animateDiv = $("<div style='height: 50px;width: 50px;background-size: contain;background-repeat:no-repeat;background-position:center;position: absolute;z-index: 99;"+args.image+"' ></div>").appendTo("body"),
                        animateFrom = args.from,
                        animateTo = args.to;

                    animateFrom.top += 40;
                    animateFrom.left += 40;
                    animateTo.left += 40;
                    animateTo.top += 40;
                    animateDiv.css(animateFrom);
                    animateDiv.fadeIn(function() {
                        animateDiv.animate(animateTo, 1000, function() {
                            $timeout(function(){
                                animateDiv.remove();
                            }, 5000);
                        });
                    });
                }
                function doCardDistributionAnimation(args) {
                    if(!$localStorage.cardAnimationRunning)
                        return;
                                                 
                    var counter = 2;
                    var interval = $interval(function() {
                        var animateDiv = $("<div class='deck-card spin counter-"+counter+"' style='width: 30px;height: 50px;border: 2px solid #FFF;'></div>").appendTo("body > .container");
                        var animateTo = $(element).find(".current-player-outer").offset();
                        var animateFrom = $(".table-bet").offset();
                        animateFrom.top += 20;
                        animateFrom.left += 10;
                        animateTo.left += 70;
                        animateTo.top += 50;
                        animateDiv.css(animateFrom);
                        animateDiv.fadeIn(function() {
                            soundService.card();
                            animateDiv.animate(animateTo, args.timeout || 500, function() {
                                $('.deck-card.counter-2').addClass('rotate-right');
                                $('.deck-card.counter-0').addClass('rotate-left');
                            });
                        });
            
                        if(counter == 0){
                            $localStorage.cardAnimationRunning = false;
                            $interval.cancel(interval);
                        }
                        counter--;
                    }, 1000);
                }

                var performBetAnimation = scope.$on('performBetAnimation', function(evt, args) {
                    if (scope.player && scope.player.turn) {
                        soundService.coin();
                        doAnimation({
                            amount: args.bet,
                            timeout: args.timeout
                        });
                    }
                });
                var performWinnerAnimation = scope.$on('performWinnerAnimation', function(evt, args) {
                    if (scope.player && scope.player.winner) {
                        soundService.winner();
                        doAnimation({
                            amount: args.bet,
                            timeout: args.timeout,
                            callback: args.callback
                        }, true);
                    }
                });
                var performCardDistributionAnimation = scope.$on('performCardDistributionAnimation', function(evt, args) {
                    if (scope.player && scope.player.active) {
                        doCardDistributionAnimation({
                            timeout: args.timeout
                        });
                    }
                });
                var performBootAnimation = scope.$on('performBootAnimation', function(evt, args) {
                    if (scope.player && scope.player.active) {
                        soundService.coin();
                        doAnimation({
                            amount: args.boot,
                            timeout: args.timeout
                        });
                        $timeout(function(){
                            $('.deck-card').remove();
                        }, args.timeout);
                    }

                });
                var performGiftAnimation = scope.$on('performGiftAnimation', function(evt, args) {
                    var from = $("input[value="+args.from+"]").offset(),
                        to = $("input[value="+args.to+"]").offset();
                    args.image = args.image.replace('../images/', 'images/');
                    doGiftAnimation({
                        from: from,
                        to: to,
                        image: args.image,
                    });
                });
                var updatePlayerSuccess = scope.$on('updatePlayerSuccess', function(evt, args) {
                    if(scope.player && scope.player.active && scope.player.playerInfo.id == args.playerId){
                        scope.player.playerInfo[args.field] = args.value;
                        scope.$apply();
                    }
                });
                
                scope.disableActions = false;
                scope.playerAvatarClass = function(player){
                    var className = '';
                    if(player && player.playerInfo)
                        className = (player.playerInfo.avatar.indexOf('character') > -1) ? player.playerInfo.avatar : 'custom-character';
                                                              
                    return className;
                };
                scope.pack = function() {
                    scope.player.lastAction = "Packed";
                    scope.player.lastBet = "";
                    scope.player.packed = true;
                    scope.disableActions = true;
                    scope.placePack();
                };
                scope.blind = function() {
                    scope.table.lastBlind = true;
                    scope.table.lastBet = scope.possibleBet;
                    scope.player.lastAction = "Blind";
                    scope.player.lastBet = scope.possibleBet;
                    scope.disableActions = true;
                    scope.blindCount++;
                    scope.placeBet();
                };
                scope.chaal = function() {
                    scope.player.lastAction = "Chaal";
                    scope.player.lastBet = scope.possibleBet;
                    scope.table.lastBlind = false;
                    scope.table.lastBet = scope.possibleBet;
                    scope.placeBet();
                    scope.disableActions = true;
                };
                scope.show = function() {
                    scope.player.lastAction = "Show";
                    scope.player.lastBet = scope.possibleBet;
                    scope.table.lastBlind = scope.player.cardSet.closed;
                    scope.table.lastBet = scope.possibleBet;
                    scope.player.show = true;
                    scope.placeBet();
                    scope.disableActions = true;
                };
                scope.sideshow = function() {
                    scope.player.lastAction = "Side Show";
                    scope.table.lastBlind = false;
                    scope.table.lastBet = scope.possibleBet;
                    scope.player.sideshow = true;
                    scope.disableActions = true;
                    scope.placeSideShow();
                };
                scope.acceptSideShow = function() {
                    scope.player.lastAction = "Accepted";
                    scope.respondSideShow();
                };
                scope.denySideShow = function() {
                    scope.player.lastAction = "Denied";
                    scope.respondSideShow();
                };
                scope.changeBet = function(type) {
                    switch (type) {
                        case '-':
                            scope.possibleBet = scope.possibleBet / 2;
                            break;
                        case '+':
                            scope.possibleBet = scope.possibleBet * 2;
                            break;
                    }
                    updateButtons();
                }
                scope.plus = function() {
                    scope.changeBet('+');
                }
                scope.minus = function() {
                    scope.changeBet('-');
                }
                scope.$on('startNew', function(args) {
                    if (scope.player && scope.player.active) {
                        setInitialValues();
                    }
                });
                scope.$watch('table', function(newVal) {
                    if (newVal) {
                        updatePossibleBet();
                        updateButtons();
                    }
                });
                scope.$watch('player.turn', function(newVal) {
                    if (newVal === false) {
                        scope.disableActions = false;
                    } else {
                        if (scope.blindCount >= BLIND_ALLOWED) {
                            scope.seeMyCards();
                        }
                    }
                });
                scope.$watch('player.cardSet.closed', function(newVal) {
                    if (newVal === false) {
                        updatePossibleBet();
                    }
                });
                scope.$on('$destroy', function(){
                    performBetAnimation();
                    performWinnerAnimation();
                    performBootAnimation();
                    performGiftAnimation();
                    performCardDistributionAnimation();
                    updatePlayerSuccess();
                });


                function setInitialValues() {
                    scope.blindCount = 0;
                }
                function updatePossibleBet() {
                    scope.possibleBet = getLastBet();
                    updateButtons();
                }
                function updateButtons() {
                    var minBet = getLastBet();
                    scope.disableMinus = (scope.possibleBet == minBet) || !(scope.possibleBet > minBet);
                    scope.disablePlus = ((scope.possibleBet == minBet * 2) && (scope.possibleBet <= scope.table.maxBet)) || (scope.possibleBet >= scope.table.maxBet / 2 && scope.player.cardSet.closed) || (scope.possibleBet >= scope.table.maxBet && !scope.player.cardSet.closed);
                }
                function getLastBet() {
                    if(scope.player.cardSet){
                        if (scope.player.cardSet.closed) {
                            if (scope.table.lastBlind == true) {
                                return scope.table.lastBet;
                            } else {
                                return scope.table.lastBet / 2;
                            }
                        } else {
                            if (scope.table.lastBlind == true) {
                                return scope.table.lastBet * 2;
                            } else {
                                return scope.table.lastBet;
                            }
                        }
                    }
                }

                setInitialValues();
            }
        };
    }
]);
angular.module('table99.directives').directive('tableNotifications', [

    function() {
        return {
            scope: {
                showMessage: '=',
                message: '=',
                eventOn: '='
            },
            templateUrl: 'table.notifications.html',
            link: function(scope, element, attrs) {
                scope.$watch('showMessage', function(newVal, oldVal) {
                    if (newVal === true) {
                        element.find('.text-message').fadeIn('slow');
                    } else if (newVal === false) {
                        element.find('.text-message').fadeOut('slow');
                    } else {
                        element.find('.text-message').hide();
                    }
                });
            }
        }


    }
]);
angular.module('table99.directives').directive('tableBet', [

    function() {
        return {
            scope: {
                table: '='
            },
            templateUrl: 'table.bet.html',
            link: function(scope, element, attrs) {
                scope.$watch('table.showAmount', function(newVal) {
                    if (newVal === true) {
                        fadeInBet();
                    } else if (newVal === false) {
                        fadeOutBet();
                    }
                });

                function fadeOutBet() {
                    var $betInfo = element.find('.bet-info');
                    $betInfo.fadeOut();
                }

                function fadeInBet() {
                    var $betInfo = element.find('.bet-info');
                    $betInfo.fadeIn();
                }

                scope.$on('performWinnerAnimation', function() {
                    fadeOutBet();
                });
            }
        }


    }
]);
angular.module('table99.directives').directive('tableInfo', [ 'soundService',
    function(soundService) {
        return {
            scope: {
                table: '=',
            },
            templateUrl: 'table.info.html',
            link: function(scope, element, attrs) {
                scope.close = function(){
                    scope.$parent.tableInfoOpen = false;
                    soundService.buttonClick();
                }
            }
        }
    }
]);
angular.module('table99.directives').directive('useravatarfile', function () {
    return {
        restrict: 'A',
        link: function(scope, element) {
            element.bind('click', function(e) {
                angular.element(e.target).siblings('#upload').trigger('click');
            });
        }
    };
});
angular.module('table99.directives').directive("scrollBottom", ['$timeout', function($timeout){
    return {
        link: function(scope, element, attr){
            $(element).on("click", function(){
                var element= $("#" + attr.scrollBottom);
                scrollToBottom(element);
            });
            scope.$on('scrollToBottom',function(event, data){
                var element= $("#chat-list");
                scrollToBottom(element);
            });

            function scrollToBottom(element){
                $timeout(function(){
                    element.animate({scrollTop: element[0].scrollHeight}, 1000);
                }, 500);
            }
        }
    }
}]);

angular.module('table99.services').factory('soundService', ['$cordovaMedia',
    function($cordovaMedia) {
        var buttonMedia = $cordovaMedia.newMedia('sounds/click.mp3'),
            exitMedia = $cordovaMedia.newMedia('sounds/exit.mp3'),
            winnerMedia = $cordovaMedia.newMedia('sounds/applaused.mp3'),
            loserMedia = $cordovaMedia.newMedia('sounds/curse.mp3'),
            swipeMedia = $cordovaMedia.newMedia('sounds/swipe.mp3'),
            alertMedia = $cordovaMedia.newMedia('sounds/alert.mp3'),
            cardMedia = $cordovaMedia.newMedia('sounds/card.mp3'),
            coinMedia = $cordovaMedia.newMedia('sounds/coin.mp3');
                                                            
        var iOSPlayOptions = {
            numberOfLoops: 1,
            playAudioWhenScreenIsLocked : false
        }
                                                            
        return {
            buttonClick: function(){
                buttonMedia.play(iOSPlayOptions);
            },
            exitClick: function(){
                exitMedia.play(iOSPlayOptions);
            },
            arrowClick: function(){
                swipeMedia.play(iOSPlayOptions);
            },
            winner: function(){
                winnerMedia.play(iOSPlayOptions);
            },
            loser: function(){
                loserMedia.play(iOSPlayOptions);
            },
            alert: function(){
                alertMedia.play(iOSPlayOptions);
            },
            card: function(){
                cardMedia.play(iOSPlayOptions);
            },
            coin: function(){
                coinMedia.play(iOSPlayOptions);
            }
        };
    }
]);
angular.module('table99.services').factory('layoutService', [
    function() {
        return {
            layoutClass: {
                homeLayout: 'home-layout',
                bodyLayout: 'body-layout',
                gameLayout: 'game-layout'
            }
        };
    }
]);
angular.module('table99.services').factory('cardService', [
    function() {

    }
]);
angular.module('table99.services').factory('userService', ['$http', 'BASE_URL',
    function($http, BASE_URL) {
        return {
            getUser: function(params) {
                return $http.post(BASE_URL + 'user/get', params);
            },
            signin: function(params) {
                return $http.post(BASE_URL + 'user/signin', params);
            },
            updateAvatar: function(params) {
                return $http.post(BASE_URL + 'user/updateAvatar', params);
            },
            updateDisplayName: function(params) {
                return $http.post(BASE_URL + 'user/updateDisplayName', params);
            },
            updateBalance: function(params) {
                return $http.post(BASE_URL + 'user/updateBalance', params);
            },
            signup: function(params) {
                return $http.post(BASE_URL + 'user/signup', params);
            },
            fbsignin: function(params) {
                return $http.post(BASE_URL + 'user/fbsignin', params);
            },
            getBonus: function(params) {
                return $http.post(BASE_URL + 'user/getBonus', params);
            },
            creditBonus: function(params) {
                return $http.post(BASE_URL + 'user/creditBonus', params);
            },
            updateBonusTime: function(params){
                return $http.post(BASE_URL + 'user/updateBonusTime', params);
            },
        };
    }
]);
angular.module('table99.services').factory('tableService', ['$http', 'BASE_URL',
    function($http, BASE_URL) {
        return {
            getAvailableSystemTables: function(params) {
                return $http.post (BASE_URL + 'tables/getAvailableSystemTables', params);
            },
            getSystemTable: function(params) {
                return $http.post (BASE_URL + 'tables/getSystemTable', params);
            },
            getCustomTable: function(params) {
                return $http.post (BASE_URL + 'tables/getCustomTable', params);
            },
            saveChat: function(params){
                return $http.post (BASE_URL + 'tables/saveChat', params);
            },
            loadChats: function(params){
                return $http.post (BASE_URL + 'tables/loadChats', params);
            },
            createCustomTable: function(params){
                return $http.post (BASE_URL + 'tables/createCustomTable', params);
            },
            getCustomTables: function(params){
                return $http.post (BASE_URL + 'tables/getCustomTables', params);
            },
            loadGifts: function(params){
                return $http.post (BASE_URL + 'tables/loadGifts', params);
            },
        };
    }
]);
angular.module('table99.services').factory('socket',
    function(socketFactory) {
        return socketFactory({
            ioSocket: io.connect("http://ec2-35-154-102-213.ap-south-1.compute.amazonaws.com:3000/")
        });
    }
);

angular.module('table99.controllers').controller('table99Ctrl', ['$scope', 'cardService',
    function($scope, cardService) {

    }
]);
angular.module('table99.controllers').controller('homeCtrl', ['$rootScope', '$scope', '$timeout', '$state', 'layoutService',
    function($rootScope, $scope, $timeout, $state, layoutService) {
        $rootScope.layout = layoutService.layoutClass.homeLayout;
        //$rootScope.background = {'background-image': 'none' };
        
        $timeout(function(){
            $state.go('signin',{});
        }, 5000);
    }
]);
angular.module('table99.controllers').controller('signUpCtrl', ['$rootScope', '$localStorage', '$scope', 'userService',
    '$state', 'layoutService', 'soundService',
    function($rootScope, $localStorage, $scope, userService, $state, layoutService, soundService) {
        $scope.guest = {};
        $rootScope.layout = layoutService.layoutClass.bodyLayout;

        if($localStorage && $localStorage.USER && $localStorage.USER){
            $state.go('tables', {});
        }

        if($localStorage.BACKGROUND){
            $rootScope.background = $localStorage.BACKGROUND;
        }

        $scope.signup = function() {
            soundService.buttonClick();
            if(!$scope.guest.name || !$scope.guest.email || !$scope.guest.password)
                return;

            userService.signup({
                name: $scope.guest.name,
                email: $scope.guest.email,
                password: $scope.guest.password,
            }).success(function(res) {
                if (res.status == 'success') {
                    alert(res.data.name + ", You have sucessfully registerd.");
                    $state.go('signin', {});
                }

                if (res.status == 'failed') {
                    if(res.message == 'VALIDATION_FAILED'){
                        alert("Please fill the required fields");
                    }
                    if(res.message == 'PROBLEM_SIGNUP'){
                        alert("Problem in signing up, Please try again later");
                    }
                    if(res.message == 'ALREADY_REGISTERED'){
                        alert("You have already registerd, Try signing in instead");
                    }
                }
            });
        }
        $scope.goSignIn = function(){
            soundService.buttonClick();
            $state.go('signin',{});
        };
    }
]);
angular.module('table99.controllers').controller('signInCtrl', ['$rootScope', '$localStorage', '$scope', 'userService',
    '$state', 'layoutService', 'soundService',
    function($rootScope, $localStorage, $scope, userService, $state, layoutService, soundService) {
        $rootScope.layout = layoutService.layoutClass.bodyLayout;
        $scope.user = {};

        if($localStorage && $localStorage.USER && $localStorage.USER.LOGGEDIN){
            $state.go('tables', {});
        }

        if($localStorage.BACKGROUND){
            $rootScope.background = $localStorage.BACKGROUND;
        }

        $scope.signin = function() {
            soundService.buttonClick();
            userService.signin({
                email: $scope.user.email,
                password: $scope.user.password,
            }).success(function(res) {
                if (res.status == 'success') {
                    var user = res.data;
                    user.LOGGEDIN = true;
                    $localStorage.USER = user;
                    $state.go('tables', {});
                }

                if (res.status == 'failed') {
                    if(res.message == "USER_NOT_FOUND"){
                        alert("Invalid username & Password");
                    }
                    if(res.message == "PROBLEM_SIGNIN"){
                        alert("Problem in signing in, Please try again later");
                    }
                    if(res.message == "VALIDATION_FAILED"){
                        alert("Please provide email & password");
                    }
                }
            })
        }
        $scope.signInUsingFB = function(){
            soundService.buttonClick();

            function onError(){
                alert('Problem fetching facebook details, Please try again later');
            }

            window.facebookConnectPlugin.getLoginStatus(function(response) {
                if (response.status === 'connected'){
                    window.facebookConnectPlugin.api("me/?fields=email,first_name,last_name,picture.width(100).height(100)",["email","public_profile"],
                        function (response) {
                            if(response && response.first_name && response.last_name && response.email && response.picture){
                                var name = response.first_name +" "+ response.last_name,
                                    email = response.email,
                                    picture = response.picture.data.url;

                                facebookSignIn(name, email, picture);
                            }
                            else{
                                onError();
                            }
                        },
                        onError);
                }
                else{
                    window.facebookConnectPlugin.login(['email','public_profile'],
                    function (response) {
                        if (response.status === 'connected'){
                            window.facebookConnectPlugin.api("me/?fields=email,first_name,last_name,picture.width(200).height(200)",["email","public_profile"],
                                function (response) {
                                    if(response && response.first_name && response.last_name && response.email && response.picture){
                                        var name = response.first_name +" "+ response.last_name,
                                            email = response.email,
                                            picture = response.picture.data.url;

                                        facebookSignIn(name, email, picture);
                                    }
                                    else{
                                        onError();
                                    }
                                },onError);
                        }
                    });
                }
            });
        }
        $scope.goSignUp = function(){
            soundService.buttonClick();
            $state.go('signup',{});
        };

        function facebookSignIn(name, email, picture){
            userService.fbsignin({
                name: name,
                email: email,
                picture: picture,
            }).success(function(res) {
                if (res.status == 'success') {
                    var user = res.data;
                    user.LOGGEDIN = true;
                    $localStorage.USER = user;
                    $state.go('tables', {});
                }
                if (res.status == 'failed') {
                    if(res.message == 'PROBLEM_SIGNUP'){
                        alert("Problem in signing in using facebook, Please try again later");
                    }
                    if(res.message == 'ALREADY_REGISTERED'){
                        var user = res.data;
                        user.LOGGEDIN = true;
                        $localStorage.USER = user;
                        $state.go('tables', {});
                    }
                }
            });
        }
    }
]);
angular.module('table99.controllers').controller('tablesCtrl', ['$rootScope', '$localStorage', '$scope', 'tableService', '$state', 'layoutService', 'soundService', '$mdDialog', 'userService', '$interval', '$window',
    function($rootScope, $localStorage, $scope, tableService, $state, layoutService, soundService, $mdDialog, userService, $interval, $window) {
        $rootScope.layout = layoutService.layoutClass.gameLayout;
        $scope.bonusObj = {};
        $scope.background = '';
        $scope.user = {};
        $scope.tables = [];
        $scope.customTables = [];
        $scope.isLoading = false;
        $scope.nextBonusDateShortString = '0 hrs';

        if($localStorage){
            if(!$localStorage.USER){
                $state.go('signin', {});
            }
            else{
                $scope.user = $localStorage.USER;
            }
        }
        else{
            $state.go('signin', {});
        }

        if($localStorage.BACKGROUND){
            $rootScope.background = $scope.background = $localStorage.BACKGROUND;
        }

        $scope.user.avatar = $scope.user.avatar ? $scope.user.avatar : 'background: url(images/default_avatar.jpg);';
        $scope.user.displayName = $scope.user.displayName ? $scope.user.displayName : 'Guest';
        $scope.user.chips = $scope.user.chips ? $scope.user.chips : '0';
        $scope.characterClass = ($scope.user.avatar.indexOf('character') > -1) ? $scope.user.avatar : 'custom-character';

        $scope.$watch('user.avatar', function() {
            $scope.characterClass = ($scope.user.avatar.indexOf('character') > -1) ? $scope.user.avatar : 'custom-character';
        });
        $scope.openUpdateAvatarDialog = function($event){
            soundService.alert();
            $mdDialog.show(
                $mdDialog.updateAvatar({
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    scope: $scope,
                    preserveScope: true,
                    locals: {caller: 'tables'}
                })
            );
        };
        $scope.openChangeNameDialog = function($event){
            soundService.alert();
            $mdDialog.show(
                $mdDialog.updateDisplayName({
                    scope: $scope,
                    preserveScope: true,
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    locals: {caller: 'table'},
                })
            );
        };
        $scope.openChangeBackgroundDialog = function($event){
            soundService.alert();
            $mdDialog.show(
                $mdDialog.updateBackground({
                    scope: $scope,
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    preserveScope: true,
                })
            );
        };
        $scope.openShopDialog = function($event){
            soundService.alert();
            $mdDialog.show(
                $mdDialog.shop({
                    scope: $scope,
                    preserveScope: true,
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    locals: {caller: 'table'},
                })
            );
        };
        $scope.openBonusDialog = function($event){
            soundService.alert();
            $mdDialog.show(
                $mdDialog.bonus({
                    scope: $scope,
                    preserveScope: true,
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    locals: {},
                })
            );
        };

        $scope.slickConfig = {
            variableWidth: true,
            slidesToScroll: 1,
            enabled: true,
            dots: false,
            method: {},
            event: {
                beforeChange: function (event, slick, currentSlide, nextSlide) {
                    soundService.arrowClick();
                },
                afterChange: function (event, slick, currentSlide, nextSlide) {
                    
                }
            }
        };
        $scope.signOut = function(){
            soundService.exitClick();
            if($localStorage.USER){
                $localStorage.USER = undefined;
                $state.go('signin', {});
            }
        };
        $scope.playTable = function(table){
            soundService.buttonClick();
            if(table.type == "SYSTEM"){
                $scope.playSystemTable(table);
            }
            else{
                if(table.action == "ADD"){
                    $state.go('createTable', {});
                }
                else{
                    $scope.playCustomTable(table);
                }
            }
        };
        $scope.playSystemTable = function(table){
            tableService.getAvailableSystemTables({
                potAmount: table.boot_amount,
                maxPlayers: table.max_players,
                userId: $scope.user.id
            }).success(function(res) {
                if (res.status == 'success') {
                    $state.go('play', {id: res.data.id});
                }
                if (res.status == 'failed') {
                    if(res.message == "PROBLEM_FETCH_TABLE"){
                        alert("Problem finding available table, Please try again later");
                    }
                }
            })
        };
        $scope.playCustomTable = function(table){
            $state.go('userPlay', {id: table.id, ref : false});
        };
        $scope.goCreateTable = function(){
            soundService.buttonClick();
            $state.go('createTable',{});
        };
        
        findTables();
        findBonus();

        function findTables(){
            if($scope.isLoading)
                return;

            $scope.isLoading = true;
            tableService.getCustomTables({
                owner: $scope.user.id
            }).success(function(res) {
                $scope.isLoading = false;
                $scope.tables = [{
                    type: 'SYSTEM',
                    boot_amount: 50,
                    max_players: 5,
                    action: "PLAY"
                },{
                    type: 'SYSTEM',
                    boot_amount: 100,
                    max_players: 5,
                    action: "PLAY"
                },{
                    type: 'SYSTEM',
                    boot_amount: 200,
                    max_players: 5,
                    action: "PLAY"
                }];
                if (res.status == 'success') {
                    for(var i=0; i<res.data.length; i++){
                        res.data[i].type = "CUSTOM";
                        res.data[i].action = "PLAY";
                    }
                    $scope.tables = $scope.tables.concat(res.data);
                }
                $scope.tables = $scope.tables.concat( [{
                    name: "ADD TABLE",
                    type: "CUSTOM",
                    action: "ADD"
                }]);
                if (res.status == 'failed') {
                    if(res.message == "NO_TABLE_FOUND"){
                    }
                    if(res.message == "PROBLEM_FETCHING_TABLE"){
                        alert("Problem fetching your tables, Please try again later");
                    }
                }
            })
        }
        function findBonus(){
            userService.getBonus({
                user: $scope.user.id
            }).success(function(res) {
                if (res.status == 'success') {
                    soundService.alert();
                    $scope.bonusObj = res.data;
                    $mdDialog.show(
                        $mdDialog.bonus({
                            scope: $scope,
                            preserveScope: true,
                            parent: angular.element(document.body),
                            locals: {},
                        })
                    );
                }
                if (res.status == 'failed') {
                    if(res.message == 'PROBLEM_FETCHING_BONUS'){
                    }
                    if(res.message == 'ALREADY_CREDITED'){
                       $scope.bonusObj = res.data;
                       var nextDate = moment($scope.bonusObj.received).add('days', 1).unix(),
                       currentDate = moment().unix(),
                       diffTime = nextDate - currentDate,
                       duration = moment.duration(diffTime * 1000, 'milliseconds');
                       
                       var interval = $interval(function() {
                            duration = moment.duration(duration.asMilliseconds() - 1000, 'milliseconds');
                            var d = moment.duration(duration).days(),
                            h = moment.duration(duration).hours(),
                            m = moment.duration(duration).minutes(),
                            s = moment.duration(duration).seconds();
                                                
                            d = $.trim(d).length === 1 ? '0' + d : d;
                            h = $.trim(h).length === 1 ? '0' + h : h;
                            m = $.trim(m).length === 1 ? '0' + m : m;
                            s = $.trim(s).length === 1 ? '0' + s : s;
                                            
                            $scope.nextBonusDateShortString = parseInt(h)+" hrs ";
                                                
                            var remainingSeconds = duration.asSeconds();
                            if(remainingSeconds <= 0){
                                soundService.alert();
                                $mdDialog.show(
                                    $mdDialog.bonus({
                                        scope: $scope,
                                        preserveScope: true,
                                        parent: angular.element(document.body),
                                        targetEvent: $event,
                                        locals: {},
                                    })
                                );
                            }
                            
                        }, 1000);
                }
            }
        });
    }
    }
]);
angular.module('table99.controllers').controller('createTableCtrl', ['$rootScope', '$scope', '$timeout', '$state', 'layoutService',
    '$localStorage', 'soundService', 'tableService', '$filter',
    function($rootScope, $scope, $timeout, $state, layoutService, $localStorage, soundService, tableService, $filter) {
        $rootScope.layout = layoutService.layoutClass.homeLayout;
        $scope.user = {};
        $scope.table = {};

        if($localStorage){
            if(!$localStorage.USER){
                $state.go('signin', {});
            }
            else{
                $scope.user = $localStorage.USER;
            }
        }
        else{
            $state.go('signin', {});
        }

        if($localStorage.BACKGROUND){
            $rootScope.background = $localStorage.BACKGROUND;
        }

        $scope.createTable = function() {
            soundService.buttonClick();

            if($scope.table.minPlayers > 5){
                alert('Minimum players should be less than or equal to five');
                return;
            }
            if($scope.table.maxPlayers > 5){
                alert('Maximum players should be less than or equal to five');
                return;
            }

            var date = $filter('date')(new Date(), "yyyy-MM-dd HH:mm:ss");
            tableService.createCustomTable({
                name: $scope.table.name,
                bootAmount: $scope.table.bootAmount,
                minPlayers: $scope.table.minPlayers,
                maxPlayers:  $scope.table.maxPlayers,
                owner: $scope.user.id,
                date: date
            }).success(function(res) {
                if (res.status == 'success') {
                    alert('Table created successfully');
                    $state.go('tables', {});
                }
                if (res.status == 'failed') {
                    if(res.message == "PROBLEM_TABLE_CREATION"){
                        alert("Problem in creating table, Please try again later");
                    }
                    if(res.message == "VALIDATION_FAILED"){
                        alert("Please fill the required fields");
                    }
                    if(res.message == "ALREADY_CREATED"){
                        alert("A table already exists with same name, Please try using different name");
                    }
                }
            })
        }
    }
]);
angular.module('table99.controllers').controller('playCtrl', ['$rootScope', '$localStorage', '$scope', 'tableService', '$state', '$stateParams', '$filter', '$timeout', 'layoutService', 'soundService', '$mdDialog', 'BASE_URL', 'socket',
    function($rootScope, $localStorage, $scope, tableService, $state, $stateParams,  $filter, $timeout, layoutService, soundService, $mdDialog, BASE_URL, socket) {
        var tableId = $stateParams.id, socket, tableLoadingInProgress = false;
        $rootScope.layout = layoutService.layoutClass.bodyLayout;
        $scope.background = '';
        $scope.user = {};
        $scope.table= {};
        $scope.currentPlayer = {};
        $scope.seatingInfo = {};
        $scope.seatingInfoById = {};
        $scope.chats = [];
        $scope.dealSeat = "";
        $scope.currentTurn = "";
        $scope.isChatWindowOpen = false;
        $scope.chat = {};
        $scope.chat.normal_height = false;
        $scope.tableId = tableId;
        $scope.tableInfoOpen = false;
        $scope.isMenuOpen = false;

        if($localStorage){
            if(!$localStorage.USER){
                $state.go('signin', {});
            }
            else{
                try {
                     $scope.user = $localStorage.USER;
                     $localStorage.cardAnimationRunning = false;
                     fetchTable();
                }
                catch(err) {
                    $state.go('tables', {});
                }
            }
        }
        else{
            $state.go('signin', {});
        }

        if($localStorage.BACKGROUND){
            $rootScope.background = $scope.background = $localStorage.BACKGROUND;
        }

        $scope.user.avatar = $scope.user.avatar ? $scope.user.avatar : 'background: url(images/default_avatar.jpg);';
        $scope.user.displayName = $scope.user.displayName ? $scope.user.displayName : 'Guest';
        $scope.user.chips = $scope.user.chips ? $scope.user.chips : '0';
        $scope.characterClass = ($scope.user.avatar.indexOf('character') > -1) ? $scope.user.avatar : 'custom-character';
                    
        $scope.$on('$locationChangeStart', function(event, next, current) {
            if(!$scope.table.gameStarted)
                return;
                   
            if(confirm('Are you sure wants to left the table')){
                $('.deck-card').remove();
                soundService.exitClick();
                socket.emit('removePlayer', {tableId: tableId, player: $scope.currentPlayer});
                $state.go('tables', {});
            }
        });
        $scope.toggleChatWindow = function(){
            soundService.buttonClick();
            $scope.isChatWindowOpen = !$scope.isChatWindowOpen;
        };
        $scope.onChatBoxBlur = function(){
            $scope.chat.normal_height = true;
        };
        $scope.enterChatMessage = function(){
            soundService.buttonClick();
            var date = $filter('date')(new Date(), "yyyy-MM-dd HH:mm:ss");
            tableService.saveChat({
                table_id: tableId,
                user_id: $scope.user.id,
                message: $scope.chat.message,
                date: date
            }).success(function(res) {
                if (res.status == 'success') {
                    socket.emit('newChatMessageAdded', {
                        table_id: tableId,
                        user_id: $scope.user.id,
                        from: $scope.user.displayName,
                        message: $scope.chat.message,
                        date: $filter('date')(new Date(), "dd MMM yyyy h:mm:ss a")
                    });
                    $scope.chat.message = "";
                }

                if (res.status == 'failed') {
                    if(res.message == 'PROBLEM_ADDING_CHAT'){
                        alert("Problem in chatting, Please try after some time");
                    }
                }
            });
        };
        $scope.autoExpandChatBox = function(e) {
            var element = typeof e === 'object' ? e.target : document.getElementById(e);
            var scrollHeight = element.scrollHeight;
            element.style.height =  (scrollHeight - 10)+ "px";
        };
        $scope.exitGame = function(){
            if(confirm('Are you sure wants to left the table')){
                $('.deck-card').remove();
                soundService.exitClick();
                socket.emit('removePlayer', {tableId: tableId, player: $scope.currentPlayer});
                $state.go('tables', {});
            }
        };
        $scope.seeMyCards = function() {
            socket.emit('seeMyCards', {player: $scope.currentPlayer, tableId: tableId} );
        }
        $scope.placeBet = function() {
            socket.emit('placeBet', {
                tableId: tableId,
                player: $scope.currentPlayer,
                bet: {
                    action: $scope.currentPlayer.lastAction,
                    amount: $scope.table.lastBet,
                    blind: $scope.table.lastBlind,
                    show: $scope.currentPlayer.show
                }
            });
            $scope.currentPlayer.playerInfo.chips -= $scope.table.lastBet;
        }
        $scope.placeSideShow = function() {

            socket.emit('placeSideShow', {
                tableId: tableId,
                player: $scope.currentPlayer,
                bet: {
                    action: $scope.currentPlayer.lastAction,
                    amount: $scope.table.lastBet,
                    blind: $scope.table.lastBlind,
                    show: $scope.currentPlayer.show
                }
            });
            $scope.currentPlayer.playerInfo.chips -= $scope.table.lastBet;
        }
        $scope.respondSideShow = function() {
            socket.emit('respondSideShow', {
                tableId: tableId,
                player: $scope.currentPlayer,
                lastAction: $scope.currentPlayer.lastAction
            });
        }
        $scope.placePack = function() {
            socket.emit('placePack', {
                tableId: tableId,
                player: $scope.currentPlayer,
                bet: {
                    action: $scope.currentPlayer.lastAction,
                    amount: "",
                    blind: false
                }
            });
        }
        $scope.toggleTableInfo = function(){
            soundService.alert();
            if($scope.table && $scope.table.gameStarted){
                $scope.tableInfoOpen = !$scope.tableInfoOpen;
            }
        };
        $scope.toggleMenu = function(){
            soundService.alert();
            $scope.isMenuOpen = !$scope.isMenuOpen;
        };
        $scope.closeMenu = function(){
            soundService.buttonClick();
            $scope.isMenuOpen = false;
        };
        $scope.closeChat = function(){
            soundService.buttonClick();
            $scope.isChatWindowOpen = !$scope.isChatWindowOpen;
        };
        $scope.sendGift = function(args){
            socket.emit('sendGift', args);
        };

        $scope.$watch('user.avatar', function() {
            $scope.characterClass = ($scope.user.avatar.indexOf('character') > -1) ? $scope.user.avatar : 'custom-character';
        });
        $scope.openUpdateAvatarDialog = function($event){
            soundService.alert();
            $mdDialog.show(
                $mdDialog.updateAvatar({
                    scope: $scope,
                    preserveScope: true,
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    locals: {caller: 'game'}
                })
            );
        };
        $scope.openChangeNameDialog = function($event){
            soundService.alert();
            $mdDialog.show(
                $mdDialog.updateDisplayName({
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    scope: $scope,
                    preserveScope: true,
                    locals: {caller: 'game'},
                })
            );
        };
        $scope.updatePlayerOnServer = function(tableId, playerId, field, value){
            socket.emit('updatePlayerOnServer', {tableId: tableId, playerId: playerId, field: field, value: value});
        };
        $scope.openChangeBackgroundDialog = function($event){
            soundService.alert();
            $mdDialog.show(
                $mdDialog.updateBackground({
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    scope: $scope,
                    preserveScope: true,
                })
            );
        };
        $scope.openShopDialog = function($event){
            soundService.alert();
            $mdDialog.show(
                $mdDialog.shop({
                    scope: $scope,
                    preserveScope: true,
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    locals: {caller: 'game'},
                })
            );
        };
        $scope.openShopDialogFromMenu = function(){
            $scope.isMenuOpen = false;
            $scope.openShopDialog();
        };
        $scope.switchTable = function(){
            soundService.buttonClick();
            if(confirm('Are you sure wants to switch the game')){
                socket.emit('removePlayer', {tableId: tableId, player: $scope.currentPlayer});
                tableService.getAvailableSystemTables({
                    potAmount: $scope.table.pot_amount,
                    maxPlayers: $scope.table.max_players,
                    userId: $scope.user.id
                }).success(function(res) {
                    if (res.status == 'success') {
                        $state.go('play', {id: res.data.id});
                    }
                    if (res.status == 'failed') {
                        if(res.message == "PROBLEM_FETCH_TABLE"){
                            alert("Problem finding available table, Please try again later");
                        }
                    }
                })

            }
        }
        $scope.openRulesDialog = function(args){
            $scope.isMenuOpen = false;
            soundService.alert();
            $mdDialog.show(
                $mdDialog.rules({
                    parent: angular.element(document.body),
                })
            );
        };
        $scope.$on('$destroy', function (event) {
            socket.removeAllListeners();
        });

        function loadChats(){
            tableService.loadChats({
                table_id: tableId
            }).success(function(res) {
                if (res.status == 'success') {
                    $scope.chats = res.data;
                }

                if (res.status == 'failed') {
                    if(res.message == 'PROBLEM_FETCHING_CHAT'){
                        alert("Problem in fetching chats, Please try after sometime");
                    }
                }
            });
        }
        function getNextSeat(slot) {
            var slotNum = slot.substr(4) * 1,
                seat = 1,
                currentPlayerSlot = $scope.currentPlayer.slot.substr(4) * 1,
                nextSlot = currentPlayerSlot;

            for (var iC = 0; iC < 4; iC++) {
                nextSlot++;
                if (nextSlot > 5) {
                    nextSlot = ((nextSlot) % 5);
                }
                seat++;
                if (slotNum === nextSlot) {
                    break;
                }
            }
            return "seat" + seat;
        }
        function setOtherPlayers(currentPlayer, otherPlayers) {
            for (var keyId in otherPlayers) {
                var objPlayer = otherPlayers[keyId];
                if (currentPlayer.slot !== objPlayer.slot) {
                    var seat = getNextSeat(objPlayer.slot);
                    $scope[seat] = objPlayer;
                    $scope.seatingInfo[objPlayer.slot] = seat;
                    $scope.seatingInfoById[objPlayer.id] = seat;
                }
            }
            $scope.$digest();
        }
        function showNotification(args, callback) {
            $scope.notificationMessage = args.message;
            $scope.showNotification = true;
            setTimeout(function() {
                $scope.showNotification = false;
                $scope.$digest();
                if (callback && typeof(callback) === 'function') {
                    callback();
                }
            }, args.timeout);

            $scope.$digest();
        }
        function initSocketEvents() {
            var scope = $scope;
            socket.on('betPlaced', function(args) {
                if(args.tableId != tableId)
                    return;

                $scope.$broadcast('performBetAnimation', {
                    bet: args.bet.amount,
                    timeout: 2000
                });
                var lastActionPlayer = $scope[$scope.seatingInfoById[args.placedBy]];
                if (lastActionPlayer) {
                    lastActionPlayer.lastAction = args.bet.action;
                    lastActionPlayer.lastBet = args.bet.amount;
                }
                $scope.$digest();
                setTimeout(function() {
                    $scope.table = args.table;

                    for (var player in args.players) {
                        var currentPl = $scope[$scope.seatingInfoById[args.players[player].id]];
                        currentPl.turn = args.players[player].turn;
                        currentPl.packed = args.players[player].packed;
                        currentPl.playerInfo.chips = args.players[player].playerInfo.chips;
                    }
                    $scope.$digest();
                }, 3000);
            });
            socket.on('sideShowResponded', function(args) {
                if(args.tableId == tableId)
                    return;

                function sideShowRespond() {
                    $scope.table = args.table;
                    for (var player in args.players) {
                        var currentPl = $scope[$scope.seatingInfoById[args.players[player].id]];
                        currentPl.lastAction = args.players[player].lastAction;
                        currentPl.sideShowTurn = args.players[player].sideShowTurn;
                        currentPl.turn = args.players[player].turn;
                        currentPl.packed = args.players[player].packed;
                    }
                    $scope.$digest();
                }
                if (args.message) {
                    showNotification({
                        message: args.message,
                        timeout: 3000
                    }, sideShowRespond);
                } else {
                    sideShowRespond();
                }
            });
            socket.on('sideShowResult', function(args) {

                function sideShowResult() {
                    $scope.table = args.table;
                    for (var player in args.players) {
                        var currentPl = $scope[$scope.seatingInfoById[args.players[player].id]];
                        currentPl.cardSet.cards = args.players[player].cardSet.cards;
                        currentPl.cardSet.closed = args.players[player].cardSet.closed;
                    }
                    $scope.$digest();
                }
                if (args.message) {
                    showNotification({
                        message: args.message,
                        timeout: 2000
                    }, sideShowResult);
                } else {
                    sideShowResult();
                }
            });
            socket.on('sideShowPlaced', function(args) {
                if(args.tableId != tableId)
                    return;

                $scope.$broadcast('performBetAnimation', {
                    bet: args.bet.amount,
                    timeout: 2000
                });

                function sideShowProcess() {
                    $scope.table = args.table;
                    for (var player in args.players) {
                        var currentPl = $scope[$scope.seatingInfoById[args.players[player].id]];
                        currentPl.sideShowTurn = args.players[player].sideShowTurn;
                        if (currentPl.sideShowTurn) {
                            currentPl.sideShowMessage = args.message;
                        }
                    }
                    $scope.$digest();
                }

                if (args.message) {
                    showNotification({
                        message: args.message,
                        timeout: 2000
                    }, sideShowProcess);
                } else {
                    sideShowProcess();
                }


            });
            socket.on('showWinner', function(args) {
                if(args.tableId != tableId)
                    return;

                function showWinner() {
                    $scope.table = args.table;
                    if (args.message) {
                        showNotification({
                            message: args.message,
                            timeout: args.timeout || 4000
                        });
                    }
                    var lastActionPlayer = $scope[$scope.seatingInfoById[args.placedBy]];
                    if (lastActionPlayer) {
                        lastActionPlayer.lastAction = args.bet.action;
                        lastActionPlayer.lastBet = args.bet.amount;
                    }
                    for (var player in args.players) {
                        var playerSeat = $scope.seatingInfoById[args.players[player].id];
                        $scope[playerSeat].packed = args.players[player].packed;
                        $scope[playerSeat].active = args.players[player].active;
                        $scope[playerSeat].turn = args.players[player].turn;
                        $scope[playerSeat].winner = args.players[player].winner;
                        // $scope[playerSeat].playerInfo.chips = args.players[player].playerInfo.chips;
                        if ((playerSeat !== 'currentPlayer') || (playerSeat === 'currentPlayer' && $scope[playerSeat].cardSet.closed)) {
                            $scope[playerSeat].cardSet.cards = args.players[player].cardSet.cards;
                            $scope[playerSeat].cardSet.closed = args.players[player].cardSet.closed;
                        }
                    }
                    $scope.$digest();
                    $scope.$broadcast('performWinnerAnimation', {
                        bet: args.table.amount,
                        timeout: 2000,
                        callback: function() {
                            for (var player in args.players) {
                                var playerSeat = $scope.seatingInfoById[args.players[player].id];
                                $scope[playerSeat].playerInfo.chips = args.players[player].playerInfo.chips;
                            }
                        }
                    });
                }

                if (args.potLimitExceeded) {
                    showNotification({
                        message: "Pot Limit Exceeded Force Show",
                        timeout: 3000
                    }, showWinner);
                } else {
                    if (!args.packed && !args.potLimitExceeded) {
                        $scope.$broadcast('performBetAnimation', {
                            bet: args.bet.amount,
                            timeout: 2000
                        });
                        setTimeout(showWinner, 3000);
                    } else {
                        showWinner();
                    }
                }

                if(args.lastPlayerGameEnded){
                    alert('Game is ending now. See you later.');
                    $timeout(function() {
                        socket.emit('gameEndConfirmed', {table: args.tableId, player: args.playerId});
                        $state.go('tables', {});
                    }, 2000);
                }
            });
            socket.on('playerPacked', function(args) {
                if(args.tableId != tableId)
                    return;

                $scope.table = args.table;
                var lastActionPlayer = $scope[$scope.seatingInfoById[args.placedBy]];
                if (lastActionPlayer) {
                    lastActionPlayer.lastAction = args.bet.action;
                    lastActionPlayer.lastBet = args.bet.amount;
                }
                for (var player in args.players) {
                    var currentPl = $scope[$scope.seatingInfoById[args.players[player].id]];
                    currentPl.turn = args.players[player].turn;
                    currentPl.packed = args.players[player].packed;
                    currentPl.playerInfo.chips = args.players[player].playerInfo.chips;
                }
                $scope.$digest();
            });
            socket.on('connectionSuccess', function(args) {
                $scope.user.clientId = args.id;
                tableId = args.tableId;
                socket.emit('joinTable', {player: $scope.user, tableId: tableId});
            });
            socket.on('tableJoined', function(args) {
                if(args.tableId != tableId)
                    return;
                
                $scope.seatingInfo[args.player.slot] = "currentPlayer";
                $scope.seatingInfoById[args.player.id] = "currentPlayer";
                $scope.currentPlayer = args.player;
                setOtherPlayers($scope.currentPlayer, args.player.otherPlayers);
                $scope.$digest();
                showNotification({message: "You have joined the table", timeout: 2000});
            });
            socket.on('playerLeft', function(args) {
                if(args.tableId != tableId)
                    return;

                $scope[$scope.seatingInfo[args.removedPlayer.slot]] = null;
                $scope[$scope.seatingInfoById[args.removedPlayer.id]] = null;
                delete $scope.seatingInfo[args.removedPlayer.slot];
                delete $scope.seatingInfo[args.removedPlayer.id];
                $scope.table.isShowAvailable = args.table.isShowAvailable;
                $scope.table.isSideShowAvailable = args.table.isSideShowAvailable;
                for (var player in args.players) {
                    var currentPl = $scope[$scope.seatingInfoById[args.players[player].id]];
                    currentPl.turn = args.players[player].turn;
                    currentPl.packed = args.players[player].packed;
                    currentPl.playerInfo.chips = args.players[player].playerInfo.chips;
                }
                $scope.$digest();
                showNotification({message: args.removedPlayer.playerInfo.displayName + " has left the table", timeout: 2000});
            });
            socket.on('gameCountDown', function(args) {
                if(args.tableId != tableId)
                    return;

                var counter = args.counter;
                if ($scope.table) {
                    $scope.table.showAmount = false;
                }
                $scope.gameCountdownMessage = "Your game will begin in " + counter + " seconds";
                $scope.showMessage = true;
                $scope.$digest();
                var interValId = window.setInterval(function() {
                    counter--;
                    if (counter == 0) {
                        clearInterval(interValId);
                        $scope.showMessage = false;
                    } else {
                        $scope.gameCountdownMessage = "Your game will begin in " + counter + " seconds";
                    }
                    $scope.$digest();
                }, 1000);
            });
            socket.on('distributeCards', function(args){
                if(scope.tableId != args.tableId && args.minPlayerAvailable)
                    return;
                
                if($localStorage.cardAnimationRunning)
                    return;
                    
                $localStorage.cardAnimationRunning = true;
                $scope.$broadcast('performCardDistributionAnimation', {
                    timeout: 1000
                });
            });
            socket.on('cardsSeen', function(args) {
                if(args.tableId != tableId)
                    return;

                $scope.currentPlayer.cardSet.cards = args.cardsInfo;
                $scope.currentPlayer.cardSet.closed = false;
                $scope.$digest()

            });
            socket.on('playerCardSeen', function(args) {
                if(args.tableId != tableId)
                    return;

                $scope[$scope.seatingInfoById[args.id]].lastAction = "Card Seen";
                for (var player in args.players) {
                    $scope[$scope.seatingInfoById[args.players[player].id]].isSideShowAvailable = args.players[player].isSideShowAvailable;
                }
                $scope.$digest();
                showNotification({message: args.player.playerInfo.displayName + " has seen the cards", timeout: 2000});
            });
            socket.on('notification', function(args) {
                if(args.tableId != tableId)
                    return;

                showNotification(args);
            });
            socket.on('resetTable', function(args) {
                if(args.tableId != tableId)
                    return

                $scope.table = args.table;
                $scope.showMessage = false;
                $scope.table.showAmount = false;
                for (var player in args.players) {
                    $scope[$scope.seatingInfoById[args.players[player].id]] = args.players[player];
                }
                $scope.$digest();
            });
            socket.on('startNew', function(args) {
                if(args.tableId != tableId)
                    return;

                $scope.$emit('startNew', {
                    args: args
                });
                for (var player in args.players) {
                    $scope[$scope.seatingInfoById[args.players[player].id]].turn = false;
                    $scope[$scope.seatingInfoById[args.players[player].id]].winner = false;
                    $scope[$scope.seatingInfoById[args.players[player].id]].packed = false;
                    $scope[$scope.seatingInfoById[args.players[player].id]].active = true;
                    $scope[$scope.seatingInfoById[args.players[player].id]].cardSet = null;
                    $scope[$scope.seatingInfoById[args.players[player].id]].lastAction = "";
                    $scope[$scope.seatingInfoById[args.players[player].id]].lastBet = "";
                }
                $scope.$digest();
                showNotification({
                    message: "Collecting boot amount of " + $filter('number')(args.table.boot),
                    timeout: 2000
                }, function() {
                    $scope.$broadcast('performBootAnimation', {
                        boot: args.table.boot,
                        timeout: 2000
                    });
                });
                setTimeout(function() {
                    $scope.table = args.table;
                    $scope.showMessage = false;
                    $scope.table.showAmount = true;
                    for (var player in args.players) {
                        if ($scope.lastTurn) {
                            $scope[$scope.seatingInfoById[$scope.lastTurn]].turn = false;
                        }
                        $scope[$scope.seatingInfoById[args.players[player].id]] = args.players[player];
                    }
                    $scope.$digest();
                }, 4000);
            });
            socket.on('newPlayerJoined', function(args) {
                if(args.tableId != tableId)
                    return;

                var seat = getNextSeat(args.player.slot);
                $scope.seatingInfo[args.player.slot] = seat;
                $scope.seatingInfoById[args.player.id] = seat;
                $scope[seat] = args.player;
                $scope.$digest();
                showNotification({message: args.player.playerInfo.displayName + " have joined the table", timeout: 2000});
            });
            socket.on('showChatMessage', function(chat) {
                soundService.alert();
                if(chat.table_id != tableId)
                    return;

                $scope.chats.push({from: chat.from, message: chat.message, date: chat.date});
                $scope.$apply();
                $rootScope.$broadcast('scrollToBottom',{});
                if(!$scope.isChatWindowOpen){
                    $scope.isChatWindowOpen = true;
                }
            });
            socket.on('updatePlayerOnServerSuccess', function(args){
                if(args.tableId != tableId)
                    return;

                $scope.$broadcast('updatePlayerSuccess', args);
            });
            socket.on('sendGiftSuccess', function(args) {
                if(args.tableId != tableId)
                    return;

                $scope.$broadcast('performGiftAnimation', args);

            });


        }
        function fetchTable(){
            if(!tableLoadingInProgress){
                tableLoadingInProgress = true;
                tableService.getSystemTable({
                    id: tableId
                }).success(function(res) {
                    tableLoadingInProgress = false;
                    if (res.status == 'success') {
                        $scope.table = res.data;
                        initSocketEvents();
                        loadChats();
                        var data = res.data;
                        data.type = 'SYSTEM';
                        socket.emit('createTable', data);
                    }
                    if (res.status == 'failed') {
                        if(res.message == "PROBLEM_FETCH_TABLE"){
                            $state.go('tables',{});
                        }
                    }
                });
            }


        }
    }
]);
angular.module('table99.controllers').controller('userPlayCtrl', ['$rootScope', '$localStorage', '$scope', 'tableService', '$state', '$stateParams', '$filter', '$timeout', 'layoutService', 'soundService', '$mdDialog', 'userService', 'BASE_URL', 'socket',
    function($rootScope, $localStorage, $scope, tableService, $state, $stateParams,  $filter, $timeout, layoutService, soundService, $mdDialog, userService, BASE_URL, socket) {
        var tableId = $stateParams.id, referer=$stateParams.ref, socket, tableLoadingInProgress = false;
        $rootScope.layout = layoutService.layoutClass.bodyLayout;
        $scope.background = '';
        $scope.user = {};
        $scope.table= {};
        $scope.currentPlayer = {};
        $scope.seatingInfo = {};
        $scope.seatingInfoById = {};
        $scope.chats = [];
        $scope.dealSeat = "";
        $scope.currentTurn = "";
        $scope.isChatWindowOpen = false;
        $scope.chat = {};
        $scope.chat.normal_height = false;
        $scope.tableId = tableId;
        $scope.tableInfoOpen = false;
        $scope.isMenuOpen = false;

        function onError(){
            alert('Problem fetching facebook details, Please try again later');
        }

        if($localStorage){
            $localStorage.cardAnimationRunning = false;
            if($localStorage.USER != undefined && ( referer == 'false' || referer == 'true')){
                initialize();
            }
            else if($localStorage.USER == undefined  && referer == 'true'){
                $timeout(function(){
                    window.facebookConnectPlugin.getLoginStatus(function(response) {
                        if (response.status === 'connected'){
                            window.facebookConnectPlugin.api("me/?fields=email,first_name,last_name,picture.width(200).height(200)",["email","public_profile"],
                                function (response) {
                                    if(response && response.first_name && response.last_name && response.email && response.picture){
                                        var name = response.first_name +" "+ response.last_name,
                                            email = response.email,
                                            picture = response.picture.data.url;

                                        facebookSignIn(name, email, picture);
                                    }
                                    else{
                                        onError();
                                    }
                                },
                                onError);
                        }
                        else{
                            window.facebookConnectPlugin.login(['email','public_profile'],
                            function (response) {
                                if (response.status === 'connected'){
                                    window.facebookConnectPlugin.api("me/?fields=email,first_name,last_name,picture.width(200).height(200)",["email","public_profile"],
                                        function (response) {
                                            if(response && response.first_name && response.last_name && response.email && response.picture){
                                                var name = response.first_name +" "+ response.last_name,
                                                    email = response.email,
                                                    picture = response.picture.data.url;

                                                facebookSignIn(name, email, picture);
                                            }
                                            else{
                                                onError();
                                            }
                                        },
                                        onError);
                                }
                            });
                        }
                    });
                }, 2000);
            }
        }
        else{
            $state.go('signin', {});
        }

        if($localStorage.BACKGROUND){
            $rootScope.background = $scope.background = $localStorage.BACKGROUND;
        }

        $scope.user.avatar = $scope.user.avatar ? $scope.user.avatar : 'background: url(images/default_avatar.jpg);';
        $scope.user.displayName = $scope.user.displayName ? $scope.user.displayName : 'Guest';
        $scope.user.chips = $scope.user.chips ? $scope.user.chips : '0';
        $scope.characterClass = ($scope.user.avatar.indexOf('character') > -1) ? $scope.user.avatar : 'custom-character';

        $scope.$on('$locationChangeStart', function(event, next, current) {
            if(!$scope.table.gameStarted)
                return;
                   
            if(confirm('Are you sure wants to left the table')){
                $('.deck-card').remove();
                soundService.exitClick();
                socket.emit('removePlayer', {tableId: tableId, player: $scope.currentPlayer});
                $state.go('tables', {});
            }
        });
        $scope.toggleChatWindow = function(){
            soundService.buttonClick();
            $scope.isChatWindowOpen = !$scope.isChatWindowOpen;
        };
        $scope.onChatBoxBlur = function(){
            $scope.chat.normal_height = true;
        };
        $scope.enterChatMessage = function(){
            soundService.buttonClick();
            var date = $filter('date')(new Date(), "yyyy-MM-dd HH:mm:ss");
            tableService.saveChat({
                table_id: tableId,
                user_id: $scope.user.id,
                message: $scope.chat.message,
                date: date
            }).success(function(res) {
                if (res.status == 'success') {
                    socket.emit('newChatMessageAdded', {
                        table_id: tableId,
                        user_id: $scope.user.id,
                        from: $scope.user.displayName,
                        message: $scope.chat.message,
                        date: $filter('date')(new Date(), "dd MMM yyyy h:mm:ss a")
                    });
                    $scope.chat.message = "";
                }

                if (res.status == 'failed') {
                    if(res.message == 'PROBLEM_ADDING_CHAT'){
                        alert("Problem in chatting, Please try after some time");
                    }
                }
            });
        };
        $scope.autoExpandChatBox = function(e) {
            var element = typeof e === 'object' ? e.target : document.getElementById(e);
            var scrollHeight = element.scrollHeight;
            element.style.height =  (scrollHeight - 10)+ "px";
        };
        $scope.exitGame = function(){
            soundService.exitClick();
            if(confirm('Are you sure wants to left the table')){
                $('.deck-card').remove();
                socket.emit('removePlayer', {tableId: tableId, player: $scope.currentPlayer});
                $state.go('tables', {});
            }
        };
        $scope.seeMyCards = function() {
            socket.emit('seeMyCards', {player: $scope.currentPlayer, tableId: tableId} );
        }
        $scope.placeBet = function() {
            socket.emit('placeBet', {
                tableId: tableId,
                player: $scope.currentPlayer,
                bet: {
                    action: $scope.currentPlayer.lastAction,
                    amount: $scope.table.lastBet,
                    blind: $scope.table.lastBlind,
                    show: $scope.currentPlayer.show
                }
            });
            $scope.currentPlayer.playerInfo.chips -= $scope.table.lastBet;
        }
        $scope.placeSideShow = function() {
            socket.emit('placeSideShow', {
                tableId: tableId,
                player: $scope.currentPlayer,
                bet: {
                    action: $scope.currentPlayer.lastAction,
                    amount: $scope.table.lastBet,
                    blind: $scope.table.lastBlind,
                    show: $scope.currentPlayer.show
                }
            });
            $scope.currentPlayer.playerInfo.chips -= $scope.table.lastBet;
        }
        $scope.respondSideShow = function() {
            socket.emit('respondSideShow', {
                tableId: tableId,
                player: $scope.currentPlayer,
                lastAction: $scope.currentPlayer.lastAction
            });
        }
        $scope.placePack = function() {
            socket.emit('placePack', {
                tableId: tableId,
                player: $scope.currentPlayer,
                bet: {
                    action: $scope.currentPlayer.lastAction,
                    amount: "",
                    blind: false
                }
            });
        }
        $scope.toggleTableInfo = function(){
            soundService.alert();
            if($scope.table && $scope.table.gameStarted){
                $scope.tableInfoOpen = !$scope.tableInfoOpen;
            }
        };
        $scope.toggleMenu = function(){
            soundService.alert();
            $scope.isMenuOpen = !$scope.isMenuOpen;
        };
        $scope.closeMenu = function(){
            soundService.buttonClick();
            $scope.isMenuOpen = false;
        };
        $scope.closeChat = function(){
            soundService.buttonClick();
            $scope.isChatWindowOpen = !$scope.isChatWindowOpen;
        };
        $scope.sendGift = function(args){
            socket.emit('sendGift', args);
        };

        $scope.$watch('user.avatar', function() {
            $scope.characterClass = ($scope.user.avatar.indexOf('character') > -1) ? $scope.user.avatar : 'custom-character';
        });
        $scope.openUpdateAvatarDialog = function($event){
            soundService.alert();
            $mdDialog.show(
                $mdDialog.updateAvatar({
                    scope: $scope,
                    preserveScope: true,
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    locals: {caller: 'game'}
                })
            );
        };
        $scope.openChangeNameDialog = function($event){
            soundService.alert();
            $mdDialog.show(
                $mdDialog.updateDisplayName({
                    scope: $scope,
                    preserveScope: true,
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    locals: {caller: 'game'},
                })
            );
        };
        $scope.openChangeBackgroundDialog = function($event){
            soundService.alert();
            $mdDialog.show(
                $mdDialog.updateBackground({
                    scope: $scope,
                    preserveScope: true,
                    parent: angular.element(document.body),
                    targetEvent: $event,
                })
            );
        };
        $scope.openShopDialog = function($event){
            soundService.alert();
            $mdDialog.show(
                $mdDialog.shop({
                    scope: $scope,
                    preserveScope: true,
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    locals: {caller: 'game'},
                })
            );
        };
        $scope.facebookShare = function($event){
            soundService.alert();
            window.facebookConnectPlugin.showDialog({
                method: 'send',
                link: BASE_URL+"#/userPlay/"+$scope.table.id+"/true",
                picture: "https://www.w3schools.com/css/trolltunga.jpg",
            },
            function(response) {
                if (response && response.completionGesture == "message") {
                    alert('Request has been successfully send');
                } else {
                    alert('Problem sending request. Please try again later');
                }
            });
        };
        $scope.whatsAppShare = function($event){
            soundService.alert();
            navigator.screenshot.save(function(error,res){
                if(error){
                    console.error(error);
                }else{
                    
                    /*window.plugins.socialsharing.shareViaWhatsApp(null, 'file://' + res.filePath, null, function(response){
                                
                            }, function(error){
                                console.log(error);
                    });*/
                    window.plugins.socialsharing.shareViaWhatsApp("Play "+$scope.table.name+" with me\n"+BASE_URL+"#/userPlay/"+$scope.table.id+"/true", null, null, function(response){
                            alert('Request has been successfully send');
                        }, function(error){
                            alert('Problem sending request. Please try again later');
                    });
                }
            }, 'jpg', 50, 'myScreenshot');
        };
        $scope.openShopDialogFromMenu = function(){
            $scope.isMenuOpen = false;
            $scope.openShopDialog();
        };
        $scope.updatePlayerOnServer = function(tableId, playerId, field, value){
            socket.emit('updatePlayerOnServer', {tableId: tableId, playerId: playerId, field: field, value: value});
        };
                                                                  
        $scope.openRulesDialog = function(args){
            soundService.alert();
            $scope.isMenuOpen = false;
            $mdDialog.show(
                $mdDialog.rules({
                    parent: angular.element(document.body),
                })
            );
        };
        $scope.$on('$destroy', function (event) {
            socket.removeAllListeners();
        });

        function facebookSignIn(name, email, picture){
            userService.fbsignin({
                name: name,
                email: email,
                picture: picture,
            }).success(function(res) {
                if (res.status == 'success') {
                    var user = res.data;
                    user.LOGGEDIN = true;
                    $localStorage.USER = user;
                    initialize();
                }
                if (res.status == 'failed') {
                    if(res.message == 'PROBLEM_SIGNUP'){
                        alert("Problem in signing in using facebook, Please try again later");
                    }
                    if(res.message == 'ALREADY_REGISTERED'){
                        var user = res.data;
                        user.LOGGEDIN = true;
                        $localStorage.USER = user;
                        initialize();
                    }
                }
            });
        }
        function loadChats(){
            tableService.loadChats({
                table_id: tableId
            }).success(function(res) {
                if (res.status == 'success') {
                    $scope.chats = res.data;
                }

                if (res.status == 'failed') {
                    if(res.message == 'PROBLEM_FETCHING_CHAT'){
                        alert("Problem in fetching chats, Please try after sometime");
                    }
                }
            });
        }
        function getNextSeat(slot) {
            var slotNum = slot.substr(4) * 1,
                seat = 1,
                currentPlayerSlot = $scope.currentPlayer.slot.substr(4) * 1,
                nextSlot = currentPlayerSlot;

            for (var iC = 0; iC < 4; iC++) {
                nextSlot++;
                if (nextSlot > 5) {
                    nextSlot = ((nextSlot) % 5);
                }
                seat++;
                if (slotNum === nextSlot) {
                    break;
                }
            }
            return "seat" + seat;
        }
        function setOtherPlayers(currentPlayer, otherPlayers) {
            for (var keyId in otherPlayers) {
                var objPlayer = otherPlayers[keyId];
                if (currentPlayer.slot !== objPlayer.slot) {
                    var seat = getNextSeat(objPlayer.slot);
                    $scope[seat] = objPlayer;
                    $scope.seatingInfo[objPlayer.slot] = seat;
                    $scope.seatingInfoById[objPlayer.id] = seat;
                }
            }
            $scope.$digest();
        }
        function showNotification(args, callback) {
            $scope.notificationMessage = args.message;
            $scope.showNotification = true;
            setTimeout(function() {
                $scope.showNotification = false;
                $scope.$digest();
                if (callback && typeof(callback) === 'function') {
                    callback();
                }
            }, args.timeout);

            $scope.$digest();
        }
        function initSocketEvents() {
            socket.on('betPlaced', function(args) {
                if(args.tableId != tableId)
                    return;

                $scope.$broadcast('performBetAnimation', {
                    bet: args.bet.amount,
                    timeout: 2000
                });
                var lastActionPlayer = $scope[$scope.seatingInfoById[args.placedBy]];
                if (lastActionPlayer) {
                    lastActionPlayer.lastAction = args.bet.action;
                    lastActionPlayer.lastBet = args.bet.amount;
                }
                $scope.$digest();
                setTimeout(function() {
                    $scope.table = args.table;

                    for (var player in args.players) {
                        var currentPl = $scope[$scope.seatingInfoById[args.players[player].id]];
                        currentPl.turn = args.players[player].turn;
                        currentPl.packed = args.players[player].packed;
                        currentPl.playerInfo.chips = args.players[player].playerInfo.chips;
                    }
                    $scope.$digest();
                }, 3000);
            });
            socket.on('sideShowResponded', function(args) {
                if(args.tableId == tableId)
                    return;

                function sideShowRespond() {
                    $scope.table = args.table;
                    for (var player in args.players) {
                        var currentPl = $scope[$scope.seatingInfoById[args.players[player].id]];
                        currentPl.lastAction = args.players[player].lastAction;
                        currentPl.sideShowTurn = args.players[player].sideShowTurn;
                        currentPl.turn = args.players[player].turn;
                        currentPl.packed = args.players[player].packed;
                    }
                    $scope.$digest();
                }
                if (args.message) {
                    showNotification({
                        message: args.message,
                        timeout: 3000
                    }, sideShowRespond);
                } else {
                    sideShowRespond();
                }
            });
            socket.on('sideShowResult', function(args) {

                function sideShowResult() {
                    $scope.table = args.table;
                    for (var player in args.players) {
                        var currentPl = $scope[$scope.seatingInfoById[args.players[player].id]];
                        currentPl.cardSet.cards = args.players[player].cardSet.cards;
                        currentPl.cardSet.closed = args.players[player].cardSet.closed;
                    }
                    $scope.$digest();
                }
                if (args.message) {
                    showNotification({
                        message: args.message,
                        timeout: 2000
                    }, sideShowResult);
                } else {
                    sideShowResult();
                }
            });
            socket.on('sideShowPlaced', function(args) {
                if(args.tableId != tableId)
                    return;

                $scope.$broadcast('performBetAnimation', {
                    bet: args.bet.amount,
                    timeout: 2000
                });

                function sideShowProcess() {
                    $scope.table = args.table;
                    for (var player in args.players) {
                        var currentPl = $scope[$scope.seatingInfoById[args.players[player].id]];
                        currentPl.sideShowTurn = args.players[player].sideShowTurn;
                        if (currentPl.sideShowTurn) {
                            currentPl.sideShowMessage = args.message;
                        }
                    }
                    $scope.$digest();
                }

                if (args.message) {
                    showNotification({
                        message: args.message,
                        timeout: 2000
                    }, sideShowProcess);
                } else {
                    sideShowProcess();
                }


            });
            socket.on('showWinner', function(args) {
                if(args.tableId != tableId)
                    return;

                function showWinner() {
                    $scope.table = args.table;
                    if (args.message) {
                        showNotification({
                            message: args.message,
                            timeout: args.timeout || 4000
                        });
                    }
                    var lastActionPlayer = $scope[$scope.seatingInfoById[args.placedBy]];
                    if (lastActionPlayer) {
                        lastActionPlayer.lastAction = args.bet.action;
                        lastActionPlayer.lastBet = args.bet.amount;
                    }
                    for (var player in args.players) {
                        var playerSeat = $scope.seatingInfoById[args.players[player].id];
                        $scope[playerSeat].packed = args.players[player].packed;
                        $scope[playerSeat].active = args.players[player].active;
                        $scope[playerSeat].turn = args.players[player].turn;
                        $scope[playerSeat].winner = args.players[player].winner;
                        // $scope[playerSeat].playerInfo.chips = args.players[player].playerInfo.chips;
                        if ((playerSeat !== 'currentPlayer') || (playerSeat === 'currentPlayer' && $scope[playerSeat].cardSet.closed)) {
                            $scope[playerSeat].cardSet.cards = args.players[player].cardSet.cards;
                            $scope[playerSeat].cardSet.closed = args.players[player].cardSet.closed;
                        }
                    }
                    $scope.$digest();
                    $scope.$broadcast('performWinnerAnimation', {
                        bet: args.table.amount,
                        timeout: 2000,
                        callback: function() {
                            for (var player in args.players) {
                                var playerSeat = $scope.seatingInfoById[args.players[player].id];
                                $scope[playerSeat].playerInfo.chips = args.players[player].playerInfo.chips;
                            }
                        }
                    });
                }

                if (args.potLimitExceeded) {
                    showNotification({
                        message: "Pot Limit Exceeded Force Show",
                        timeout: 3000
                    }, showWinner);
                } else {
                    if (!args.packed && !args.potLimitExceeded) {
                        $scope.$broadcast('performBetAnimation', {
                            bet: args.bet.amount,
                            timeout: 2000
                        });
                        setTimeout(showWinner, 3000);
                    } else {
                        showWinner();
                    }
                }

                if(args.lastPlayerGameEnded){
                    alert('Game is ending now. See you later.');
                    $timeout(function() {
                        socket.emit('gameEndConfirmed', {table: args.tableId, player: args.playerId});
                        $state.go('tables', {});
                    }, 2000);
                }
            });
            socket.on('playerPacked', function(args) {
                if(args.tabbleId != tableId)
                    return;

                $scope.table = args.table;
                var lastActionPlayer = $scope[$scope.seatingInfoById[args.placedBy]];
                if (lastActionPlayer) {
                    lastActionPlayer.lastAction = args.bet.action;
                    lastActionPlayer.lastBet = args.bet.amount;
                }
                for (var player in args.players) {
                    var currentPl = $scope[$scope.seatingInfoById[args.players[player].id]];
                    currentPl.turn = args.players[player].turn;
                    currentPl.packed = args.players[player].packed;
                    currentPl.playerInfo.chips = args.players[player].playerInfo.chips;
                }
                $scope.$digest();
            });
            socket.on('connectionSuccess', function(args) {
                $scope.user.clientId = args.id;
                tableId = args.tableId;
                socket.emit('joinTable', {player: $scope.user, tableId: tableId});
            });
            socket.on('tableJoined', function(args) {
                if(args.tableId != tableId)
                    return;
                
                $scope.seatingInfo[args.player.slot] = "currentPlayer";
                $scope.seatingInfoById[args.player.id] = "currentPlayer";
                $scope.currentPlayer = args.player;
                setOtherPlayers($scope.currentPlayer, args.player.otherPlayers);
                $scope.$digest();
                showNotification({message: "You have joined the table", timeout: 2000});
            });
            socket.on('playerLeft', function(args) {
                if(args.tableId != tableId)
                    return;

                $scope[$scope.seatingInfo[args.removedPlayer.slot]] = null;
                $scope[$scope.seatingInfoById[args.removedPlayer.id]] = null;
                delete $scope.seatingInfo[args.removedPlayer.slot];
                delete $scope.seatingInfo[args.removedPlayer.id];
                $scope.table.isShowAvailable = args.table.isShowAvailable;
                $scope.table.isSideShowAvailable = args.table.isSideShowAvailable;
                for (var player in args.players) {
                    var currentPl = $scope[$scope.seatingInfoById[args.players[player].id]];
                    currentPl.turn = args.players[player].turn;
                    currentPl.packed = args.players[player].packed;
                    currentPl.playerInfo.chips = args.players[player].playerInfo.chips;
                }
                $scope.$digest();
                showNotification({message: args.removedPlayer.playerInfo.displayName + " has left the table", timeout: 2000});
            });
            socket.on('gameCountDown', function(args) {
                if(args.tableId != tableId)
                    return;

                var counter = args.counter;
                if ($scope.table) {
                    $scope.table.showAmount = false;
                }
                $scope.gameCountdownMessage = "Your game will begin in " + counter + " seconds";
                $scope.showMessage = true;
                $scope.$digest();
                var interValId = window.setInterval(function() {
                    counter--;
                    if (counter == 0) {
                        clearInterval(interValId);
                        $scope.showMessage = false;
                    } else {
                        $scope.gameCountdownMessage = "Your game will begin in " + counter + " seconds";
                    }
                    $scope.$digest();
                }, 1000);
            });
            socket.on('distributeCards', function(args){
                if(scope.tableId != args.tableId && args.minPlayerAvailable)
                    return;
                
                if($localStorage.cardAnimationRunning)
                    return;
                
                $localStorage.cardAnimationRunning = true;
                $scope.$broadcast('performCardDistributionAnimation', {
                    timeout: 500
                });
            });
            socket.on('cardsSeen', function(args) {
                if(args.tableId != tableId)
                    return;

                $scope.currentPlayer.cardSet.cards = args.cardsInfo;
                $scope.currentPlayer.cardSet.closed = false;
                $scope.$digest()

            });
            socket.on('playerCardSeen', function(args) {
                if(args.tableId != tableId)
                    return;

                $scope[$scope.seatingInfoById[args.id]].lastAction = "Card Seen";
                for (var player in args.players) {
                    $scope[$scope.seatingInfoById[args.players[player].id]].isSideShowAvailable = args.players[player].isSideShowAvailable;
                }
                $scope.$digest();
                showNotification({message: args.players[player].playerInfo.displayName + " has seen the cards", timeout: 2000});
            });
            socket.on('notification', function(args) {
                if(args.tableId != tableId)
                    return;

                showNotification(args);
            });
            socket.on('resetTable', function(args) {
                if(args.tableId != tableId)
                    return

                $scope.table = args.table;
                $scope.showMessage = false;
                $scope.table.showAmount = false;
                for (var player in args.players) {
                    $scope[$scope.seatingInfoById[args.players[player].id]] = args.players[player];
                }
                $scope.$digest();
            });
            socket.on('startNew', function(args) {
                if(args.tableId != tableId)
                    return;

                $scope.$emit('startNew', {
                    args: args
                });
                for (var player in args.players) {
                    $scope[$scope.seatingInfoById[args.players[player].id]].turn = false;
                    $scope[$scope.seatingInfoById[args.players[player].id]].winner = false;
                    $scope[$scope.seatingInfoById[args.players[player].id]].packed = false;
                    $scope[$scope.seatingInfoById[args.players[player].id]].active = true;
                    $scope[$scope.seatingInfoById[args.players[player].id]].cardSet = null;
                    $scope[$scope.seatingInfoById[args.players[player].id]].lastAction = "";
                    $scope[$scope.seatingInfoById[args.players[player].id]].lastBet = "";
                }
                $scope.$digest();
                showNotification({
                    message: "Collecting boot amount of " + $filter('number')(args.table.boot),
                    timeout: 2000
                }, function() {
                    $scope.$broadcast('performBootAnimation', {
                        boot: args.table.boot,
                        timeout: 2000
                    });
                });
                setTimeout(function() {
                    $scope.table = args.table;
                    $scope.showMessage = false;
                    $scope.table.showAmount = true;
                    for (var player in args.players) {
                        if ($scope.lastTurn) {
                            $scope[$scope.seatingInfoById[$scope.lastTurn]].turn = false;
                        }
                        $scope[$scope.seatingInfoById[args.players[player].id]] = args.players[player];
                    }
                    $scope.$digest();
                }, 4000);
            });
            socket.on('newPlayerJoined', function(args) {
                if(args.tableId != tableId)
                    return;
                
                var seat = getNextSeat(args.player.slot);
                $scope.seatingInfo[args.player.slot] = seat;
                $scope.seatingInfoById[args.player.id] = seat;
                $scope[seat] = args.player;
                $scope.$digest();
                showNotification({message: args.player.playerInfo.displayName + " have joined the table", timeout: 2000});
            });
            socket.on('showChatMessage', function(chat) {
                soundService.alert();
                if(chat.table_id != tableId)
                    return;

                $scope.chats.push({from: chat.from, message: chat.message, date: chat.date});
                $scope.$apply();
                $rootScope.$broadcast('scrollToBottom',{});
                if(!$scope.isChatWindowOpen){
                    $scope.isChatWindowOpen = true;
                }
            });
            socket.on('sendGiftSuccess', function(args) {
                if(args.tableId != tableId)
                    return;

                $scope.$broadcast('performGiftAnimation', args);

            });
        }
        function fetchTable(){
            if(!tableLoadingInProgress){
                tableLoadingInProgress = true;

                tableService.getCustomTable({
                    id: tableId
                }).success(function(res) {
                    tableLoadingInProgress = false;
                    if (res.status == 'success') {
                        $scope.table = res.data;
                        $scope.table.invitedPlayerCount = 0;
                        initSocketEvents();
                        loadChats();
                        $rootScope.pageTitle = "Play "+$scope.table.name+" with "+$scope.user.displayName;
                        var data = res.data;
                        data.type = 'CUSTOM';
                        socket.emit('createTable', data);
                    }
                    if (res.status == 'failed') {
                        if(res.message == "PROBLEM_FETCH_TABLE"){
                            alert("Problem finding table, Going back to tables");
                            $state.go('tables',{});
                        }
                    }
                });
            }
        }
        function initialize(){
            try {
                $scope.user = $localStorage.USER;
                fetchTable();
            }
            catch(err) {
                $state.go('tables', {});
            }
        }
    }
]);
angular.module('table99.controllers').controller('nameDialogCtrl', ['$rootScope', '$scope', '$state', '$localStorage',
    'soundService', 'userService', '$mdDialog', 'caller',
    function($rootScope, $scope, $state, $localStorage, soundService, userService, $mdDialog, caller) {
                                                                    
        $scope.closeDialog = function(){
            soundService.buttonClick();
            $mdDialog.hide();
        };
                                                                    
        $scope.changeDisplayName = function(){
            soundService.buttonClick();
            if($scope.user){
                var userId = $scope.user.id;
                var displayName = $scope.user.displayName;
                userService.updateDisplayName({
                    id: userId,
                    displayName: displayName
                }).success(function(res) {
                    if (res.status == 'success') {
                        if($localStorage.USER){
                            var localStorageData = $localStorage.USER;
                            localStorageData.displayName = res.data.displayName;
                            $localStorage.USER = localStorageData;
                        }
                        if(caller == 'game'){
                            $scope.currentPlayer.playerInfo.displayName = $scope.user.displayName = res.data.displayName;
                            $scope.updatePlayerOnServer($scope.tableId, $scope.currentPlayer.playerInfo.id, 'displayName', res.data.displayName);
                        }
                        $mdDialog.hide();
                    }
                    if (res.status == 'failed') {
                        if(res.message == "PROBLEM_CHANGING_DISPLAY_NAME"){
                            alert("Problem in changing display name, Please try again later");
                        }
                    }
                })
            }
            else{
                $state.go('signin', {});
            }
        };
    }]);
angular.module('table99.controllers').controller('avatarDialogCtrl', ['$rootScope', '$scope', '$state', '$localStorage',
    'soundService', 'userService', '$mdDialog', 'Upload', 'BASE_URL', 'caller',
    function($rootScope, $scope, $state, $localStorage, soundService, userService, $mdDialog, Upload, BASE_URL, caller) {
        $scope.up = {};
        $scope.uploadingStart = false;

        $scope.closeDialog = function(){
            soundService.buttonClick();
            $mdDialog.hide();
        };
                                                                      
        $scope.addUserAvatar = function(){
            soundService.buttonClick();
            $scope.addAvatar = false;
        };
                                                                      
        $scope.uploadAvatar = function(){
            soundService.buttonClick();
            if ($scope.up.file) {
                Upload.upload({
                    url: '/user/uploadAvatar',
                    data:{file:$scope.up.file, temp: "temp"}
                }).then(function (resp) {
                    $scope.uploadingStart = false;
                    if(resp.data.status == 'success'){
                        var avatar = BASE_URL+'avatars/getAvatar/?r='+resp.data.filename;
                        var userId = $scope.user.id;
                        userService.updateAvatar({
                            id: userId,
                            avatar: avatar
                        }).success(function(res) {
                            if (res.status == 'success') {
                                if($localStorage.USER){
                                    var localStorageData = $localStorage.USER;
                                    localStorageData.avatar = res.data.avatar;
                                    $localStorage.USER= localStorageData;
                                }
                                $scope.user.avatar = res.data.avatar;
                                $scope.addAvatar = true;
                                if(caller == 'game'){
                                    $scope.currentPlayer.playerInfo.avatar = res.data.avatar;
                                    $scope.updatePlayerOnServer($scope.tableId, $scope.currentPlayer.playerInfo.id, 'avatar', res.data.avatar);
                                }
                                $mdDialog.hide();
                            }
                            if (res.status == 'failed') {
                                if(res.message == "PROBLEM_CHANGING_AVATAR"){
                                    alert("Problem in changing avatar, Please try again later");
                                }
                            }
                        });
                    }
                    else
                        alert('Error uploading avatar, Please try again later');
                }, function (resp) {
                    alert('Error uploading avatar, Please try again later');
                }, function (evt) {
                    $scope.uploadingStart = true;
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    $scope.up.progress = progressPercentage + '% ';
                });
            }
        };
        $scope.changeAvatar = function(object){
            soundService.buttonClick();
            if($scope.user){
                var userId = $scope.user.id;
                var avatar = object.target.attributes.image.value;
                userService.updateAvatar({
                    id: userId,
                    avatar: avatar
                }).success(function(res) {
                    if (res.status == 'success') {
                        if($localStorage.USER){
                            var localStorageData = $localStorage.USER;
                            localStorageData.avatar = res.data.avatar;
                            $localStorage.USER= localStorageData;
                        }
                        $scope.user.avatar = res.data.avatar;
                        if(caller == 'game'){
                            $scope.currentPlayer.playerInfo.avatar = res.data.avatar;
                            $scope.updatePlayerOnServer($scope.tableId, $scope.currentPlayer.playerInfo.id, 'avatar', res.data.avatar);
                        }
                        $mdDialog.hide();
                    }
                    if (res.status == 'failed') {
                        if(res.message == "PROBLEM_CHANGING_AVATAR"){
                            alert("Problem in changing avatar, Please try again later");
                        }
                    }
                })
            }
            else{
                $state.go('signin', {});
            }
        }
    }]);
angular.module('table99.controllers').controller('backgroundDialogCtrl', ['$rootScope', '$scope', '$state', '$localStorage',
    'soundService', '$mdDialog',
    function($rootScope, $scope, $state, $localStorage, soundService, $mdDialog) {
        $scope.slickConfig = {
            variableWidth: true,
            slidesToScroll: 1,
            enabled: true,
            dots: false,
            event: {
                beforeChange: function (event, slick, currentSlide, nextSlide) {
                    soundService.arrowClick();
                },
                afterChange: function (event, slick, currentSlide, nextSlide) {
                }
            }
        };
                                                                          
        $scope.closeDialog = function(){
            soundService.buttonClick();
            $mdDialog.hide();
        };
                                                                          
        $scope.changeBackground = function(object){
            soundService.buttonClick();
            var imageValue = object.target.attributes.image.value;
            imageValue = imageValue.replace('../images/', 'images/');
            var styleObj = { 'background': imageValue };
            $localStorage.BACKGROUND = $rootScope.background = $scope.background = styleObj;
            $mdDialog.cancel();
        };
    }]);
angular.module('table99.controllers').controller('shopDialogCtrl', ['$rootScope', '$localStorage', '$scope', 'userService',
    '$state', 'layoutService', 'soundService', '$mdDialog', 'caller',
    function($rootScope, $localStorage, $scope, userService, $state, layoutService, soundService, $mdDialog, caller) {
        $scope.shopItems = [{
            debit_amount: 50,
            credit_amount: 500
        },{
            debit_amount: 100,
            credit_amount: 1000
        },{
            debit_amount: 200,
            credit_amount: 2000
        }];

        $scope.user.chips = $scope.user.chips ? $scope.user.chips : '0';
        $scope.closeDialog = function(){
            soundService.buttonClick();
            $mdDialog.hide();
        };
                                                                    
        $scope.slickConfig = {
            variableWidth: true,
            slidesToScroll: 1,
            enabled: true,
            dots: false,
            method: {},
            event: {
                beforeChange: function (event, slick, currentSlide, nextSlide) {
                    soundService.arrowClick();
                },
                afterChange: function (event, slick, currentSlide, nextSlide) {
                }
            }
        };
        $scope.boughtShopItem = function(item){
            soundService.buttonClick();
            if($scope.user){
                var userId = $scope.user.id;
                var chips = $scope.user.chips + item.credit_amount - item.debit_amount;
                userService.updateBalance({
                    id: userId,
                    chips: chips
                }).success(function(res) {
                    if (res.status == 'success') {
                        if($localStorage.USER){
                            var localStorageData = $localStorage.USER;
                            localStorageData.chips = res.data.chips;
                            $localStorage.USER = localStorageData;
                        }
                        $scope.user.chips = res.data.chips;
                        if(caller == 'game'){
                            $scope.currentPlayer.playerInfo.chips = res.data.chips;
                            $scope.updatePlayerOnServer($scope.tableId, $scope.currentPlayer.playerInfo.id, 'chips', res.data.chips);
                        }
                        $mdDialog.hide();
                    }
                    if (res.status == 'failed') {
                        if(res.message == "PROBLEM_UPDATING_BALANCE"){
                            alert("Problem in updating balance, Please try again later");
                        }
                    }
                })
            }
            else{
                $state.go('signin', {});
            }
        };

    }
]);
angular.module('table99.controllers').controller('shareCtrl', ['$rootScope', '$scope', '$state', '$localStorage',
    'soundService', '$mdDialog', '$timeout', 'tableService', 'userService', 'SOURCE', 'DESTINATION', 'USER', 'TABLE_ID',
    function($rootScope, $scope, $state, $localStorage, soundService, $mdDialog, $timeout, tableService, userService, SOURCE, DESTINATION, USER, TABLE_ID) {
        $scope.gifts = [];
        var user = USER,
            currentPlayer = $scope;

        loadGifts();

        $scope.closeDialog = function(){
            soundService.buttonClick();
            $mdDialog.hide();
        };
                                                               
        $scope.send = function(gift){
            soundService.buttonClick();
            $mdDialog.hide();
            USER.chips -= gift.price;
            userService.updateBalance({id: USER.id, chips: USER.chips}).success(function(res) {
                if (res.status == 'success') {
                    $scope.$parent.currentPlayer.playerInfo.chips = USER.chips;
                    $scope.$parent.updatePlayerOnServer($scope.$parent.tableId, $scope.$parent.currentPlayer.playerInfo.id, 'chips', USER.chips);

                    $scope.$parent.sendGift({
                        from: SOURCE,
                        to: DESTINATION,
                        image: gift.image,
                        tableId: $scope.$parent.tableId
                    });
                }

                if (res.status == 'failed') {
                    if(res.message == 'PROBLEM_FETCHING_CHAT'){
                        alert("Problem in fetching gifts, Please try after sometime");
                    }
                }
            });
        };

        function loadGifts(){
            tableService.loadGifts().success(function(res) {
                if (res.status == 'success') {
                    for(var i=0; i<=res.data.length-1;i++)
                        res.data[i].image = res.data[i].image.replace('../images/', 'images/');
                    
                    $scope.gifts = res.data;
                }

                if (res.status == 'failed') {
                    if(res.message == 'PROBLEM_FETCHING_CHAT'){
                        alert("Problem in fetching gifts, Please try after sometime");
                    }
                }
            });
        }
    }]);

angular.module('table99.controllers').controller('rulesDialogCtrl', ['$rootScope', '$scope', '$state', '$localStorage','soundService', '$mdDialog',
     function($rootScope, $scope, $state, $localStorage, soundService, $mdDialog) {
                                                               
         $scope.closeDialog = function(){
             soundService.buttonClick();
             $mdDialog.hide();
         };
}]);
angular.module('table99.controllers').controller('bonusDialogCtrl', ['$rootScope', '$scope', '$state', '$localStorage', 'soundService', 'userService', '$mdDialog', '$interval',
    function($rootScope, $scope, $state, $localStorage, soundService, userService, $mdDialog, $interval) {
        $scope.nextBonusDateString = '0h 0m 0s';
        $scope.bonusCredited = false;
        $scope.bonusObj = {};
        $scope.user = {};
                                                                    
        if($localStorage){
            if(!$localStorage.USER){
                $state.go('signin', {});
            }
            else{
                $scope.user = $localStorage.USER;
            }
        }
        else{
            $state.go('signin', {});
        }
                                                                     
        $scope.closeDialog = function(){
            soundService.buttonClick();
            $mdDialog.hide();
        };
        $scope.creditBonus = function(){
            userService.creditBonus({
                user: $scope.user.id,
                bonus: $scope.bonusObj.bonus
            }).success(function(res) {
                if (res.status == 'success') {
                    $scope.bonusObj = res.data;
                    userService.updateBalance({
                        id: $scope.user.id,
                        chips: $scope.user.chips + $scope.bonusObj.amount
                    }).success(function(res) {
                        if (res.status == 'success') {
                            alert('Bonus successfully credited in your account');
                            $state.reload();
                            if($localStorage.USER){
                                var localStorageData = $localStorage.USER;
                                localStorageData.chips = res.data.chips;
                                $localStorage.USER = localStorageData;
                            }
                            $scope.user.chips = res.data.chips;
                            var nextDate = moment($scope.bonusObj.received).add('days', 1).unix(),
                                currentDate = moment().unix(),
                                diffTime = nextDate - currentDate,
                                duration = moment.duration(diffTime * 1000, 'milliseconds');
                                                                                                                                             
                                var interval = $interval(function() {
                                    duration = moment.duration(duration.asMilliseconds() - 1000, 'milliseconds');
                                    var d = moment.duration(duration).days(),
                                        h = moment.duration(duration).hours(),
                                        m = moment.duration(duration).minutes(),
                                        s = moment.duration(duration).seconds();
                                        d = $.trim(d).length === 1 ? '0' + d : d;
                                        h = $.trim(h).length === 1 ? '0' + h : h;
                                        m = $.trim(m).length === 1 ? '0' + m : m;
                                        s = $.trim(s).length === 1 ? '0' + s : s;
                                                                                                                                                                      
                                    $scope.nextBonusDateString = parseInt(h)+"h "+parseInt(m)+"m "+parseInt(s)+"s";
                                                                                                                                                                      
                                    var remainingSeconds = duration.asSeconds();
                                    if(remainingSeconds <= 0){
                                        $interval.cancel(interval);
                                        $scope.bonusCredited = false;
                                    }
                                 }, 1000);
                                 $scope.bonusCredited = true;
                              }
                              if (res.status == 'failed') {
                                 if(res.message == "PROBLEM_UPDATING_BALANCE"){
                                    alert("Problem in crediting bonus, Please try again later");
                                 }
                              }
                           })
                        }
                        if (res.status == 'failed') {
                           if(res.message == 'PROBLEM_CREDITING_BONUS'){
                               alert("Problem in crediting bonus, Please try again later");
                           }
                        }
                     });
                  };
                                                                     
                  findBonus();
                                                                     
                  function findBonus(){
                     userService.getBonus({
                        user: $scope.user.id
                     }).success(function(res) {
                        if (res.status == 'success') {
                            $scope.bonusObj = res.data;
                        }
                                                                                                     
                        if (res.status == 'failed') {
                            if(res.message == 'PROBLEM_FETCHING_BONUS'){}
                            if(res.message == 'ALREADY_CREDITED'){
                                $scope.bonusObj = res.data;
                                $scope.bonusCredited = true;
                                var nextDate = moment($scope.bonusObj.received).add('days', 1).unix(),
                                    currentDate = moment().unix(),
                                    diffTime = nextDate - currentDate,
                                    duration = moment.duration(diffTime * 1000, 'milliseconds');
                                                                                                     
                                var interval = $interval(function() {
                                    duration = moment.duration(duration.asMilliseconds() - 1000, 'milliseconds');
                                    var d = moment.duration(duration).days(),
                                        h = moment.duration(duration).hours(),
                                        m = moment.duration(duration).minutes(),
                                        s = moment.duration(duration).seconds();
                                                                                                                              
                                        d = $.trim(d).length === 1 ? '0' + d : d;
                                        h = $.trim(h).length === 1 ? '0' + h : h;
                                        m = $.trim(m).length === 1 ? '0' + m : m;
                                        s = $.trim(s).length === 1 ? '0' + s : s;
                                                                                                                              
                                    $scope.nextBonusDateString = parseInt(h)+"h "+parseInt(m)+"m "+parseInt(s)+"s";
                                                                                                                              
                                    var remainingSeconds = duration.asSeconds();
                                    if(remainingSeconds <= 0){
                                        $interval.cancel(interval);
                                         $scope.bonusCredited = false;
                                    }
                                 }, 1000);
                              }
                          }
                     });
           }
}]);
