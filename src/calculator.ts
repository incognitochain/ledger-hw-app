import type Transport from "@ledgerhq/hw-transport";
import { cmd } from "./constants";

const arrayConcat = (arrays) => {
    const flatNumberArray = arrays.reduce((acc: any[], curr: any) => {
        acc.push(...curr);
        return acc;
    }, []);

    return new Uint8Array(flatNumberArray);
};

export async function genAlpha(transport: Transport, alphaLen: number, isToken: boolean) {
    let buf = Buffer.from([]);
    let p2 = 0;
    if (isToken == true) {
        p2 = 1;
    }
    return transport.send(cmd.cla, cmd.GenAlpha, alphaLen, p2, buf);
}

export async function setAlpha(transport: Transport, index: number, data: string) {
    const buf = Buffer.from(data, "base64")
    return await transport.send(cmd.cla, cmd.SetAlpha, index, 0x00, buf)
}

export async function getAlpha(transport: Transport, alphaLen: number, isToken: boolean) {
    const buf = Buffer.from([])
    let p2 = isToken ? 1 : 0;
    for (let i = 0; i < alphaLen; i++) {
        const res = await transport.send(cmd.cla, cmd.GetAlpha, i, p2, buf)
        console.log(res)
    }
}

export async function calculateKeyImage(transport: Transport, encryptKmB64: string, coinPubKeyB64: string) {
    const coinPubKey = Buffer.from(coinPubKeyB64, "base64")
    const coinEncryptKm = Buffer.from(encryptKmB64, "base64")
    if (coinPubKey.length != 32) throw 'invalid coinPubKey';
    if (coinEncryptKm.length != 32) throw 'invalid coinEncryptKm';
    let buffer = Buffer.alloc(64);
    
    coinEncryptKm.copy(buffer, 0);
    coinPubKey.copy(buffer, 32);
    const res = await transport.send(cmd.cla, cmd.KeyImage, 0x00, 0x00, buffer);
    return res.subarray(0, 32);
}


async function _calculateFirstC(transport: Transport, params: string[]) {
    const pedComG = Buffer.from(params[params.length - 1], "base64")
    try {
        let result = [];
        for (let i = 0; i < params.length - 1; i++) {
            const h = Buffer.from(params[i], "base64")
            const msg = await transport.send(cmd.cla, cmd.CalculateC, 0x00, i, h)
            result.push(msg.subarray(0, 64));
        }
        const msg = await transport.send(cmd.cla, cmd.CalculateC, 0x01, params.length - 1, pedComG)
        result.push(msg.subarray(0, 32));
        return arrayConcat(result);
    }
    catch (err) {
        console.error(err)
    }
}

async function _calculateFirstC_CA(transport: Transport, params: string[]) {
    const pedComG = Buffer.from(params[params.length - 1], "base64")
    try {
        let result = [];
        for (let i = 0; i < params.length - 2; i++) {
            const h = Buffer.from(params[i], "base64")
            const msg = await transport.send(cmd.cla, cmd.CalculateCCA, 0x00, i, h)
            result.push(msg.subarray(0, 64));
        }
        let msg = await transport.send(cmd.cla, cmd.CalculateCCA, 0x01, params.length - 2, pedComG)
        result.push(msg.subarray(0, 32));

        msg = await transport.send(cmd.cla, cmd.CalculateCCA, 0x01, params.length - 1, pedComG)
        result.push(msg.subarray(0, 32));
        return arrayConcat(result);
    }
    catch (err) {
        console.error(err)
    }
}

export const calculateFirstC = async (transport: Transport, params: string[], isToken: boolean) => 
    isToken ? _calculateFirstC_CA(transport, params) : _calculateFirstC(transport, params);

export async function calculateR(transport: Transport, coinLen: number, cPi: string, isToken: boolean) {
    const buf = Buffer.from(cPi, "base64")
    try {
        let result = [];
        let p1 = isToken ? 1 : 0;
        for (let i = 0; i < coinLen; i++) {
            const msg = await transport.send(cmd.cla, cmd.CalculateR, p1, i, buf)
            result.push(msg.subarray(0, 32));
        }
        return result;
    }
    catch (err) {
        console.error(err)
    }
}

export async function calculateCoinPrivKey(transport: Transport, coinsH: string[], inputLen: number) {
    for (let i = 0; i < inputLen; i++) {
        let buf = Buffer.from(coinsH[i], "base64")
        await transport.send(cmd.cla, cmd.GenCoinPrivateKey, 0x00, i, buf)
    }
    for (let i = inputLen; i < coinsH.length; i++) {
        {
            let buf = Buffer.from(coinsH[i], "base64")
            await transport.send(cmd.cla, cmd.GenCoinPrivateKey, 0x01, i, buf)
        }
    }
}

export async function signSchnorr(transport: Transport, pedRand: string, pedPriv: string, randomness: string, message: string) {
    let pRand;
    const pPriv = Buffer.from(pedPriv, "base64")
    const rand = Buffer.from(randomness, "base64")
    const msg = Buffer.from(message, "base64")
    if (pedRand.length == 0) {
        pRand = Buffer.alloc(32);
        pRand = Buffer.from([])
    } else {
        pRand = Buffer.from(pedRand, "base64")
    }
    let buf = Buffer.alloc(pRand.length + pPriv.length + rand.length + msg.length)
    pRand.copy(buf, 0, pRand.length)
    pPriv.copy(buf, pRand.length, pPriv.length)
    rand.copy(buf, pRand.length + pPriv.length, rand.length)
    msg.copy(buf, pRand.length + pPriv.length + rand.length, msg.length)

    try {
        return await transport.send(cmd.cla, cmd.SignSchnorr, 0x00, 0x00, buf)
    }
    catch (err) {
        console.error(err)
    }
}