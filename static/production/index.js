var serverHost = "http://127.0.0.1:8080";

var tag = "MainNetFullNodes";

var infoUrl = serverHost + "/v1/monitor/info/tag/";
var settingsUrl = serverHost + "/v1/monitor/settings/";
var runTimeUrl = serverHost + "/v1/monitor/program-info/";

var table = $('#showdatatable').DataTable({
    destroy: true,
    searching: true,
    fixedHeader: true,
    pageLength: 100,
    autoWidth: false,
    progress: false,
    ajax: {
        url: infoUrl + tag,
        type: "GET",
        dataSrc: function (response) {
            if (response == null) {
                return "";
            }

            for (var i = 0; i < response.data.length; ++i) {
                var arr = [];
                arr[0] = response.data[i].Address;

                arr[1] = response.data[i].NowBlockNum;
                arr[2] = response.data[i].NowBlockHash.substring(0, 4) + "****" + response.data[i].NowBlockHash.substring(response.data[i].NowBlockHash.length - 4, response.data[i].NowBlockHash.length);

                arr[3] = response.data[i].LastSolidityBlockNum;

                if (response.data[i].Ping <= 0) {
                    arr[4] = '<p class="red">0</p>';
                } else if (response.data[i].Ping < 100) {
                    arr[4] = '<p class="green">' + response.data[i].Ping + '</p>';
                } else if (response.data[i].Ping < 300) {
                    arr[4] = '<p class="blue">' + response.data[i].Ping + '</p>';
                } else {
                    arr[4] = '<p style="color: #F39C12;">' + response.data[i].Ping + '</p>';
                }

                arr[5] = "--";
                if (response.data[i].PingMonitor !== '') {
                    arr[5] = '<span class="sparklines_ping">' + response.data[i].PingMonitor + '</span>'
                }

                if (response.data[i].Message === 'success') {
                    arr[6] = '<p class="green">' + response.data[i].Message + '</p>';
                } else {
                    arr[6] = '<p class="red">' + response.data[i].Message + '</p>';
                }

                response.data[i] = arr;
            }
            return response.data;
        }
    }
});

// 页面加载后执行
$(document).ready(function () {
    initTag();

    initRunTime();

    initTable();
});

function initPing() {
    $('.sparklines_ping').sparkline('html', {
        type: 'bar',
        zeroColor: '#ff0000',
        barColor: '#00bf00',
        colorMap: {
            '1:99':'#1CBD20',
            '100:299': '#48A4DF',
            '300:':'#F39C12'
        },
    });
}

function initTag() {
    axios.get(settingsUrl).then(function (response) {

        if (response == null) {
            return;
        }

        if (response.data == null) {
            return;
        }

        for (var i = 0; i < response.data.length; ++i) {
            var radioStr = `
            <div class="radio">
                <label>
                    <input type="radio" class="flat" name="serverTags" value="` + response.data[i].tag + `">` +
                response.data[i].tag + `
                </label>
            `;

            if (response.data[i].isOpenMonitor) {
                radioStr += `
                <small class="fa fa-bell green">已开启钉钉报警</small>
                `
            } else {
                radioStr += `
                <small class="fa fa-bell">未开启钉钉报警</small>
                `
            }

            radioStr += `
             </div>
            `;
            $("#serverRadios").append(radioStr);
        }

        $(":radio[name='serverTags']:first").attr("checked","true");

        $(":radio[name='serverTags']").change(function () {
            tag = this.value;
            table.ajax.url(infoUrl + tag);
            table.ajax.reload(initPing);
        });
    }).catch(function (error) {
        console.log(error);
    });
}

function initRunTime() {
    setInterval(function () {
        axios.get(runTimeUrl).then(function(response) {
            $("#runTime").text(response.data);
        }).catch(function (error) {
            console.log(error);
        })
    }, 1000);
}

function initTable() {
    setInterval(function () {
        table.ajax.reload(initPing);
    }, 3000);
}