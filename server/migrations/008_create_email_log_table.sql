CREATE TABLE payslip_email_logs (
    id serial PRIMARY KEY,
    batch_id uuid NOT NULL,
    employee_id integer NOT NULL,
    status varchar(20) NOT NULL CHECK (status IN ('pending', 'sent', 'failed')),
    error_message text,
    sent_at timestamp,
    job_id varchar(100),
    created_at timestamp NOT NULL DEFAULT NOW(),
    updated_at timestamp NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_email_logs_batch FOREIGN KEY (batch_id) REFERENCES payslip_batches (id) ON DELETE CASCADE,
    CONSTRAINT fk_email_logs_employee FOREIGN KEY (employee_id) REFERENCES employees (id) ON DELETE CASCADE,
    CONSTRAINT unique_batch_employee UNIQUE (batch_id, employee_id)
);

