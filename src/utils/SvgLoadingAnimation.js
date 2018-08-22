// @flow

import React from "react";

type Props = {
  width?: number,
  height?: number
};

class SvgLoadingAnimation extends React.Component {
  props: Props;

  render() {
    const width = this.props.width || 15;
    const height = this.props.height || 9;

    const circleToAnimateSize = height * 0.1;
    const circleVerticalPosition = height / 2;
    const circleHorizontalPosition = width / 2 - circleToAnimateSize * 2.5;

    const opacityStart = 0.2;
    const opacityEnd = 0.5;

    const animationDuration = "1.2s";

    return (
      <g>
        <circle
          cx={circleHorizontalPosition + circleToAnimateSize}
          cy={circleVerticalPosition}
          r={circleToAnimateSize}
        >
          <animate
            attributeName="r"
            from={circleToAnimateSize}
            to={circleToAnimateSize}
            begin="0s"
            dur={animationDuration}
            values={`${circleToAnimateSize};${circleToAnimateSize *
              0.6};${circleToAnimateSize}`}
            calcMode="linear"
            repeatCount="indefinite"
          />
          <animate
            attributeName="fill-opacity"
            from={opacityEnd}
            to={opacityEnd}
            begin="0s"
            dur={animationDuration}
            values={`${opacityEnd};${opacityStart};${opacityEnd}`}
            calcMode="linear"
            repeatCount="indefinite"
          />
        </circle>
        <circle
          cx={circleHorizontalPosition + circleToAnimateSize * 3}
          cy={circleVerticalPosition}
          r={circleToAnimateSize * 0.6}
          fillOpacity={opacityEnd}
        >
          <animate
            attributeName="r"
            from={circleToAnimateSize * 0.6}
            to={circleToAnimateSize * 0.6}
            begin="0s"
            dur={animationDuration}
            values={`${circleToAnimateSize *
              0.6};${circleToAnimateSize};${circleToAnimateSize * 0.6}`}
            calcMode="linear"
            repeatCount="indefinite"
          />
          <animate
            attributeName="fill-opacity"
            from={opacityStart}
            to={opacityStart}
            begin="0s"
            dur={animationDuration}
            values={`${opacityStart};${opacityEnd};${opacityStart}`}
            calcMode="linear"
            repeatCount="indefinite"
          />
        </circle>
        <circle
          cx={circleHorizontalPosition + circleToAnimateSize * 5}
          cy={circleVerticalPosition}
          r={circleToAnimateSize}
        >
          <animate
            attributeName="r"
            from={circleToAnimateSize}
            to={circleToAnimateSize}
            begin="0s"
            dur={animationDuration}
            values={`${circleToAnimateSize};${circleToAnimateSize *
              0.6};${circleToAnimateSize}`}
            calcMode="linear"
            repeatCount="indefinite"
          />
          <animate
            attributeName="fill-opacity"
            from={opacityEnd}
            to={opacityEnd}
            begin="0s"
            dur={animationDuration}
            values={`${opacityEnd};${opacityStart};${opacityEnd}`}
            calcMode="linear"
            repeatCount="indefinite"
          />
        </circle>
      </g>
    );
  }
}

export default SvgLoadingAnimation;
