import React, { Component } from 'react';
import Bank from '../../ethereum/bank';
import { Form, Button, Input, Container, Message, Card } from "semantic-ui-react";
import web3 from "../../ethereum/web3";
import Head from 'next/head';
import { Router } from '../../routs';
import Header from '../../components/Header';
import '../../fireBaseConfig'
import { getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

class deposit extends Component {
    state = {
        error: '',
        num: '',
        chill: false,
        user: null
    }

    static async getInitialProps(props) {
        const app = getApp()
        const auth = getAuth(app)
        return {
            address: props.query.address,
            user: auth.currentUser ? auth.currentUser : null
        }
    }

    Deposit = async (event) => {
        event.preventDefault();
        this.setState({ chill: true });

        try {
            const accounts = await web3.eth.getAccounts();
            this.setState({ message: "Waiting on transaction success..." });
            await Bank.methods.deposit().send({
                from: accounts[0],
                value: web3.utils.toWei(this.state.num, 'ether')
            });
            Router.pushRoute(`/bank/${accounts[0]}`);

            this.setState({ message: "Account Has Been Created" });

        } catch (err) {

            this.setState({ error: err.message });

        }
        this.setState({ chill: false });
    };

    render() {
        return <div style={{ backgroundColor: 'whitesmoke' }}>
            <Head>
                <title>Deposit</title>
                <link

                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"
                />
            </Head>
            <Header user={this.props.user} address={this.props.address} page='deposit' />
            <Container>
                <div style={{ backgroundColor: 'white', padding: '20px', margin: '50px auto', width: '90%', maxWidth: '40rem' }}>
                    <h2>Deposit</h2>
                    <Form onSubmit={this.Deposit} error={!!this.state.error}>
                        <Form.Field>
                            <label>The amount you want to deposit</label>
                            <Input
                                label="Amount"
                                labelPosition="right"
                                style={{ width: '80%', margin: '20px 0' }}
                                value={this.state.num}
                                onChange={event => {
                                    this.setState({ num: event.target.value })
                                }}
                            />
                        </Form.Field>

                        <Message error header="Oops!" content={this.state.error} />
                        <Button loading={this.state.chill} secondary>Deposit</Button>
                    </Form> 
                </div>
                <h1></h1>
            </Container>
        </div>
    }
}
export default deposit;