# SupplyChain-Coffee-Ethereum
**Ethereum Project - Coffee Supply Chain**  
A supplychain smart contract written in Solidity and deployed on the Rinkeby test network. This Smart contract demonstrates how supplychains can improve authenticity, efficiency and privacy between seller and buyer.
****
### Steps:
1. There are 4 roles: Farmer, Distributor, Retailer, and Consumer
2. Farmer initializes the process, and updates the status: Harvested > Processed > Packed > Forsale
3. Distributor buys the coffee from a farmer and ships it to a retailer. Transfering ownership from farmer to distributor.
4. Retailer receives the coffee from a distributor. Transfering ownership from distributor to retailer.
5. Consumer purchases the coffee from a retail. Transfering ownership from retailer to consumer.
****
**Contract Diagrams**  
--- 
**Activity Diagram**  
![image](https://github.com/DavidCLi/SupplyChain-Coffee-Ethereum/blob/master/Project%20write-up/Activity_Diagram.jpg)  
  
**Sequence Diagram**  
![image](https://github.com/DavidCLi/SupplyChain-Coffee-Ethereum/blob/master/Project%20write-up/Sequence_Diagram.jpg)  
  
**State Diagram**  
![image](https://github.com/DavidCLi/SupplyChain-Coffee-Ethereum/blob/master/Project%20write-up/State_Diagram.png)  
  
**Data Model**  
![image](https://github.com/DavidCLi/SupplyChain-Coffee-Ethereum/blob/master/Project%20write-up/Data_Model.jpg)  
****
**Contract Functions**  
--- 
### Access Control
    Access control is implemented by contracts found within the "coffeeaccesscontrol" directory that are inherited by the supplychain.  
    Consisting of four contracts for each actor of the supplychain (Farmer,Distributor,Retailer and Consumer).
  
### Supplychain  
### 1. Farmer    
    harvestItem  
    processItem  
    packItem  
    sellItem  
### 2. Distributor      
    buyItem  
    shipItem  
### 3. Retailer        
    receiveItem  
### 4. Consumer        
    purchaseItem  
  
****
**Frontend**  
--- 
![image](https://github.com/DavidCLi/SupplyChain-Coffee-Ethereum/blob/master/pics/Add_Roles.JPG)    
![image](https://github.com/DavidCLi/SupplyChain-Coffee-Ethereum/blob/master/pics/Validate.JPG)    
![image](https://github.com/DavidCLi/SupplyChain-Coffee-Ethereum/blob/master/pics/Farmer1.JPG)  
![image](https://github.com/DavidCLi/SupplyChain-Coffee-Ethereum/blob/master/pics/Farmer2.JPG)  
![image](https://github.com/DavidCLi/SupplyChain-Coffee-Ethereum/blob/master/pics/Farmer3.JPG)  
![image](https://github.com/DavidCLi/SupplyChain-Coffee-Ethereum/blob/master/pics/Farmer4.JPG)  
![image](https://github.com/DavidCLi/SupplyChain-Coffee-Ethereum/blob/master/pics/Distributor.JPG)  
![image](https://github.com/DavidCLi/SupplyChain-Coffee-Ethereum/blob/master/pics/Retailer.JPG)  
![image](https://github.com/DavidCLi/SupplyChain-Coffee-Ethereum/blob/master/pics/Consumer.JPG)  
****
### Quick Start
    npm install
    truffle compile
    truffle migrate --network development  --reset --all / truffle migrate --network goerli  --reset
    npm run dev
****
**Project Details**  
Truffle v5.0.28 (core: 5.0.28)  
Solidity v0.5.0 (solc-js)  
Node v11.1.0  
Web3.js v1.0.0-beta.37  
****

