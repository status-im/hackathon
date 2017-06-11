pragma solidity ^0.4.0;

contract PixelWall {

  uint256[2**12] pixels;

  function PixelWall () {
  }

  function getPixels (uint offset) constant returns (uint256[16]) {
    return [
            pixels[offset + 0],
            pixels[offset + 1],
            pixels[offset + 2],
            pixels[offset + 3],
            pixels[offset + 4],
            pixels[offset + 5],
            pixels[offset + 6],
            pixels[offset + 7],
            pixels[offset + 8],
            pixels[offset + 9],
            pixels[offset + 10],
            pixels[offset + 11],
            pixels[offset + 12],
            pixels[offset + 13],
            pixels[offset + 14],
            pixels[offset + 15]
            ];
  }

  function draw (uint16 x, uint16 y, uint8 color) {
    uint256 offset = x * 512 + y;
    uint256 bucket = offset / 64;
    uint256 shift = (offset % 64) * 4;
    pixels[bucket] = (pixels[bucket] & ~(uint256(15) << shift)) | (uint256(color) << shift);
  }

  function drawMany(uint256[] data) {
    for(uint i = 0; i < data.length; i += 2) {
      uint256 offset = data[i];
      uint256 color = data[i + 1];
      uint256 bucket = offset / 64;
      uint256 shift = (offset % 64) * 4;
      pixels[bucket] = (pixels[bucket] & ~(uint256(15) << shift)) | (uint256(color) << shift);
    }
  }
}
