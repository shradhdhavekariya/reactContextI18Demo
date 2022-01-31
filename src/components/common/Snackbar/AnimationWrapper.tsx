import { ReactNode } from 'react'
import styled, { AnyStyledComponent, css, keyframes } from 'styled-components'
import {
  ALERT_ENTER_ANIMATION_DURATION,
  ALERT_EXIT_ANIMATION_DURATION,
} from './consts'

interface AnimationWrapperProps {
  className: string
  children: (className: string) => ReactNode
  out?: boolean
}

const animInKeyframes = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`

const animOutKeyframes = keyframes`
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(-60%);
  }
`

const animOutKeyframesDesktop = keyframes`
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(-60%);
  }
`

const animationStyles = css<Record<string, unknown>>`
  & {
    animation-name: ${(props) =>
      props.out ? animOutKeyframes : animInKeyframes};
    animation-duration: ${(props) =>
      props.out
        ? `${ALERT_EXIT_ANIMATION_DURATION}ms`
        : `${ALERT_ENTER_ANIMATION_DURATION}ms`};
    animation-timing-function: ease;
    animation-delay: 0s;
    animation-iteration-count: 1;
    animation-direction: normal;
    animation-fill-mode: forwards;
    animation-play-state: running;
  }
  @media screen and (min-width: 420px) {
    animation-name: ${(props) =>
      props.out ? animOutKeyframesDesktop : animInKeyframes};
  }
`

const AnimationWrapper = styled((({
  className,
  children,
}: AnimationWrapperProps) => children(className)) as AnyStyledComponent)`
  ${animationStyles}
`

export default AnimationWrapper
