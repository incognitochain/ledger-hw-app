export * from "./getAccount";
export * from "./getVersion";
export * from "./calculator";
export * from "./decrypt";
export * from "./trustDevice";

import TransportHttp from "./hw-transport-http/withStaticURLs";
export {
    TransportHttp,
}