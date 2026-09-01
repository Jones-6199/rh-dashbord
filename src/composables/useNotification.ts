import { ref } from 'vue';
import type { ToastNotification } from '@/types/candidate';

const notifications = ref<ToastNotification[]>([]);

export function useNotification() {
  const addNotification = (
    type: ToastNotification['type'],
    title: string,
    message: string,
    duration = 4000
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const notification: ToastNotification = { id, type, title, message, duration };

    notifications.value.push(notification);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  };

  const removeNotification = (id: string) => {
    notifications.value = notifications.value.filter((n) => n.id !== id);
  };

  const notifySuccess = (title: string, message: string) =>
    addNotification('success', title, message);

  const notifyError = (title: string, message: string) =>
    addNotification('error', title, message);

  const notifyInfo = (title: string, message: string) =>
    addNotification('info', title, message);

  const notifyWarning = (title: string, message: string) =>
    addNotification('warning', title, message);

  return {
    notifications,
    addNotification,
    removeNotification,
    notifySuccess,
    notifyError,
    notifyInfo,
    notifyWarning,
  };
}
