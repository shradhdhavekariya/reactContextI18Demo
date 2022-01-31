const amountsMap = [
  10304259,
  302737,
  301224,
  299718,
  298219,
  296728,
  295244,
  293768,
  292299,
  290838,
  289384,
  287937,
  13411497,
  285064,
  283639,
  282221,
  280810,
  279406,
  278009,
  276619,
  275236,
  273859,
  272490,
  271128,
  269772,
  13393423,
  267081,
  265746,
  264,
  417,
  263095,
  261779,
  260470,
  259168,
  257872,
  256583,
  255300,
  254024,
  252753,
  13376490,
  250232,
  248981,
  247736,
  246497,
  245265,
  244039,
  242818,
  241604,
  240396,
  239194,
  237998,
  236808,
  13360399,
]

export const getAmountReleaseThisWeek = (): number => {
  const currentDate = new Date()
  const oneOfAugust = new Date(currentDate.getFullYear(), 7, 1)

  const numberOfDays = Math.floor(
    (currentDate.getTime() - oneOfAugust.getTime()) / (24 * 60 * 60 * 1000),
  )
  const result = Math.ceil((currentDate.getDay() + 1 + numberOfDays) / 7) - 1

  return amountsMap[result - 1]
}
