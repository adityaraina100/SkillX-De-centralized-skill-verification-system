import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import SmartContract from '../abis/Decentraskill.json';

const App = () => {
  const [state, setState] = useState({
    web3: null,
    contract: null,
    email: '',
    account: '',
    accountId: '',
    signedIn: false,
    loaded: false,
  });
  // ...
};
const initWeb3 = async () => {
    if (window.ethereum) {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      try {
        const web3 = new Web3(window.ethereum);
        const account = (await web3.eth.getAccounts())[0];
        const netId = await web3.eth.net.getId();
        const address = SmartContract.networks[netId].address;
        const contract = new web3.eth.Contract(SmartContract.abi, address);
        const accountId = await contract.methods.address_to_id(account).call();
        setState({
          ...state,
          web3,
          account,
          contract,
          accountId,
          loaded: true,
        });
        console.log('setup complete');
      } catch (e) {
        alert(e);
      }
    } else {
      alert('web3 not detected');
    }
  };
  const login = async () => {
    try {
      const accountType = await state.contract.methods.login(state.email).call({
        from: state.account,
      });
      console.log('account type:', accountType);
      setState({ ...state, signedIn: true });
    } catch (e) {
      console.error(e);
    }
  };
  const signUp = async () => {
    try {
      await state.contract.methods
        .sign_up(state.email, 'name', 'user')
        .send({ from: state.account });
      alert('signed up');
    } catch (e) {
      console.error(e);
    }
  };
  const requestCompany = async (startDate, endDate, role, companyId) => {
    try {
      await state.contract.methods.add_experience(
        state.accountId,
        startDate,
        endDate,
        role,
        companyId
      );
    } catch (e) {
      console.error(e);
    }
  };
  const approveEmployee = async (experienceId, companyId) => {
    try {
      await state.contract.methods.approve_experience(experienceId, companyId);
    } catch (e) {
      console.error(e);
    }
  };
  const updateWallet = async (newAddress) => {
    try {
      await state.contract.methods.update_wallet_address(state.email, newAddress);
    } catch (e) {
      console.error(e);
    }
  };
  const approveManager = async (empId) => {
    try {
      await state.contract.methods.approve_manager(empId);
    } catch (e) {
      console.error(e);
    }
  };
  const addCertificate = async (
    certUrl,
    issueDate,
    validTill,
    certName,
    issuer,
    linkedSkill
  ) => {
    try {
      await state.contract.methods.add_certification(
        state.accountId,
        certUrl,
        issueDate,
        validTill,
        certName,
        issuer,
        linkedSkill
      );
    } catch (e) {
      console.error(e);
    }
  };
  const addSkill = async (skillName) => {
    try {
      await state.contract.methods.add_skill(state.accountId, skillName);
    } catch (e) {
      console.error(e);
    }
  };
  const endorseSkill = async (empId, skillId, comment) => {
    const date = new Date();
    try {
      await state.contract.methods.endorse_skill(
        empId,
        skillId,
        `${date.getMonth()} ${date.getFullYear()}`,
        comment
      );
    } catch (e) {
      console.error(e);
    }
  };
