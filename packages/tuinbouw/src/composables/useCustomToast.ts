import { useToast } from 'primevue/usetoast'

export default () => {
  const toast = useToast()

  const showToast = (
    type: 'error' | 'success' | 'info' | 'warn',
    message: string,
    title: string,
  ) => {
    // Remove all groups to prevent stacking
    toast.removeAllGroups()
    toast.add({
      severity: type,
      summary: message,
      detail: title,
      life: 5000,
    })
  }
  return {
    showToast,
  }
}
