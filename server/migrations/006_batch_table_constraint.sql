ALTER TABLE ug_batch
    ADD CONSTRAINT unique_batch UNIQUE (department, section, year, semester);

