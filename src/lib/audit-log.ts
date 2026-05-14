import { db } from './db';

interface AuditLogData {
  action: string;
  entity: string;
  entityId?: string;
  details?: Record<string, unknown>;
  userId?: string;
  userAgent?: string;
  ipAddress?: string;
}

export async function createAuditLog(data: AuditLogData) {
  try {
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
