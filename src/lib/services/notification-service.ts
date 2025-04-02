export class NotificationService {
  async notify(message: string): Promise<void> {
    // Implement notification logic
    console.log('Notification:', message);
  }
}

export default new NotificationService();
