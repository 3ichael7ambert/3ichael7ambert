const worldTimeApiKey = "YOUR_WORLDTIME_API_KEY";
const city = "New York";

// Function to fetch date for a city using WorldTimeAPI
function fetchDate(city) {
  return fetch(`http://worldtimeapi.org/api/timezone/${city}`)
    .then((response) => response.json())
    .then((data) => {
      return data.datetime.slice(0, 10); // Extract date (YYYY-MM-DD)
    })
    .catch((error) => {
      console.error("Error fetching date data:", error);
    });
}

// Main function to fetch date for the specified city
async function getDateForCity(city) {
  try {
    const date = await fetchDate(city);
    if (date) {
      document.getElementById(
        "date-info"
      ).innerText = `Current date in ${city}: ${date}`;
    } else {
      console.log("Unable to fetch date data.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

// Call the main function when the page loads
getDateForCity(city);
