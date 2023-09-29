import { Module, customModule, Container, Styles, Control, application, Panel } from '@ijstech/components';
import ScomFlow from '@scom/scom-flow';
const Theme = Styles.Theme.currentTheme;

const sampleData = {
    "data": {},
    "title": "",
    "widgets": [
        {
            "name": "scom-staking",
            "initialSetupStepTitle": 'Get Ready to Stake',
            'executionStepTitle': 'Stake liquidity for farming',
            "tokenRequirements": [
                {
                    "tokensIn": [
                        {
                            // "address": "0x45eee762aaeA4e5ce317471BDa8782724972Ee19",
                            "address": "0x3cb66f6057d80015D0cf7c4c4e00dfC79ff6c836",
                            "chainId": 97
                        },
                        {
                            "address": "0xb9C31Ea1D475c25E58a1bE1a46221db55E5A7C6e",
                            "chainId": 43113
                        },
                        {
                            "chainId": 43113
                        }
                    ],
                    "tokenOut": {
                        // "address": "0x78d9D80E67bC80A11efbf84B7c8A65Da51a8EF3C",
                        "address": "0x1B23B0dBB8D142596443999Dd0197299Fa17eb03",
                        "chainId": 43113
                    }
                }
            ],
            "options": {
                "properties": {
                    "chainId": 43113,
                    "name": "Staking",
                    "desc": "Earn OSWAP",
                    "showContractLink": true,
                    "staking": {
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
        }
    ]
};

@customModule
export default class Module1 extends Module {
    private panel: Panel;
    private elm: ScomFlow
    constructor(parent?: Container, options?: any) {
        super(parent, options);
    }

    private onChanged() {
        console.log(this.elm.activeStep)
    }

    async init() {
        super.init();
        this.elm = (await application.createElement('scom-flow', true)) as ScomFlow;
        this.panel.append(this.elm);
        await this.elm.setData({
            activeStep: 0,
            description: 'Stake OSWAP to earn more OSWAP',
            img: 'https://ipfs.scom.dev/ipfs/bafkreihusulbamxr2ti6s3hlciyufobsyicgoslbdhk5qkjdhfayotd6ym',
            widgets: sampleData.widgets
        });
        this.elm.onChanged = this.onChanged.bind(this);
        // this.elm.updateStatus(0, true)
    }

    render() {
        return <i-panel padding={{ left: '1rem', right: '1rem', top: '1rem', bottom: '1rem' }} id="panel">
            {/* <i-scom-flow
                id="elm"
                img="https://ipfs.scom.dev/ipfs/bafkreihusulbamxr2ti6s3hlciyufobsyicgoslbdhk5qkjdhfayotd6ym"
                description="e.g Ethan wants to participate in Yield Farming mining. Using BQL workflow, he can automate the farming operations by combining the three steps of exchange, liquidity addition and staking in one go."
                onChanged={this.onChanged.bind(this)}
            /> */}
        </i-panel>
    }
}