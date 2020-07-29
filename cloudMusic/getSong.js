/*
* Search()
* 搜索歌曲: 返回歌曲列表 输入歌曲id 播放单曲
* 搜索歌手: 返回歌手id 输入歌手id 返回歌曲列表 ——> 搜索歌曲
*/

// TODO： 处理英文歌曲撇号 %27 空格 %20
//var requestURL = 'https://api.imjad.cn/cloudmusic/?type=search&s=Don't say you love me&search_type=1';
//var requestURL = 'https://api.imjad.cn/cloudmusic/?type=search&s=Don%27t%20say%20you%20love%20me&search_type=1';
//var requestURL = 'https://api.imjad.cn/cloudmusic/?type=search&s=Don%27t%20say%20you%20love%20me&search_type=1';
//var requestURL = 'https://api.imjad.cn/cloudmusic/?type=search&s=深海少女&search_type=1';


const BaseURL = 'https://api.imjad.cn/cloudmusic/?type=';

const selectType = document.querySelector('#type');

const mediaBox = document.querySelector('.media');

const infoList = document.querySelector('.info');

const songName = document.querySelector('#songName');
// ? querySelector or getElementById Both can use
//const withIdtype = document.getElementById('type');

const inputId = document.getElementById('id');

const searchButton = document.querySelector('.searchButton');
// searchButton.onclick = search;
searchButton.addEventListener('click', Search);

var getSongId = inputId.value
// 输入改变
inputId.onchange = function() {
    getSongId = inputId.value;
}

const getSongButton = document.querySelector('.getSongbtn');
getSongButton.addEventListener('click', getSong); 

const clearBtn = document.querySelector('.clearBtn');
clearBtn.onclick = clearInfoMedia;

// 选择所有tr 和 audio 在父类中去除
function clearInfoMedia() {
    var allTr = document.querySelectorAll('tr');
    for(let i = 0; i < allTr.length; i++){
        allTr[i].parentNode.removeChild(allTr[i]);
    }
    // console.log(allTr);
    // console.log(allTr.length);

    var allAudio = document.querySelector('.media');
    var myAudio = allAudio.querySelectorAll('audio');
    for(let i = 0; i < myAudio.length; i++){
        myAudio[i].parentNode.removeChild(myAudio[i]);
    }
    // console.log(myAudio);
    // console.log(myAudio.length);
}

// 输入id 按下button 播放歌曲
function getSong() {
    
    // 如果有id 则可以播放歌曲
    if(getSong !== ''){
        var type = 'song';
        var requestURL = BaseURL + type + '&id=' + getSongId;

        var requestSong = new XMLHttpRequest();
        requestSong.open('GET', requestURL);
        requestSong.responseType = 'json';
        requestSong.send();

        requestSong.onload= function() {
            var backSongData = requestSong.response;
            playSong(backSongData);
        }

        function playSong(backSongData){

            var myUrl = backSongData['data'][0]['url'];
            // 200 正常
            var code = backSongData['code'];
            if(code === 200){
                var mySong = document.createElement('audio');
                var mySongsource = document.createElement('source');
                // 可以控制进度 自动播放
                mySong.controls = true;
                mySong.autoplay = true;
                mySongsource.setAttribute('src', myUrl);
                mySongsource.setAttribute('type', 'audio/mp3');

                mySong.appendChild(mySongsource);
                mediaBox.appendChild(mySong);
            } else{
                alert('Something WRONG With the Songid !! (っ °Д °;)っ');
            }

        }// playSong end

    }// if end

}// getSong() end

function Search() {
// 搜索 歌曲 | 歌手
// 搜索时 type = search
// search_type = 1 单曲 || = 100 歌手
// Exampl：https://api.imjad.cn/cloudmusic/?type=search&s=李宗盛&search_type=100
// https://api.imjad.cn/cloudmusic/?type=search&s=鬼迷心窍&search_type=1
    

    // 默认搜索歌曲 search_type = 1
    var selectChoosevalue = selectType.options[selectType.selectedIndex].value;
    var search_type = selectChoosevalue;
    // 改变选项时更新 search_type
    selectType.onchange = function() {
        selectChoosevalue = selectType.options[selectType.selectedIndex].value;
        search_type = selectChoosevalue;
        console.log(search_type);
    }

    var s = songName.value;
    var type = 'search';
    var requestURL = BaseURL + type + '&s=' + s + '&search_type=' + search_type;

    // test
    console.log(requestURL);

    

    
    
    var requestID = new XMLHttpRequest();
    // 打开一个新的请求
    requestID.open('GET', requestURL);// 设定请求
    //...
    requestID.responseType = 'json';
    // 发送
    requestID.send();
    // 处理返回数据
    requestID.onload = function() {
        var backData = requestID.response;
        if(search_type === '1'){
            // 单曲信息
            getID(backData);
        } else if(search_type === '100') {
            // 歌手信息
            getArinfo(backData);
        }        
    }



    // 分支 1
    // 搜索单曲
    function getID(backData) {

        for(let i=0; i < 5; i++){
            var singleSong = backData['result']['songs'][i];
            var songName = singleSong['name'];
            var songId = singleSong['id'];
            // 艺术家信息
            var ar = singleSong['ar'][0];
            var arId = ar['id'];
            var arName = ar['name'];
            var arAlias = ar['tns'];

        // tr
            var singleTr = document.createElement('tr');
            
        // p*5
            var tdSongname = document.createElement('td');
            tdSongname.textContent = songName;
            var tdSongid = document.createElement('td');
            tdSongid.textContent = songId;
            var tdId = document.createElement('td');
            tdId.textContent = arId;
            var tdName = document.createElement('td');
            tdName.textContent = arName;
            var tdAlias = document.createElement('td');
            tdAlias.textContent = arAlias;

            singleTr.appendChild(tdSongname);
            singleTr.appendChild(tdSongid);
            singleTr.appendChild(tdId);
            singleTr.appendChild(tdName);
            singleTr.appendChild(tdAlias);
            infoList.appendChild(singleTr);
        }// for end

    }// getID(backData) end



    // 分支 2
    // 搜索歌手
    function getArinfo(backData){

        var ar = backData['result']['artists'][0];
        var arId = ar['id'];
        var arName = ar['name'];
        var arPic = ar['picUrl'];
        var arAlias = ar['alias'];

    // first tr
        var firstTr = document.createElement('tr');
    // th 表头
        var thSongname = document.createElement('th');
        thSongname.textContent = '歌曲name';
        var thSongid = document.createElement('th');
        thSongid.textContent = '歌曲id';
        var thId = document.createElement('th');
        thId.textContent = '歌手id';
        var thName = document.createElement('th');
        thName.textContent = '歌手name';
        var thAlias = document.createElement('th');
        thAlias.textContent = '歌手别名';

        var thPic = document.createElement('th');
        // rowspan 竖占位 || colspan 行占位 
        // thPic.setAttribute('rowspan', '1');
        thPic.textContent = '歌手图片';

        var arImage = document.createElement('img');
        arImage.setAttribute('src', arPic);
        thPic.appendChild(arImage);
        
        firstTr.appendChild(thSongname);
        firstTr.appendChild(thSongid);
        firstTr.appendChild(thId);
        firstTr.appendChild(thName);
        firstTr.appendChild(thAlias);
        firstTr.appendChild(thPic);

        infoList.appendChild(firstTr);
        

    // second tr
        var secTr = document.createElement('tr');
    // td 内容
        var blank_1 = document.createElement('td');
        var blank_2 = document.createElement('td');
        var tdId = document.createElement('td');
        tdId.textContent = arId;
        var tdName = document.createElement('td');
        tdName.textContent = arName;
        var tdAlias = document.createElement('td');
        tdAlias.textContent = arAlias;

        
        secTr.appendChild(blank_1);
        secTr.appendChild(blank_2);
        secTr.appendChild(tdId);
        secTr.appendChild(tdName);
        secTr.appendChild(tdAlias);
        infoList.appendChild(secTr);
        
        getHotsong(arId);

    /*
    * 现有 艺术家id arId
    * 需要一个新函数getHotsong(arId)
    * 在函数中继续添加表格
    * 搜索歌手 ——> 得到id ——> 搜索id ——> 得到hotSongid ——> 输入id播放单曲
    * 实现：Search() ——> arId ——> getHotsong(arId) ——> showHotsong(backData);
    */

        function getHotsong(arId) {
            var type = 'artist';
            var requestURL = BaseURL + type + '&id=' + arId;
            var requestHs = new XMLHttpRequest();
            // 打开一个新的请求
            requestHs.open('GET', requestURL);// 设定请求
            //...
            requestHs.responseType = 'json';
            // 发送
            requestHs.send();
            // 处理返回数据
            requestHs.onload = function() {
                var backData = requestHs.response;
                showHotsong(backData);
    
            }
    
            function showHotsong(backData) {
                
                for(let i = 0; i < 10; i++){
                    var hotSonglist = backData['hotSongs'][i];
                    var songName = hotSonglist['name'];
                    var songId = hotSonglist['id'];
    
                    // tr
                    var trHot = document.createElement('tr');
                    // td
                    var thHotname = document.createElement('td');
                    thHotname.textContent = songName;
                    var thHotid = document.createElement('td');
                    thHotid.textContent = songId;
                    
                    trHot.appendChild(thHotname);
                    trHot.appendChild(thHotid);
                    infoList.appendChild(trHot);
                //var blank = document.createElement('br');
                //infoList.appendChild(blank);
                    
                }// for end

            }// showHotsong(backData) end

        }// getHotsong(arId) end

    }// getArinfo(backData) end

}// Search() end