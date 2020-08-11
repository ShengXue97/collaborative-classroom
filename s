return (
            <div
              id="localBox"
              style={{ background: "#FFD5B8" }}
              key="2"
              data-grid={{ x: 4, y: 0, w: 4, h: 2 }}
            >
              <LocalBox
                removeElement={() => removeElement("localBox")}
                videoRoom={videoRoom}
              />
            </div>
          );