import {HardhatUserConfig} from 'hardhat/config';
import * as dotenv from 'dotenv';
import '@nomicfoundation/hardhat-toolbox';
import '@openzeppelin/hardhat-upgrades';
import {hdkey} from 'ethereumjs-wallet';
import {mnemonicToSeedSync} from 'bip39';

dotenv.config();

let productionPrivateKey = process.env.DEPLOYER_ACCOUNT;

try {
    if (productionPrivateKey === undefined) {
        const homedir = require('os').homedir();
        require('path').resolve(homedir, '.point', 'keystore', 'key.json');
        const wallet = hdkey.fromMasterSeed(
            mnemonicToSeedSync(
                require(require('path').resolve(
                    homedir,
                    '.point',
                    'keystore',
                    'key.json'
                )).phrase
            )
        )
            .getWallet();
        productionPrivateKey = wallet.getPrivateKey().toString('hex');
    }
} catch (e) {
    console.log(e);
}
if (!productionPrivateKey) {
    console.log(
        'Warn: Production account not found. Will not be possible to deploy to Production Network.'
    );
}

const config: HardhatUserConfig = {
    solidity: '0.8.9',
    networks: {
        xnet: {
            url: 'https://xnet-pluto-1.point.space',
            gasPrice: 1,
            accounts: [productionPrivateKey as string]
        }
    }
};

export default config;
