import { readFileSync, writeFileSync } from "fs";
import { Context } from "semantic-release";
import { getCargoMetadata } from "./cargo";

export default function (config: PluginConfig, context: Context) {
    const data = getCargoMetadata()

    for (const cargoPackage of data.packages) {
        replaceVersion(cargoPackage.manifest_path, cargoPackage.version, context.nextRelease?.version!!)
    }
}

export function replaceVersion(manifestPath: string, oldVersion: string, newVersion: string) {
    const re = new RegExp(`(version\\s*=\\s*")(${oldVersion})(".*)`)
    const manifest = readFileSync(manifestPath, { encoding: 'utf8' })

    writeFileSync(manifestPath, manifest.replace(re, `$1${newVersion}$3`))
}