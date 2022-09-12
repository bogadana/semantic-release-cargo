import { Context } from "semantic-release";
import { cargoPublish } from "./cargo";

export default function (config: PluginConfig, context: Context) {
    cargoPublish(config.registryName)
}