import { ExecutionContext, ScheduledEvent } from '@cloudflare/workers-types';
import { Env } from './types';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return new Response('Worker running');
  },

  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    try {
      const response = await fetch(`${env.APP_URL}/api/cron/daily-update`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${env.CRON_SECRET}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      console.error('Error in scheduled task:', error);
      throw error;
    }
  }
};
