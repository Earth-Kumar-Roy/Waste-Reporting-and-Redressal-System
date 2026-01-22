function checkCode(inputCode) {
  if (!inputCode) return false;

  const sheet = SpreadsheetApp
    .openById(SHEET_ID)
    .getSheetByName(REG_SHEET);

  if (!sheet) throw new Error("Registration sheet not found");

  const storedCode = String(sheet.getRange("B1").getValue()).trim();

  if (!storedCode) return false;

  return String(inputCode).trim() === storedCode;
}

function getPendingWorkers() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(REG_SHEET);
  if (!sheet) return [];

  const data = sheet.getDataRange().getDisplayValues();
  const out = [];

  for (let i = 5; i < data.length; i++) {
    const row = data[i];
    const status = (row[8] || "").toUpperCase(); // Status column

    if (status !== "PENDING") continue;

    out.push({
      name: row[0],
      email: row[1],
      phone: row[2],
      region: row[3],
      username: row[4],
      id: row[6],
      image: row[7],   // ✅ FULL DRIVE LINK
      status: status
    });
  }

  return out;
}




/* =========================
   ADMIN – FETCH ALL WORKERS
========================= */

function getAllWorkers() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(REG_SHEET);
  if (!sheet) return [];

  const data = sheet.getDataRange().getDisplayValues();
  const result = [];

  for (let i = 5; i < data.length; i++) {
    const row = data[i];

    result.push({
      rowIndex: i + 1,
      name: row[0],
      email: row[1],
      phone: row[2],
      region: row[3],
      username: row[4],
      id: row[6],
      image: row[7],   // ✅ SAME KEY → View ID Card works
      status: String(row[8] || "").trim().toUpperCase()
    });
  }

  return result.reverse();
}



/* =========================
   ADMIN – APPROVE / REJECT
========================= */

function updateWorkerStatus(username, action) {
  action = String(action).trim().toUpperCase();

  if (!["APPROVED", "REJECTED"].includes(action)) {
    throw new Error("Invalid action");
  }

  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(REG_SHEET);
  if (!sheet) throw new Error("Registration sheet not found");

  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    const rowUsername = String(data[i][4]).trim();

    if (rowUsername === username) {
      const name  = data[i][0];
      const email = data[i][1];

      // Column I = Status
      sheet.getRange(i + 1, 9).setValue(action);

      // Send email
      sendStatusMail(email, name, action);

      // ✅ RETURN STRING ONLY
      return `Worker ${action.toLowerCase()} successfully`;
    }
  }

  throw new Error("Worker not found");
}




/* =========================
   EMAIL NOTIFICATION
========================= */

function sendStatusMail(email, name, status) {
  if (!email || !name || !status) {
    return { success: false, msg: "Missing required parameters" };
  }

  status = String(status).toUpperCase();

  let subject = "";
  let body = "";

  if (status === "APPROVED") {
    subject = "Worker Profile Approved – Waste Reporting & Redressal System";

    body =
      "Hello " + name + ",\n\n" +
      "We are pleased to inform you that your worker profile has been APPROVED after verification.\n\n" +
      "You are now authorized to participate in municipal waste reporting and redressal operations.\n\n" +
      "Please ensure compliance with operational guidelines and maintain service integrity at all times.\n\n" +
      "Regards,\n" +
      "Waste Reporting & Redressal System\n" +
      "Kolkata Municipal Operations Team";
  }

  else if (status === "REJECTED") {
    subject = "Worker Profile Rejected – Waste Reporting & Redressal System";

    body =
      "Hello " + name + ",\n\n" +
      "After careful review, your worker profile has been REJECTED.\n\n" +
      "This may be due to incomplete or unverifiable information provided during registration.\n\n" +
      "For clarification or further assistance, you may contact the administrator directly:\n\n" +
      "Email: earth.kumar.roy9752@gmail.com\n\n" +
      "Regards,\n" +
      "Waste Reporting & Redressal System\n" +
      "Kolkata Municipal Operations Team";
  }

  else {
    return { success: false, msg: "Invalid status value" };
  }

  MailApp.sendEmail({
    to: email,
    subject: subject,
    body: body,
    name: "Waste Reporting & Redressal System"
  });

  return { success: true, msg: "Status email sent successfully" };
}



