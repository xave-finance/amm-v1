Sūrya's Description Report

Files Description Table

| File Name                                                                   | SHA-1 Hash                               |
| --------------------------------------------------------------------------- | ---------------------------------------- |
| /Users/ernestpascual/Downloads/projects/bigmochi/amm-v1/contracts/Curve.sol | 3dbf839b54a7d414e38a35bd156642c680ff7a4c |

Contracts Description Table

|  Contract  |       Type        |     Bases      |                |                                             |
| :--------: | :---------------: | :------------: | :------------: | :-----------------------------------------: |
|     └      | **Function Name** | **Visibility** | **Mutability** |                **Modifiers**                |
|            |                   |                |                |                                             |
| **Curves** |      Library      |                |                |                                             |
|     └      |        add        |   Private 🔐   |                |                                             |
|     └      |        sub        |   Private 🔐   |                |                                             |
|     └      |     transfer      |  External ❗️  |       🛑       |                    NO❗️                    |
|     └      |      approve      |  External ❗️  |       🛑       |                    NO❗️                    |
|     └      |   transferFrom    |  External ❗️  |       🛑       |                    NO❗️                    |
|     └      | increaseAllowance |  External ❗️  |       🛑       |                    NO❗️                    |
|     └      | decreaseAllowance |  External ❗️  |       🛑       |                    NO❗️                    |
|     └      |    \_transfer     |   Private 🔐   |       🛑       |                                             |
|     └      |     \_approve     |   Private 🔐   |       🛑       |                                             |
|            |                   |                |                |                                             |
| **Curve**  |  Implementation   |    Storage     |                |                                             |
|     └      |   <Constructor>   |   Public ❗️   |       🛑       |                    NO❗️                    |
|     └      |     setParams     |  External ❗️  |       🛑       |                  onlyOwner                  |
|     └      | excludeDerivative |  External ❗️  |       🛑       |                  onlyOwner                  |
|     └      |     viewCurve     |  External ❗️  |                |                    NO❗️                    |
|     └      |   setEmergency    |  External ❗️  |       🛑       |                  onlyOwner                  |
|     └      |     setFrozen     |  External ❗️  |       🛑       |                  onlyOwner                  |
|     └      | transferOwnership |  External ❗️  |       🛑       |                  onlyOwner                  |
|     └      |    originSwap     |  External ❗️  |       🛑       |     deadline transactable nonReentrant      |
|     └      |  viewOriginSwap   |  External ❗️  |                |                transactable                 |
|     └      |    targetSwap     |  External ❗️  |       🛑       |     deadline transactable nonReentrant      |
|     └      |  viewTargetSwap   |  External ❗️  |                |                transactable                 |
|     └      |      deposit      |  External ❗️  |       🛑       | deadline transactable nonReentrant underCap |
|     └      |    viewDeposit    |  External ❗️  |                |            transactable underCap            |
|     └      | emergencyWithdraw |  External ❗️  |       🛑       |      isEmergency deadline nonReentrant      |
|     └      |     withdraw      |  External ❗️  |       🛑       |            deadline nonReentrant            |
|     └      |   viewWithdraw    |  External ❗️  |                |                transactable                 |
|     └      | supportsInterface |   Public ❗️   |                |                    NO❗️                    |
|     └      |     transfer      |   Public ❗️   |       🛑       |                nonReentrant                 |
|     └      |   transferFrom    |   Public ❗️   |       🛑       |                nonReentrant                 |
|     └      |      approve      |   Public ❗️   |       🛑       |                nonReentrant                 |
|     └      |     balanceOf     |   Public ❗️   |                |                    NO❗️                    |
|     └      |    totalSupply    |   Public ❗️   |                |                    NO❗️                    |
|     └      |     allowance     |   Public ❗️   |                |                    NO❗️                    |
|     └      |     liquidity     |   Public ❗️   |                |                    NO❗️                    |
|     └      |    assimilator    |   Public ❗️   |                |                    NO❗️                    |
|     └      |      setCap       |   Public ❗️   |       🛑       |                  onlyOwner                  |

Legend

| Symbol | Meaning                   |
| :----: | ------------------------- |
|   🛑   | Function can modify state |
|   💵   | Function is payable       |
