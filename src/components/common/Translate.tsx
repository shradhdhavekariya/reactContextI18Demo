import { useTranslation } from 'react-i18next'

interface TranslateProps {
  children: string
  namespaces: string[]
  options?: Record<string, unknown>
}

const Translate = ({ children, namespaces, options = {} }: TranslateProps) => {
  const { t } = useTranslation(namespaces)

  return <>{`${t(children, options)}`}</>
}

export default Translate
