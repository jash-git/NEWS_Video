var slideImgHeight, slideImgCount = 0, intervalProgID; //左側精彩節目4個輪播 - 首頁, 節目表使用
var uptodateCount, uptodateNO = 1, isNotInitBtnPre = true;   //首頁橫軸最新新聞 
var slideImgActHeight, slideImgActCount = 0, intervalActID; //右側活動專區3個輪播 - 首頁, 節目表使用
var slideImgFriendHeight, slideImgFriendCount = 0, intervalFriendID; //右側合作專區5個輪播 - 首頁, 節目表使用
var slideImgAstroHeight, slideImgAstroCount = 0, intervalAstroID, isAstroClick = false;  //左側本日星座運勢2個輪播 - 首頁使用
var arrAds, idxAds, intervalAD;  //首頁廣告

var countTotal_newsList, pageIndex_newsList; //新聞總覽 各分類新聞頁數與目前頁面Index
var countTotal_wondershow, pageIndex_wondershow;   //精彩節目 頁數與目前頁面Index
//國曆農曆
function initCalendar() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    var dayOfWeek = date.getDay();

    var arrSolar = new Array(year - 1911, month, day, dayOfWeek);
    var arrLunar = mainx(year, month, day).split(',');

    setDate(arrSolar, arrLunar);
}
function setDate(arrSolar, arrLunar) {
    var htmCode = "";
    var day_list = ['日', '一', '二', '三', '四', '五', '六'];
    var week = '星期' + day_list[arrSolar[3]];

    htmCode = '<span class="text_14">';
    htmCode += '民國' + arrSolar[0] + '年' + arrSolar[1] + '月' + arrSolar[2] + '日' + week + '</span><br />';
    htmCode += '農曆' + arrLunar[1] + '月' + arrLunar[2] + '日 ';
    $('#date').html(htmCode);
}
//--
//左側本日星座運勢2個輪播 - 首頁使用
function initAstroSlide() {
    $('#astro-main #astro-main-area div:nth-child(1)').children('.astro-box').each(function () {
        if (slideImgAstroHeight == undefined) slideImgAstroHeight = $(this).height()+16;
        slideImgAstroCount++;
    });
    
    if (slideImgAstroCount > 2) {
        intervalAstroID = setInterval(nextAstroSlide, 5600);
    }
}
function nextAstroSlide() {
    $('#btn-astro-next').attr('disabled', true);

    $('#astro-main #astro-main-area div:nth-child(1)').animate({ top: -slideImgAstroHeight }, 1000, function () {
        var topImg = $(this).children('.astro-box').eq(0);
        $(this).append(topImg).css('top', 0);
        $('#btn-astro-next').removeAttr('disabled');
    });
}
//--
//左側精彩節目8個顯示 - 首頁, 節目表使用
function initProgramSlide() {
    $('#program-main div:nth-child(1)').children('img').each(function () {
        if (slideImgHeight == undefined) slideImgHeight = $(this).height();
        slideImgCount++;
    });
    //左側精彩節目不再輪播
//    if (slideImgCount > 8) {
//        intervalProgID = setInterval(nextProgSlide, 2000);
//    }
}
//function nextProgSlide() {
//    $('#program-main div:nth-child(1)').animate({ top: -slideImgHeight }, 500, function () {
//        var topImg = $(this).children('img').eq(0);
//        $(this).append(topImg).css('top', 0);
//    });
//}
//--
//首頁橫軸最新新聞
function initUptodateNews() {
    $('.videotitle').hide();
    $('.videotitle').eq(0).show();

    $('#btnPre').fadeTo(0, .5);
    $('#btnNext').fadeTo(0, .5);
    $('#nowplaying-box .nowplaying').eq(0).children('img').css('border', '#FF3 1px solid');

    uptodateCount = $('#nowplaying-box').children().length;
    
    if (uptodateCount > 4) {
        $('#btnNext').hover(function () {
            if (uptodateNO < uptodateCount) {
                $(this).css('cursor', 'pointer').fadeTo(0, 1);
            }
        }, function () {
            $(this).fadeTo(0, .5);
        }).on('click', uptodateNext_click);
    }
}
function initUptodatePre() {
    isNotInitBtnPre = false;
    $('#btnPre').hover(function () {
        if (uptodateNO > 1) {
            $(this).css('cursor', 'pointer').fadeTo(0, 1);
        }
    }, function () {
        $(this).fadeTo(0, .5);
    }).on('click', uptodatePre_click);
}
function uptodateNext_click() {
    $('#btnNext').off('click'); //click之後先off click
    if (isNotInitBtnPre) initUptodatePre(); //橫軸的下一個按鈕第一次click之後, 才讓前一個按鈕on click
    //
    if (uptodateCount < ++uptodateNO) {
        uptodateNO = uptodateCount;
    } else {
        $('#nowplaying-box .nowplaying').eq(uptodateNO - 2).children('.videotitle').hide();
        $('#nowplaying-box .nowplaying').eq(uptodateNO - 1).children('.videotitle').show();
        $('#nowplaying-box .nowplaying img').css('border', '#FFF 1px solid');
        $('#nowplaying-box .nowplaying').eq(uptodateNO - 1).children('img').css('border', '#FF3 1px solid');
    }
    //
    showNowPlaying();
    //橫軸移到下一個uptodateNO
    $('#nowplaying-box').animate({ left: (uptodateNO - 1) * -87 }, 500, function () {
        $('#btnNext').on('click', uptodateNext_click); //橫軸移動完成後再on click
    });
    $('#btnPre').css('cursor', 'pointer').fadeTo(0, 1);
    //橫軸到終點時cursor auto
    if (uptodateCount == uptodateNO) {
        $(this).css('cursor', 'auto').fadeTo(0, .5);
        return;
    }
}
function uptodatePre_click() {
    $('#btnPre').off('click'); //click之後先off click
    //
    if (--uptodateNO < 1) {
        uptodateNO = 1;
    } else {
        $('#nowplaying-box .nowplaying').eq(uptodateNO).children('.videotitle').hide();
        $('#nowplaying-box .nowplaying').eq(uptodateNO - 1).children('.videotitle').show();
        $('#nowplaying-box .nowplaying img').css('border', '#FFF 1px solid');
        $('#nowplaying-box .nowplaying').eq(uptodateNO - 1).children('img').css('border', '#FF3 1px solid');
    }
    //
    showNowPlaying();
    //橫軸移到前一個uptodateNO
    $('#nowplaying-box').animate({ left: (uptodateNO - 1) * -87 }, 500, function () {
        $('#btnPre').on('click', uptodatePre_click); //橫軸移動完成後再on click
    });
    $('#btnNext').css('cursor', 'pointer').fadeTo(0, 1);
    //橫軸到起點時cursor auto
    if (uptodateNO == 1) {
        $(this).css('cursor', 'auto').fadeTo(0, .5);
        return;
    }
}
function uptodateImgThumb_click(imgThumbNo) {
    $('#btnPre').off('click'); //click之後先off click
    //
    uptodateNO = imgThumbNo;
    //
    $('#nowplaying-box .nowplaying .videotitle').hide();
    $('#nowplaying-box .nowplaying').eq(uptodateNO - 1).children('.videotitle').show();
    $('#nowplaying-box .nowplaying img').css('border', '#FFF 1px solid');
    $('#nowplaying-box .nowplaying').eq(uptodateNO - 1).children('img').css('border', '#FF3 1px solid');
    //
    showNowPlaying();
    //橫軸移到uptodateNO
    $('#nowplaying-box').animate({ left: (uptodateNO - 1) * -87 }, 500, function () {
        $('#btnPre').on('click', uptodatePre_click); //橫軸移動完成後再on click
        //橫軸到起點時
        if (uptodateNO == 1) {
            $('#btnPre').css('cursor', 'auto').fadeTo(0, .5);
        } else {
            $('#btnPre').css('cursor', 'pointer').fadeTo(0, 1);
        }
        //橫軸到終點時
        if (uptodateCount == uptodateNO) {
            $('#btnNext').css('cursor', 'auto').fadeTo(0, .5);
        } else {
            $('#btnNext').css('cursor', 'pointer').fadeTo(0, 1);
        }
    });
}
function showNowPlaying() {
    var e = $('#nowplaying-box .nowplaying').eq(uptodateNO - 1);
    var htm = '';
    if (e.attr('img') != '') {
//        //從大圖網址中取得id
//        var arrPath = e.attr('img').split('/');
//        var id = arrPath[arrPath.length - 1].split('.')[0];
        //
        htm = '<img src="' + e.attr('img') + '" width="540" height="363" onclick="window.open(\'http://news.ebc.net.tw/apps/newsList.aspx?id=' + e.attr('id') + '&cat=' + e.attr('cat') + '\',\'_self\');" style="cursor:pointer;" />';
    } else if (e.attr('vid') != '') {
        htm = '<div class="videoWrapper"><iframe width="540" height="363" src="http://www.youtube.com/embed/' + e.attr('vid') + '?rel=0" frameborder="0" allowfullscreen></iframe></div>';
    }
    $('#video-utube').html(htm);
}
//--
//首頁合作專區輪播
function initFriendSlide() {
    $('#friends-main div:nth-child(1)').children('img').each(function () {
        if (slideImgFriendHeight == undefined) slideImgFriendHeight = $(this).height() + 7;
        slideImgFriendCount++;
    });

    if (slideImgFriendCount > 4) {
        intervalFriendID = setInterval(nextFriendSlide, 2000);
    }
}
function nextFriendSlide() {
    $('#friends-main div').css('height', 'auto');
    $('#friends-main div:nth-child(1)').animate({ top: -slideImgFriendHeight }, 500, function () {
        $('#friends-main div').css('height', 245);
        var topImg = $(this).children('img').eq(0);
        $(this).append(topImg).css('top', 0);
    });
}
//--
//AD區輪播 - 首頁, 新聞總覽, 精彩節目, 節目表使用
function initAd() {
    var $box = $('#topad #topad-box');
    arrAds = new Array();
    //countAds = $box.children('.topad-item').length;
    if ($box.children('.topad-item').length > 1) {
        $box.children('.topad-item').each(function () {
            arrAds.push($(this));
        });
        idxAds = 0;
        $box.append(arrAds[0]);

        intervalAD = setInterval(nextAdSlide, 4200);

        $('.topad-item').hover(function () {
            $(this).find('.topad-item-youtube').attr('src', '../images/youtube_play.png');
            window.clearInterval(intervalAD);
        }, function () {
            $(this).find('.topad-item-youtube').attr('src', '../images/youtube_idle.png');
            if (intervalAD != undefined) {
                intervalAD = setInterval(nextAdSlide, 4200);
            }
        });
    }
}
function nextAdSlide() {
    var $box = $('#topad #topad-box');
    $box.children('.topad-item').eq(0).fadeOut('normal', function () {
        var idx = idxAds;
        for (i = 0; i < arrAds.length; i++) {
            $box.append(arrAds[idx++]);
            if (idx == arrAds.length) {
                idx = 0;
            }
        }
        if (++idxAds == arrAds.length) {
            idxAds = 0;
        }
        $(this).fadeIn();
    });
}
//--
//活動專區輪播 - 首頁, 節目表使用
function initActiveSlide() {
    $('#active-main div:nth-child(1)').children('img').each(function () {
        if (slideImgActHeight == undefined) slideImgActHeight = $(this).height();
        slideImgActCount++;
    });
    
    if (slideImgActCount > 3) {
        intervalActID = setInterval(nextActSlide, 2000);
    }
}
function nextActSlide() {
    $('#active-main div:nth-child(1)').animate({ top: -slideImgActHeight }, 500, function () {
        var topImg = $(this).children('img').eq(0);
        $(this).append(topImg).css('top', 0);
    });
}
//--
//每一頁的搜尋初始化
function initSearch() {
    $('#txtSearch').focusin(function () {
        var v = $(this).val().replace('請輸入關鍵字', '');
        $(this).val(v).css('color', 'auto');
    }).focusout(function () {
        if ($(this).val() == '') {
            $(this).val('請輸入關鍵字').css('color', '#888');
        }
    }).keypress(function (event) {
        if (event.which == 13) { //Enter
            event.preventDefault();
            btnSearchClick();
        }
    });
}
//每一頁的搜尋按鈕按下事件
function btnSearchClick() {
    var s = $('#txtSearch').val().replace(/(^\s*)|(\s*$)/g, '');
    if (s == '') {
        alert('請輸入關鍵字');
    } else {
        location.replace('newsList.htm?search=' + encodeURIComponent(s));
    }
}
//搜尋後使用newsList.htm顯示結果
function getSearchJson(text) {
    $.blockUI({ message: '網頁載入中...' });
    //
    $.post('DataHandler.ashx', {
        kind: 'search',
        search: decodeURIComponent(text)
    }, function (res) {
        var obj = jQuery.parseJSON(res);
        if (obj.result) {
            //
            var htmList = "";
            var arrData = obj.data;
            for (var i in arrData) {
                htmList += '<div class="newslist-box">';
                var imgThum = arrData[i].image_thum;
                if (imgThum == '') {
                    imgThum = '../images/400300.jpg';
                }
                htmList += '<div class="newslist-box-pic"><img src="' + imgThum + '" width="100" height="75" /></div>';
                htmList += '<div class="newslist-title">';
                htmList += '<span class="newslist-title-txt" onclick="window.open(\'newsList.aspx?id=' + arrData[i].id + '&cat=' + arrData[i].category + '\',\'_self\')">';
                htmList += arrData[i].title + '</span>';
                //
                if (arrData[i].video == 'Y') {
                    htmList += '&nbsp;<img src="../images/icon-video_01.jpg" width="30" height="16" align="absmiddle" />';
                }
                htmList += '&nbsp;<span class="gray_text">' + arrData[i].pubdate + ' | ' + arrData[i].category_cn + '</span></div>';
                //
                var desc = arrData[i].description;
                if (desc.length > 86) {
                    desc = desc.substr(0, 84) + '...';
                }
                htmList += '<div class="newslist-part">' + desc + '<strong>&lt;<a href="newsList.aspx?id=' + arrData[i].id + '&cat=' + arrData[i].category + '">詳全文</a>&gt;</strong></div>';
                //
                htmList += '</div>';
            }
            //
            pageIndex_newsList = 0;
            $('#news-area').html(htmList);
            countTotal_newsList = $('#news-area').children('.newslist-box').length;
            $('#news-area').append('<div class="page"></div>');
            //
            document.cookie = "pageIndex=0";
            changePage_newsList(0);
            //
            $('#newsList_cate').html('使用關鍵字：<span class="yellow_text">' + decodeURIComponent(text) + '</span>&nbsp;找到了&nbsp;' + countTotal_newsList + '&nbsp;筆新聞');
        }
    });
}
//--
//新聞總覽 - 新聞分類切換
function changeCategory(inc, idxCate) {
    $.blockUI({ message: '網頁載入中...' });

    //pageIndex_newsList = 0;
    $('#news-area').load(inc, function () {
        countTotal_newsList = $(this).children('.newslist-box').length;
        $(this).append('<div class="page"></div>');
        changePage_newsList(0);
    });
    //分類字體顏色切換
    $('#newsList_cate span').removeClass('yellow_text');
    $('#newsList_cate span').eq(idxCate).attr('class', 'yellow_text');
}
//新聞總覽 - 新聞的上下頁
function changePage_newsList(step) {
    if (isNaN(getCookie('pageIndex'))) {
        pageIndex_newsList = 0;
    } else {
        pageIndex_newsList = parseInt(getCookie('pageIndex'), 10);
    }
//    if (pageIndex > 0) {
//        pageIndex_newsList = pageIndex;
//    }
    //計算總共幾頁
    var pageTotal = parseInt(countTotal_newsList / 10, 10);
    if (countTotal_newsList % 10 > 0) {
        pageTotal++;
    }
    //下一頁上一頁index
    pageIndex_newsList += step;
    if (pageIndex_newsList < 0) {
        pageIndex_newsList = 0;
    } else if (pageIndex_newsList > pageTotal - 1) {
        pageIndex_newsList = pageTotal - 1;
    }
    //隱藏List
    $("#news-area .newslist-box").hide();
    //顯示第n頁
    var iEnd = (pageIndex_newsList + 1) * 10;
    for (i = pageIndex_newsList * 10; i < iEnd; i++) {
        $("#news-area .newslist-box").eq(i).show();
    }
    //改寫上一頁下一頁link
    $('#news-area .page').html('<span class="gray_text">&lt;&nbsp;<a href="javascript:void(0);" onclick="changePage_newsList(-1);">上一頁</a></span> Page ' + (pageIndex_newsList + 1) + ' / ' + pageTotal + ' <span class="gray_text"><a href="javascript:void(0);" onclick="changePage_newsList(1);">下一頁</a> &gt;</span>');
    //
    document.cookie = "pageIndex=" + pageIndex_newsList;
    //點上下頁後往上scroll至第一則
    if (step > 0) {
        $('html,body').animate({ scrollTop: 0 }, 280);
//        document.getElementById('menu').scrollIntoView(true);
    }
    $.unblockUI();
}
//--
//單則新聞
function fbShare_onenews() {
    window.open('http://www.facebook.com/sharer/sharer.php?u=' + location.href);
}
//--
//精彩節目上下頁
function changePage_wondershow(step) {
    //計算總共幾頁
    var pageTotal = parseInt(countTotal_wondershow / 6, 10);
    if (countTotal_wondershow % 6 > 0) {
        pageTotal++;
    }
    //下一頁上一頁index
    pageIndex_wondershow += step;
    if (pageIndex_wondershow < 0) {
        pageIndex_wondershow = 0;
    } else if (pageIndex_wondershow > pageTotal - 1) {
        pageIndex_wondershow = pageTotal - 1;
    }
    //隱藏List
    $("#program-area .program-box").hide();
    //顯示第n頁
    var iEnd = (pageIndex_wondershow + 1) * 6;
    for (i = pageIndex_wondershow * 6; i < iEnd; i++) {
        $("#program-area .program-box").eq(i).show();
    }
    //改寫上一頁下一頁link
    $('#bigleft .page').html('<span class="gray_text">&lt;&nbsp;<a href="javascript:void(0);" onclick="changePage_wondershow(-1);">上一頁</a></span> Page ' + (pageIndex_wondershow + 1) + ' / ' + pageTotal + ' <span class="gray_text"><a href="javascript:void(0);" onclick="changePage_wondershow(1);">下一頁</a> &gt;</span>');

    if (step > 0) {
        document.getElementById('wrap').scrollIntoView(true);
    }
}
//--
//主播圖片點擊換HTML
function changeAncho(htm) {
    $('#ancho-ancho').load(htm);
}
//--
//投訴爆料popup
function showNo8Popup() {
    //top.inc[主播介紹]換圖
    $('#menu ul li:nth-child(7) img').attr('src', '../images/n-menu-b_07.jpg');

    var x = ($(window).width() / 2) - ($("#divNo8").width() / 2);
    var y = ($(window).height() / 2) - ($("#divNo8").height() / 2);
    $("#divCover").show();
    $("#divNo8").css('left', x).css('top', y).fadeIn();
}
function closeNo8Popup() {
    $('#divCover').hide();
    $('#divNo8').hide();

    //top.inc[主播介紹]換回圖
    $('#menu ul li:nth-child(7) img').attr('src', '../images/n-menu-a_26.jpg');
}
//--

//getCookie
function getCookie(c_name) {
    var c_value = document.cookie;
    var c_start = c_value.indexOf(" " + c_name + "=");
    if (c_start == -1) {
        c_start = c_value.indexOf(c_name + "=");
    }
    if (c_start == -1) {
        c_value = null;
    }
    else {
        c_start = c_value.indexOf("=", c_start) + 1;
        var c_end = c_value.indexOf(";", c_start);
        if (c_end == -1) {
            c_end = c_value.length;
        }
        c_value = unescape(c_value.substring(c_start, c_end));
    }
    return c_value;
}
//--
//加為最愛
function addBookmarkForBrowser(sTitle, sUrl) {
    if (window.sidebar && window.sidebar.addPanel) {
        addBookmarkForBrowser = function (sTitle, sUrl) {
            window.sidebar.addPanel(sTitle, sUrl, "");
        }
    } else if (window.external) {
        addBookmarkForBrowser = function (sTitle, sUrl) {
            window.external.AddFavorite(sUrl, sTitle);
        }
    } else {
        addBookmarkForBrowser = function () {
            alert("do it yourself");
        }
    }
    return addBookmarkForBrowser(sTitle, sUrl);
}
//---
