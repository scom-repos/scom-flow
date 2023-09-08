import { Module, customModule, Container, Styles, Control } from '@ijstech/components';
import ScomFlow from '@scom/scom-flow';
const Theme = Styles.Theme.currentTheme;

const sampleData = {
    "data": {},
    "title": "",
    "widgets": [
        {
            "name": "scom-staking",
            "tokenRequirements": [
                {
                    "tokensIn": [
                        {
                            "address": "0xb9C31Ea1D475c25E58a1bE1a46221db55E5A7C6e",
                            "chainId": 43113
                        },
                        {
                            "chainId": 43113
                        }
                    ],
                    "tokenOut": {
                        "address": "0x78d9D80E67bC80A11efbf84B7c8A65Da51a8EF3C",
                        "chainId": 43113
                    }
                }
            ],
            "transactions": [
                {
                    "hash": "",
                    "type": "tokenAcquisition"
                }
            ],
            "options": {
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
                }
            }
        },
        {
            name: "scom-token-acquisition",
            options: {
                properties: {
                    data: [
                        {
                            stepName: 'Step 1',
                            data: {
                              properties: {
                                providers: [
                                  {
                                    caption: 'OpenSwap',
                                    image: 'ipfs://bafkreidoi5pywhyo4hqdltlosvrvefgqj4nuclmjl325exzmjgnyl2cc4y',
                                    key: 'OpenSwap',
                                    dexId: 1,
                                    chainId: 97,
                                  },
                                  {
                                    caption: 'OpenSwap',
                                    image: 'ipfs://bafkreidoi5pywhyo4hqdltlosvrvefgqj4nuclmjl325exzmjgnyl2cc4y',
                                    key: 'OpenSwap',
                                    dexId: 1,
                                    chainId: 43113,
                                  },
                                ],
                                category: 'aggregator',
                                tokens: [
                                  {
                                    name: 'USDT',
                                    address: '0x29386B60e0A9A1a30e1488ADA47256577ca2C385',
                                    symbol: 'USDT',
                                    decimals: 6,
                                    chainId: 97,
                                  },
                                  {
                                    name: 'OpenSwap',
                                    address: '0x45eee762aaeA4e5ce317471BDa8782724972Ee19',
                                    symbol: 'OSWAP',
                                    decimals: 18,
                                    chainId: 97,
                                  },
                                  {
                                    name: 'Tether USD',
                                    address: '0xb9C31Ea1D475c25E58a1bE1a46221db55E5A7C6e',
                                    symbol: 'USDT.e',
                                    decimals: 6,
                                    chainId: 43113,
                                  },
                                  {
                                    name: 'OpenSwap',
                                    address: '0x78d9D80E67bC80A11efbf84B7c8A65Da51a8EF3C',
                                    symbol: 'OSWAP',
                                    decimals: 18,
                                    chainId: 43113,
                                  },
                                ],
                                defaultChainId: 43113,
                                networks: [
                                  {
                                    chainId: 43113,
                                  },
                                  {
                                    chainId: 97,
                                  },
                                ],
                                wallets: [
                                  {
                                    name: 'metamask',
                                  },
                                ]
                              }
                            }
                          },
                          {
                            stepName: 'Step 2',
                            data: {
                              properties: {
                                providers: [
                                  {
                                    caption: 'OpenSwap',
                                    image: 'ipfs://bafkreidoi5pywhyo4hqdltlosvrvefgqj4nuclmjl325exzmjgnyl2cc4y',
                                    key: 'OpenSwap',
                                    dexId: 1,
                                    chainId: 43113,
                                  },
                                ],
                                category: 'aggregator',
                                defaultChainId: 43113,
                                networks: [
                                  {
                                    chainId: 43113,
                                  },
                                ],
                                wallets: [
                                  {
                                    name: 'metamask',
                                  },
                                ]
                              }
                            }
                        }
                    ],
                    onDone: function (target: Control) {
                        console.log('Completed all steps', target)
                        const flowParent = target.closest('i-scom-flow') as any;
                        if (flowParent) {
                          flowParent.updateStatus(1, true);
                          flowParent.activeStep = 2;
                        }
                    }
                }
            }
        }
    ]
};

@customModule
export default class Module1 extends Module {
    private _steps: any[] = []
    private elm: ScomFlow
    constructor(parent?: Container, options?: any) {
        super(parent, options);
        const widgetData = sampleData.widgets[0];
        this._steps = [
            {
                name: 'Get Ready to Stake',
                image: '',
                color: Theme.colors.success.main,
                stage: 'initialSetup',
                widgetData: widgetData
            },
            {
                name: 'Exchange',
                image: '',
                color: Theme.colors.success.main,
                stage: '',
                widgetData: sampleData.widgets[1]
            },
            {
                name: 'Stake liquidity for farming',
                image: '',
                color: Theme.colors.success.main,
                stage: '',
                widgetData: widgetData
            }
        ]
    }

    private onChanged() {
        console.log(this.elm.activeStep)
    }

    async init() {
        super.init();
        this.elm.updateStatus(0, true)
    }

    render() {
        return <i-panel padding={{ left: '1rem', right: '1rem', top: '1rem', bottom: '1rem' }}>
            <i-scom-flow
                id="elm"
                steps={this._steps}
                img="https://ipfs.scom.dev/ipfs/bafkreihusulbamxr2ti6s3hlciyufobsyicgoslbdhk5qkjdhfayotd6ym"
                description="e.g Ethan wants to participate in Yield Farming mining. Using BQL workflow, he can automate the farming operations by combining the three steps of exchange, liquidity addition and staking in one go."
                onChanged={this.onChanged.bind(this)}
            />
        </i-panel>
    }
}