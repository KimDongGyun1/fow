import React from "react";
import styled from "@emotion/styled";
import colors from "../constants/colors";

interface ProgressBarProps {
  progress: number;
  containerWidth?: number; // 추가: ProgressBarContainer의 width를 조절하기 위한 prop
  containerHeight?: number; // 추가: ProgressBarContainer의 height를 조절하기 위한 prop
}

const ProgressBar = ({
  progress,
  containerWidth,
  containerHeight,
}: ProgressBarProps) => {
  return (
    <ProgressBarContainer width={containerWidth} height={containerHeight}>
      <StyledProgressBar progress={progress}>
        <ProgressText isWhite={progress > 0}>다음 탐험 레벨까지</ProgressText>
      </StyledProgressBar>
      <FollowDiv progress={progress}>4,300</FollowDiv>
    </ProgressBarContainer>
  );
};

export default ProgressBar;

const ProgressBarContainer = styled.div<{ width?: number; height?: number }>`
  position: relative;
  width: ${({ width }) => (width ? `${width}px` : "350px")};
  height: ${({ height }) => (height ? `${height}px` : "22px")};
  margin-top: 20px;
`;

const StyledProgressBar = styled.div<ProgressBarProps>`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  background-color: #eee;
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  &::after {
    content: "";
    display: block;
    width: ${({ progress }) => `${progress}%`};
    height: 100%;
    background-color: ${colors.primary};
    animation: fillAnimation 1s ease-out;
  }

  @keyframes fillAnimation {
    from {
      width: 0;
    }
    to {
      width: ${({ progress }) => `${progress}%`};
    }
  }
`;

const ProgressText = styled.span<{ isWhite: boolean }>`
  position: absolute;
  top: 47%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: bold;
  font-size: 12px;
  color: white;
  text-shadow: -0.2px 0 #000, 0 0.2px #000, 0.2px 0 #000, 0 -0.2px #000;
`;

const FollowDiv = styled.div<{ progress: number }>`
  position: absolute;
  left: ${({ progress }) => `${progress}%`};
  transform: translate(-50%, -100%);
  font-size: 12px;
  font-weight: bold;
  color: ${colors.primary};
  animation: followAnimation 1s ease-out;

  @keyframes followAnimation {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  } */
`;
