document.addEventListener("DOMContentLoaded", () => {
    const siteElement = document.getElementById("site");
    const messageElement = document.getElementById("message");
    const jobListElement = document.getElementById("jobList");
  
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      const url = new URL(tab.url);
      const hostname = url.hostname.replace("www.", "");
  
      siteElement.textContent = `🔗 You're on: ${hostname}`;
  
      chrome.tabs.sendMessage(tab.id, { action: "extractJobs" }, (response) => {
        jobListElement.innerHTML = ""; // Clear old results
  
        if (chrome.runtime.lastError || !response?.jobs?.length) {
          messageElement.textContent = "😕 No job data found on this page.";
          return;
        }
  
        messageElement.textContent = "👔 Jobs Found on this page:";
  
        const job = response.jobs[0];
        if (job) {
          const item = document.createElement("div");
          item.className = "job-item";
  
          const header = document.createElement("div");
          header.className = "job-title";
          header.textContent = job.title;
  
          const desc = document.createElement("div");
          desc.className = "job-desc";
          desc.style.display = "block";
  
          const resps = job.responsibilities
            ? `📌 Responsibilities:\n${job.responsibilities}`
            : "";
          const quals = job.qualifications
            ? `🎓 Qualifications:\n${job.qualifications}`
            : "";
          desc.textContent = [resps, quals].filter(Boolean).join("\n\n");
  
          const button = document.createElement("button");
          button.textContent = "Save";
          button.className = "job-btn";
          button.addEventListener("click", () => {
            navigator.clipboard.writeText(`${job.title}\n\n${desc.textContent}`);
            button.textContent = "Copied!";
            setTimeout(() => (button.textContent = "Save"), 2000);
          });
  
          item.appendChild(header);
          item.appendChild(desc);
          item.appendChild(button);
          jobListElement.appendChild(item);
        }
      });
    });
  });
  