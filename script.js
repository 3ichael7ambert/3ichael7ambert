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
  var bookSeries = root.querySelector("book_series");
  var buyLinks = bookSeries.querySelector("buy_links");
  var amazonEmbed = bookSeries.querySelector("amazon_embed");

  var output = "<h2>Book Series: Memorandum in a Cruet</h2>";

  // Display book series information
  output += "<div id='book-series'>";
  output += "<img src='" + bookSeries.querySelector("img").getAttribute("src") + "'>";
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
  output += portraitography.getElementsByTagName("p")[0].textContent; // Display the introduction
  output += "<div>" + portraitography.querySelector("iframe").outerHTML + "</div>"; // Display the YouTube video
  output += "<p>Links:</p>";
  output += "<ul>";
  var portraitLinks = portraitography.querySelectorAll("ul li");
  portraitLinks.forEach(function (link) {
    output += "<li>" + link.innerHTML + "</li>";
  });
  output += "</ul>";
  output += "</div>";

  // Display Fine Arts
  output += "<div id='fine-arts'>";
  output += fineArts.getElementsByTagName("p")[0].textContent; // Display the introduction
  output += "<p>Links:</p>";
  output += "<ul>";
  var fineArtsLinks = fineArts.querySelectorAll("ul li");
  fineArtsLinks.forEach(function (link) {
    output += "<li>" + link.innerHTML + "</li>";
  });
  output += "</ul>";
  output += "</div>";

  // Display Animations
  output += "<div id='animations'>";
  output += animations.getElementsByTagName("p")[0].textContent; // Display the introduction
  output += "<p>Links:</p>";
  output += "<ul>";
  var animationLinks = animations.querySelectorAll("ul li");
  animationLinks.forEach(function (link) {
    output += "<li>" + link.innerHTML + "</li>";
  });
  output += "</ul>";
  output += "<p>Embedded YouTube Video:</p>";
  output += animations.querySelector("iframe").outerHTML; // Display the YouTube video
  output += "</div>";

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
  var education = root.getElementsByTagName("education")[0];
  var experience = root.getElementsByTagName("experience")[0];

  var output = "<h2>Credentials</h2>";

  // Display Education
  output += "<div id='education'>";
  output += "<h3>Education</h3>";
  var degrees = education.getElementsByTagName("degree");
  for (var i = 0; i < degrees.length; i++) {
    output += "<div class='degree'>";
    output += "<h4>" + degrees[i].getElementsByTagName("title")[0].textContent + "</h4>";
    output += "<p>" + degrees[i].getElementsByTagName("institution")[0].textContent + ", " + degrees[i].getElementsByTagName("year")[0].textContent + "</p>";
    output += "</div>";
  }
  output += "</div>";

  // Display Experience
  output += "<div id='experience'>";
  output += "<h3>Experience</h3>";
  var positions = experience.getElementsByTagName("position");
  for (var i = 0; i < positions.length; i++) {
    output += "<div class='position'>";
    output += "<h4>" + positions[i].getElementsByTagName("title")[0].textContent + "</h4>";
    output += "<p>" + positions[i].getElementsByTagName("company")[0].textContent + ", " + positions[i].getElementsByTagName("years")[0].textContent + "</p>";
    output += "<ul>";
    var tasks = positions[i].getElementsByTagName("task");
    for (var j = 0; j < tasks.length; j++) {
      output += "<li>" + tasks[j].textContent + "</li>";
    }
    output += "</ul>";
    output += "</div>";
  }
  output += "</div>";

  document.getElementById("main-content").innerHTML = output;
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
