const main = async () => {
    const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
    const waveContract = await waveContractFactory.deploy({
      value : hre.ethers.utils.parseEther('0.1'),
    });
    await waveContract.deployed();
    console.log("Contract deployed to:", waveContract.address);

    let contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log('Contract Balance:', hre.ethers.utils.formatEther(contractBalance));

    let waveTransaction = await waveContract.wave('Hey You!');
    await waveTransaction.wait();

    const[_, randomPerson] = await hre.ethers.getSigners();

    waveTransaction = await waveContract.connect(randomPerson).wave('A new msg');
    await waveTransaction.wait();

    contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log(
      'Contract balance:',
      hre.ethers.utils.formatEther(contractBalance)
    );
    

    let allmsg = await waveContract.getAllmessages();
    console.log(allmsg);
  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  runMain();