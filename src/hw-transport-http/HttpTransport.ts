import Transport from "@ledgerhq/hw-transport";
import { TransportError } from "@ledgerhq/errors";
// import axios from "axios";
// import adapter from "@vespaiach/axios-fetch-adapter";
import { log } from "@ledgerhq/logs";
/**
 * HTTP transport implementation
 */

export default class HttpTransport extends Transport {
  static isSupported = (): Promise<boolean> =>
    Promise.resolve(typeof fetch === "function");
  // this transport is not discoverable
  static list = (): any => Promise.resolve([]);
  static listen = (_observer: any) => ({
    unsubscribe: () => {},
  });
  static check = async (url: string, timeout = 5000) => {
    const response = await fetch(
      url
    );

    if (response.status !== 200) {
      throw new TransportError(
        "failed to access HttpTransport(" +
          url +
          "): status " +
          response.status,
        "HttpTransportNotAccessible"
      );
    }
  };

  static async open(url: string, timeout?: number): Promise<Transport> {
    await HttpTransport.check(url, timeout);
    return new HttpTransport(url);
  }

  url: string;

  constructor(url: string) {
    super();
    this.url = url;
  }

  override async exchange(apdu: Buffer): Promise<Buffer> {
    const apduHex = apdu.toString("hex");
    log("apdu", "=> " + apduHex);
    const response = await fetch(this.url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        apduHex,
      })
    });

    if (response.status !== 200) {
      throw new TransportError(
        "failed to communicate to server. code=" + response.status,
        "HttpTransportStatus" + response.status
      );
    }

    const body: any = await response.json();
    if (body.error) throw body.error;
    const result = Buffer.from(body.data, "hex");
    return result;
  }

  setScrambleKey() {}

  close(): Promise<void> {
    return Promise.resolve();
  }
}
