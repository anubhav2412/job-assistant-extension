# job-assistant-extension
This browser extension extracts job-related information from the current website and displays it to the user. It also notifies the user when a potential job listing is found.

Features
Automatic Job Detection: Scans the current page for job postings, looking for responsibilities and qualifications based on common keywords.

Visual Feedback: Displays the website's name and the detected job information directly in the extension popup.

Notification Alerts: Sends a browser notification to the user whenever a job is detected.

Copy and Save: Allows users to copy job details directly from the popup for future reference.

Setup
Clone or download the repository:

bash
Copy
git clone https://github.com/anubhav2412/job-assistant-extension.git
Or simply download and extract the repository as a ZIP file.

Load the extension:

Open your browser and navigate to chrome://extensions/.

Enable "Developer mode" (usually a toggle at the top-right).

Click Load unpacked and select the folder containing the extension files.

Permissions:
Ensure that the extension has permissions to display notifications and access active tabs. The manifest.json includes:

json
Copy
{
  "permissions": ["notifications", "tabs", "activeTab"],
  "host_permissions": ["<all_urls>"]
}
How to Use
Detect jobs on the current page:
The extension automatically scans the current page for potential job information.

Open a page with job listings.

If a job is found, a notification will be displayed and the popup will show the detected job details.

View job details:

Click on the extension’s icon to open the popup.

The popup will display the website’s name and the first detected job’s title, responsibilities, and qualifications.

Copy job details:

Click the Save button in the popup to copy the job details to your clipboard.

Contributing
If you’d like to contribute, please open an issue or submit a pull request on the GitHub repository.

Note:
This extension is a simple tool designed for educational purposes. Always verify the accuracy of the job information before using i