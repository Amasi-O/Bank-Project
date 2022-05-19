import React, { Component } from 'react';
import getToken from "../../ethereum/token";
import { Form, Button, Input, Container, Message, Card } from "semantic-ui-react";
import web3 from "../../ethereum/web3";
import Head from 'next/head';
import { Router } from '../../routs';
import Header from '../../components/Header';
import '../../fireBaseConfig'
import { getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

class transfer extends Component {
    state = {
        tokens: [{ tokenName: 'GAZE', tokenAddress: '0x16e5f5724C6344c60Fc4eBF24B4DabbF420eDfC4' },
        { tokenName: 'BAZE', tokenAddress: '0xe319111d97A16709a5260A6b14d5f9Ae2A17B4A6' },
        { tokenName: 'FAZE', tokenAddress: '0xf65bB56631ba31AA2DE81cFe834d7c3F76c594CE' }],
        selectedToken: '',
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

    getTok = async (selectedToken) => {
        const token = getToken(selectedToken)
        this.setState({
            ...this.state,
            tokenContract: token
        })

    }

    Transfer = async (event) => {
        event.preventDefault();
        this.setState({ start: true });

        try {
            const accounts = await web3.eth.getAccounts();
            const token = getToken(this.state.selectedToken);


            await token.methods.transfer(this.state.place, this.state.Amount).send({
                from: this.props.address
            });
            Router.pushRoute(`/bank/${accounts[0]}`);

        } catch (err) {

            this.setState({ errorMessage: err.message });

        }
        this.setState({ start: false });
    };

    render() {
        return <div style={{ backgroundColor: 'whitesmoke' }}>
            <Head>
                <title>Transfer</title>
                <link

                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"
                />
            </Head>
            <Header user={this.props.user} address={this.props.address} page='transfer' />
            <Container>
                <div style={{ backgroundColor: 'white', padding: '20px', margin: '50px auto', width: '90%', maxWidth: '40rem' }}>
                    <h2>Transfer</h2>
                    <Form onSubmit={this.Transfer} error={!!this.state.errorMessage}>
                    <div>
                            <Input list='tokens' placeholder='Choose Token...' onChange={(e) => {
                                this.getTok(e.target.value)
                                this.setState({
                                    ...this.state,
                                    selectedToken: e.target.value
                                })
                            }}/>
                            <datalist id='tokens'>
                                {
                                    this.state.tokens.map((token, index) => (<option key={index} value={token.tokenAddress}>{token.tokenName}</option>))
                                }

                            </datalist>
                        </div>
                        <Form.Field>
                            <label>The Amount of Tokens to Transfer</label>
                            <Input
                                label="amount"
                                labelPosition="right"
                                style={{ width: '80%', margin: '20px 0' }}
                                value={this.state.Amount}
                                onChange={event => this.setState({ Amount: event.target.value })}
                            />
                            <label>The Address of the recipient</label>
                            <Input
                                label="address"
                                labelPosition="right"
                                style={{ width: '80%', margin: '20px 0' }}
                                value={this.state.place}
                                onChange={event => this.setState({ place: event.target.value })}
                            />
                        </Form.Field>

                        <Message error header="Oops!" content={this.state.errorMessage} />
                        <Button loading={this.state.start} secondary>transfer</Button>
                    </Form>
                </div>
                <h1></h1>
            </Container>
        </div>
    }
}
export default transfer;