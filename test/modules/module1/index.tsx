import { Module, customModule, Container, Styles } from '@ijstech/components';
import ScomFlow from '@scom/scom-flow';
const Theme = Styles.Theme.currentTheme;

@customModule
export default class Module1 extends Module {
    private _steps: any[] = []
    private elm: ScomFlow
    constructor(parent?: Container, options?: any) {
        super(parent, options);
        this._steps = [
            {
                name: 'Action: First exchange som ETH for USDT',
                image: '',
                color: Theme.colors.warning.main,
                embedData: {
                    "properties": {
                        "providers": [
                            {
                                "key": "OpenSwap",
                                "chainId": 43113
                            }
                        ],
                        "category": "fixed-pair",
                        "tokens": [
                            {
                                "name": "Tether USD",
                                "address": "0xb9C31Ea1D475c25E58a1bE1a46221db55E5A7C6e",
                                "symbol": "USDT.e",
                                "decimals": 6,
                                "chainId": 43113
                            },
                            {
                                "name": "OpenSwap",
                                "address": "0x78d9D80E67bC80A11efbf84B7c8A65Da51a8EF3C",
                                "symbol": "OSWAP",
                                "decimals": 18,
                                "isCommon": true,
                                "chainId": 43113
                            }
                        ],
                        "defaultChainId": 43113,
                        "networks": [
                            {
                                "chainId": 43113
                            }
                        ],
                        "wallets": [
                            {
                                "name": "metamask"
                            }
                        ],
                        "showHeader": true,
                        "showFooter": true,
                        "title": ""
                    },
                    "module": {
                        "name": "Swap DApp",
                        "path": "scom-swap",
                        "category": "micro-dapps"
                    }
                }
            },
            {
                name: 'Action: Add ETH and USDT to liquidity pool',
                image: '',
                color: Theme.colors.error.main
            },
            {
                name: 'Action: Stake liquidity for farmings and start mining',
                image: '',
                color: Theme.colors.success.main,
                embedData: {
                    "properties": {
                        "chainId": 43113,
                        "name": "Staking",
                        "desc": "Earn OSWAP",
                        "showContractLink": true,
                        "stakings": {
                          "address": "0xb9a237fbd7ddc2cd2bfafd90da97a62c2ca42c9f",
                          "lockTokenType": 0,
                          "rewards": {
                            "address": "0x1754f919d45e5737eb03ee148e94bee135f2ed6d",
                            "isCommonStartDate": false
                          }
                        },
                        "networks": [
                          {
                            "chainId": 43113
                          }
                        ],
                        "wallets": [
                          {
                            "name": "metamask"
                          }
                        ]
                    },
                    "module": {
                        "name": "Staking DApp",
                        "path": "scom-staking",
                        "category": "micro-dapps"
                    }
                }
            }
        ]
    }

    private onChanged() {
        console.log(this.elm.activeStep)
    }

    async init() {
        super.init();
    }

    render() {
        return <i-panel margin={{left: '1rem', top: '1rem'}}>
            <i-scom-flow
                id="elm"
                steps={this._steps}
                img="https://ipfs.scom.dev/ipfs/bafkreihusulbamxr2ti6s3hlciyufobsyicgoslbdhk5qkjdhfayotd6ym"
                description="e.g Ethan wants to participate in Yield Farming mining"
                onChanged={this.onChanged.bind(this)}
            />
        </i-panel>
    }
}