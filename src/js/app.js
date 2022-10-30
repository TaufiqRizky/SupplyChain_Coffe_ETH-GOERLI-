App = {
    web3Provider: null,
    contracts: {},
    emptyAddress: "0x0000000000000000000000000000000000000000",
    sku: 0,
    upc: 0,
    metamaskAccountID: "0x0000000000000000000000000000000000000000",
    ownerID: "0x0000000000000000000000000000000000000000",
    originFarmerID: "0x0000000000000000000000000000000000000000",
    originFarmName: null,
    originFarmInformation: null,
    originFarmLatitude: null,
    originFarmLongitude: null,
    productNotes: null,
    productPrice: 0,
    distributorID: "0x0000000000000000000000000000000000000000",
    retailerID: "0x0000000000000000000000000000000000000000",
    consumerID: "0x0000000000000000000000000000000000000000",

    init: async function () {
        App.readForm();
        /// Setup access to blockchain
        return await App.initWeb3();
    },

    readForm: function () {
        App.upc = $("#harvestupc").val();
        App.originFarmName = $("#originFarmName").val();
        App.originFarmInformation = $("#originFarmInformation").val();
        App.originFarmLatitude = $("#originFarmLatitude").val();
        App.originFarmLongitude = $("#originFarmLongitude").val();
        App.productNotes = $("#productNotes").val();
        //App.productPrice = $("#productPrice").val();
    },

    initWeb3: async function () {
        /// Find or Inject Web3 Provider
        /// Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }

        App.getMetaskAccountID();

        return App.initSupplyChain();
    },

    getMetaskAccountID: function () {
        web3 = new Web3(App.web3Provider);

        // Retrieving accounts
        web3.eth.getAccounts(function (err, res) {
            if (err) {
                console.log('Error:', err);
                return;
            }
            console.log('getMetaskID:', res);
            App.metamaskAccountID = res[0];
            App.originFarmerID = document.getElementById("farmerID").value;
            App.distributorID = document.getElementById("distributorID").value;
            App.retailerID = document.getElementById("retailerID").value;
            App.consumerID = document.getElementById("consumerID").value;
            /*
            App.originFarmerID = res[0];
            document.getElementById("farmerID").value = App.originFarmerID;
            App.distributorID = res[1];
            document.getElementById("distributorID").value = App.distributorID;
            App.retailerID = res[2];
            document.getElementById("retailerID").value = App.retailerID;
            App.consumerID = res[3];
            document.getElementById("consumerID").value = App.consumerID;
            */
        })
    },

    initSupplyChain: function () {
        /// Source the truffle compiled smart contracts
        var jsonSupplyChain = '../../build/contracts/SupplyChain.json';

        /// JSONfy the smart contracts
        $.getJSON(jsonSupplyChain, function (data) {
            console.log('data', data);
            var SupplyChainArtifact = data;
            App.contracts.SupplyChain = TruffleContract(SupplyChainArtifact);
            App.contracts.SupplyChain.setProvider(App.web3Provider);

            App.fetchItemBufferOne();
            App.fetchItemBufferTwo();
            App.fetchEvents();

        });

        return App.bindEvents();
    },

    bindEvents: function () {
        $(document).on('click', App.handleButtonClick);
    },

    handleButtonClick: async function (event) {
        event.preventDefault();

        App.getMetaskAccountID();

        var processId = parseInt($(event.target).data('id'));

        switch (processId) {
            case 1:
                return await App.harvestItem(event);
                break;
            case 2:
                return await App.processItem(event);
                break;
            case 3:
                return await App.packItem(event);
                break;
            case 4:
                return await App.sellItem(event);
                break;
            case 5:
                return await App.buyItem(event);
                break;
            case 6:
                return await App.shipItem(event);
                break;
            case 7:
                return await App.receiveItem(event);
                break;
            case 8:
                return await App.purchaseItem(event);
                break;
            case 9:
                return await App.fetchItemBufferOne(event);
                break;
            case 10:
                return await App.fetchItemBufferTwo(event);
                break;
            case 11:
                return await App.addFarmer(event);
                break;
            case 12:
                return await App.addDistributor(event);
                break;
            case 13:
                return await App.addRetailer(event);
                break;
            case 14:
                return await App.addConsumer(event);
                break;
        }
    },

    addFarmer: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        var displayRole = document.getElementById("roleResultBuffer");
        App.originFarmerID = $("#farmerID").val();

        App.contracts.SupplyChain.deployed().then(async function (instance) {
            var checkRole = await instance.isFarmer(App.originFarmerID);
            if (checkRole == false) {
                await instance.addFarmer(
                    App.originFarmerID,
                    { from: App.metamaskAccountID }
                );
            }
            checkRole = await instance.isFarmer(App.originFarmerID);
            return checkRole;
        }).then(function (result) {
            if (result) {
                displayRole.innerHTML = ("Farmer address(" + App.originFarmerID + "): Success");
            } else {
                displayRole.innerHTML = ("Farmer address(" + App.originFarmerID + "): Fail");
            }
        }).catch(function (err) {
            displayRole.innerHTML = ("Farmer address(" + App.originFarmerID + "): " + err.message);
        });
    },

    addDistributor: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        var displayRole = document.getElementById("roleResultBuffer");
        App.distributorID = $("#distributorID").val();

        App.contracts.SupplyChain.deployed().then(async function (instance) {
            var checkRole = await instance.isDistributor(App.distributorID);
            if (checkRole == false) {
                await instance.addDistributor(
                    App.distributorID,
                    { from: App.metamaskAccountID }
                );
            }
            checkRole = await instance.isDistributor(App.distributorID);
            return checkRole;
        }).then(function (result) {
            if (result) {
                displayRole.innerHTML = ("Distributor address(" + App.distributorID + "): Success");
            } else {
                displayRole.innerHTML = ("Distributor address(" + App.distributorID + "): Fail");
            }
        }).catch(function (err) {
            displayRole.innerHTML = ("Distributor address(" + App.distributorID + "): " + err.message);
        });
    },

    addRetailer: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        var displayRole = document.getElementById("roleResultBuffer");
        App.retailerID = $("#retailerID").val();

        App.contracts.SupplyChain.deployed().then(async function (instance) {
            var checkRole = await instance.isRetailer(App.retailerID);
            if (checkRole == false) {
                await instance.addRetailer(
                    App.retailerID,
                    { from: App.metamaskAccountID }
                );
            }
            checkRole = await instance.isRetailer(App.retailerID);
            return checkRole;
        }).then(function (result) {
            if (result) {
                displayRole.innerHTML = ("Retailer address(" + App.retailerID + "): Success");
            } else {
                displayRole.innerHTML = ("Retailer address(" + App.retailerID + "): Fail");
            }
        }).catch(function (err) {
            displayRole.innerHTML = ("Retailer address(" + App.retailerID + "): " + err.message);
        });
    },

    addConsumer: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        var displayRole = document.getElementById("roleResultBuffer");
        App.consumerID = $("#consumerID").val();

        App.contracts.SupplyChain.deployed().then(async function (instance) {
            var checkRole = await instance.isConsumer(App.consumerID);
            if (checkRole == false) {
                await instance.addConsumer(
                    App.consumerID,
                    { from: App.metamaskAccountID }
                );
            }
            checkRole = await instance.isConsumer(App.consumerID);
            return checkRole;
        }).then(function (result) {
            if (result) {
                displayRole.innerHTML = ("Consumer address(" + App.consumerID + "): Success");
            } else {
                displayRole.innerHTML = ("Consumer address(" + App.consumerID + "): Fail");
            }
        }).catch(function (err) {
            displayRole.innerHTML = ("Consumer address(" + App.consumerID + "): " + err.message);
        });
    },

    harvestItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        var displayResult = document.getElementById("harvestResultBuffer");
        App.readForm();
        App.originFarmerID = App.metamaskAccountID;
        App.contracts.SupplyChain.deployed().then(function (instance) {
            return instance.harvestItem(
                App.upc,
                App.metamaskAccountID,
                App.originFarmName,
                App.originFarmInformation,
                App.originFarmLatitude,
                App.originFarmLongitude,
                App.productNotes
            );
        }).then(function (result) {
            $("#ftc-item").text(result);
            displayResult.innerHTML = (result.tx);
            //console.log('harvestItem', result);
        }).catch(function (err) {
            displayResult.innerHTML = (err.message);
            //console.log(err.message);
        });
    },

    processItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        var displayResult = document.getElementById("processResultBuffer");
        var upc = $("#processupc").val();
        App.contracts.SupplyChain.deployed().then(function (instance) {
            return instance.processItem(upc, { from: App.metamaskAccountID });
        }).then(function (result) {
            $("#ftc-item").text(result);
            displayResult.innerHTML = (result.tx);
            //console.log('processItem', result);
        }).catch(function (err) {
            displayResult.innerHTML = (err.message);
            //console.log(err.message);
        });
    },

    packItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        var displayResult = document.getElementById("packResultBuffer");
        var upc = $("#packupc").val();
        App.contracts.SupplyChain.deployed().then(function (instance) {
            return instance.packItem(upc, { from: App.metamaskAccountID });
        }).then(function (result) {
            $("#ftc-item").text(result);
            displayResult.innerHTML = (result.tx);
            //console.log('packItem', result);
        }).catch(function (err) {
            displayResult.innerHTML = (err.message);
            //console.log(err.message);
        });
    },

    sellItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        var displayResult = document.getElementById("sellResultBuffer");
        var upc = $("#sellupc").val();
        App.productPrice = $("#productPrice").val();
        App.contracts.SupplyChain.deployed().then(function (instance) {
            //const productPrice = web3.toWei(1, "ether");
            //console.log('productPrice', productPrice);
            return instance.sellItem(upc, App.productPrice, { from: App.metamaskAccountID });
        }).then(function (result) {
            $("#ftc-item").text(result);
            displayResult.innerHTML = (result.tx);
            //console.log('sellItem', result);
        }).catch(function (err) {
            displayResult.innerHTML = (err.message);
            //console.log(err.message);
        });
    },

    buyItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        var displayResult = document.getElementById("buyResultBuffer");
        var upc = $("#buyupc").val();
        App.distributorID = App.metamaskAccountID;

        App.contracts.SupplyChain.deployed().then(function (instance) {
            return instance.fetchItemBufferTwo(upc);
        }).then(function (result) {
            App.contracts.SupplyChain.deployed().then(function (instance) {
                var price = result[4].c[0];
                const walletValue = web3.toWei(price, "ether");
                return instance.buyItem(upc, { from: App.metamaskAccountID, value:walletValue });
            }).then(function (result) {
                $("#ftc-item").text(result);
                displayResult.innerHTML = (result.tx);
                //console.log('buyItem', result);
            }).catch(function (err) {
                displayResult.innerHTML = (err.message);
                //console.log(err.message);
            });
        }).catch(function (err) {
            displayResult.innerHTML = (err.message);
        });

        /*
        App.contracts.SupplyChain.deployed().then(function (instance) {
            var result = await instance.fetchItemBufferTwo(upc);
            console.log(result);
            var price = result[4].c[0];
            const walletValue = web3.toWei(price, "ether");
            return instance.buyItem(upc, { from: App.metamaskAccountID, value:walletValue });
        }).then(function (result) {
            $("#ftc-item").text(result);
            displayResult.innerHTML = (result.tx);
            //console.log('buyItem', result);
        }).catch(function (err) {
            displayResult.innerHTML = (err.message);
            //console.log(err.message);
        });
        */
    },

    shipItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        var displayResult = document.getElementById("shipResultBuffer");
        var upc = $("#shipupc").val();
        App.contracts.SupplyChain.deployed().then(function (instance) {
            return instance.shipItem(upc, { from: App.metamaskAccountID });
        }).then(function (result) {
            $("#ftc-item").text(result);
            displayResult.innerHTML = (result.tx);
            //console.log('shipItem', result);
        }).catch(function (err) {
            displayResult.innerHTML = (err.message);
            //console.log(err.message);
        });
    },

    receiveItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        var displayResult = document.getElementById("receiveResultBuffer");
        var upc = $("#receiveupc").val();
        App.retailerID = App.metamaskAccountID;
        App.contracts.SupplyChain.deployed().then(function (instance) {
            return instance.receiveItem(upc, { from: App.metamaskAccountID });
        }).then(function (result) {
            $("#ftc-item").text(result);
            displayResult.innerHTML = (result.tx);
            //console.log('receiveItem', result);
        }).catch(function (err) {
            displayResult.innerHTML = (err.message);
            //console.log(err.message);
        });
    },

    purchaseItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        var displayResult = document.getElementById("purchaseResultBuffer");
        var upc = $("#purchaseupc").val();
        App.consumerID = App.metamaskAccountID;
        App.contracts.SupplyChain.deployed().then(function (instance) {
            return instance.purchaseItem(upc, { from: App.metamaskAccountID });
        }).then(function (result) {
            $("#ftc-item").text(result);
            displayResult.innerHTML = (result.tx);
            //console.log('purchaseItem', result);
        }).catch(function (err) {
            displayResult.innerHTML = (err.message);
            //console.log(err.message);
        });
    },

    fetchItemBufferOne: function () {
        ///   event.preventDefault();
        ///    var processId = parseInt($(event.target).data('id'));
        var displayBlock = document.getElementById("blockInfoBuffer");
        var upc = $('#upc').val();
        //App.upc = $('#upc').val();
        //console.log('upc', App.upc);

        App.contracts.SupplyChain.deployed().then(function (instance) {
            return instance.fetchItemBufferOne(upc);
        }).then(function (result) {
            $("#ftc-item").text(result);
            displayBlock.innerHTML = (
                "SKU: " + result[0] + "<br>" +
                "UPC: " + result[1] + "<br>" +
                "Owner ID: " + result[2] + "<br>" +
                "Origin Farmer ID: " + result[3] + "<br>" +
                "Origin Farm Name: " + result[4] + "<br>" +
                "Origin Farm Information: " + result[5] + "<br>" +
                "Origin Farm Latitude: " + result[6] + "<br>" +
                "Origin Farm Longitude: " + result[7] + "<br>");
        }).catch(function (err) {
            displayBlock.innerHTML = (err.message);
            //console.log(err.message);
        });
    },

    fetchItemBufferTwo: function () {
        ///    event.preventDefault();
        ///    var processId = parseInt($(event.target).data('id'));

        var displayBlock = document.getElementById("blockInfoBuffer");
        var upc = $('#upc').val();

        App.contracts.SupplyChain.deployed().then(function (instance) {
            return instance.fetchItemBufferTwo.call(upc);
        }).then(function (result) {
            $("#ftc-item").text(result);
            displayBlock.innerHTML = (
                "SKU: " + result[0] + "<br>" +
                "UPC: " + result[1] + "<br>" +
                "Product ID: " + result[2] + "<br>" +
                "Product Notes: " + result[3] + "<br>" +
                "Product Price: " + result[4] + "<br>" +
                "Item State: " + result[5] + "<br>" +
                "Distributor ID: " + result[6] + "<br>" +
                "Retailer ID: " + result[7] + "<br>" +
                "Consumer ID: " + result[8]);
        }).catch(function (err) {
            displayBlock.innerHTML = (err.message);
            //console.log(err.message);
        });
    },

    fetchEvents: function () {
        if (typeof App.contracts.SupplyChain.currentProvider.sendAsync !== "function") {
            App.contracts.SupplyChain.currentProvider.sendAsync = function () {
                return App.contracts.SupplyChain.currentProvider.send.apply(
                    App.contracts.SupplyChain.currentProvider,
                    arguments
                );
            };
        }

        App.contracts.SupplyChain.deployed().then(function (instance) {
            var events = instance.allEvents(function (err, log) {
                if (!err)
                    $("#ftc-events").append('<li>' + log.event + ' - ' + log.transactionHash + '</li>');
            });
        }).catch(function (err) {
            console.log(err.message);
        });

    }
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
