# Postmortem Report - Order Dashboard Challenge

Nummering = volgorde waarin de bugs zichtbaar werden.

## Bug 1: CORS Policy & Auth Header (eerst zichtbaar)

- **Toegewezen aan:** Frontend & Backend (samen)
- **Symptoom:** Wat ging er mis bij aanmelden en daarna bij het laden van bestellingen?
- **Root Cause:** Waar zat de mismatch tussen frontend en backend?
- **Gebruikte Tooling:** (VS Code; Chrome Network / Console / Application; Swagger)
- **Oplossing:** Hoe hebben jullie dit samen opgelost?

Het probleem was dat er eerst een CORS error was bij het inloggen waardoor de user er niet inkwam en dat de orders niet ge authenticate waren, omdat deze nooit mee werd gegeven.
De mismatch was dat in de frontend de authorization verwacht werd, maar deze niet mee werd gegeven vanuit de backend.

Backend/Program.cs -> daar hebben we "line 15" de origins aangepast naar de local url (5173). Uiteindelijk zou je deze lijn compleet eruit halen als het geen local host meer is. 
Router/Index.ts -> daar hebben we "line 25" die de authentication verwijderde uitgecomment. 
Backend/Program.cs -> daar hebben we bij "line 16" de authorization toegevoegd aan de headers, zodat dit toegestaan is bij een api call.


## Bug 2: State Mutation & Reactivity Broken

- **Toegewezen aan:** Frontend
- **Symptoom:** Wat merkte de gebruiker in de UI?
- **Root Cause:** Waarom ging het mis in de Vue/Pinia code?
- **Gebruikte Tooling:** (Vue.js DevTools in Chrome, VS Code + Volar, breakpoints)
- **Oplossing:** Hoe is het hersteld?

Het probleem is dat er geen bestellingen worden laten zien, dat komt omdat er in "line 17" een value wordt toegedragen aan de data, maar omdat het een ref() argument is moet hieraan de value toegewezen worden. 

## Bug 3: Async/Await & Enum Deserialization

- **Toegewezen aan:** Backend
- **Symptoom:** Wat voor HTTP/API-foutmeldingen of JSON zag je (Swagger / Network)?
- **Root Cause:** Waar in de .NET controller/service zat de fout?
- **Gebruikte Tooling:** (VS Code + C# Dev Kit, breakpoints, Swagger)
- **Oplossing:** Hoe is de C# code aangepast?

We ontdekten dat de bestellingen niet getoond werden, doordat er iets misging met de filtersysteem in Components/OrderList.vue. In OrderStatus.cs is er in "line 4" [JsonConverter(typeof(JsonStringEnumConverter))] toegevoegd omdat de status van de backend werd in de frontend als een enumerator value gegeven in plaats van een string waardoor er een error kwam. Dit is gevonden door de order.status te loggen en daaruit bleek dat dit een getal was.
