import { Thermia } from "https://deno.land/x/thermia_online/mod.ts";

const installationId = 1540524; //Can be found via getInstallations(), see example.

const thermia = new Thermia(Deno.env.get("USER"), Deno.env.get("PASSWORD"));
await thermia.initialize();

const periodStart = new Date("2023-01-25").toJSON();
const periodEnd = new Date("2023-01-26").toJSON();

//Get the all the available registers found in the history api.
const dataGroups = await thermia.getDataHistoryAvailableRegisters(installationId, periodStart, periodEnd);

//...
//Do something with the 'dataGroups'.... Im going to find the outdoor temperature and thats registerId 2000 in my case.
//...

// Get history for outdoor temperature between the 2023-01-25-2023-01-26 per hour and print the data.

const history = await thermia.getDataHistoryForRegister(
    installationId,
    2000,
    "hour",
    periodStart,
    periodEnd,
);
