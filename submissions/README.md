# Requirements

**node / npm**

**geth**

**testrpc** `npm install -g ethereumjs-testrpc`

**truffle** `npm install -g truffle`

**status-dev-cli** `npm install -g status-dev-cli`

**status-dev-cli** `npm install -g ionic`


# Installation

git clone https://github.com/gjeanmart/hackathon.git

cd hackathon/submissions/dts/

npm install

testrpc --account="0x0f9c44961bba06b146bd6a652ecbf944dcb6c06b74b7e3997b0cc38d25e53ae5,10000000000000000000000" --account="0x0dfbc1dab22266e31be842632448179cf7ebce1b97a989c23545c4c16488971f,10000000000000000000000" --secure -u 0 -u 1 --hostname 0.0.0.0 --port 8545 &


truffle migrate --compile-all --reset ; cp -R ./build/contracts/ ./www/contracts/


ionic serve