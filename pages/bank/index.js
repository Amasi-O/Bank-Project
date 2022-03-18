import React, { Component } from 'react';
import Bank from '../../ethereum/bank';
import {  Button } from "semantic-ui-react";
import web3 from "../../ethereum/web3";
import classes from "../../public/css/oboi.module.css";
import Head from 'next/head';
import { Router } from '../../routs';
import Header from '../../components/Header';

class BankOpen extends Component {
    state = {
        totalsupply: '',
        checking: "",
        userAddress: "",
        message: "",
        loading: false,
        address: ''


    }
    async componentDidMount(){
        const accounts = await web3.eth.getAccounts()
        this.setState({address: accounts[0]})
    }
    onClick = async (event) => {
        event.preventDefault();

        this.setState({ loading: true });

        const accounts = await web3.eth.getAccounts();

        this.setState({ message: "Please Wait..." });

        await Bank.methods.openAccount().send({
            from: accounts[0]
        });

        Router.pushRoute('/bank/new');

        this.setState({ loading: false });

    };

    

    static async getInitialProps() {
        const bank = await Bank.methods.openAccount().call();

        return { bank };
    }

    render() {
        return (
            <div className={classes.image}>
                <Head>
                    <link

                        rel="stylesheet"
                        href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"
                    />
                </Head>
                <Header address = {this.state.address}/>

                <p>{this.state.checking}</p>
                <div style={{ width: '50%', maxWidth: '300px', margin: '400px auto' }}>
                    <Button
                        onClick={this.onClick}
                        style={{ margin: '80px 70px' }}
                        content="Open Account"
                        icon="add circle"
                        loading={this.state.loading}
                        secondary
                    />

                </div>

            </div>
        );
    }
}

export default BankOpen;