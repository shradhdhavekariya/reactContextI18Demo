import React from 'react'
import {
  createStyles,
  Switch,
  SwitchClassKey,
  SwitchProps,
  withStyles,
} from '@material-ui/core'
import { Color } from 'src/theme'

interface Styles extends Partial<Record<SwitchClassKey, string>> {
  focusVisible?: string
}

interface Props extends SwitchProps {
  classes: Styles
}

const ConnectionSwitch = withStyles(() =>
  createStyles({
    root: {
      width: 38,
      height: 16,
      padding: 0,
      margin: 8,
    },
    switchBase: {
      margin: '0 1px',
      padding: 1,
      '&$checked': {
        '& + $track': {
          backgroundColor: Color.success,
          opacity: 1,
        },
      },
      '&$focusVisible $thumb': {
        color: Color.success,
      },
    },
    thumb: {
      width: 14,
      backgroundColor: 'black',
      height: 14,
    },
    track: {
      borderRadius: 13,
      backgroundColor: Color.danger,
      opacity: 1,
    },
    checked: {},
    focusVisible: {},
  }),
)(({ classes, ...props }: Props) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      checkedIcon={props.icon}
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  )
})

export default ConnectionSwitch
