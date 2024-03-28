let reportData = ``;

const countHtmlElements = (htmlCode) => {
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(htmlCode, "text/html");
  const numHtmlElements = htmlDoc.getElementsByTagName("*").length;
  return numHtmlElements;
};

const processCss = (cssCode) => {
  const numCssRules = cssCode.split("}").length - 1;
  const numCssDeclarations = cssCode.split(";").length - 1;
  const selectorRegex = /[^,{]+(?=,|\s*{)/g;
  const numCssSelectors = (cssCode.match(selectorRegex) || []).length;

  const cssMetrics = {
    numCssRules,
    numCssDeclarations,
    numCssSelectors,
  };
  return cssMetrics;
};

function generateReportContent(numHtmlElements, cssMetrics) {
  const reportContent = `
    <h1>Website Analysis Report</h1>
    <h2>HTML Analysis</h2>
    <p>Number of HTML elements: ${numHtmlElements}</p>
    
    <h2>CSS Analysis</h2>
    <p>Number of CSS rules: ${cssMetrics.numCssRules}</p>
    <p>Number of CSS declarations: ${cssMetrics.numCssDeclarations}</p>
    <p>Number of CSS selectors: ${cssMetrics.numCssSelectors}</p>
    <br> <br>
    
    <h2 style="text-align:center;">Fitts' Law Analysis Report</h2>
  `;
  return reportContent;
}

function analyzeHtmlCss(htmlCode, cssCode) {
  const numHtmlElements = countHtmlElements(htmlCode);

  const cssMetrics = processCss(cssCode);

  const reportContent = generateReportContent(numHtmlElements, cssMetrics);

  reportData += reportContent;
}

const renderHtml = function (event) {
  event.preventDefault();
  const htmlTextArea = document.querySelector(".html-content");
  const cssTextArea = document.querySelector(".css-content");
  document.querySelector(".output-container").classList.remove("d-none");
  let renderedHtml = document.querySelector(".rendered-html");

  const tempContainer = document.createElement("div");
  tempContainer.innerHTML = htmlTextArea.value;
  tempContainer.innerHTML += `<style>${cssTextArea.value}</style>`;

  renderedHtml.appendChild(tempContainer);

  analyzeHtmlCss(htmlTextArea.value, cssTextArea.value);
  detectDarkPatterns(htmlTextArea.value, cssTextArea.value);
};

function performFittsAnalysis() {
  const interactiveElements = Array.from(
    document
      .querySelector(".rendered-html")
      .querySelectorAll('button, a, input[type="text"], select, textarea')
  );
  console.log("Interactive Elements", interactiveElements);
  const metrics = calculateMetrics(interactiveElements);

  metrics.forEach((metric) => {
    const {
      element,
      targetSize,
      width,
      nearestInteractiveElementDistance,
      nearestSubmitButtonDistance,
      referencePointDistance,
      importantContentDistance,
    } = metric;

    if (!element) return;
    console.log("Element", element, "width", width, "targetSize", targetSize);

    // Calculate Fitts' law parameters
    let distance = Math.max(
      nearestInteractiveElementDistance,
      nearestSubmitButtonDistance,
      referencePointDistance,
      importantContentDistance
    );
    if (distance === NaN || distance === Infinity) distance = 10000;
    const indexDifficulty = Math.log2(distance / targetSize + 1);

    // Generate analysis report
    const report = `
    <p><strong>Element:</strong> ${element.tagName}</p>
    <p><strong>Width:</strong> ${width}px</p>
    <p><strong>Target Size:</strong> ${targetSize}px</p>
    <p><strong>Distance to Nearest Interactive Element:</strong> ${nearestInteractiveElementDistance}px</p>
    <p><strong>Distance to Nearest Submit Button:</strong> ${nearestSubmitButtonDistance}px</p>
    <p><strong>Distance to Reference Point:</strong> ${referencePointDistance}px</p>
    <p><strong>Distance to Important Content:</strong> ${importantContentDistance}px</p>
    <p><strong>Index of Difficulty:</strong> ${indexDifficulty.toFixed(2)}</p>
   <p><strong>Analysis:</strong> ${
     indexDifficulty < 1
       ? "The design meets Fitts' law requirements. No significant improvements are needed."
       : "The design violates Fitts' law constraints. Consider the following improvements:"
   }</p>
    <ul>
      <li>Increase the target size to improve accuracy and reduce errors. Larger targets are easier to hit, especially for users with less precise motor control.</li>
      <li>Reduce the distance to interactive elements for faster interaction. Minimize the distance between the user's initial cursor position and the target element to improve efficiency and reduce movement time.</li>
      <li>Place important content closer to the reference point for easier access. Consider organizing the layout to bring frequently used or critical elements closer to the user's natural starting position or the center of the screen.</li>
      <li>Ensure scrollable areas are easily reachable and distinguishable. If there are scrollable regions, such as long lists or content sections, make sure the scrollbars or scrollable areas are clearly visible and easily accessible without requiring excessive mouse movement.</li>
      <li>Use visual cues to guide users to interactive elements. Employ visual affordances such as color contrast, hover effects, or iconography to draw attention to interactive elements and make them more discoverable.</li>
      <li>Consider touch-friendly design for mobile or touch-enabled devices. Adapt the design to accommodate touch-based interactions, such as using larger touch targets and providing appropriate spacing between elements to prevent accidental touches.</li>
      <li>Conduct user testing and gather feedback. User feedback and testing can provide valuable insights into specific pain points or areas for improvement that may not be immediately evident through the Fitts' law analysis alone.</li>
    </ul>
  `;

    reportData += report;
  });
}



// DARK PATTERN DETECTION CODE
const detectDarkPatterns = (htmlCode, cssCode) => {
  let data=``;
  const darkPatterns = [];

  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(htmlCode, 'text/html');

  // False hierarchy dark pattern
  const popUpAds = findPopUpAds(htmlDoc);
  popUpAds.forEach(ad => {
    const closeButton = findCloseButton(ad);
    const installButton = findInstallButton(ad);
    if (closeButton && installButton) {
      const closeButtonStyles = closeButton.style;
      const installButtonStyles = installButton.style;
      if(closeButtonStyles && installButtonStyles)
      {
        if (closeButtonStyles.color === installButtonStyles.color && closeButtonStyles.backgroundColor === 'transparent') {
          const style = document.createElement('style');
          style.textContent = `
            .close-button-red-border {
              border: 1px solid red !important;
            }
          `;
          document.head.appendChild(style);
          closeButton.classList.add('close-button-red-border');

          darkPatterns.push({
            type: 'False Hierarchy in Pop-up Ad',
            ad: ad.outerHTML
          });
          data+=`type: 'False Hierarchy in Pop-up Ad'`;
        }
      }
    }
  });

  // Hidden information and forced continuity dark pattern
  const offers = htmlDoc.querySelectorAll('p');
  offers.forEach(offer => {
    const offerStyles = offer.style;
    const offerText = offer.innerText.toLowerCase();
    if(offerText.includes('automatically deducted') || offerText.includes('free trial') || offerText.includes('will continue') || offerText.includes('free subscription'))
    {
      if (parseInt(offerStyles.fontSize) < 12 || offerStyles.color === 'gray' || offerStyles.color === '#999') {
        darkPatterns.push({
          type: 'Hidden Terms in Free Trial Offer',
          offer: offer.outerHTML
        });
        data+=`type: 'Hidden Terms in Free Trial Offer'`;
      }
    }
  });

  // Preselection dark pattern
  const preselectedCheckboxes = htmlDoc.querySelectorAll('input[type="checkbox"]:checked');
  preselectedCheckboxes.forEach(checkbox => {
      if (isSensitiveInput(checkbox)) {
        darkPatterns.push({
          type: 'Preselected Checkbox - Dark Pattern',
          element: checkbox.outerHTML
        });
        data += `type: 'Preselected Checkbox - Dark Pattern'`;
      }
  });

  //Aesthetic Manipulation dark pattern
  const popUpAd = findPopUpAds(htmlDoc);
  popUpAd.forEach(ad => {
    const smallCloseButton = findsmallCloseButton(ad);
    const smallCloseButtonStyles = smallCloseButton.style;
    if(smallCloseButtonStyles)
    {
      if(parseInt(smallCloseButtonStyles.fontSize) < 10)
      {
        darkPatterns.push({
          type: 'Aesthetic Manipulation',
          ad: ad.outerHTML
        });
        data+=`type: 'Aesthetic Manipulation'`;
      }
    }
  });

  //Manipulative techniques dark pattern
  const offerends = htmlDoc.querySelectorAll('p');
  offerends.forEach(offerend => {
    const offerendStyles = offerend.style;
    const offerendText = offerend.innerText.toLowerCase();
    if(offerendText.includes('hurry up') || offerendText.includes('countdown')
    || offerendText.includes('ending soon') || offerendText.includes('sale ends'))
    {
      if (parseInt(offerendStyles.fontSize) > 15) {
        darkPatterns.push({
          type: 'Manipulative techniques',
          offerend: offerend.outerHTML
        });
        data+=`type: 'Manipulative techniques'`;
      }
    }
    reportData+=data;
  });

  reportData+=data;
  console.log("Detected dark patterns:", darkPatterns);
  return darkPatterns;
};

const isSensitiveInput = (input) => {
  const parentLabel = input.closest('label');
  if (parentLabel) {
    const labelText = parentLabel.innerText.toLowerCase();
    return (
      labelText.includes('notifications') ||
      labelText.includes('sensitive') ||
      labelText.includes('data') ||
      labelText.includes('permission') ||
      labelText.includes('subscribe') ||
      labelText.includes('agree')
    );
  }
  return false;
};

function findsmallCloseButton(ad) {
  const smallCloseButtons = ad.querySelectorAll('button');
  return Array.from(smallCloseButtons).find(button => {
    return (
      button.textContent.trim() === '✕' || 
      button.textContent.trim() === '\u00D7' || 
      button.textContent.trim() === '&times;'
    );
  });
}

function findPopUpAds(code) {
  const popUpAds = [];
  const elements = code.querySelectorAll('div'); 
  elements.forEach(element => {
    if (
      element.textContent.includes('Ad') ||
      element.textContent.includes('ad') ||
      element.textContent.includes('AD')
    ) {
      popUpAds.push(element);
    }
  });
  return popUpAds;
}

function findCloseButton(ad) {
  const closeButtons = ad.querySelectorAll('button'); 
  return Array.from(closeButtons).find(button => {
    return (
      button.textContent.toLowerCase().includes('close') 
    );
  });
}

function findInstallButton(ad) {
  const installButtons = ad.querySelectorAll('button'); 
  return Array.from(installButtons).find(button => {
    return (
      button.textContent.toLowerCase().includes('install')
    );
  });
}

const downloadReport = function () {
  if (reportData === "") {
    alert("Please provide the html to analyze");
    return;
  }
  const html = `<body>${reportData}</body>`;
  console.log("Download report", reportData);
  var val = htmlToPdfmake(html);
  var dd = {
    content: val,
    pagebreakBefore: function (
      currentNode,
      followingNodesOnPage,
      nodesOnNextPage,
      previousNodesOnPage
    ) {
      return (
        currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0
      );
    },
    pageBackground: "#red",
    styles: {
      body: {
        background: "#add8e6",
        fontSize: 12,
        lineHeight: 1.5,
      },
      page: {
        background: "#f0f0f0",
      },
    },
  };
  pdfMake.createPdf(dd).download();
};

document
  .querySelector("#download-btn")
  .addEventListener("click", downloadReport);

document.querySelector("form").addEventListener("submit", renderHtml);

// Copy button functionality
const preTags = document.querySelectorAll("pre");

preTags.forEach((preTag) => {
  // Create a copy button element
  const copyButton = document.createElement("span");
  copyButton.innerText = "Copy";
  copyButton.classList.add("copy-button");

  // Append the copy button to the <pre> tag
  preTag.appendChild(copyButton);

  // Add click event listener to the copy button
  copyButton.addEventListener("click", () => {
    // Hide the copy button temporarily
    copyButton.style.display = "none";

    // Create a range and select the text inside the <pre> tag
    const range = document.createRange();
    range.selectNode(preTag);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);

    try {
      // Copy the selected text to the clipboard
      document.execCommand("copy");

      // Alert the user that the text has been copied
      copyButton.innerText = "Copied!";
      setTimeout(function () {
        copyButton.innerText = "Copy";
      }, 2000);
    } catch (err) {
      console.error("Unable to copy text:", err);
    } finally {
      // Show the copy button again
      copyButton.style.display = "inline";

      // Deselect the text
      window.getSelection().removeAllRanges();
    }
  });
});
