import { NextRequest, NextResponse } from 'next/server';
import { D1Database, KVNamespace } from '@cloudflare/workers-types';

interface CloudflareRequest extends NextRequest {
  cf: {
    d1: D1Database;
    kvStore: KVNamespace;
  };
}

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 60; // 60 requests per minute

export async function rateLimiter(request: CloudflareRequest) {
  const ip = request.headers.get('cf-connecting-ip') || 'unknown';
  const key = `ratelimit:${ip}`;
  
  const current = await request.cf.kvStore.get(key);
  
  if (current) {
    const { count, timestamp } = JSON.parse(current);
    
    if (Date.now() - timestamp < RATE_LIMIT_WINDOW) {
      if (count >= MAX_REQUESTS) {
        return NextResponse.json({
          error: 'Too many requests'
        }, { status: 429 });
      }
      
      await request.cf.kvStore.put(key, JSON.stringify({
        count: count + 1,
        timestamp
      }));
    } else {
      await request.cf.kvStore.put(key, JSON.stringify({
        count: 1,
        timestamp: Date.now()
      }));
    }
  } else {
    await request.cf.kvStore.put(key, JSON.stringify({
      count: 1,
      timestamp: Date.now()
    }));
  }
  
  return null;
}
