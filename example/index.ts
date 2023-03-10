import type Transport from "@ledgerhq/hw-transport";
import TransportWebHID from "@ledgerhq/hw-transport-webhid";
import TransportNodeHid from "@ledgerhq/hw-transport-node-hid";
import TransportHttp from "@ledgerhq/hw-transport-http";
import {
    getAddress,
    getOTAKey,
    getVersion,
    getViewKey,
    genAlpha,
    calculateR,
    calculateFirstC,
    calculateCoinPrivKey,
    trustDevice, setAlpha, calculateKeyImage, getAlpha, switchKey
} from "../src";

async function main() {
    const tra: Transport = await TransportHttp(['http://127.0.0.1:9998']).create();
    // const tra: Transport = await TransportWebHID.create();
    // const tra: Transport = await TransportNodeHid.create();

    const res0 = await getAddress(tra)
    console.log(res0)

    const res1 = await switchKey(tra, 4)
    console.log(res1)

    const res2 = await getAddress(tra)
    console.log(res2)
    // const res0 = await trustDevice(tra)
    // console.log(res0)
    //
    // const res1 = await getOTAKey(tra);
    // console.log(res1)
    // console.log("Gen alpha for token")
    // await genAlpha(tra, 2, false)
    // console.log("Get alpha PRV")
    // await getAlpha(tra, 2, false)
    // console.log("Get alpha TOKEN")
    // await getAlpha(tra, 2, true)

    // await setAlpha(tra, 0,  "Mon/F3DfUbZJ1JwjlqeR+GESKMwaXJ45hor8mgC4mgw=");
    // await setAlpha(tra, 0,  "DTWJfPCe9qEwROABP5MyFK41cDeVKhs9feJqVJHIJgg=");
    //
    // console.log("Get Alpha")
    // await getAlpha(tra, 2)
    //
    // console.log("Calculate First C");
    // const res2 = await calculateFirstC(tra,["YwGniRo4EtHA+v9yVLezMDODhhrJh+k9DBAzFPD8aTY=", "dGbumgh0umyq1F4ZBwSdzz8FT+WNju8hCcOTRcQZM1o="]);
    // console.log(res2);
    //
    // console.log("Calculate key image");
    // const res3 = await calculateKeyImage(tra, "YwGniRo4EtHA+v9yVLezMDODhhrJh+k9DBAzFPD8aTY=", "YwGniRo4EtHA+v9yVLezMDODhhrJh+k9DBAzFPD8aTY=");
    // console.log(res3);
    //
    // console.log("Calculate coin private key");
    // const res4 = await calculateCoinPrivKey(tra, ["YwGniRo4EtHA+v9yVLezMDODhhrJh+k9DBAzFPD8aTY=", "YwGniRo4EtHA+v9yVLezMDODhhrJh+k9DBAzFPD8aTY="]);
    // console.log(res4);

}
main()