import { Thermia } from 'https://deno.land/x/thermia_online/mod.ts';

const thermia = new Thermia(Deno.env.get('USER'), Deno.env.get('PASSWORD'));
await thermia.initialize();

//Get basic information about your installed heatpumps.
const installations = await thermia.getInstallations();

console.log(installations);
