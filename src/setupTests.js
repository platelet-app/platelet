import "@testing-library/jest-dom/extend-expect";
import { Crypto } from "@peculiar/webcrypto";

global.crypto = new Crypto();
