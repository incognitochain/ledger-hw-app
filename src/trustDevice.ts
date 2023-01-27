import type Transport from "@ledgerhq/hw-transport";
import { cmd } from "./constants";
const bn = require("bn.js");

export  async  function trustDevice(transport: Transport) {
    let buf = Buffer.from([]);
    return transport.send(cmd.cla, cmd.TrustHost, 0x00, 0x00, buf);
}


export async function confirmTx(transport: Transport, amount: string, decimal: number, address: string) {
    const bnAmt = new bn(amount);
    const onesbyte = new bn(0xFF);
    let bufAmount = Buffer.alloc(8);
    bufAmount[0] = bnAmt.shrn(56).and(onesbyte);
    bufAmount[1] = bnAmt.shrn(48).and(onesbyte);
    bufAmount[2] = bnAmt.shrn(40).and(onesbyte);
    bufAmount[3] = bnAmt.shrn(32).and(onesbyte);
    bufAmount[4] = bnAmt.shrn(24).and(onesbyte);
    bufAmount[5] = bnAmt.shrn(16).and(onesbyte);
    bufAmount[6] = bnAmt.shrn(8).and(onesbyte);
    bufAmount[7] = bnAmt.and(onesbyte);

    let bufAddress = Buffer.from(address, "base64");
    let arr = [bufAmount, bufAddress];
    let buf = Buffer.concat(arr);
    return transport.send(cmd.cla, cmd.ConfirmTx, 0x00, decimal, buf);
}