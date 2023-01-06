import type Transport from "@ledgerhq/hw-transport";
import { cmd } from "./constants";

export async function getAddress(transport: Transport) {
    let buf = Buffer.from([]);
    let res = await transport.send(cmd.cla, cmd.GetAddress, 0x00, 0x00, buf);
    const temp = String.fromCharCode.apply(null, res.subarray(0, res.indexOf(0)));
    return temp.trimEnd().replace(/[^0-9a-z]/gi, '');
}

export async function getOTAKey(transport: Transport) {
    let buf = Buffer.from([]);
    const res = await transport.send(cmd.cla, cmd.GetOTAKey, 0x00, 0x00, buf);
    return res.subarray(0, 32);
}

export async function getViewKey(transport: Transport) {
    let buf = Buffer.from([]);
    const res = await transport.send(cmd.cla, cmd.GetViewKey, 0x00, 0x00, buf);
    return res.subarray(0, 32);
}

export async function getValidatorKey(transport: Transport) {
    let buf = Buffer.from([]);
    const res = await transport.send(cmd.cla, cmd.GetValidatorKey, 0x00, 0x00, buf);
    return res.subarray(0, 32);
}

export async function switchKey(transport: Transport, accountNum: number) {
    let buf = Buffer.alloc(4);
    buf[0] = (accountNum >> 24) & 0xFF;
    buf[1] = (accountNum >> 16) & 0xFF;
    buf[2] = (accountNum >> 8) & 0xFF;
    buf[3] = accountNum & 0xFF;
    const res = await transport.send(cmd.cla, cmd.SwitchKey, 0x00, 0x00, buf);
    return res.subarray(0,100)
}
