import { D1Database } from '@cloudflare/workers-types';
import { v4 as uuidv4 } from 'uuid';

export enum NotificationType {
  NEW_TENDER = 'new_tender',
  TENDER_UPDATE = 'tender_update',
  DEADLINE_REMINDER = 'deadline_reminder',
  SAVED_SEARCH_MATCH = 'saved_search_match'
}

interface NotificationContent {
  title: string;
  message: string;
  tenderId?: string;
  searchId?: string;
}

interface DbNotification {
  id: string;
  user_id: string;
  type: NotificationType;
  content: string;
  created_at: string;
}

interface DbTenderWithUser {
  id: string;
  title: string;
  user_id: string;
  submission_deadline: string;
}

export class NotificationService {
  constructor(private readonly db: D1Database) {}

  async createNotification(
    userId: string,
    type: NotificationType,
    content: NotificationContent
  ): Promise<string> {
    const id = uuidv4();
    
    await this.db.prepare(
      `INSERT INTO notifications (id, user_id, type, content, created_at)
       VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`
    )
    .bind(id, userId, type, JSON.stringify(content))
    .run();
    
    return id;
  }

  async getUserNotifications(userId: string, limit = 50): Promise<DbNotification[]> {
    const result = await this.db.prepare(
      `SELECT * FROM notifications 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT ?`
    )
    .bind(userId, limit)
    .all<DbNotification>();
    
    return result.results;
  }

  async markAsRead(notificationId: string, userId: string): Promise<void> {
    await this.db.prepare(
      `UPDATE notifications 
       SET read_status = TRUE 
       WHERE id = ? AND user_id = ?`
    )
    .bind(notificationId, userId)
    .run();
  }

  async createDeadlineReminders(): Promise<void> {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const tenders = await this.db.prepare(
      `SELECT t.*, u.id as user_id
       FROM tenders t
       JOIN saved_tenders st ON t.id = st.tender_id
       JOIN users u ON st.user_id = u.id
       WHERE t.submission_deadline = ?`
    )
    .bind(tomorrow.toISOString().split('T')[0])
    .all<DbTenderWithUser>();
    
    for (const tender of tenders.results) {
      await this.createNotification(
        tender.user_id,
        NotificationType.DEADLINE_REMINDER,
        {
          title: 'Tender Deadline Tomorrow',
          message: `The tender "${tender.title}" is due tomorrow`,
          tenderId: tender.id
        }
      );
    }
  }
}
