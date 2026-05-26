import { useState } from "react";
import VideoUtility from "../../Utilities/VideoUtility";

function VideoContainer() {
  const [currentBackground] = useState(() =>
    VideoUtility.getRandomBackground()
  );

  if (!currentBackground.video) {
    return null;
  }

  return (
    <div className="backgroundContainer">
      <img
        id="background"
        src={currentBackground.video}
        alt=""
        aria-hidden
      />
    </div>
  );
}

export default VideoContainer;
