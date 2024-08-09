const url = 'https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWA-3643D64E-7EA7-4F4A-AD56-9B297B38EBC4';

function getData() {
    fetch(url)
        .then(function (data) {
            return data.json();
        })
        .then(function (data) {
            sortArr(data);
            getCardAll();
            putCardAll();
        });
}

let northArr = [];
let centralArr = [];
let southArr = [];
let eastenArr = [];
let islandArr = [];

// const areaAll = {
//     areaAllArr: [northArr, centralArr, southArr, eastenArr, islandArr],
//     northArr,
//     centralArr,
//     southArr,
//     eastenArr,
//     islandArr,
// }

function sortArr(data) {
    data.records.location.forEach(item => {
        if (item.locationName === '基隆市' || item.locationName === '臺北市' || item.locationName === '新北市' || item.locationName === '桃園市' || item.locationName === '新竹縣' || item.locationName === '新竹市' || item.locationName === '宜蘭縣') {
            northArr.push(item);
        }
        if (item.locationName === '苗栗縣' || item.locationName === '臺中市' || item.locationName === '彰化縣' || item.locationName === '南投縣' || item.locationName === '雲林縣') {
            centralArr.push(item);
        }
        if (item.locationName === '嘉義縣' || item.locationName === '嘉義市' || item.locationName === '臺南市' || item.locationName === '高雄市' || item.locationName === '屏東縣') {
            southArr.push(item);
        }
        if (item.locationName === '花蓮縣' || item.locationName === '臺東縣') {
            eastenArr.push(item);
        }
        if (item.locationName === '澎湖縣' || item.locationName === '金門縣' || item.locationName === '連江縣') {
            islandArr.push(item);
        }
    });

    const sortOrder = ['基隆市', '臺北市', '新北市', '桃園市', '新竹縣', '新竹市', '宜蘭縣',
        '苗栗縣', '臺中市', '彰化縣', '南投縣', '雲林縣',
        '嘉義縣', '嘉義市', '臺南市', '高雄市', '屏東縣',
        '花蓮縣', '臺東縣',
        '澎湖縣', '金門縣', '連江縣'];

    [northArr, centralArr, southArr, eastenArr, islandArr].forEach(arr => {
        arr.sort((a, b) => sortOrder.indexOf(a.locationName) - sortOrder.indexOf(b.locationName));
        // 如果結果為負數，a 會被排在 b 之前。
        // 如果結果為正數，b 會被排在 a 之前。
        // 如果結果為零，保持原有順序。
    });
}

const locationBtnAll = document.querySelectorAll('button');
const container = document.querySelector('.container');
let cardAll = '';

locationBtnAll.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        getCardAll(index);
        putCardAll();
    });
});

let currentArray = [];

function getCardAll(index) {
    switch (index) {
        case 1:
            currentArray = northArr;
            break;
        case 2:
            currentArray = centralArr;
            break;
        case 3:
            currentArray = southArr;
            break;
        case 4:
            currentArray = eastenArr;
            break;
        case 5:
            currentArray = islandArr;
            break;
        default:
            currentArray = [...northArr, ...centralArr, ...southArr, ...eastenArr, ...islandArr];
        // 展開運算子 等於areaAll.northArr.length一路加到areaAll.islandArr.length
    }
    cardAll = currentArray.length;
}

function putCardAll() {
    container.innerHTML = '';
    let content = '';
    const currentHour = new Date().getHours();
    const isDay = currentHour >= 6 && currentHour < 18;
    let timeOfDay;
    if (isDay) {
        timeOfDay = 'day';
    } else {
        timeOfDay = 'night';
    }
    currentArray.forEach(item => {
        const Wx = item.weatherElement[0].time[0].parameter;
        const PoP = parseInt(item.weatherElement[1].time[0].parameter.parameterName);
        const MaxT = item.weatherElement[4].time[0].parameter.parameterName;
        const MinT = item.weatherElement[2].time[0].parameter.parameterName;
        const CI = item.weatherElement[3].time[0].parameter.parameterName;
        const startTime = item.weatherElement[0].time[0].startTime;
        const endTime = item.weatherElement[0].time[0].endTime;

        const weatherCode = Wx.parameterValue.padStart(2, '0');
        const iconUrl = `https://www.cwa.gov.tw/V8/assets/img/weather_icons/weathers/svg_icon/${timeOfDay}/${weatherCode}.svg`;

        content += `
        <div class="card" data-aos="zoom-in">
            <div class="flip-card-container">
                <div class="card-front">
                    <div class="cityName">${item.locationName}</div>
                    <img src="${iconUrl}" alt="${Wx.parameterName}" class="weather-icon">
                    <div class="Wx">${Wx.parameterName}</div>
                </div>
                <div class="card-back">
                    <div class="rainfall">
                        <div class="wave" style="height: ${PoP}%;"></div>
                    </div>
                    <div class="card-back-content">
                        <div class="weather-data">
                            <div class="PoP">降雨機率：${PoP}%</div>
                            <div class="MaxT">最高溫度：${MaxT}˚C</div>
                            <div class="MinT">最低溫度：${MinT}˚C</div>
                            <div class="CI">舒適度：${CI}</div>
                        </div>
                        <div class="time">
                            資料區間：
                            <div class="start-time">${startTime}</div>
                            <div class="end-time">${endTime}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    });
    container.innerHTML += content;
}

document.addEventListener('DOMContentLoaded', getData);