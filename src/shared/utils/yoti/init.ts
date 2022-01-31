const initYoti = (
  domId: string,
  button: Record<string, string>,
  scenarioId: string,
  clientSdkId: string,
  tokenHandler: (token: string, done: () => void) => void,
  onInit: () => void,
  skinId: '' | 'yoti-with-post-office' = '',
  displayLearnMoreLink = false,
) => {
  onInit()
  return window.Yoti.Share.init({
    elements: [
      {
        domId,
        scenarioId,
        clientSdkId,
        displayLearnMoreLink,
        button,
        modal: {
          zIndex: 9999, // default to 9999, min of 0 - max of 2147483647
        },
        // shareComplete is currently not supported on Mobile
        shareComplete: {
          closeDelay: 4000, // default to 4000, min of 500 - max of 10000
          tokenHandler,
        },
        skinId,
      },
    ],
  })
}

export default initYoti
