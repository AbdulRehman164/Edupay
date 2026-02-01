BEGIN;
-- create batch table
CREATE TABLE payslip_batches (
  id UUID PRIMARY KEY,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);


-- crearte payslip_batch_items table (map payslips to batch)
CREATE TABLE payslip_batch_items (
  batch_id UUID NOT NULL,
  payslip_id BIGINT NOT NULL,
  PRIMARY KEY (batch_id, payslip_id),
  FOREIGN KEY (batch_id) REFERENCES payslip_batches(id) ON DELETE CASCADE,
  FOREIGN KEY (payslip_id) REFERENCES payslips(id) ON DELETE CASCADE
);



COMMIT;
