import { useEffect, useState } from 'react'

export type Status = 'idle' | 'loading' | 'ready' | 'error'
export type ScriptElt = HTMLScriptElement | null

const useScript = (src: string): Status => {
  const [status, setStatus] = useState<Status>(src ? 'loading' : 'idle')

  useEffect(
    () => {
      if (!src) {
        setStatus('idle')
        return
      }

      let script: ScriptElt = document.querySelector(`script[src="${src}"]`)

      if (!script) {
        script = document.createElement('script')
        script.src = src
        script.async = true
        script.setAttribute('data-status', 'loading')
        document.head.appendChild(script)

        const setAttributeFromEvent = (event: Event) => {
          script?.setAttribute(
            'data-status',
            event.type === 'load' ? 'ready' : 'error',
          )
        }
        script.addEventListener('load', setAttributeFromEvent)
        script.addEventListener('error', setAttributeFromEvent)
      } else {
        setStatus(script.getAttribute('data-status') as Status)
      }

      const setStateFromEvent = (event: Event) => {
        setStatus(event.type === 'load' ? 'ready' : 'error')
      }

      script.addEventListener('load', setStateFromEvent)
      script.addEventListener('error', setStateFromEvent)

      // eslint-disable-next-line consistent-return
      return () => {
        if (script) {
          script.removeEventListener('load', setStateFromEvent)
          script.removeEventListener('error', setStateFromEvent)
        }
      }
    },
    [src], // Only re-run effect if script src changes
  )
  return status
}
export default useScript
