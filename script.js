// Function to get data from XML file
function getData(xmlFile) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var xmlDoc = this.responseXML;
      processData(xmlDoc);
    }
  };
  xhttp.open("GET", xmlFile, true);
  xhttp.send();
}

// Function to process the XML data and call the appropriate display function
function processData(xmlDoc) {
  var root = xmlDoc.documentElement;
  var dataType = root.getAttribute("type");

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


// Function to display author content
function displayAuthor(root) {
  var bookSeries = root.getElementsByTagName("book_series")[0];
  var buyLinks = bookSeries.getElementsByTagName("buy_links")[0];
  var amazonEmbed = bookSeries.getElementsByTagName("amazon_embed")[0];

  var output = "<h2>Book Series: Memorandum in a Cruet</h2>";

  // Display book series information
  output += "<div id='book-series'>";
  output += "<img src='" + bookSeries.getAttribute("img") + "'>";
  output += bookSeries.textContent;
  output += "<div>";

  // Display buy links
  output += "<div id='buy-links'>";
  var links = buyLinks.children;
  for (var i = 0; i < links.length; i++) {
    output += "<a href='" + links[i].textContent + "' target='_blank'>" + links[i].tagName + "</a>";
  }
  output += "</div>";

  // Display Amazon embed
  output += "<div id='amazon-embed'>";
  output += amazonEmbed.innerHTML;
  output += "</div>";

  output += "</div>";
  document.getElementById("main-content").innerHTML = output;
}

// Function to display graphic illustrator content
function displayGraphicIllustrator(root) {
  var portraitography = root.getElementsByTagName("portraitography")[0];
  var fineArts = root.getElementsByTagName("fine_arts")[0];
  var animations = root.getElementsByTagName("animations")[0];

  var output = "<h2>Graphic Illustrator</h2>";

  // Display Portraitography
  output += "<div id='portraitography'>";
  output += portraitography.textContent;
  output += "<div>" + portraitography.getElementsByTagName("iframe")[0].outerHTML + "</div>";
  output += "</div>";

  // Display Fine Arts
  output += "<div id='fine-arts'>";
  output += fineArts.textContent;
  output += "</div>";

  // Display Animations
  output += "<div id='animations'>";
  output += animations.textContent;
  output += "</div>";

  document.getElementById("main-content").innerHTML = output;
}

// Function to display music composer content
function displayMusicComposer(root) {
  var journey = root.getElementsByTagName("journey")[0];
  var sections = root.getElementsByTagName("sections")[0];

  var output = "<h2>Music Composer</h2>";

  // Display Music Journey
  output += "<div id='music-journey'>";
  output += journey.textContent;
  output += "</div>";

  // Display Music Sections
  output += "<div id='music-sections'>";
  output += sections.textContent;
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
  output += "<ul>";
  var recentFocus = focus.getElementsByTagName("recent_focus")[0].getElementsByTagName("technology");
  for (var i = 0; i < recentFocus.length; i++) {
    output += "<li>" + recentFocus[i].textContent + "</li>";
  }
  output += "</ul>";
  output += "</div>";

  // Display Projects
  output += "<div id='projects'>";
  output += "<h3>Projects</h3>";
  var projectList = projects.getElementsByTagName("project");
  for (var i = 0; i < projectList.length; i++) {
    output += "<h4>" + projectList[i].getElementsByTagName("name")[0].textContent + "</h4>";
    output += "<p>" + projectList[i].getElementsByTagName("description")[0].textContent + "</p>";
  }
  output += "</div>";

  // Display Game Development
  output += "<div id='gamedev'>";
  output += "<h3>Game Development</h3>";
  output += "<p>Started in " + gamedev.getElementsByTagName("start_year")[0].textContent + "</p>";
  output += "<p>Tools used: " + gamedev.getElementsByTagName("tools")[0].textContent + "</p>";
  output += "<p>Education: " + gamedev.getElementsByTagName("education")[0].textContent + "</p>";
  output += "<p>Certificate: " + gamedev.getElementsByTagName("certificate")[0].textContent + "</p>";
  output += "<p>Development Focus: " + gamedev.getElementsByTagName("development_focus")[0].textContent + "</p>";
  output += "<h4>Game Links</h4>";
  output += "<ul>";
  var gameLinks = gamedev.getElementsByTagName("game_links")[0].children;
  for (var i = 0; i < gameLinks.length; i++) {
    output += "<li>" + gameLinks[i].tagName + ": <a href='" + gameLinks[i].textContent + "' target='_blank'>" + gameLinks[i].textContent + "</a></li>";
  }
  output += "</ul>";
  output += "</div>";

  // Display Useful Links
  output += "<div id='useful-links'>";
  output += "<h3>Useful Links</h3>";
  var usefulLinks = links.children;
  for (var i = 0; i < usefulLinks.length; i++) {
    output += "<a href='" + usefulLinks[i].textContent + "' target='_blank'>" + usefulLinks[i].tagName + "</a>";
  }
  output += "</div>";

  document.getElementById("main-content").innerHTML = output;
}

// Function to display stores content
function displayStores(root) {
  var stores = root.getElementsByTagName("store");

  var output = "<h2>Stores</h2>";

  output += "<div id='stores-list'>";
  for (var i = 0; i < stores.length; i++) {
    output += "<div class='store-item'>";
    output += "<h3>" + stores[i].getElementsByTagName("name")[0].textContent + "</h3>";
    output += "<p>" + stores[i].getElementsByTagName("description")[0].textContent + "</p>";
    output += "<a href='" + stores[i].getElementsByTagName("link")[0].textContent + "' target='_blank'>" + stores[i].getElementsByTagName("link")[0].tagName + "</a>";
    output += "</div>";
  }
  output += "</div>";

  document.getElementById("main-content").innerHTML = output;
}

// Function to display credentials content
function displayCredentials(root) {
  var education = root.getElementsByTagName("education")[0];
  var certificates = root.getElementsByTagName("certificates")[0];
  var skills = root.getElementsByTagName("skills")[0];

  var output = "<h2>Credentials</h2>";

  // Display Education
  output += "<div id='education'>";
  output += "<h3>Education</h3>";
  output += "<p>" + education.getElementsByTagName("degree")[0].textContent + " in " + education.getElementsByTagName("major")[0].textContent + "</p>";
  output += "<p>" + education.getElementsByTagName("university")[0].textContent + ", " + education.getElementsByTagName("graduation_year")[0].textContent + "</p>";
  output += "</div>";

  // Display Certificates
  output += "<div id='certificates'>";
  output += "<h3>Certificates</h3>";
  var certificateList = certificates.getElementsByTagName("certificate");
  for (var i = 0; i < certificateList.length; i++) {
    output += "<h4>" + certificateList[i].getElementsByTagName("name")[0].textContent + "</h4>";
    output += "<p>" + certificateList[i].getElementsByTagName("organization")[0].textContent + ", " + certificateList[i].getElementsByTagName("completion_year")[0].textContent + "</p>";
  }
  output += "</div>";

  // Display Skills
  output += "<div id='skills'>";
  output += "<h3>Skills</h3>";
  var skillsList = skills.children;
  for (var i = 0; i < skillsList.length; i++) {
    output += "<p>" + skillsList[i].tagName + ": " + skillsList[i].textContent + "</p>";
  }
  output += "</div>";

  document.getElementById("main-content").innerHTML = output;
}
