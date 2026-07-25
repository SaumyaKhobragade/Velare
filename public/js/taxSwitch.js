const taxSwitch = document.getElementById("switchCheckDefault");

if (taxSwitch) {
    taxSwitch.addEventListener("change", function () {
        const listingCards = document.getElementsByClassName("listing-card");
        const gstRate = 1.18;

        for (let card of listingCards) {
            const priceValue = card.querySelector(".price-value");

            if (!priceValue) {
                continue;
            }

            const basePrice = Number(card.dataset.basePrice);

            if (taxSwitch.checked) {
                const totalPrice = Math.round(basePrice * gstRate);
                priceValue.innerHTML = `&#8377;${totalPrice.toLocaleString("en-IN")}` +  "/ night incl. GST";
            } else {
                priceValue.innerHTML = `&#8377;${basePrice.toLocaleString("en-IN")}` + "/ night";
            }
        }
    });
}
