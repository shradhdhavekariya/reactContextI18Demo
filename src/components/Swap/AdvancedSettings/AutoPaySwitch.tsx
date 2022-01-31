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

const pseudoStyles = {
  fontSize: 16,
  position: 'absolute',
  top: 7,
}

const AutoPaySwitch = withStyles(() =>
  createStyles({
    root: {
      border: `1px solid ${Color.grey}`,
      borderRadius: 4,
      height: 36,
      width: 78,
      padding: 0,
    },
    switchBase: {
      padding: 0,
      '&$checked': {
        '& + $track': {
          backgroundColor: 'transparent',
        },
      },
    },
    thumb: {
      borderRadius: 2,
      margin: 3,
      height: 28,
      width: 35,
      backgroundColor: Color.grey,
      '&:before': {
        ...pseudoStyles,
        color: Color.background,
        content: "'Off'",
        left: 7,
      },
    },
    track: {
      borderRadius: 2,
      backgroundColor: 'transparent',
      '&:after, &:before': {
        ...pseudoStyles,
        color: Color.grey,
      },
      '&:after': {
        content: "'Off'",
        left: 5,
      },
      '&:before': {
        content: "'On'",
        right: 5,
      },
    },
    checked: {
      borderRadius: 2,
      margin: 3,
      height: 28,
      width: 35,
      color: 'white',
      fontSize: 16,
      backgroundColor: `${Color.primary} !important`,
      transform: 'translateX(34px) !important',
    },
    focusVisible: {},
  }),
)(({ classes, ...props }: Props) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      checkedIcon={<span style={{ color: 'white' }}>On</span>}
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

export default AutoPaySwitch
