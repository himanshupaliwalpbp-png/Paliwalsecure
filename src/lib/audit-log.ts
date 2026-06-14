interface AuditLogData {
  action: string;
  entity: string;
  entityId?: string;
  details?: Record<string, unknown>;
  userId?: string;
  userAgent?: string;
  ipAddress?: string;
}

/**
 * Create an audit log entry.
 * Uses dynamic DB import to avoid crashing on Vercel/serverless where SQLite doesn't exist.
 */
export async function createAuditLog(data: AuditLogData) {
  try {
    const dbModule = await import('./db');
    const db = dbModule.db;
    await db.auditLog.create({
      data: {
        action: data.action,
        entity: data.entity,
        entityId: data.entityId,
        details: data.details ? JSON.stringify(data.details) : null,
        userId: data.userId,
        userAgent: data.userAgent,
        ipAddress: data.ipAddress,
      },
    });
  } catch (error) {
    console.error('[AUDIT_LOG_ERROR]', error);
    // Don't throw — audit logging should never break the main flow
  }
}
