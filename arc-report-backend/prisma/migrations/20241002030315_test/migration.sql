-- CreateTable
CREATE TABLE "docfile" (
    "doc_no" TEXT NOT NULL,
    "doc_posting_date" TEXT,
    "doc_type" TEXT,
    "doc_location" TEXT,
    "doc_status" TEXT,
    "doc_createddate" TEXT,
    "doc_createdby" TEXT,
    "doc_lastupdate" TEXT,
    "doc_lastuser" TEXT,
    "doc_category" TEXT,
    "doc_aircrafte" TEXT,
    "doc_work_packagee" TEXT,
    "doc_reason" TEXT,
    "doc_returndate" TEXT,
    "doc_retention_schedule" TEXT,
    "doc_last_received" TEXT,
    "doc_last_rejected" TEXT,
    "doc_filed" TEXT,

    CONSTRAINT "docfile_pkey" PRIMARY KEY ("doc_no")
);

-- CreateTable
CREATE TABLE "arc_swift" (
    "equipment" TEXT NOT NULL,
    "material_number" TEXT,
    "serial_number" TEXT,
    "material_description" TEXT,
    "material_group" TEXT,
    "functional_location" TEXT,
    "aircraft_reg" TEXT,
    "notif_w3" TEXT,
    "order_notif_w3" TEXT,
    "notif_w4" TEXT,
    "batch_notif_w4" TEXT,
    "title" TEXT,
    "po_number" TEXT,
    "ac_type" TEXT,
    "operator" TEXT,
    "timestamp_pi" TEXT,

    CONSTRAINT "arc_swift_pkey" PRIMARY KEY ("equipment")
);

-- CreateTable
CREATE TABLE "location" (
    "doc_box" TEXT NOT NULL,
    "doc_locations" TEXT,

    CONSTRAINT "location_pkey" PRIMARY KEY ("doc_box")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "admin" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "old_component" (
    "identified" TEXT NOT NULL,
    "aircraft_reg" TEXT,
    "ac_type" TEXT,
    "operator" TEXT,

    CONSTRAINT "old_component_pkey" PRIMARY KEY ("identified")
);

-- CreateIndex
CREATE UNIQUE INDEX "arc_swift_equipment_key" ON "arc_swift"("equipment");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
