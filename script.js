document
  .getElementById("apiForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const apiUrl = document.getElementById("apiUrl").value.trim(); // Mengambil nilai dari input URL
    const userId = document.getElementById("userId").value; // Ambil User ID jika ada
    const apiTableContainer = document.getElementById("apiTableContainer");

    if (!apiUrl) {
      apiTableContainer.innerHTML = "<p>Please enter a valid API URL</p>";
      return;
    }

    apiTableContainer.innerHTML = "Fetching data..."; // Tampilkan pesan fetching

    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error("Error fetching data: " + response.statusText);
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        apiTableContainer.innerHTML = generateTable(data);
      } else {
        apiTableContainer.innerHTML = generateTable([data]); // Untuk objek tunggal, jadikan sebagai array
      }
    } catch (error) {
      apiTableContainer.textContent = `Error: ${error.message}`;
    }
  });

// Function untuk menangani objek bersarang seperti 'address' dan 'company'
function generateTable(data) {
  let table = '<table class="table table-bordered">';
  table += "<thead><tr>";

  // Generate table headers dynamically based on the keys
  Object.keys(data[0]).forEach((key) => {
    table += `<th>${key}</th>`;
  });

  table += "</tr></thead>";
  table += "<tbody>";

  // Generate table rows
  data.forEach((item) => {
    table += "<tr>";
    Object.keys(item).forEach((key) => {
      if (typeof item[key] === "object" && item[key] !== null) {
        // Handle nested object for address and company
        if (key === "address") {
          table += `<td>
            ${item[key].street}, ${item[key].suite}, ${item[key].city}, ${item[key].zipcode}
            <br/>
            Geo: (${item[key].geo.lat}, ${item[key].geo.lng})
          </td>`;
        } else if (key === "company") {
          table += `<td>
            ${item[key].name} <br/>
            CatchPhrase: ${item[key].catchPhrase} <br/>
            BS: ${item[key].bs}
          </td>`;
        } else {
          table += "<td>Object</td>";
        }
      } else {
        table += `<td>${item[key]}</td>`;
      }
    });
    table += "</tr>";
  });

  table += "</tbody></table>";
  return table;
}
