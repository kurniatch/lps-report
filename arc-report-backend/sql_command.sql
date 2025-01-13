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
CREATE OR REPLACE FUNCTION fill_columns_based_on_pos()
RETURNS TRIGGER AS $$
DECLARE
    ref_buk VARCHAR(255);
    ref_bus VARCHAR(255);
    ref_uus VARCHAR(255);
    ref_kategori VARCHAR(50);
    ref_head VARCHAR(50);
BEGIN
    -- Mengambil nilai dari tabel referensi
    SELECT buk, bus, uus, kategori, head
    INTO ref_buk, ref_bus, ref_uus, ref_kategori, ref_head
    FROM neraca_bank_ref
    WHERE pos_laporan_keuangan = NEW.pos_laporan_keuangan;

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
        NEW.kategori := NULL; -- Mengubah default dari 'Asset' menjadi NULL
    END IF;

    IF ref_head IS NOT NULL THEN
        NEW.head := ref_head;
    ELSE
        NEW.head := NULL;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
