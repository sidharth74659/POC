export class RateLimitMiddleware {
  private static requestCounts = new Map<string, { count: number; resetTime: number }>();
  
  static checkRateLimit(identifier: string, maxRequests: number = 100, windowMs: number = 15 * 60 * 1000): boolean {
    const now = Date.now();
    const record = this.requestCounts.get(identifier);
    
    if (!record || now > record.resetTime) {
      this.requestCounts.set(identifier, {
        count: 1,
        resetTime: now + windowMs
      });
      return true;
    }
    
    if (record.count >= maxRequests) {
      return false;
    }
    
    record.count++;
    return true;
  }
  
  static cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.requestCounts.entries()) {
      if (now > record.resetTime) {
        this.requestCounts.delete(key);
      }
    }
  }
}