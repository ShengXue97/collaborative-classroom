import React from "react";
import moment from "moment";
import "./Message.css";

export default function Message(props) {
  const { data, isMine, startsSequence, endsSequence, showTimestamp } = props;

  const dateObject = new Date(JSON.parse(data.timestamp));
  const adjustedDateObject = new Date(
    dateObject.toLocaleString("en-US", {
      timeZone: "Asia/Singapore",
    }),
  );

  const friendlyTimestamp = moment(adjustedDateObject).format("LLLL");
  return (
    <div
      className={[
        "message",
        `${isMine ? "mine" : ""}`,
        `${startsSequence ? "start" : ""}`,
        `${endsSequence ? "end" : ""}`,
      ].join(" ")}
    >
      {showTimestamp && <div className="timestamp">{friendlyTimestamp}</div>}

      <div className="bubble-container">
        <div className="bubble" title={friendlyTimestamp}>
          {data.message}
        </div>
      </div>
    </div>
  );
}
