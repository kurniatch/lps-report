CREATE VIEW view_laporan_keuangan AS
SELECT 
    "id_pelapor",
    "id",
    "pos_laporan_keuangan" AS "Sandi",
    "deskripsi_pos_laporan_keuangan" AS "Pos-Pos",
    "buk",
    "kategori"
FROM 
    neraca_bank
WHERE 
    "head" = 'Header'  -- Prioritize rows with header first
    OR ("buk" IS NOT NULL AND "buk" != '')  -- Then show rows where buk is not null or empty
ORDER BY 
    CASE WHEN "head" = 'header' THEN 0 ELSE 1 END,  -- Ensure header rows appear first
    "id_pelapor",
    CAST("id" AS NUMERIC);


----------------------------------------------
ALTER TABLE neraca_bank
ADD COLUMN "head" TEXT;
ADD COLUMN "bus" TEXT,
ADD COLUMN "uus" TEXT;

----------------------------------------------
UPDATE neraca_bank
SET 
    "head" = 'Header'
WHERE 
    "id" = '153.0';

UPDATE neraca_bank
SET "kategori" = 'Asset'
WHERE "id" IN ('39.0', '43.0', '49.0');


SELECT kategori FROM neraca_bank
WHERE "id" IN ('129.0', '133.0', '140.0', '143.0', '146.0', '149.0', '150.0', '153.0');


--------------------
UPDATE neraca_bank
SET 
    "kategori" = CASE
        WHEN "pos_laporan_keuangan" LIKE '01.%' THEN 'Asset'
        WHEN "pos_laporan_keuangan" LIKE '02.%' THEN 'Likuiditas'
        WHEN "pos_laporan_keuangan" LIKE '03.%' THEN 'Ekuitas'
        ELSE "pos_laporan_keuangan" -- Jika tidak sesuai, biarkan nilainya tetap
    END;

----------------------------------------------

SELECT distinct "deskripsi_pos_laporan_keuangan", "id" 
FROM neraca_bank
ORDER BY CAST("id" AS NUMERIC);


-----------------------------------------------
CREATE OR REPLACE FUNCTION fill_columns_based_on_id_laba()
RETURNS TRIGGER AS $$
DECLARE
    ref_buk VARCHAR(255);
    ref_bus VARCHAR(255);
    ref_uus VARCHAR(255);
    ref_kategori VARCHAR(50);
    ref_head VARCHAR(50);
BEGIN
    -- Pastikan NEW.id tidak NULL sebelum mencoba mencocokkan
    IF NEW.id IS NOT NULL THEN
        -- Mengambil nilai dari tabel referensi berdasarkan id
        SELECT buk, bus, uus, kategori, head
        INTO ref_buk, ref_bus, ref_uus, ref_kategori, ref_head
        FROM laba_rugi_ref
        WHERE id = NEW.id::TEXT;

        -- Mengisi kolom berdasarkan hasil query
        IF ref_buk IS NOT NULL THEN
            NEW.buk := ref_buk;
        ELSE
            NEW.buk := NULL;
        END IF;

        IF ref_bus IS NOT NULL THEN
            NEW.bus := ref_bus;
        ELSE
            NEW.bus := NULL;
        END IF;

        IF ref_uus IS NOT NULL THEN
            NEW.uus := ref_uus;
        ELSE
            NEW.uus := NULL;
        END IF;

        IF ref_kategori IS NOT NULL THEN
            NEW.kategori := ref_kategori;
        ELSE
            NEW.kategori := NULL; -- Default kategori menjadi NULL
        END IF;

        IF ref_head IS NOT NULL THEN
            NEW.head := ref_head;
        ELSE
            NEW.head := NULL;
        END IF;
    ELSE
        -- Jika NEW.id adalah NULL, set kolom ke NULL atau biarkan sesuai kebutuhan
        NEW.buk := NULL;
        NEW.bus := NULL;
        NEW.uus := NULL;
        NEW.kategori := NULL;
        NEW.head := NULL;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_fill_columns_laba
BEFORE INSERT OR UPDATE ON laba_rugi
FOR EACH ROW
EXECUTE FUNCTION fill_columns_based_on_id_laba();


UPDATE laba_rugi_ref
SET buk = 'B, T'
WHERE pos_laba_rugi = '05.12.00.00.00.00';

UPDATE laba_rugi_ref
SET head = 'Header'
WHERE pos_laba_rugi IS NULL OR pos_laba_rugi = '';

--------------------

SELECT
  TO_CHAR(TO_DATE(n.periode_data, 'YYYY-MM-DD'), 'YYYY-MM-DD') AS formatted_date,
  COUNT(DISTINCT n.id) AS total_neraca,
  COUNT(DISTINCT l.id) AS total_laba
FROM
  neraca_bank n
FULL OUTER JOIN
  laba_rugi l
ON
  n.id_pelapor = l.id_pelapor
WHERE
  (n.id_pelapor = '008001000' OR l.id_pelapor = '008001000')
  AND (n.buk IS NOT NULL AND n.buk != '')
  AND (l.buk IS NOT NULL AND l.buk != '')
GROUP BY
  TO_CHAR(TO_DATE(n.periode_data, 'YYYY-MM-DD'), 'YYYY-MM-DD')
ORDER BY
  formatted_date;


