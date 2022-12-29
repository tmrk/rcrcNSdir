# rcrcNSdir

A simple JavaScript browser app that scrapes [IFRC's online directory](https://www.ifrc.org/national-societies-directory) of the 193 Red Cross and Red Crescent national societies and outputs the result as JSON.

To enable cross-domain requests the demo server of [CORS Anywhere](https://github.com/Rob--W/cors-anywhere) can be used.

The most recent output can be accessed here: [tmrk.github.io/rcrcNSdir/rcrcNationalSocieties.json](https://tmrk.github.io/rcrcNSdir/rcrcNationalSocieties.json)

## Usage

1. `git clone https://github.com/tmrk/rcrcNSdir.git`

2. Visit [cors-anywhere.herokuapp.com](https://cors-anywhere.herokuapp.com/) to request temporary access to the demo server.

3. Open `scraper.html` in your browser and wait for the 193 (+1) fetches to complete.
