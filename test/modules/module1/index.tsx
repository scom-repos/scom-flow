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
                    "guid": "68492d2c-2062-11ee-a663-0242ac130003",
                    "dataUri": "bafybeih5v2hoeuio4ou3pnqr47lilaa6m6ojqxv3hllk4mycju3imoh4gq",
                    "contractAddress": "",
                    "owner": "0xb15E094957c31D6b0d08714015fF85Bec7842635",
                    "developedBy": "OpenSwap",
                    "title": "SushiSwap Swap",
                    "img": "https://ipfs.scom.dev/ipfs/bafkreic4ak6x7f5iyq6bfwne7suo77ojo4cudusydxrf245nwdfwkquupi",
                    "category": "swaps",
                    "description": "Carry out token swaps using SushiSwap. This Swap Dapp is registered to www.sushi.com",
                    "commissionRate": 1,
                    "startDate": 1683072430,
                    "numOfEmbedders": 10344,
                    "lastUpdated": 1685525220,
                    "tags": [
                        "NEW"
                    ],
                    "chainIds": [
                        1
                    ],
                    "categories": [
                        "swaps",
                        "embed-to-earn"
                    ],
                    "categoryName": "Swaps"
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
                color: Theme.colors.success.main
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