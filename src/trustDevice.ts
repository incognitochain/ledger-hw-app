import type Transport from "@ledgerhq/hw-transport";
import { cmd } from "./constants";

export  async  function trustDevice(transport: Transport) {
    let buf = Buffer.from([]);
    return transport.send(cmd.cla, cmd.TrustHost, 0x00, 0x00, buf);
}


export async function confirmTx(transport: Transport, amount: number, decimal: number, address: string) {
    let bufAmount = Buffer.alloc(8);
    bufAmount[0] = (amount >> 56) & 0xFF;
    bufAmount[1] = (amount >> 48) & 0xFF;
    bufAmount[2] = (amount >> 40) & 0xFF;
    bufAmount[3] = (amount >> 32) & 0xFF;
    bufAmount[4] = (amount >> 24) & 0xFF;
    bufAmount[5] = (amount >> 16) & 0xFF;
    bufAmount[6] = (amount >> 8) & 0xFF;
    bufAmount[7] = amount & 0xFF;

    let bufAddress = Buffer.from(address, "hex")
    let arr = [bufAmount, bufAddress]
    let buf = Buffer.concat(arr)
    return transport.send(cmd.cla, cmd.ConfirmTx, 0x00, decimal, buf)
}