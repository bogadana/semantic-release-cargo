import { Context } from "semantic-release";
import { getCargoMetadata } from "./cargo";

export default function (config: PluginConfig, context: Context) {
    verify(config.cargoPublish, config.registryName, context.env)
}

export function verify(publish: boolean | undefined, registryName: string | undefined, env: NodeJS.ProcessEnv) {
    let data = getCargoMetadata()

    if (data.workspace_members.length > 1) {
        throw new Error("workspaces with multiple packages are not supported")
    }

    if (publish) {
        const tokenVar = registryName === undefined ? "CARGO_REGISTRY_TOKEN" : `CARGO_REGISTRIES_${registryName.toUpperCase()}_TOKEN`

        if (env[tokenVar] === undefined) {
            throw new Error(`${tokenVar} is unset`)
        }
    }
}
