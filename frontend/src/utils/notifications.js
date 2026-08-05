import { LocalNotifications } from '@capacitor/local-notifications';

export const requestNotificationPermission = async () => {
  const status = await LocalNotifications.checkPermissions();
  if (status.display !== 'granted') {
    await LocalNotifications.requestPermissions();
  }
};

export const scheduleMedicineAlarm = async (medicine) => {
  try {
    // Schedule alarm
    const [hours, minutes] = medicine.time.split(':').map(Number);

    // We unique ID for each medicine notification
    // Simple way to generate a numeric ID from string name
    const notificationId = Math.abs(medicine.name.split('').reduce((a,b) => (((a << 5) - a) + b.charCodeAt(0)) | 0, 0)) % 1000000;

    await LocalNotifications.schedule({
      notifications: [
        {
          title: `Medicine Reminder: ${medicine.name}`,
          body: `Time to take your ${medicine.dosage} (${medicine.food})`,
          id: notificationId,
          schedule: {
            on: {
              hour: hours,
              minute: minutes
            },
            repeats: true,
            allowWhileIdle: true
          },
          extra: {
            medicineId: medicine._id
          }
        }
      ]
    });
    console.log(`Alarm scheduled for ${medicine.name} at ${medicine.time}`);
    return true;
  } catch (err) {
    console.error('Notification Error:', err);
    return false;
  }
};

export const cancelMedicineAlarm = async (medicineName) => {
  try {
    const notificationId = Math.abs(medicineName.split('').reduce((a,b) => (((a << 5) - a) + b.charCodeAt(0)) | 0, 0)) % 1000000;
    await LocalNotifications.cancel({
      notifications: [{ id: notificationId }]
    });
    console.log(`Alarm canceled for ${medicineName}`);
  } catch (err) {
    console.error('Cancel Notification Error:', err);
  }
};
