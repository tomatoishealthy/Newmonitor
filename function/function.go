package function

import (
	"time"
	"fmt"
	"net/http"
)


func Get(httpUrl string) float64 {
	start := time.Now()
	result, err := http.Get(httpUrl)

	if err != nil {
		fmt.Print("error", err)
		return -1
	}
	defer func(result  *http.Response) {
		if (result != nil){
			result.Body.Close()
		}

	}(result)
	elapsed := time.Since(start).Seconds()


	return elapsed
}

