package alerts

import (
	"fmt"
	"time"
	"github.com/sasaxie/monitor/dingding"
)

var maxBlockNum int64= -1

func MaxBlockReportAlert() {
	queryTimeS := time.Now().UnixNano() / 1000000
	getNowBlockAlert := new(GetNowBlockAlert)
	getNowBlockAlert.MaxBlockNum = make(map[string]int64)
	getNowBlockAlert.Load()
	getNowBlockAlert.GetMaxBlockNum(queryTimeS)

	tmp := getNowBlockAlert.MaxBlockNum["主网"]
	if (tmp == maxBlockNum) {
		bodyContent := fmt.Sprintf(`
			{
				"msgtype": "text",
				"text": {
					"content": "产块异常，请及时查看原因"
				}
			}
			`)

		dingding.DingAlarm.Alarm([]byte(bodyContent))
	}
	maxBlockNum = tmp
}
