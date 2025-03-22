(() => {
    const DESCRIPTION_KEYWORDS = [
      "responsibilities",
      "you will",
      "you are expected to",
      "tasks include",
      "your role",
      "day-to-day",
      "we are looking for",
      "what you will do",
      "what you'll do",
      "key duties",
      "position overview",
      "qualifications",
      "qualification"
    ];
    function showToast(message) {
        // Create the toast element
        const toast = document.createElement('div');
        toast.textContent = message;
        
        // Style the toast (adjust these values as needed)
        toast.style.position = 'fixed';
        toast.style.top = '20px';
        toast.style.right = '20px';
        toast.style.padding = '15px 20px';
        toast.style.backgroundColor = '#333';
        toast.style.color = '#fff';
        toast.style.borderRadius = '5px';
        toast.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
        toast.style.zIndex = 10000;
        toast.style.fontFamily = 'sans-serif';
        
        
        // Append the toast to the document
        document.body.appendChild(toast);
        
        // Remove the toast after 3 seconds
        setTimeout(() => {
          toast.remove();
        }, 3000);
      }
      
  
    function isJobApplicationPage() {
      const keywords = ["apply", "job description", "qualifications", "submit", "position"];
      const textContent = document.body.innerText.toLowerCase();
      const matches = keywords.filter(keyword => textContent.includes(keyword));
      return matches.length >= 2;
    }
  
    function extractJobDescription(startEl) {
      const candidates = [];
      let section = startEl.closest("section") || startEl.parentElement;
  
      while (section && section !== document.body) {
        if (section.innerText.length > 150) {
          candidates.push(section);
        }
        section = section.parentElement;
      }
  
      const filteredLines = [];
  
      for (const candidate of candidates) {
        const walker = document.createTreeWalker(candidate, NodeFilter.SHOW_ELEMENT);
        while (walker.nextNode()) {
          const el = walker.currentNode;
          if (el.tagName === 'UL' || el.tagName === 'OL') {
            const items = Array.from(el.querySelectorAll('li')).map(li => li.innerText.trim()).filter(Boolean);
            filteredLines.push(...items);
          } else if (el.tagName === 'P' || el.tagName === 'DIV') {
            const text = el.innerText.trim();
            if (DESCRIPTION_KEYWORDS.some(kw => text.toLowerCase().includes(kw))) {
              filteredLines.push(text);
            }
          }
        }
        if (filteredLines.length > 0) break;
      }
  
      const uniqueLines = [...new Set(filteredLines)];
      return uniqueLines.length > 0 ? uniqueLines.join("\n") : "No detailed description found.";
    }
  
    function extractSectionsFromText(text) {
      const sections = {
        responsibilities: [],
        qualifications: []
      };
  
      const lines = text.split("\n");
      let current = null;
  
      for (let line of lines) {
        const lower = line.toLowerCase();
  
        if (lower.includes("responsibilities")) {
          current = "responsibilities";
          continue;
        } else if (lower.includes("qualifications")) {
          current = "qualifications";
          continue;
        }
  
        if (current && line.trim()) {
          sections[current].push(line.trim());
        }
      }
  
      sections.responsibilities = [...new Set(sections.responsibilities)];
      sections.qualifications = [...new Set(sections.qualifications)];
  
      return sections;
    }
  
    function extractGenericJobs() {
      const jobData = [];
      const seenTitles = new Set();
      const INVALID_TITLES = [
        "company", "resources", "legal", "about us", "careers", "contact", "programs"
      ];
  
      const headings = document.querySelectorAll("h1, h2, h3, h4");
  
      headings.forEach(heading => {
        const title = heading.innerText.trim();
        if (
          !title ||
          INVALID_TITLES.includes(title.toLowerCase()) ||
          title.length < 10 ||
          seenTitles.has(title.toLowerCase())
        ) {
          return;
        }
  
        const description = extractJobDescription(heading);
        const sections = extractSectionsFromText(description);
  
        jobData.push({
          title,
          responsibilities: sections.responsibilities.join("\n"),
          qualifications: sections.qualifications.join("\n")
        });
  
        seenTitles.add(title.toLowerCase());
      });
  
      return jobData;
    }

   // ✅ Notification helper
   function notifyJobFound(jobTitle) {
    chrome.runtime.sendMessage({
      action: "showNotification",
      title: "Job Found!",
      message: `We found a job: ${jobTitle}`
    });

  }
    const jobsOnLoad = extractGenericJobs();
    if (jobsOnLoad.length > 0) {
      notifyJobFound(jobsOnLoad[0].title);
      showToast(`Job Found: ${jobsOnLoad[0].title}`);

    }
  
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      if (msg.action === "checkJobPage") {
        const jobs = extractGenericJobs();
        sendResponse({ isJobPage: jobs.length > 0 });
      } else if (msg.action === "extractJobs") {
        const jobs = extractGenericJobs();
        sendResponse({ jobs, source: "dom-heuristic" });
      } else if (msg.action === "GET_JOB_INFO") {
        const jobs = extractGenericJobs();
        sendResponse(jobs[0] || {});
      }
    });
  })();
  