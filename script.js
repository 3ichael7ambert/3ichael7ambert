function getData(file) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        displayData(this.responseXML);
      }
    };
    xhttp.open("GET", file, true);
    xhttp.send();
  }
  
  function displayData(xml) {
    var items = xml.getElementsByTagName("item");
    var output = "<ul>";
    for (var i = 0; i < items.length; i++) {
      var title = items[i].getElementsByTagName("title")[0].childNodes[0].nodeValue;
      var description = items[i].getElementsByTagName("description")[0].childNodes[0].nodeValue;
      output += "<li><strong>" + title + "</strong>: " + description + "</li>";
    }
    output += "</ul>";
    document.getElementById("main-content").innerHTML = output;
  }