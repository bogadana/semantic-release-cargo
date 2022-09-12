import test from 'ava';
import { randomUUID } from 'crypto';
import { copyFileSync, readFileSync, unlinkSync } from 'fs';
import { cargoPublish, getCargoMetadata } from '../cargo';
import { replaceVersion } from '../prepare';
import { verify } from '../verifyConditions';

process.chdir("test/single-project")

test('cargo metadata is correct', t => {
    const data = getCargoMetadata()

    t.is(data.workspace_members.length, 1)
    t.is(data.packages[0].version, "0.1.0")
});

test('verify is successful', t => {
    t.notThrows(() => verify(false, undefined, process.env)) 
});

test('verify is successful when publishing', t => {
    t.notThrows(() => verify(true, undefined, { "CARGO_REGISTRY_TOKEN": "test" })) 
});

test('verify fails when publishing without token set', t => {
    const error = t.throws(() => verify(true, undefined, { "CARGO_REGISTRY_TOKEN": undefined })) 

    t.is(error?.message, "CARGO_REGISTRY_TOKEN is unset")
});

test('verify fails when publishing without token set with custom registry', t => {
    const error = t.throws(() => verify(true, "test", { "CARGO_REGISTRIES_TEST_TOKEN": undefined })) 

    t.is(error?.message, "CARGO_REGISTRIES_TEST_TOKEN is unset")
});

test('replaceVersion changes version correctly', t => {
    const testFileName = randomUUID() + ".test"
    copyFileSync("Cargo.toml", testFileName)

    replaceVersion(testFileName, "0.1.0", "1.33.7")

    t.deepEqual(readFileSync(testFileName), readFileSync("Cargo.toml.expected"))

    unlinkSync(testFileName)
});

test('cargo publish runs', t => {
    t.notThrows(() => cargoPublish(undefined, true)) 
});

test('cargo publish runs with custom registry', t => {
    t.notThrows(() => cargoPublish("crates-io", true)) 
});

