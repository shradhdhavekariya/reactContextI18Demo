import { HTMLAttributes } from 'react'

const Thumb = (props: HTMLAttributes<HTMLSpanElement>) => (
  <span {...props}>
    <span className="bar" />
    <span className="bar" />
    <span className="bar" />
  </span>
)

export default Thumb
