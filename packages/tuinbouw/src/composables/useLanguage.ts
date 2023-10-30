import { SUPPORTED_LOCALES } from '@/bootstrap/i18n'
import { UPDATE_LOCALE } from '@/graphql/user.mutation'
import type { CustomUser } from '@/interfaces/custom.user.interface'
import { useMutation } from '@vue/apollo-composable'
import { useI18n } from 'vue-i18n'
import useCustomUser from './useCustomUser'

export default () => {
  const { locale, setLocaleMessage } = useI18n()
  const { customUser } = useCustomUser()

  const loadMessages = async (locale: string) => {
    if (locale in SUPPORTED_LOCALES) {
      const messages = await import(`../locales/${locale}.json`).then(
        m => m.default[locale],
      )

      return messages
    }

    throw new Error(`Unsupported locale: ${locale}`)
  }

  const setLocale = async (targetLocale: string) => {
    const messages = await loadMessages(targetLocale)

    setLocaleMessage(targetLocale, messages)
    locale.value = targetLocale

    // save locale to user in database
    const { mutate: updateLocale } = useMutation<CustomUser>(UPDATE_LOCALE)

    if (customUser.value) {
      // console.log('update locale', targetLocale)
      await updateLocale({
        id: customUser.value?.id,
        locale: targetLocale,
      })
    }
  }

  return {
    locale,
    setLocale,
  }
}
