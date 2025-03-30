function onFormSubmit(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form Responses");
  if (!sheet) {
    Logger.log("❌ Error: Sheet 'Form Responses' not found.");
    return;
  }

  var row = e.range.getRow();
  var email = sheet.getRange(row, 3).getValue(); // Email column
  var name = sheet.getRange(row, 2).getValue();  // Name column
  var message = sheet.getRange(row, 4).getValue();  // Message column

  // Send confirmation email
  try {
    var subject = "✅ Form Submission Received";
    var body = `Hello ${name},\n\nThank you for reaching out! We have received your message: "${message}".\n\nWe will get back to you shortly.\n\nBest regards,\nYour Company`;
    
    MailApp.sendEmail(email, subject, body);
    sheet.getRange(row, 5).setValue("Email Sent ✅");
  } catch (error) {
    sheet.getRange(row, 5).setValue("Failed ❌: " + error.message);
  }
}

// Apply Conditional Formatting to highlight pending messages
function applyConditionalFormatting() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form Responses");
  if (!sheet) return;

  var range = sheet.getRange("E2:E"); // Status column
  var rule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains("Pending")
    .setBackground("#ffcccc") // Light red
    .setFontColor("#b22222")  // Dark red
    .build();

  var rules = sheet.getConditionalFormatRules();
  rules.push(rule);
  sheet.setConditionalFormatRules(rules);
}