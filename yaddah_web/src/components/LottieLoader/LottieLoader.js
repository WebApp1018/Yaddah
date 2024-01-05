import React from "react";
import { Player } from "@lottiefiles/react-lottie-player";

import loadingLottie from "../../assets/lottie/loadingSecondary.json";

const LottieLoader = ({ className }) => {
  return (
    <div className={className && className}>
      <Player
        autoplay
        loop
        src={loadingLottie}
        style={{ height: "300px", width: "300px" }}
      ></Player>
    </div>
  );
};

export default LottieLoader;
