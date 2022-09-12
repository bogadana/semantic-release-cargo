import test from 'ava';
import { getCargoMetadata } from '../cargo';
import { verify } from '../verifyConditions';

process.chdir("test/multi-project")

test('cargo metadata is correct', t => {
    const data = getCargoMetadata()

    t.is(data.workspace_members.length, 2)
    t.is(data.packages[0].version, "0.1.0")
    t.is(data.packages[1].version, "0.2.0")
})

test('verify fails', t => {
    const error = t.throws(() => verify(false, undefined, process.env))

    t.is(error?.message, "workspaces with multiple packages are not supported")
});
