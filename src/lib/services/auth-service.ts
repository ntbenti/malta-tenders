import { D1Database } from '@cloudflare/workers-types';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  preferences: {
    categories: string[];
    notificationSettings: {
      email: boolean;
      deadline: boolean;
      savedSearches: boolean;
    };
  };
}

interface DbUser {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  created_at: string;
}

export class AuthService {
  constructor(
    private readonly db: D1Database,
    private readonly jwtSecret: string
  ) {}

  async createUser(email: string, password: string, name: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();

    await this.db.prepare(
      `INSERT INTO users (id, email, password_hash, name, created_at)
       VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`
    )
    .bind(id, email.toLowerCase(), hashedPassword, name)
    .run();

    return id;
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.db.prepare(
      `SELECT * FROM users WHERE email = ?`
    )
    .bind(email.toLowerCase())
    .first<DbUser>();

    if (!user || !await bcrypt.compare(password, user.password_hash)) {
      throw new Error('Invalid credentials');
    }

    return jwt.sign({ userId: user.id }, this.jwtSecret, { expiresIn: '24h' });
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const user = await this.db.prepare(
      `SELECT id, email, name FROM users WHERE id = ?`
    )
    .bind(userId)
    .first<Pick<DbUser, 'id' | 'email' | 'name'>>();

    if (!user) {
      return null;
    }

    // Get user preferences from a separate table or default values
    const preferences = {
      categories: [],
      notificationSettings: {
        email: true,
        deadline: true,
        savedSearches: true
      }
    };

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      preferences
    };
  }
}
