function getHolidays() {
    fetch("http://127.0.0.1:8000/getHolidays")
    .then(response => response.json())
    .then(data => {
        const holidayList = document.createElement("div");
        holidayList.style.padding = "20px";
        holidayList.style.fontFamily = "Arial, sans-serif";

        data.forEach(holiday => {
            const holidayCard = document.createElement("div");
            holidayCard.style.marginBottom = "20px";
            holidayCard.style.padding = "10px";
            holidayCard.style.border = "1px solid #ddd";
            holidayCard.style.borderRadius = "10px";
            holidayCard.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";

            const title = document.createElement("h2");
            title.textContent = holiday.title;
            holidayCard.appendChild(title);

            const details = document.createElement("ul");
            details.style.listStyle = "none";
            details.style.padding = "0";
            details.style.margin = "0";

            const countryItem = document.createElement("li");
            countryItem.textContent = `Šalis: ${holiday.country}`;
            details.appendChild(countryItem);

            const cityItem = document.createElement("li");
            cityItem.textContent = `Miestas: ${holiday.city}`;
            details.appendChild(cityItem);

            const durationItem = document.createElement("li");
            durationItem.textContent = `Trukmė: ${holiday.duration}`;
            details.appendChild(durationItem);

            const seasonItem = document.createElement("li");
            seasonItem.textContent = `Sezonas: ${holiday.season}`;
            details.appendChild(seasonItem);

            const priceItem = document.createElement("li");
            priceItem.textContent = `Kaina: ${holiday.price}`;
            details.appendChild(priceItem);

            const ratingItem = document.createElement("li");
            ratingItem.textContent = `Įvertinimas: ${holiday.averageRating}`;
            details.appendChild(ratingItem);

            const photos = document.createElement("div");
            photos.style.marginTop = "10px";
            holiday.photos.forEach(photoUrl => {
                const img = document.createElement("img");
                img.src = photoUrl;
                img.style.width = "100px";
                img.style.height = "100px";
                img.style.margin = "10px";
                photos.appendChild(img);
            });
            holidayCard.appendChild(photos);

            holidayCard.appendChild(details);

            holidayCard.onclick = function() {
                getHoliday(holiday.id);
            };

            holidayList.appendChild(holidayCard);
        });

        document.body.appendChild(holidayList);
    });
}

function getHoliday(id) {
    fetch(`http://127.0.0.1:8000/getHoliday?id=${id}`)
    .then(response => response.json())
    .then(data => {
        const holidayInfo = document.createElement("div");
        holidayInfo.style.padding = "20px";
        holidayInfo.style.fontFamily = "Arial, sans-serif";

        const title = document.createElement("h1");
        title.textContent = data.title;
        holidayInfo.appendChild(title);

        const details = document.createElement("ul");
        details.style.listStyle = "none";
        details.style.padding = "0";
        details.style.margin = "0";

        const descriptionItem = document.createElement("li");
        descriptionItem.textContent = `Aprašas: ${data.description}`;
        details.appendChild(descriptionItem);

        const countryItem = document.createElement("li");
        countryItem.textContent = `Šalis: ${data.country}`;
        details.appendChild(countryItem);

        const cityItem = document.createElement("li");
        cityItem.textContent = `Miestas: ${data.city}`;
        details.appendChild(cityItem);

        const durationItem = document.createElement("li");
        durationItem.textContent = `Trukmė: ${data.duration}`;
        details.appendChild(durationItem);

        const seasonItem = document.createElement("li");
        seasonItem.textContent = `Sezonas: ${data.season}`;
        details.appendChild(seasonItem);

        const priceItem = document.createElement("li");
        priceItem.textContent = `Kaina: ${data.price}`;
        details.appendChild(priceItem);

        const ratingItem = document.createElement("li");
        ratingItem.textContent = `Įvertinimas: ${data.averageRating}`;
        details.appendChild(ratingItem);

        const photos = document.createElement("div");
        photos.style.marginTop = "10px";
        data.photos.forEach(photoUrl => {
            const img = document.createElement("img");
            img.src = photoUrl;
            img.style.width = "100px";
            img.style.height = "100px";
            img.style.margin = "10px";
            photos.appendChild(img);
        });
        holidayInfo.appendChild(photos);

        holidayInfo.appendChild(details);

        const backButton = document.createElement("button");
        backButton.textContent = "Go Back";
        backButton.onclick = function() {
            document.body.innerHTML = "";
            getHolidays();
        };
        holidayInfo.appendChild(backButton);

        document.body.innerHTML = "";
        document.body.appendChild(holidayInfo);
    });
}

getHolidays();