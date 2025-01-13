export interface Country {
    name?: string;
    code?: string;
}

export interface Representative {
    name?: string;
    image?: string;
}

export interface Customer {
    id?: number;
    name?: string;
    country?: Country;
    company?: string;
    date?: string;
    status?: string;
    activity?: number;
    representative?: Representative;
}

export interface ReportStatus {
    formatted_month?: string;
    total_available?: string;
    total_unavailable?: string;
    total_documents?: string;
}

export interface Report {
    aircraft_reg?: string;
    ac_type?: string;
    llp_linked?: string;
    llp_baseline?: string;
    llp_percentage?: string;
    tc_linked?: string;
    tc_baseline?: string;
    tc_percentage?: string;
    non_tc_linked?: string;
    non_tc_baseline?: string;
    non_tc_percentage?: string;
    total_count?: string;
}

export interface Data {
    id_pelapor?: string;
    periode_laporan?: string;
    periode_data?: string;
    id?: string;
    pos_laporan_keuangan: any; // Tetap dibiarkan 'any' sesuai dengan kebutuhan Anda
    deskripsi_pos_laporan_keuangan?: string;
    deskripsi_pos_laba_rugi?: string;
    cakupan_data?: string;
    deskripsi_cakupan_data?: string;
    nominal_rupiah?: number;
    nominal_valas?: number;
    nominal_valas_usd?: number;
    nominal_valas_non_usd?: number;
    nominal_total?: number;
    nominal_perusahaan_induk_rupiah?: number;
    nominal_perusahaan_induk_valas?: number;
    nominal_perusahaan_induk_total?: number;
    nominal_perusahaan_anak_selain_asuransi_rupiah?: number;
    nominal_perusahaan_anak_selain_asuransi_valas?: number;
    nominal_perusahaan_anak_selain_asuransi_total?: number;
    nominal_perusahaan_anak_asuransi_rupiah?: number;
    nominal_perusahaan_anak_asuransi_valas?: number;
    nominal_perusahaan_anak_asuransi_total?: number;
    nominal_konsolidasi_rupiah?: number;
    nominal_konsolidasi_valas?: number;
    nominal_konsolidasi_total?: number;
    buk?: string;
    bus?: string;
    uus?: string;
    kategori?: string;
    uuid?: string;
}

export interface docfile_data {
    doc_no?: string;
    doc_posting_date?: string;
    doc_type?: string;
    doc_location?: string;
    doc_status?: string;
    doc_createddate?: string;
    doc_createdby?: string;
    doc_lastupdate?: string;
    doc_lastuser?: string;
    doc_category?: string;
    doc_aircrafte?: string;
    doc_work_packagee?: string;
    doc_reason?: string;
    doc_returndate?: string;
    doc_retention_schedule?: string;
    doc_last_received?: string;
    doc_last_rejected?: string;
    doc_filed?: string;
}

export interface arc_swift_data {
    equipment?: string;
    material_number?: string;
    serial_number?: string;
    material_description?: string;
    material_group?: string;
    functional_location?: string;
    aircraft_reg?: string;
    notif_w3?: string;
    order_notif_w3?: string;
    notif_w4?: string;
    batch_notif_w4?: string;
    title?: string;
    po_number?: string;
    timestamp_pi?: string;
}

export interface location_data {
    doc_box?: string;
    doc_locations?: string;
}

export interface Document {
    arc_swift: arc_swift_data;
    docfile: docfile_data;
    location: location_data;
}
