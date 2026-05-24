import pool from '../../../config/db.js';

export async function getBatchEmployees(batchId) {
    const result = await pool.query(
        `
        SELECT
            p.employee_id,
            p.month,
            p.year,
            e.name,
            e.email,
            e.cnic_no,
            p.id AS payslip_id
        FROM payslip_batch_items pbi

        JOIN payslips p
            ON p.id = pbi.payslip_id

        JOIN employees e
            ON e.id = p.employee_id

        WHERE pbi.batch_id = $1
        `,
        [batchId],
    );

    return result.rows;
}

export async function upsertPendingEmailLog(batchId, employeeId) {
    await pool.query(
        `
        INSERT INTO payslip_email_logs (
            batch_id,
            employee_id,
            status
        )
        VALUES (
            $1,
            $2,
            'pending'
        )

        ON CONFLICT (
            batch_id,
            employee_id
        )

        DO UPDATE SET
            status = 'pending',
            error_message = NULL,
            sent_at = NULL,
            updated_at = NOW()
        `,
        [batchId, employeeId],
    );
}

export async function markEmailSent(batchId, employeeId) {
    await pool.query(
        `
        UPDATE payslip_email_logs
        SET
            status = 'sent',
            sent_at = NOW(),
            error_message = NULL,
            updated_at = NOW()

        WHERE batch_id = $1
        AND employee_id = $2
        `,
        [batchId, employeeId],
    );
}

export async function markEmailFailed(batchId, employeeId, errorMessage) {
    await pool.query(
        `
        UPDATE payslip_email_logs
        SET
            status = 'failed',
            error_message = $3,
            updated_at = NOW()

        WHERE batch_id = $1
        AND employee_id = $2
        `,
        [batchId, employeeId, errorMessage],
    );
}
export async function getBatchEmailStatus(batchId) {
    const res = await pool.query(
        `
        SELECT
            status,
            COUNT(*) as count
        FROM payslip_email_logs
        WHERE batch_id = $1
        GROUP BY status
        `,
        [batchId],
    );

    const summary = {
        pending: 0,
        sent: 0,
        failed: 0,
    };

    for (const row of res.rows) {
        summary[row.status] = Number(row.count);
    }

    const total = summary.pending + summary.sent + summary.failed;

    return {
        total,
        ...summary,
        progress:
            total === 0
                ? 0
                : Math.round(((summary.sent + summary.failed) / total) * 100),
    };
}

export async function resetEmailToPending(batchId, employeeId) {
    await pool.query(
        `
        UPDATE payslip_email_logs
        SET
            status = 'pending',
            error_message = NULL,
            updated_at = NOW()
        WHERE batch_id = $1
        AND employee_id = $2
        `,
        [batchId, employeeId],
    );
}
export async function getFailedBatchEmployees(batchId) {
    const result = await pool.query(
        `
        SELECT
            pel.employee_id,

            e.name,
            e.email,
            e.cnic_no,

            p.month,
            p.year,
            p.id AS payslip_id

        FROM payslip_email_logs pel

        INNER JOIN employees e
            ON e.id = pel.employee_id

        INNER JOIN payslip_batch_items pbi
            ON pbi.batch_id = pel.batch_id

        INNER JOIN payslips p
            ON p.id = pbi.payslip_id
            AND p.employee_id = pel.employee_id

        WHERE pel.batch_id = $1
        AND pel.status = 'failed'
        `,
        [batchId],
    );

    return result.rows;
}
