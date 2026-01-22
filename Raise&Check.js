/* -------------------- MAIN ENTRY -------------------- */


function raiseIssue(data) {
  if (!data || !data.image || !data.imageName) {
    return { msg: "Invalid request. Image data missing." };
  }

  if (!data.description || data.description.length > 300) {
    return { msg: "Invalid description (max 300 characters)." };
  }

  const ss = SpreadsheetApp.openById(SHEET_ID);
  const issueSheet = ss.getSheetByName(ISSUE_SHEET);

  if (!issueSheet) {
    return { msg: "Issue sheet not found." };
  }

  const ticketId = generateUniqueTicketId(issueSheet);

  const imageUrl = uploadImageAndGetUrl(
    data.imageName,
    data.image,
    IMAGE_FOLDER_ID
  );

  const timestamp = formatTimestampGMT5_30(new Date());

  issueSheet.appendRow([
    ticketId,
    timestamp, // Correct string timestamp
    data.name,
    data.email,
    data.mobile,
    data.region,
    data.latitude,
    data.longitude,
    imageUrl,
    data.description,
    "OPEN"
  ]);

  sendCitizenMail(data.email, ticketId, data.region, imageUrl);

  return { msg: "Issue raised successfully. Ticket ID: " + ticketId };
}

function formatTimestampGMT5_30(date) {
  // Convert to GMT+5:30
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  const gmt5_30 = new Date(utc + 5.5 * 3600000);

  const pad = (n) => (n < 10 ? '0' + n : n);

  const day = pad(gmt5_30.getDate());
  const month = pad(gmt5_30.getMonth() + 1);
  const year = gmt5_30.getFullYear();
  const hours = pad(gmt5_30.getHours());
  const minutes = pad(gmt5_30.getMinutes());
  const seconds = pad(gmt5_30.getSeconds());

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}



/* -------------------- TICKET ID -------------------- */
function generateUniqueTicketId(sheet) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id;
  let existing = [];

  const lastRow = sheet.getLastRow();

  // Only read existing IDs if data rows exist
  if (lastRow > 1) {
    existing = sheet
      .getRange(2, 1, lastRow - 1, 1)
      .getValues()
      .flat();
  }

  do {
    id = "";
    for (let i = 0; i < 8; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  } while (existing.includes(id));

  return id;
}

function uploadImageAndGetUrl(filename, base64Data, folderId) {
  const folder = DriveApp.getFolderById(IMAGE_FOLDER_ID);
  const blob = Utilities.newBlob(
    Utilities.base64Decode(base64Data),
    MimeType.PNG,
    filename
  );
  const file = folder.createFile(blob);
  return file.getUrl();
}



/* -------------------- IMAGE UPLOAD -------------------- */
function uploadImageAndGetUrl(filename, base64Data, folderId) {
  const folder = DriveApp.getFolderById(IMAGE_FOLDER_ID);
  const blob = Utilities.newBlob(
    Utilities.base64Decode(base64Data),
    MimeType.PNG,
    filename
  );
  const file = folder.createFile(blob);
  return file.getUrl();
}


/* -------------------- EMAILS -------------------- */
function sendCitizenMail(email, ticketId, region, imageUrl) {
  const subject = "Waste Issue Registered – Ticket ID: " + ticketId;

  const body =
    "Hello,\n\n" +
    "Your waste issue has been successfully registered in the Smart Waste Report Management App.\n\n" +
    "Ticket Details:\n" +
    "Ticket ID: " + ticketId + "\n" +
    "Region: " + region + "\n" +
    "Submitted Image: " + imageUrl + "\n\n" +
    "Our team will review the issue and take appropriate action at the earliest.\n" +
    "You can use the Ticket ID to track the status of your complaint.\n\n" +
    "Regards,\n" +
    "Smart Waste Report Management App\n" +
    "Citizen Support Team";

  MailApp.sendEmail({
    to: email,
    subject: subject,
    body: body,
    name: "Smart Waste Report Management App"
  });
}



/* ================= GET TASK STATUS ================= */

function fetchTicketDetails(ticketID) {
  if (ticketID === null || ticketID === undefined) {
    return { error: "No Ticket ID provided." };
  }

  // Ensure string and trim
  ticketID = ticketID.toString().trim();

  try {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(ISSUE_SHEET);
    if (!sheet) {
      return { error: "Issue sheet not found: " + ISSUE_SHEET };
    }

    // use getDisplayValues() to get everything as strings exactly as shown in the sheet
    var data = sheet.getDataRange().getDisplayValues();

    for (var i = 1; i < data.length; i++) { // Skip header row
      var row = data[i];
      if (!row || row.length === 0) continue;
      var cellTicket = (row[0] === null || row[0] === undefined) ? "" : row[0].toString().trim();
      if (cellTicket === ticketID) { // Column A = TicketID
        // return as plain strings (use fallback to empty string)
        return {
          TicketID: row[0] || "",
          TimeStamp: row[1] || "",
          Name: row[2] || "",
          Email: row[3] || "",
          "Phone Number": row[4] || "",
          Region: row[5] || "",
          Latitude: row[6] || "",
          Longitude: row[7] || "",
          "Issue Image Link": row[8] || "",
          Description: row[9] || "",
          Status: row[10] || "",
          "Completed Issue Link": row[11] || "",
          "Workers Involved": row[12] || "",
          "Completion Timestamp": row[13] || "",
          Rating: row[15] || "",
          "Rating Description": row[16] || ""
        };
      }
    }

    // If not found, return an error object
    return { error: "Ticket ID not found." };
  } catch (e) {
    throw new Error("fetchTicketDetails failed: " + (e && e.message ? e.message : JSON.stringify(e)));
  }
}

function saveFeedback(ticketID, rating, feedbackText) {
  if (!ticketID) return "Error: Invalid Ticket ID.";
  
  try {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(ISSUE_SHEET);
    var data = sheet.getDataRange().getValues();
    
    for (var i = 1; i < data.length; i++) {
      if (data[i][0].toString().trim() === ticketID.toString().trim()) {
        // Column 15 (Index 14) is Rating
        // Column 16 (Index 15) is Rating Description
        sheet.getRange(i + 1, 16).setValue(rating);
        sheet.getRange(i + 1, 17).setValue(feedbackText);
        
        return "Thank you for your valuable feedback!";
      }
    }
    return "Error: Ticket not found.";
  } catch (e) {
    return "Error: " + e.toString();
  }
}

