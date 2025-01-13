SELECT arc_swift.equipment, arc_swift.material_number, arc_swift.serial_number, arc_swift.material_description, arc_swift.material_group, arc_swift.aircraft_reg, docfile.doc_no, location.doc_box, location.doc_locations
FROM arc_swift
LEFT JOIN docfile ON arc_swift.order_notif_w3 = docfile.doc_no
                   OR arc_swift.batch_notif_w4 = docfile.doc_no
                   OR arc_swift.po_number = docfile.doc_no
LEFT JOIN location ON docfile.doc_location = location.doc_box;
WHERE arc_swift.operator = 'GA' OR arc_swift.operator = 'CITI';

SELECT equipment, material_number, serial_number, material_description, material_group, aircraft_reg, doc_no, title, doc_box, doc_locations
FROM view_get_data;
-----------------------------------------------
CREATE VIEW view_get_data AS
SELECT *
FROM arc_swift
LEFT JOIN docfile ON arc_swift.order_notif_w3 = docfile.doc_no
                   OR arc_swift.batch_notif_w4 = docfile.doc_no
                   OR arc_swift.po_number = docfile.doc_no
LEFT JOIN location ON docfile.doc_location = location.doc_box
WHERE arc_swift.operator = 'GA' OR arc_swift.operator = 'CITI';
------------------------------------------------------------

CREATE VIEW view_get_data_new AS
SELECT *
FROM view_get_data vgd
WHERE NOT EXISTS (
    SELECT 1
    FROM old_component oc
    WHERE vgd.aircraft_reg = oc.identified
      OR vgd.ac_type = oc.identified
      OR vgd.operator = oc.identified
);
------------------------------------------------------------
CREATE VIEW view_get_data_old AS
SELECT *
FROM view_get_data vgd
WHERE EXISTS (
    SELECT 1
    FROM old_component oc
    WHERE vgd.aircraft_reg = oc.identified
      OR vgd.ac_type = oc.identified
      OR vgd.operator = oc.identified
);
-----------------------------------------------
CREATE VIEW view_count_data AS
SELECT COUNT(*) AS total_rows
FROM view_get_data_new;

-----------------------------------------------
CREATE VIEW view_get_data_time AS
SELECT arc_swift.aircraft_reg, arc_swift.ac_type, arc_swift.operator, arc_swift.material_group, arc_swift.title, docfile.doc_createddate, docfile.doc_posting_date, docfile.doc_no
FROM arc_swift
LEFT JOIN docfile ON arc_swift.order_notif_w3 = docfile.doc_no
                   OR arc_swift.batch_notif_w4 = docfile.doc_no
                   OR arc_swift.po_number = docfile.doc_no

-------------------------------------------------
CREATE VIEW view_get_data_time_result AS
SELECT
  ROW_NUMBER() OVER () as "id",
  aircraft_reg,
  ac_type,
  operator,
  SUM(CASE WHEN material_group LIKE 'LLP%' AND (doc_no IS NOT NULL OR title IS NOT NULL) THEN 1 ELSE 0 END) as "llp_linked",
  SUM(CASE WHEN material_group LIKE 'LLP%' THEN 1 ELSE 0 END) as "llp_baseline",
  ROUND(
    CAST(SUM(CASE WHEN material_group LIKE 'LLP%' AND (doc_no IS NOT NULL OR title IS NOT NULL) THEN 1 ELSE 0 END) AS DECIMAL(10,2)) /
    NULLIF(CAST(SUM(CASE WHEN material_group LIKE 'LLP%' THEN 1 ELSE 0 END) AS DECIMAL(10,2)), 0) * 100,
    2
  ) as "llp_percentage",
  SUM(CASE WHEN material_group LIKE 'TC%' AND (doc_no IS NOT NULL OR title IS NOT NULL) THEN 1 ELSE 0 END) as "tc_linked",
  SUM(CASE WHEN material_group LIKE 'TC%' THEN 1 ELSE 0 END) as "tc_baseline",
  ROUND(
    CAST(SUM(CASE WHEN material_group LIKE 'TC%' AND (doc_no IS NOT NULL OR title IS NOT NULL) THEN 1 ELSE 0 END) AS DECIMAL(10,2)) /
    NULLIF(CAST(SUM(CASE WHEN material_group LIKE 'TC%' THEN 1 ELSE 0 END) AS DECIMAL(10,2)), 0) * 100,
    2
  ) as "tc_percentage",
  SUM(CASE WHEN material_group LIKE 'NON%' AND (doc_no IS NOT NULL OR title IS NOT NULL) THEN 1 ELSE 0 END) as "non_tc_linked",
  SUM(CASE WHEN material_group LIKE 'NON%' THEN 1 ELSE 0 END) as "non_tc_baseline",
  ROUND(
    CAST(SUM(CASE WHEN material_group LIKE 'NON%' AND (doc_no IS NOT NULL OR title IS NOT NULL) THEN 1 ELSE 0 END) AS DECIMAL(10,2)) /
    NULLIF(CAST(SUM(CASE WHEN material_group LIKE 'NON%' THEN 1 ELSE 0 END) AS DECIMAL(10,2)), 0) * 100,
    2
  ) as "non_tc_percentage",
  SUM(CASE WHEN material_group IS NULL THEN 1 ELSE 0 END) as "other",
  COUNT(*) as total_count
FROM view_get_data_new
GROUP BY aircraft_reg, operator, ac_type;


----------------------------------------------------------------------------------------------------------------
CREATE VIEW view_get_data_time_result_old AS
SELECT
  ROW_NUMBER() OVER () as "id",
  aircraft_reg,
  ac_type,
  operator,
  SUM(CASE WHEN material_group LIKE 'LLP%' AND (doc_no IS NOT NULL OR title IS NOT NULL) THEN 1 ELSE 0 END) as "llp_linked",
  SUM(CASE WHEN material_group LIKE 'LLP%' THEN 1 ELSE 0 END) as "llp_baseline",
  ROUND(
    CAST(SUM(CASE WHEN material_group LIKE 'LLP%' AND (doc_no IS NOT NULL OR title IS NOT NULL) THEN 1 ELSE 0 END) AS DECIMAL(10,2)) /
    NULLIF(CAST(SUM(CASE WHEN material_group LIKE 'LLP%' THEN 1 ELSE 0 END) AS DECIMAL(10,2)), 0) * 100,
    2
  ) as "llp_percentage",
  SUM(CASE WHEN material_group LIKE 'TC%' AND (doc_no IS NOT NULL OR title IS NOT NULL) THEN 1 ELSE 0 END) as "tc_linked",
  SUM(CASE WHEN material_group LIKE 'TC%' THEN 1 ELSE 0 END) as "tc_baseline",
  ROUND(
    CAST(SUM(CASE WHEN material_group LIKE 'TC%' AND (doc_no IS NOT NULL OR title IS NOT NULL) THEN 1 ELSE 0 END) AS DECIMAL(10,2)) /
    NULLIF(CAST(SUM(CASE WHEN material_group LIKE 'TC%' THEN 1 ELSE 0 END) AS DECIMAL(10,2)), 0) * 100,
    2
  ) as "tc_percentage",
  SUM(CASE WHEN material_group LIKE 'NON%' AND (doc_no IS NOT NULL OR title IS NOT NULL) THEN 1 ELSE 0 END) as "non_tc_linked",
  SUM(CASE WHEN material_group LIKE 'NON%' THEN 1 ELSE 0 END) as "non_tc_baseline",
  ROUND(
    CAST(SUM(CASE WHEN material_group LIKE 'NON%' AND (doc_no IS NOT NULL OR title IS NOT NULL) THEN 1 ELSE 0 END) AS DECIMAL(10,2)) /
    NULLIF(CAST(SUM(CASE WHEN material_group LIKE 'NON%' THEN 1 ELSE 0 END) AS DECIMAL(10,2)), 0) * 100,
    2
  ) as "non_tc_percentage",
  SUM(CASE WHEN material_group IS NULL THEN 1 ELSE 0 END) as "other",
  COUNT(*) as total_count
FROM view_get_data_old
GROUP BY aircraft_reg, operator, ac_type;
-----------------------------------------------------------------------------
CREATE VIEW view_get_data_time_total AS
SELECT
  ROW_NUMBER() OVER () as "id",
  ac_type,
  operator,
  SUM(CASE WHEN material_group LIKE 'LLP%' AND (doc_no IS NOT NULL OR title IS NOT NULL) THEN 1 ELSE 0 END) as "llp_linked",
  SUM(CASE WHEN material_group LIKE 'LLP%' THEN 1 ELSE 0 END) as "llp_baseline",
  ROUND(
    CAST(SUM(CASE WHEN material_group LIKE 'LLP%' AND (doc_no IS NOT NULL OR title IS NOT NULL) THEN 1 ELSE 0 END) AS DECIMAL(10,2)) /
    NULLIF(CAST(SUM(CASE WHEN material_group LIKE 'LLP%' THEN 1 ELSE 0 END) AS DECIMAL(10,2)), 0) * 100,
    2
  ) as "llp_percentage",
  SUM(CASE WHEN material_group LIKE 'TC%' AND (doc_no IS NOT NULL OR title IS NOT NULL) THEN 1 ELSE 0 END) as "tc_linked",
  SUM(CASE WHEN material_group LIKE 'TC%' THEN 1 ELSE 0 END) as "tc_baseline",
  ROUND(
    CAST(SUM(CASE WHEN material_group LIKE 'TC%' AND (doc_no IS NOT NULL OR title IS NOT NULL) THEN 1 ELSE 0 END) AS DECIMAL(10,2)) /
    NULLIF(CAST(SUM(CASE WHEN material_group LIKE 'TC%' THEN 1 ELSE 0 END) AS DECIMAL(10,2)), 0) * 100,
    2
  ) as "tc_percentage",
  SUM(CASE WHEN material_group LIKE 'NON%' AND (doc_no IS NOT NULL OR title IS NOT NULL) THEN 1 ELSE 0 END) as "non_tc_linked",
  SUM(CASE WHEN material_group LIKE 'NON%' THEN 1 ELSE 0 END) as "non_tc_baseline",
  ROUND(
    CAST(SUM(CASE WHEN material_group LIKE 'NON%' AND (doc_no IS NOT NULL OR title IS NOT NULL) THEN 1 ELSE 0 END) AS DECIMAL(10,2)) /
    NULLIF(CAST(SUM(CASE WHEN material_group LIKE 'NON%' THEN 1 ELSE 0 END) AS DECIMAL(10,2)), 0) * 100,
    2
  ) as "non_tc_percentage",
  SUM(CASE WHEN material_group IS NULL THEN 1 ELSE 0 END) as "other",
  COUNT(*) as total_count
FROM view_get_data_new
GROUP BY operator, ac_type;
------------------------------------------------------------------------------
CREATE VIEW view_get_data_time_total_old AS
SELECT
  ROW_NUMBER() OVER () as "id",
  ac_type,
  operator,
  SUM(CASE WHEN material_group LIKE 'LLP%' AND (doc_no IS NOT NULL OR title IS NOT NULL) THEN 1 ELSE 0 END) as "llp_linked",
  SUM(CASE WHEN material_group LIKE 'LLP%' THEN 1 ELSE 0 END) as "llp_baseline",
  ROUND(
    CAST(SUM(CASE WHEN material_group LIKE 'LLP%' AND (doc_no IS NOT NULL OR title IS NOT NULL) THEN 1 ELSE 0 END) AS DECIMAL(10,2)) /
    NULLIF(CAST(SUM(CASE WHEN material_group LIKE 'LLP%' THEN 1 ELSE 0 END) AS DECIMAL(10,2)), 0) * 100,
    2
  ) as "llp_percentage",
  SUM(CASE WHEN material_group LIKE 'TC%' AND (doc_no IS NOT NULL OR title IS NOT NULL) THEN 1 ELSE 0 END) as "tc_linked",
  SUM(CASE WHEN material_group LIKE 'TC%' THEN 1 ELSE 0 END) as "tc_baseline",
  ROUND(
    CAST(SUM(CASE WHEN material_group LIKE 'TC%' AND (doc_no IS NOT NULL OR title IS NOT NULL) THEN 1 ELSE 0 END) AS DECIMAL(10,2)) /
    NULLIF(CAST(SUM(CASE WHEN material_group LIKE 'TC%' THEN 1 ELSE 0 END) AS DECIMAL(10,2)), 0) * 100,
    2
  ) as "tc_percentage",
  SUM(CASE WHEN material_group LIKE 'NON%' AND (doc_no IS NOT NULL OR title IS NOT NULL) THEN 1 ELSE 0 END) as "non_tc_linked",
  SUM(CASE WHEN material_group LIKE 'NON%' THEN 1 ELSE 0 END) as "non_tc_baseline",
  ROUND(
    CAST(SUM(CASE WHEN material_group LIKE 'NON%' AND (doc_no IS NOT NULL OR title IS NOT NULL) THEN 1 ELSE 0 END) AS DECIMAL(10,2)) /
    NULLIF(CAST(SUM(CASE WHEN material_group LIKE 'NON%' THEN 1 ELSE 0 END) AS DECIMAL(10,2)), 0) * 100,
    2
  ) as "non_tc_percentage",
  SUM(CASE WHEN material_group IS NULL THEN 1 ELSE 0 END) as "other",
  COUNT(*) as total_count
FROM view_get_data_old
GROUP BY operator, ac_type;
----------------------------------------------------------------------------------------------------------------
CREATE VIEW view_data_status AS
SELECT
  formatted_month,
  total_available,
  total_unavailable,
  total_available + total_unavailable AS total_documents
FROM (
  SELECT
    TO_CHAR(CAST(doc_posting_date AS DATE), 'YYYY-MM') AS formatted_month,
    COUNT(CASE WHEN doc_box IS NOT NULL THEN 1 END) AS total_available,
    COUNT(CASE WHEN doc_box IS NULL THEN 1 END) AS total_unavailable
  FROM view_get_data_new
  WHERE doc_posting_date IS NOT NULL AND doc_posting_date ~ '^\d{4}-\d{2}-\d{2}$'
  GROUP BY TO_CHAR(CAST(doc_posting_date AS DATE), 'YYYY-MM')
) AS subquery
ORDER BY formatted_month;

----------------------------------------------------
CREATE VIEW view_data_null_available AS
SELECT
  COUNT(CASE WHEN doc_posting_date IS NULL OR doc_posting_date !~ E'^\\d{4}-\\d{2}-\\d{2}$' THEN 1 END) AS total_null
FROM view_get_data_new;

----------------------------------------------------
CREATE VIEW view_count_status_general AS
  SELECT
    COUNT (*) AS total_count,
    COUNT(CASE WHEN doc_posting_date IS NULL OR doc_posting_date !~ E'^\\d{4}-\\d{2}-\\d{2}$' THEN 1 END) AS total_null,
    COUNT(CASE WHEN doc_box IS NOT NULL OR title IS NOT NULL THEN 1 END) AS total_available,
    COUNT(CASE WHEN doc_box IS NULL AND title IS NULL THEN 1 END) AS total_unavailable
  FROM view_get_data_new;
  -----------------------------------------------------
