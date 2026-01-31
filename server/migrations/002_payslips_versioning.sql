BEGIN;

-- 1. Add versioning flag
ALTER TABLE payslips
ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;

-- 2. Remove incorrect uniqueness constraint
ALTER TABLE payslips
DROP CONSTRAINT IF EXISTS payslips_employee_id_month_year_key;

-- 3. Enforce one active payslip per employee per month
CREATE UNIQUE INDEX IF NOT EXISTS payslips_one_active_per_employee_month
ON payslips (employee_id, month, year)
WHERE is_active = true;

-- 4. Speed up batch downloads
CREATE INDEX IF NOT EXISTS payslips_upload_id_idx
ON payslips (upload_id);

COMMIT;
