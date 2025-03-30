# 📝 Google Forms & Google Sheets Integration  

## 🚀 Overview  
This script integrates Google Forms with Google Sheets, ensuring all responses are recorded and formatted properly. Additionally, it sends a confirmation email to the user and logs submission timestamps.  

## 🔹 Features  
✅ **Automatic Data Logging** – Saves form responses in Google Sheets  
✅ **Email Notification** – Sends an email confirmation to respondents  
✅ **Conditional Formatting** – Highlights important responses  
✅ **Timestamp Logging** – Records submission time  

---

## 📑 Google Sheets Format  

Create a **Google Sheet** named **"Form Responses"**, structured as follows:  

| Timestamp           | Name      | Email               | Message        | Status  |
|---------------------|----------|--------------------|---------------|---------|
| 2025-03-30 10:15AM | John Doe  | john@example.com   | Inquiry about pricing | Pending |
| 2025-03-30 11:02AM | Alice Lee | alice@example.com  | Need a callback | Pending |
| 2025-03-30 01:30PM | Bob Smith | bob@example.com    | Feedback submission | Pending |

---

## 📅 How to Set Up the Script

1. Open Google Forms, go to Responses → Link to Sheets to create a response sheet.
2. Open Apps Script Editor (Extensions → Apps Script).
3. Copy and paste the code.gs script.
4. Go to Triggers → Add Trigger → Select onFormSubmit → Choose “From form” → “On form submit”.
5. Click Save and authorize the script.


## 📜 Script Code (`submitForm.gs`)  

```javascript
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