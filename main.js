"use strict";

const url = "https://www.ifrc.org/national-societies-directory/";

const corsProxy = "https://cors-anywhere.herokuapp.com/";
const urlObject = new URL(url);
const parser = new DOMParser();

const countries = [];

fetch(corsProxy + url)
  .then(response => response.text())
  .then(html => {

    // Parse the request response as DOM
    const page = parser.parseFromString(html, "text/html");

    // Get the data from the correct head script tag and parse it
    const scriptTags = page.head.querySelectorAll("script");
    let dataset;
    for (let i = 0; i < scriptTags.length; i++) {
      if (scriptTags[i].dataset.drupalSelector) {
        dataset = JSON.parse(scriptTags[i].textContent);
      }
    }
    console.log(dataset);

    // Loop through the geodata and push only the relevant information to the countries array
    const countriesGeoData = dataset.geodata.geoData.features;
    for (let i = 0; i < countriesGeoData.length; i++) {
      const countryData = countriesGeoData[i].properties;
      const country = {
        countryName: countryData.countryName,
        nationalSocietyName: countryData.name,
        nid: countryData.nid,
        regionTid: countryData.regionTid,
        iso2: countryData.iso2,
        url: urlObject.origin + countryData.url
      }
      countries.push(country);
    }
    let scrapeCompleted = 0;
    document.querySelector("progress").setAttribute("max", countries.length);

    const displayData = () => {
      const sortedCountries = countries.sort(function(a, b) {
        const keyA = new Date(a.countryName);
        const keyB = new Date(b.countryName);
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
      });
      const json = {
        lastUpdated: new Date().getTime(),
        nationalSocieties: sortedCountries
      }
      document.querySelector("textarea").value = JSON.stringify(json, null, 2);
      console.log(json);
    }

    // Using the URL from the dataset, fetch the individual pages and scrape the data from the DOM
    for (let i = 0; i < countries.length; i++) {
      fetch(corsProxy + countries[i].url)
        .then(response => response.text())
        .then(html => {
          const countryPage = parser.parseFromString(html, "text/html");
          
          const address = countryPage.querySelector(".ns-detail.address");
          const phone = countryPage.querySelector(".ns-detail.phone");
          const email = countryPage.querySelector(".ns-detail.e-mail"); // this in encrypted
          const website = countryPage.querySelector(".ns-detail.website > a");
          const twitter = countryPage.querySelector(".ns-detail.twitter > a");
          const facebook = countryPage.querySelector(".ns-detail.facebook > a");
          const logoUrl = countryPage.querySelector(".ns-logo > img");

          if (address) countries[i].address = address.innerText.trim();
          if (phone) countries[i].phone = phone.innerText.trim();
          if (website) countries[i].website = website.href.trim();
          if (twitter) countries[i].twitter = twitter.href.trim().split("?")[0];
          if (facebook) countries[i].facebook = facebook.href.trim().split("?")[0];
          if (logoUrl) countries[i].logoUrl = urlObject.origin + logoUrl.getAttribute("src").trim();

          scrapeCompleted++;
          console.log(scrapeCompleted + "/" + countries.length + " - " + countries[i].nationalSocietyName + " completed.");
          document.querySelector("progress").setAttribute("value", scrapeCompleted);
          if (scrapeCompleted == countries.length) displayData();
        })
    }

  });
