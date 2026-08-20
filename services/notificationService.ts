import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

// Configure foreground notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

/**
 * Configure Android Notification Channel
 */
export async function setupNotificationChannel() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('softly-mindful', {
      name: 'Mindful Sanctuary Prompts',
      description: 'Gentle morning reflections, unplug reminders, and evening wind-down.',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 150, 100, 150],
      lightColor: '#ABC0AB',
    });
  }
}

/**
 * Request notification permissions and dispatch a test/welcome notification on grant
 */
export async function requestNotificationPermissionAndWelcome(userName = 'Friend'): Promise<boolean> {
  try {
    await setupNotificationChannel();

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus === 'granted') {
      // Send instantaneous welcome notification to verify that notifications are active!
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `🌿 Welcome to Softly, ${userName}`,
          body: 'Your quiet sanctuary is active. Take a gentle, peaceful breath.',
          sound: false,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 1,
        },
      });
      return true;
    }
    return false;
  } catch (error) {
    console.warn('Error configuring notifications:', error);
    return false;
  }
}

/**
 * Schedule daily Morning Pebble prompt
 */
export async function scheduleMorningPebble(timeString = '8:30 AM') {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') return;

    // Parse time
    const [time, period] = timeString.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🌿 Morning Pebble',
        body: 'A slow morning thought is waiting for you in your quiet room.',
        sound: false,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: hours,
        minute: minutes,
      },
    });
  } catch (e) {
    console.warn('Failed to schedule morning prompt:', e);
  }
}

/**
 * Schedule Night Sanctuary wind-down
 */
export async function scheduleNightSanctuary(timeString = '10:00 PM') {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') return;

    const [time, period] = timeString.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🌙 Night Sanctuary Wind-Down',
        body: 'Time to unplug from screens and shift into restful candle amber warmth.',
        sound: false,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: hours,
        minute: minutes,
      },
    });
  } catch (e) {
    console.warn('Failed to schedule night wind-down:', e);
  }
}
