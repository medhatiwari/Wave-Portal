const main = async() =>{
    const [deployer] = await hre.ethers.getSigners();
    const accountBalance = await deployer.getBalance();

    console.log("Deploying account ", deployer.address);
    console.log("Account Balance:", accountBalance.toString());

    const Token = await hre.ethers.getContractFactory('WavePortal');
    const portal = await Token.deploy();
    
    console.log("WavePortal address:",portal.address);
};

const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  };
  
  runMain();

