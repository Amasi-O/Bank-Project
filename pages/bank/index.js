import React, { Component } from 'react';
import '../../fireBaseConfig'
import Bank from '../../ethereum/bank';
import { Button, Container, Form, Input, Message } from "semantic-ui-react";
import web3 from "../../ethereum/web3";
import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth'
import {setDoc, doc, getFirestore, collection} from 'firebase/firestore'
import {getApp} from 'firebase/app'
import Head from 'next/head';
import { Router } from '../../routs';

import ResponsiveContainer from '../../components/landingPage';

class BankOpen extends Component {
    state = {
        checking: "",
        userAddress: "",
        loading: false,
        address: '',
        password: '',
        errorMessage: '',
        success: false


    }
    async componentDidMount() {
        const accounts = await web3.eth.getAccounts()
        this.setState({ userAddress: accounts[0] })
    }
    onClick = async (event) => {
        event.preventDefault();

        this.setState({ loading: true });
        try {
        const accounts = await web3.eth.getAccounts();

        this.setState({ message: "Please Wait..." });

        await Bank.methods.openAccount().send({
            from: accounts[0]
        });
        const user = await createUserWithEmailAndPassword(getAuth(), this.state.address, this.state.password)
        await setDoc(doc(getFirestore(getApp()), 'customers' , user.user.uid), {
            email: this.state.address,
            address: accounts[0],
            ID: user.user.uid
        })

        this.setState({errorMessage: 'Operation Success', success: true})


        Router.pushRoute('/bank/new');

        this.setState({ loading: false });
    } catch (err) {

        this.setState({ errorMessage: err.message, loading: false });


    }

    };



    static async getInitialProps() {
        const bank = await Bank.methods.openAccount().call();

        return { bank };
    }

    render() {
        return (
            <div>
                <Head>
                    <title>Home</title>
                    <link

                        rel="stylesheet"
                        href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"
                    />
                </Head>

                <ResponsiveContainer gotoForm={(() => {
                    Router.pushRoute('/bank#open')
                })}>
                    <div id = 'open' style={{ width: '80%', maxWidth: '30rem', margin: '400px auto', backgroundColor: 'white' }}>
                    <Container>
                        <h1>Open New Account</h1>
                    <Form onSubmit={this.onClick}  error={!!this.state.errorMessage}>
                                <Form.Field>
                                    <label  style = {{fontSize: 'bold'}}>Ethereum Address</label>
                                    <Input 
                                    style = {{width: '95%'}}
                                    value={this.state.userAddress ? this.state.userAddress : ''
                                    }
                                    onChange={event => this.setState({ userAddress: event.target.value })}
                                    />
                                </Form.Field>

                                <Form.Field>
                                    <label  style = {{fontSize: 'bold'}}>Email</label>
                                    <Input 
                                    style = {{width: '95%'}}
                                    value={this.state.address}
                                    onChange={event => this.setState({ address: event.target.value })}
                                    />
                                </Form.Field>

                                <Form.Field>
                                    <label  style = {{fontSize: 'bold'}}>password</label>
                                    <Input 
                                    type='password'
                                    style = {{width: '95%'}}
                                    value={this.state.password}
                                    onChange={event => this.setState({ password: event.target.value })}
                                    />
                                </Form.Field>
                                
                                <Message  error header="Alert" success = {this.state.success} content={this.state.errorMessage} />
                                <Button loading={this.state.loading} icon="add circle" secondary >
                                    Open Account
                                </Button>
                            </Form>
                            {this.state.checking && <p style={{color: 'white' }}>{this.state.checkMsg}</p>} 
                    </Container>

                    </div>
                    <h1></h1>
                </ResponsiveContainer>



            </div>
        );
    }
}

export default BankOpen;