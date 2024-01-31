// Function to get data from XML file
function getData(xmlFile) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        var xmlDoc = this.responseXML;
        if (xmlDoc) {
          processData(xmlDoc);
        } else {
          console.error("Failed to parse XML. Response text:", this.responseText);
        }
      } else {
        console.error("Failed to load XML file. Status: " + this.status);
      }
    }
  };
  xhttp.open("GET", xmlFile, true);
  xhttp.send();
}

// Extract the category from the URL
var urlParams = new URLSearchParams(window.location.search);
var category = urlParams.get('category');

// Check if category is specified and not null or empty
if (category && category.trim() !== "") {
  getData(category + ".xml");
} else {
  console.error("Category not specified in the URL or is empty.");
}


// Function to process the XML data and call the appropriate display function
function processData(xmlDoc) {
  console.log("XML Document:", xmlDoc);

  var root = xmlDoc.documentElement;
  console.log("Root Element:", root);

  var dataType = root.getAttribute("type");
  console.log("Data Type:", dataType);

  switch (dataType) {
    case "software_engineering":
      displaySoftwareEngineering(root);
      break;
    case "graphic_illustrator":
      displayGraphicIllustrator(root);
      break;
    case "music_composer":
      displayMusicComposer(root);
      break;
    case "author":
      displayAuthor(root);
      break;
    case "credentials":
      displayCredentials(root);
      break;
    case "stores":
      displayStores(root);
      break;
    default:
      console.error("Invalid data type: " + dataType);
  }
}

function displayAuthor(root) {
  try {
    var bookSeries = root.querySelector("book_series");
    var buyLinks = bookSeries.querySelector("buy_links");
    var amazonEmbed = bookSeries.querySelector("amazon_embed");

    var output = "<h2>Book Series: Memorandum in a Cruet</h2>";

    // Helper function to parse CDATA content
    function parseCDATAContent(cdata) {
      try {
        var parser = new DOMParser();
        var cdataDoc = parser.parseFromString(cdata, "application/xml");

        // Extract the text content
        var textContent = cdataDoc.documentElement.textContent || "";

        return {
          textContent: textContent,
        };
      } catch (error) {
        console.error("Error in parseCDATAContent function:", error);
        return {
          textContent: "",
        };
      }
    }

    // Display book series information
    output += "<div id='book-series'>";
    output += "<img src='" + bookSeries.querySelector("img").getAttribute("src") + "'>";
    output += parseCDATAContent(bookSeries.innerHTML).textContent;
    output += "</div>";

    // Display buy links
    output += "<div id='buy-links'>";
    var links = buyLinks.children;
    for (var i = 0; i < links.length; i++) {
      // Access the text content of the child element, which is the URL
      output += "<a href='" + links[i].textContent + "' target='_blank'>" + links[i].tagName + "</a>";
    }
    output += "</div>";

    // Display Amazon embed
    output += "<div id='amazon-embed'>";
    // Access the text content of the <amazon_embed> element
    output += parseCDATAContent(amazonEmbed.outerHTML).textContent;
    output += "</div>";

    output += "</div>";
    document.getElementById("main-content").innerHTML = output;
  } catch (error) {
    console.error("Error in displayAuthor function:", error);
  }
}











function displayGraphicIllustrator(root) {
  var portraitography = root.querySelector("portraitography");
  var fineArts = root.querySelector("fine_arts");
  var animations = root.querySelector("animations");

  var output = "<h2>Graphic Illustrator</h2>";

  function parseCDATAContent(cdata) {
    var tempDiv = document.createElement("div");
    tempDiv.innerHTML = cdata;

    // Extract the text content
    var textContent = tempDiv.innerText || tempDiv.textContent || "";

    // Extract the HTML content
    var htmlContent = tempDiv.innerHTML || "";

    return {
      textContent: textContent,
      htmlContent: htmlContent,
    };
  }

  // Display Portraitography
  if (portraitography) {
    output += "<div id='portraitography'>";

    // Parse CDATA content
    var portraitographyContent = parseCDATAContent(portraitography.textContent);

    // Display the extracted HTML content
    output += portraitographyContent.htmlContent;

    // Continue with the rest of your function for links and YouTube video

    // Display Links
    var linksUl = portraitography.querySelector("ul");
    if (linksUl) {
      output += "<p>Links:</p><ul>";

      var links = linksUl.getElementsByTagName("li");
      for (var i = 0; i < links.length; i++) {
        output += "<li>" + (links[i].innerHTML || "") + "</li>";
      }

      output += "</ul>";
    }

    // Display YouTube Video
    var videoIframe = portraitography.querySelector("iframe");
    if (videoIframe) {
      output += "<div>" + (videoIframe.outerHTML || "") + "</div>";
    }

    output += "</div>";
  }


  // Display Fine Arts
  if (fineArts) {
    output += "<div id='fine-arts'>";

    // Parse CDATA content
    var fineArtsContent = parseCDATAContent(fineArts.textContent);

    // Display the extracted HTML content
    output += fineArtsContent.htmlContent;

    // Continue with the rest of your function for links and YouTube video

    // Display Links (Assuming a similar structure as Portraitography)
    var linksUl = fineArts.querySelector("ul");
    if (linksUl) {
      output += "<p>Links:</p><ul>";

      var links = linksUl.getElementsByTagName("li");
      for (var i = 0; i < links.length; i++) {
        output += "<li>" + (links[i].innerHTML || "") + "</li>";
      }

      output += "</ul>";
    }

    // You can add more specific content display here if needed

    output += "</div>";
  }

  // Display Animations
  if (animations) {
    output += "<div id='animations'>";

    // Parse CDATA content
    var animationsContent = parseCDATAContent(animations.textContent);

    // Display the extracted HTML content
    output += animationsContent.htmlContent;

    // Continue with the rest of your function for links and YouTube video

    // Display Links (Assuming a similar structure as Portraitography)
    var linksUl = animations.querySelector("ul");
    if (linksUl) {
      output += "<p>Links:</p><ul>";

      var links = linksUl.getElementsByTagName("li");
      for (var i = 0; i < links.length; i++) {
        output += "<li>" + (links[i].innerHTML || "") + "</li>";
      }

      output += "</ul>";
    }

    // You can add more specific content display here if needed

    output += "</div>";
  }

  document.getElementById("main-content").innerHTML = output;
}




// Function to display music composer content
function displayMusicComposer(root) {
  var journey = root.querySelector("journey");
  var sections = root.querySelector("sections");

  var output = "<h2>Music Composer</h2>";

  // Display Music Journey
  output += "<div id='music-journey'>";
  output += journey.innerHTML; // Display the music journey content
  output += "</div>";

  // Display Music Sections
  output += "<div id='music-sections'>";
  output += sections.innerHTML; // Display the music sections content
  output += "</div>";
  document.getElementById("main-content").innerHTML = output;
}




// Function to display software engineering content
function displaySoftwareEngineering(root) {
  var introduction = root.getElementsByTagName("introduction")[0];
  var focus = root.getElementsByTagName("focus")[0];
  var projects = root.getElementsByTagName("projects")[0];
  var gamedev = root.getElementsByTagName("gamedev")[0];
  var links = root.getElementsByTagName("links")[0];

  var output = "<h2>Software Engineering</h2>";

  // Display Introduction
  output += "<div id='introduction'>";
  output += introduction.textContent;
  output += "</div>";

  // Display Focus
  output += "<div id='focus'>";
  output += "<h3>Languages</h3>";
  output += "<ul>";
  var languages = focus.getElementsByTagName("languages")[0].getElementsByTagName("language");
  for (var i = 0; i < languages.length; i++) {
    output += "<li>" + languages[i].textContent + "</li>";
  }
  output += "</ul>";

  output += "<h3>Recent Focus</h3>";
  output += focus.querySelector("recent_focus").textContent;
  output += "</div>";

  // Display Projects
  output += "<div id='projects'>";
  var projectList = projects.getElementsByTagName("project");
  for (var i = 0; i < projectList.length; i++) {
    output += "<div class='project'>";
    output += "<h3>" + projectList[i].getElementsByTagName("name")[0].textContent + "</h3>";
    output += "<p>" + projectList[i].getElementsByTagName("description")[0].textContent + "</p>";
    output += "</div>";
  }
  output += "</div>";

  // Display Game Development
  output += "<div id='gamedev'>";
  output += gamedev.textContent;
  output += "</div>";

  // Display Useful Links
  output += "<div id='useful-links'>";
  output += "<h3>Useful Links</h3>";
  var linkList = links.getElementsByTagName("link");
  output += "<ul>";
  for (var i = 0; i < linkList.length; i++) {
    output += "<li><a href='" + linkList[i].textContent + "' target='_blank'>" + linkList[i].getAttribute("type") + "</a></li>";
  }
  output += "</ul>";
  output += "</div>";

  document.getElementById("main-content").innerHTML = output;
}


// Function to display credentials content
function displayCredentials(root) {
  var output = "<h2>Credentials</h2>";

  function displayEducation() {
    var education = root.querySelector("education");
    if (education) {
      output += "<div id='education'>";
      output += "<h3>Education</h3>";

      var degrees = education.querySelectorAll("degree");
      degrees.forEach((degree) => {
        output += "<div class='degree'>";
        output += `<h4>${degree.querySelector("title").textContent}</h4>`;
        output += `<p>${degree.querySelector("institution").textContent}, ${degree.querySelector("year").textContent}</p>`;
        output += "</div>";
      });

      output += "</div>";
    }
  }

  function displayCertificates() {
    var certificates = root.querySelector("educational_certificates");
    if (certificates) {
      output += "<div id='certificates'>";
      output += "<h3>Educational Certificates</h3>";

      var certificateList = certificates.querySelectorAll("certificate");
      certificateList.forEach((certificate) => {
        output += "<div class='certificate'>";
        output += `<h4>${certificate.querySelector("title").textContent}</h4>`;

        // Display institutions
        var institutions = certificate.querySelectorAll("institution");
        if (institutions.length > 0) {
          output += "<p>Institutions: ";
          institutions.forEach((institution, index) => {
            output += institution.textContent;
            if (index < institutions.length - 1) {
              output += ", ";
            }
          });
          output += "</p>";
        }

        // Display badge
        var badgeScript = certificate.querySelector("badge");
        if (badgeScript) {
          var badgeCDATA = badgeScript.firstChild;
          if (badgeCDATA && badgeCDATA.nodeType === Node.CDATA_SECTION_NODE) {
            output += "<div class='badge'>";
            output += badgeCDATA.nodeValue;
            output += "</div>";
          }
        }

        output += "</div>";
      });

      output += "</div>";
    }
  }

  function displayExperience() {
    var experience = root.querySelector("experience");
    if (experience) {
      output += "<div id='experience'>";
      output += "<h3>Experience</h3>";

      var positions = experience.querySelectorAll("position");
      positions.forEach((position) => {
        output += "<div class='position'>";
        output += `<h4>${position.querySelector("title").textContent}</h4>`;
        output += `<p>${position.querySelector("company").textContent}, ${position.querySelector("years").textContent}</p>`;

        var tasks = position.querySelectorAll("task");
        if (tasks.length > 0) {
          output += "<ul>";
          tasks.forEach((task) => {
            output += `<li>${task.textContent}</li>`;
          });
          output += "</ul>";
        }

        output += "</div>";
      });

      output += "</div>";
    }
  }

  displayEducation();
  displayCertificates();
  displayExperience();

  var mainContent = document.getElementById("main-content");
  if (mainContent) {
    mainContent.innerHTML = output;
  } else {
    console.error("Main content element not found.");
  }
}














// Function to display stores content
function displayStores(root) {
  var stores = root.getElementsByTagName("store");

  var output = "<h2>Stores</h2>";

  // Display Stores
  output += "<div id='stores'>";
  for (var i = 0; i < stores.length; i++) {
    output += "<div class='store'>";
    output += "<h3>" + stores[i].getElementsByTagName("name")[0].textContent + "</h3>";
    output += "<p>" + stores[i].getElementsByTagName("description")[0].textContent + "</p>";
    output += "<a href='" + stores[i].getElementsByTagName("link")[0].textContent + "' target='_blank'>Visit Store</a>";
    output += "</div>";
  }
  output += "</div>";

  document.getElementById("main-content").innerHTML = output;
}

// Extract the category from the URL
var urlParams = new URLSearchParams(window.location.search);
var category = urlParams.get('category'); 

// Call the getData function with the appropriate XML file path based on the category
if (category) {
  getData(category + ".xml");
} else {
  console.error("Category not specified in the URL.");
}
