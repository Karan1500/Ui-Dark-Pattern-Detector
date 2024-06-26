let reportData = `<h1 style="text-align: center;">Ui  DARK PATTERN DETECTOR</h1>`;

reportData+=`<br><br>`;

const renderHtml = function (event) {
  event.preventDefault();
  const htmlTextArea = document.querySelector(".html-content");
  document.querySelector(".output-container").classList.remove("d-none");
  let renderedHtml = document.querySelector(".rendered-html");

  const tempContainer = document.createElement("div");
  tempContainer.innerHTML = htmlTextArea.value;

  renderedHtml.appendChild(tempContainer);

  detectDarkPatterns(htmlTextArea.value);
};

// DARK PATTERN DETECTION CODE
const detectDarkPatterns = (htmlCode) => {
  let total=0;
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
        if (closeButtonStyles.backgroundColor === 'transparent') {
          darkPatterns.push({
            type: 'False Hierarchy in Pop-up Ad',
            ad: ad.outerHTML
          });
          data+=`Type: 'False Hierarchy in Pop-up Ad'<br>`;
          data+=`Description: The install/download button is presented such that it creates a feeling that it is more likely option as compared to the cancel button, but in reality its exactly opposite for a user. <br><br>`;
          total++;
        }
      }
    }
  });

  // Hidden information and forced continuity dark pattern
  const offers = htmlDoc.querySelectorAll('p');
  offers.forEach(offer => {
    const offerStyles = offer.style;
    const offerText = offer.innerText.toLowerCase();
    if(offerText.includes('automatically deducted') || offerText.includes('will continue') || offerText.includes('terms and conditions') || offerText.includes('t&c'))
    {
      if (parseInt(offerStyles.fontSize) < 15 || offerStyles.color === 'gray' || offerStyles.color === '#999') {
        darkPatterns.push({
          type: 'Hidden Terms in Free Trial Offer',
          offer: offer.outerHTML
        });
        data+=`Type: 'Hidden Terms in Free Trial Offer'<br>`;
        data+=`Description: The terms and conditions like the money will be automatically debited from the users' account after the free-trial period ends are written in small or dull letters such that the user may not read it. <br><br>`;
        total++;
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
        data += `Type: 'Preselected Checkbox - Dark Pattern'<br>`;
        data+=`Description: The checkbox or the toggle button for some optional activities like notification permission, or the unwanted data collection, or some extra amount while checkout are pre selected. <br><br>`;
        total++;
      }
  });

  //Aesthetic Manipulation dark pattern
  const popUpAd = findPopUpAds(htmlDoc);
  popUpAd.forEach(ad => {
    const smallCloseButton = findsmallCloseButton(ad);
    console.log(smallCloseButton);
    const smallCloseButtonStyles = smallCloseButton.style;
    if(smallCloseButtonStyles)
    {
      if(parseInt(smallCloseButtonStyles.fontSize) < 20)
      {
        darkPatterns.push({
          type: 'Aesthetic Manipulation',
          ad: ad.outerHTML
        });
        data+=`Type: 'Aesthetic Manipulation'<br>`;
        data+=`Description: The size of the close button is kept very small such that in an effort to close the ad, user may end up in clicking on the ad itself and thus gets redirected to some unwanted link. <br><br>`;
        total++;
      }
    }
  });

  //Manipulative techniques dark pattern
  const offerends = htmlDoc.querySelectorAll('p');
  offerends.forEach(offerend => {
    const offerendStyles = offerend.style;
    const offerendText = offerend.innerText.toLowerCase();
    if(offerendText.includes('hurry up') || offerendText.includes('countdown') || offerendText.includes(`don't miss out`)
    || offerendText.includes('ending soon') || offerendText.includes('sale ends') || offerendText.includes('limited time'))
    {
      if (parseInt(offerendStyles.fontSize) > 15) {
        darkPatterns.push({
          type: 'Manipulative techniques',
          offerend: offerend.outerHTML
        });
        data+=`Type: 'Manipulative techniques'<br>`;
        data+=`Description: The countdown or the text like hurry up, sale ends soon, etc. are mentioned near a product in order to develop a sense of missing out in user, so the user may end up buying unnecessary things in hurry. <br><br>`;
        total++;
      }
    }
  });

const offerendsh3 = htmlDoc.querySelectorAll('h2');
offerendsh3.forEach(offerend => {
  const offerendStyles = offerend.style;
  const offerendText = offerend.innerText.toLowerCase();
  if(offerendText.includes('hurry up') || offerendText.includes('countdown') || offerendText.includes(`don't miss out`)
  || offerendText.includes('ending soon') || offerendText.includes('sale ends') || offerendText.includes('limited time'))
  {
    
    darkPatterns.push({
      type: 'Manipulative techniques',
      offerend: offerend.outerHTML
    });
    data+=`Type: 'Manipulative techniques'<br>`;
    data+=`Description: The countdown or the text like hurry up, sale ends soon, etc. are mentioned near a product in order to develop a sense of missing out in user, so the user may end up buying unnecessary things in hurry. <br><br>`;
    total++;
    
  }
  });

const offerendsh2 = htmlDoc.querySelectorAll('h1');
offerendsh2.forEach(offerend => {
  const offerendStyles = offerend.style;
  const offerendText = offerend.innerText.toLowerCase();
  if(offerendText.includes('hurry up') || offerendText.includes('countdown') || offerendText.includes(`don't miss out`)
  || offerendText.includes('ending soon') || offerendText.includes('sale ends') || offerendText.includes('limited time'))
  {
    
    darkPatterns.push({
      type: 'Manipulative techniques',
      offerend: offerend.outerHTML
    });
    data+=`Type: 'Manipulative techniques'<br>`;
    data+=`Description: The countdown or the text like hurry up, sale ends soon, etc. are mentioned near a product in order to develop a sense of missing out in user, so the user may end up buying unnecessary things in hurry. <br><br>`;
    total++;
    
  }
  });

  reportData+=`<br><br>`;
  reportData+=`<h5>Number of DARK PATTERNS = ${total}</h5> <br>`;
  if(total)
    reportData+=`<p>The detected dark patterns are as follows:</p> <br>`;
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
      button.textContent.toLowerCase().includes('close') ||
      button.textContent.toLowerCase().includes('learn more')
    );
  });
}

function findInstallButton(ad) {
  const installButtons = ad.querySelectorAll('button'); 
  return Array.from(installButtons).find(button => {
    return (
      button.textContent.toLowerCase().includes('install') ||
      button.textContent.toLowerCase().includes('install now') ||
      button.textContent.toLowerCase().includes('install app') ||
      button.textContent.toLowerCase().includes('buy now') ||
      button.textContent.toLowerCase().includes('buy')
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

const preTags = document.querySelectorAll("pre");

preTags.forEach((preTag) => {
  const copyButton = document.createElement("span");
  copyButton.innerText = "Copy";
  copyButton.classList.add("copy-button");

  preTag.appendChild(copyButton);

  copyButton.addEventListener("click", () => {
    copyButton.style.display = "none";

    const range = document.createRange();
    range.selectNode(preTag);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);

    try {
      copyButton.innerText = "Copied!";
      setTimeout(function () {
        copyButton.innerText = "Copy";
      }, 2000);
    } catch (err) {
      console.error("Unable to copy text:", err);
    } finally {
      copyButton.style.display = "inline";

      window.getSelection().removeAllRanges();
    }
  });
});
