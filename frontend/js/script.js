async function fetchVehicles() {
    const response = await fetch("http://localhost:8000/vehicles/actives/true")
    const data = await response.json()
    console.log(data)

    for (let vehicle of data.message) {
        document.querySelector("#vehicle-list").innerHTML += `<li>${vehicle.model} | ${vehicle.kind} | ${vehicle.date} | ${vehicle.plate}</li>`
}
}

fetchVehicles()



