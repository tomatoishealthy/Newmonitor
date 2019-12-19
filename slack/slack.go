package slack

import (
	"encoding/json"
	"net/http"
	"bytes"
	"time"
	"errors"
)

var webhookUrl string = "https://hooks.slack.com/services/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"

type SlackRequestBody struct {
	Text string `json:"text"`
}

func SendSlackNotification(msg string) error {
	slackBody, _ := json.Marshal(SlackRequestBody{Text: msg})
	req, err := http.NewRequest(http.MethodPost, webhookUrl, bytes.NewBuffer(slackBody))
	if err != nil {
		return err
	}

	req.Header.Add("Content-Type", "application/json")

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}

	buf := new(bytes.Buffer)
	buf.ReadFrom(resp.Body)
	if buf.String() != "ok" {
		return errors.New("Non-ok response returned from Slack")
	}
	return nil
}

