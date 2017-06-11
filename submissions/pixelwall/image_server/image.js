const Jimp = require("jimp");
const Web3 = require("web3");
const web3 = new Web3(
  new Web3.providers.HttpProvider(process.env.PROVIDER_URL)
);
const BigNumber = require("bignumber.js");

const pixelSize = process.env.PIXEL_SIZE || 4;

const colorHash = {
  0: [0, 0, 0],
  1: [255, 255, 255],
  2: [255, 0, 0],
  3: [0, 255, 0],
  4: [0, 0, 255],
  5: [255, 255, 0],
  6: [0, 255, 255],
  7: [255, 0, 255],
  8: [192, 192, 192],
  9: [128, 128, 128],
  10: [128, 0, 0],
  11: [128, 128, 0],
  12: [0, 128, 0],
  13: [128, 0, 128],
  14: [0, 128, 128],
  15: [0, 0, 128]
};

const contract_address = process.env.CONTRACT_ADDRESS;
web3.eth.defaultAccount = "0x0aecc92c290d3a5a9e157192a37e501ae2ea72e7";

var state = web3.eth.getStorageAt(contract_address, 0);
console.log(state); // "0x03"

const pixelwall_sol_pixelwallContract = web3.eth.contract([
  {
    constant: false,
    inputs: [
      { name: "x", type: "uint16" },
      { name: "y", type: "uint16" },
      { name: "color", type: "uint8" }
    ],
    name: "draw",
    outputs: [],
    payable: false,
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "data", type: "uint256[]" }],
    name: "drawMany",
    outputs: [],
    payable: false,
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "offset", type: "uint256" }],
    name: "getPixels",
    outputs: [{ name: "", type: "uint256[16]" }],
    payable: false,
    type: "function"
  },
  { inputs: [], payable: false, type: "constructor" }
]);

const results = {};

const maximumNumber = new BigNumber(2).toPower(256);
const extractColorsFromInt256 = function(val) {
  const str = val.add(maximumNumber).toString(2);
  const trimmed = str.substring(1, str.length);
  const arr = [];
  for (let i = 252; i > -1; i -= 4) arr.push(trimmed.substring(i, i + 4));
  return arr.map(o => parseInt(o, 2));
};

const writeColors = function(contract, image, cb) {
  let doneCounter = 256;
  for (let i = 0; i < 256; i++) {
    (function(index) {
      const result = contract.getPixels.call(index * 16, function(err, result) {
        console.log(index);
        console.log("drawing");

        let pixels = [];
        for (let j = 0; j < result.length; j++) {
          pixels = pixels.concat(extractColorsFromInt256(result[j]));
        }

        for (let j = 0; j < pixels.length; j++) {
          const offset = 1024 * index + j;
          const y = Math.floor(offset / 512);
          const x = offset % 512;
          const color = colorHash[pixels[j]];
          for (subpixelX = 0; subpixelX < pixelSize; subpixelX++) {
            for (subpixelY = 0; subpixelY < pixelSize; subpixelY++) {
              image.setPixelColor(
                Jimp.rgbaToInt(color[0], color[1], color[2], 255),
                x * pixelSize + subpixelX,
                y * pixelSize + subpixelY
              );
            }
          }
        }

        doneCounter -= 1;
        if (doneCounter < 1) {
          console.log("done");
          cb();
        }
      });
    })(i);
  }
};

const pixelwall_sol_pixelwall = pixelwall_sol_pixelwallContract.at(
  contract_address,
  function(e, contract) {
    if (typeof contract.address !== "undefined") {
      console.log(
        "Contract exist! address: " +
          contract.address +
          " transactionHash: " +
          contract.transactionHash
      );
      new Jimp(512 * pixelSize, 512 * pixelSize, function(err, image) {
        writeColors(contract, image, function() {
          image.write("/data/images/pixel.png");
        });
      });
    }
  }
);

exports.results = results;
