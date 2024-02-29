import * as Crypto from "expo-crypto";

export default function createUUID() {
  return Crypto.randomUUID();
}
