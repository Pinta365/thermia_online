// ex. scripts/build_npm.ts
import { build, emptyDir } from "https://deno.land/x/dnt/mod.ts";

await emptyDir("./npm");

await build({
    entryPoints: ["./mod.ts"],
    outDir: "./npm",
    //scriptModule: false,
    test: false,
    shims: {
        undici: true,
        crypto: true,
        deno: true,
    },
    package: {
        // package.json properties
        name: "thermia_online",
        version: Deno.args[0],
        description: "Access the Thermia Online API with Deno or Node.js",
        license: "MIT",
        author: "Pinta <https://github.com/Pinta365>",
        repository: {
            type: "git",
            url: "git+https://github.com/Pinta365/thermia_online.git",
        },
        bugs: {
            url: "https://github.com/Pinta365/thermia_online/issues",
        },
    },
});

// post build steps
Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");
