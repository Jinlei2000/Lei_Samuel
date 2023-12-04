import { useToast } from 'primevue/usetoast'

export default () => {
  const toast = useToast()

  const showToast = (
    type: 'error' | 'success' | 'info' | 'warn',
    message: string,
    title: string,
  ) => {
    toast.add({
      severity: type,
      summary: message,
      detail: title,
      life: 10000,
    })
  }
  // TODO:  make a error for all backend errors same detail and summary
  return {
    showToast,
  }
}
