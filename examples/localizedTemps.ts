import { Thermia } from "https://deno.land/x/thermia_online/mod.ts";

const installationId = 1540524; //Can be found via getInstallations(), see example.

const thermia = new Thermia(Deno.env.get("USER"), Deno.env.get("PASSWORD"));
//Pass in a locale with the initializer to set up the translation table.
await thermia.initialize("sv-SE");

//Get data for all the registers grouped under the temperature group.
const dataGroups = await thermia.getRegisterGroupData(installationId, "REG_GROUP_TEMPERATURES");
const temps: Record<string, string | number>[] = [];
//Get localized translation table.
const translationTable = await thermia.getTranslationTable();

//Extract temperatures and localize the name then print a neat little table.
for (const dataGroup of dataGroups) {
    const reg = {
        translatedName: translationTable[dataGroup.registerName], //Lookup localized phrase.
        registerValue: dataGroup.registerValue,
        lastValueChange: dataGroup.timeStamp,
    };
    temps.push(reg);
}

console.table(temps);
